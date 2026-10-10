const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const MONSTER_DATA = require('./monster.js');

const PORT = Number(process.env.PORT) || 3000;
const ADMIN_TOKEN = process.env.MONSTER_ADMIN_TOKEN || '';
const DATA_FILE = path.resolve(process.env.MONSTER_DATA_FILE || path.join(__dirname, 'data', 'monsters.json'));
const RACES = new Set(['魔神', '神族', '異端', '魔族', '精霊', '鬼族', '魔獣', '聖獣', '飛天', '聖人']);
const ELEMENTS = new Set(['闇', '火', '水', '風', '雷', '無', '光']);
const ALLOWED_VALUES = new Set([...RACES, ...ELEMENTS]);
const STATIC_FILES = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/monster-manager.html', 'monster-manager.html'],
  ['/app.js', 'app.js'],
  ['/monster.js', 'monster.js'],
  ['/style.css', 'style.css']
]);
let mutationQueue = Promise.resolve();

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(data));
}

function sanitizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

function sanitizeMonster(input, id = input && input.id) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('モンスターデータの形式が正しくありません。');
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name || name.length > 50) throw new Error('モンスター名は1〜50文字で入力してください。');
  if (!RACES.has(input.race)) throw new Error('種族が正しくありません。');
  if (!ELEMENTS.has(input.element)) throw new Error('属性が正しくありません。');
  if (!Array.isArray(input.passiveTarget) || input.passiveTarget.length > ALLOWED_VALUES.size
    || input.passiveTarget.some((value) => !ALLOWED_VALUES.has(value))) {
    throw new Error('パッシブ対象が正しくありません。');
  }

  const stats = ['attack', 'defense', 'agility', 'hp', 'sp', 'crt'];
  const monster = {
    id: typeof id === 'string' && id.length <= 160 ? id : '',
    name,
    race: input.race,
    element: input.element,
    passiveTarget: [...new Set(input.passiveTarget)],
    wikiUrl: sanitizeUrl(input.wikiUrl),
    imageUrl: sanitizeUrl(input.imageUrl)
  };

  for (const stat of stats) {
    const value = Number(input[stat] || 0);
    if (!Number.isFinite(value) || value < 0 || value > 1000000) {
      throw new Error(`${stat}の値が正しくありません。`);
    }
    monster[stat] = value;
  }

  return monster;
}

async function readMonsters() {
  try {
    const contents = await fs.readFile(DATA_FILE, 'utf8');
    const stored = JSON.parse(contents);
    if (!Array.isArray(stored)) throw new Error('モンスターデータの保存形式が正しくありません。');
    return stored.map((monster) => sanitizeMonster(monster));
  } catch (error) {
    if (error.code === 'ENOENT') return JSON.parse(JSON.stringify(MONSTER_DATA));
    throw error;
  }
}

async function writeMonsters(monsters) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporaryFile, JSON.stringify(monsters, null, 2), { flag: 'wx', mode: 0o600 });
    await fs.rename(temporaryFile, DATA_FILE);
  } catch (error) {
    await fs.rm(temporaryFile, { force: true }).catch(() => {});
    throw error;
  }
}

function mutateMonsters(operation) {
  const result = mutationQueue.then(operation);
  mutationQueue = result.catch(() => {});
  return result;
}

function isAuthorized(request) {
  if (!ADMIN_TOKEN) return false;
  const supplied = Buffer.from(request.headers.authorization || '');
  const expected = Buffer.from('Bearer ' + ADMIN_TOKEN);
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

async function readRequestBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) throw Object.assign(new Error('リクエストが大きすぎます。'), { status: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('JSONの形式が正しくありません。'), { status: 400 });
  }
}

async function serveStatic(request, response, pathname) {
  const filename = STATIC_FILES.get(pathname);
  if (!filename) return sendJson(response, 404, { error: 'Not found' });
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }

  const filePath = path.join(__dirname, filename);
  const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8'
  };
  try {
    const contents = await fs.readFile(filePath);
    response.writeHead(200, {
      'Cache-Control': 'no-cache',
      'Content-Type': contentTypes[path.extname(filePath)],
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch {
    sendJson(response, 500, { error: 'Unable to serve file' });
  }
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, 'http://localhost');
  const { pathname } = requestUrl;
  if (pathname === '/api/monsters' && request.method === 'GET') {
    try {
      return sendJson(response, 200, await readMonsters());
    } catch {
      return sendJson(response, 500, { error: 'モンスターデータを読み込めませんでした。' });
    }
  }

  const match = pathname.match(/^\/api\/monsters\/([^/]+)$/);
  if (pathname === '/api/monsters' && request.method === 'POST' || match && ['PUT', 'DELETE'].includes(request.method)) {
    if (!ADMIN_TOKEN) return sendJson(response, 503, { error: '管理用パスワードが設定されていません。' });
    if (!isAuthorized(request)) return sendJson(response, 401, { error: 'Unauthorized' });

    try {
      const monsters = await mutateMonsters(async () => {
        const current = await readMonsters();
        if (request.method === 'POST') {
          if (current.length >= 10000) throw Object.assign(new Error('モンスター数の上限に達しました。'), { status: 409 });
          const monster = sanitizeMonster(await readRequestBody(request), `monster-${crypto.randomUUID()}`);
          current.push(monster);
          await writeMonsters(current);
          return { monsters: current, result: monster };
        }

        let id;
        try {
          id = decodeURIComponent(match[1]);
        } catch {
          throw Object.assign(new Error('モンスターIDが正しくありません。'), { status: 400 });
        }
        const index = current.findIndex((monster) => monster.id === id);
        if (index < 0) throw Object.assign(new Error('モンスターが見つかりません。'), { status: 404 });
        if (request.method === 'DELETE') {
          current.splice(index, 1);
          await writeMonsters(current);
          return { monsters: current, result: null };
        }

        const monster = sanitizeMonster(await readRequestBody(request), id);
        current[index] = monster;
        await writeMonsters(current);
        return { monsters: current, result: monster };
      });
      return request.method === 'DELETE'
        ? sendJson(response, 200, { ok: true })
        : sendJson(response, request.method === 'POST' ? 201 : 200, monsters.result);
    } catch (error) {
      return sendJson(response, error.status || 400, { error: error.message || '保存に失敗しました。' });
    }
  }

  if (pathname.startsWith('/api/')) return sendJson(response, 404, { error: 'Not found' });
  return serveStatic(request, response, pathname);
}

http.createServer((request, response) => {
  handleRequest(request, response).catch(() => {
    if (!response.headersSent) sendJson(response, 500, { error: 'Internal server error' });
    else response.destroy();
  });
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
