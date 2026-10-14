const STORAGE_KEYS = {
  monsters: 'monbas_monsters_v1',
  parties: 'monbas_parties_v1',
  monsterDataVersion: 'monbas_monster_data_version'
};

const RACE_OPTIONS = ['魔神', '神族', '異端', '魔族', '精霊', '鬼族', '魔獣', '聖獣', '飛天', '聖人'];
const ELEMENT_OPTIONS = ['闇', '火', '水', '風', '雷', '無', '光'];
const PASSIVE_STATS = [
  { key: 'attack', label: '攻撃力', shortLabel: '攻' },
  { key: 'defense', label: '防御力', shortLabel: '防' },
  { key: 'agility', label: '素早さ', shortLabel: '早' },
  { key: 'hp', label: 'HP', shortLabel: 'HP' },
  { key: 'sp', label: 'SP', shortLabel: 'SP' },
  { key: 'crt', label: 'Crt', shortLabel: 'Cr' }
];
const MONSTER_DATA_VERSION = '2026-10-monster-urls';
const MONSTER_MANAGER_PASSWORD = '0888';
const LEGACY_SAMPLE_IDS = new Set([
  'monster-fire-dragon',
  'monster-ice-wolf',
  'monster-sky-bird',
  'monster-stone-giant',
  'monster-moon-cat'
]);
let monsters = [];
let parties = [];

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function createNewParty() {
  return {
    id: createId('party'),
    slots: Array.from({ length: 6 }, () => '')
  };
}

function sanitizeMonsters(data) {
  if (!Array.isArray(data) || data.length === 0) return [...MONSTER_DATA];

  const normalized = data
    .map((monster) => {
      const passiveTarget = Array.isArray(monster.passiveTarget) ? monster.passiveTarget : [];
      return {
        id: typeof monster.id === 'string' ? monster.id : createId('monster'),
        name: String(monster.name || '未設定').trim() || '未設定',
        race: String(monster.race || '').trim(),
        element: String(monster.element || '').trim(),
        passiveTarget: passiveTarget.filter(t => typeof t === 'string'),
        attack: Number(monster.attack) || 0,
        defense: Number(monster.defense) || 0,
        agility: Number(monster.agility) || 0,
        hp: Number(monster.hp) || 0,
        sp: Number(monster.sp) || 0,
        crt: Number(monster.crt) || 0,
        wikiUrl: sanitizeUrl(monster.wikiUrl),
        imageUrl: sanitizeUrl(monster.imageUrl)
      };
    })
    .filter((monster) => monster && typeof monster.name === 'string');

  return normalized.length ? normalized : [...MONSTER_DATA];
}

function sanitizeParties(data) {
  if (!Array.isArray(data) || data.length === 0) return [createNewParty()];

  return data
    .filter((party) => party && Array.isArray(party.slots))
    .map((party) => ({
      id: typeof party.id === 'string' ? party.id : createId('party'),
      slots: Array.from({ length: 6 }, (_, index) => typeof party.slots[index] === 'string' ? party.slots[index] : '')
    }));
}

function loadMonsters() {
  const stored = localStorage.getItem(STORAGE_KEYS.monsters);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(MONSTER_DATA));
    localStorage.setItem(STORAGE_KEYS.monsterDataVersion, MONSTER_DATA_VERSION);
    return [...MONSTER_DATA];
  }

  try {
    const monstersFromStorage = sanitizeMonsters(JSON.parse(stored));
    if (localStorage.getItem(STORAGE_KEYS.monsterDataVersion) !== MONSTER_DATA_VERSION) {
      const seedNames = new Set(MONSTER_DATA.map((monster) => monster.name));
      const existingCustomMonsters = monstersFromStorage.filter((monster) =>
        !LEGACY_SAMPLE_IDS.has(monster.id) && !seedNames.has(monster.name)
      );
      const storedUrls = new Map(monstersFromStorage.map((monster) => [monster.name, {
        wikiUrl: monster.wikiUrl,
        imageUrl: monster.imageUrl
      }]));
      const migratedMonsters = [
        ...MONSTER_DATA.map((monster) => ({
          ...monster,
          ...storedUrls.get(monster.name)
        })),
        ...existingCustomMonsters
      ];
      localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(migratedMonsters));
      localStorage.setItem(STORAGE_KEYS.monsterDataVersion, MONSTER_DATA_VERSION);
      return migratedMonsters;
    }
    return monstersFromStorage;
  } catch (error) {
    localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(MONSTER_DATA));
    localStorage.setItem(STORAGE_KEYS.monsterDataVersion, MONSTER_DATA_VERSION);
    return [...MONSTER_DATA];
  }
}

function loadParties() {
  const stored = localStorage.getItem(STORAGE_KEYS.parties);
  if (!stored) {
    const defaultParty = createNewParty();
    localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify([defaultParty]));
    return [defaultParty];
  }

  try {
    const parsed = JSON.parse(stored);
    return sanitizeParties(parsed);
  } catch (error) {
    const defaultParty = createNewParty();
    localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify([defaultParty]));
    return [defaultParty];
  }
}

function saveMonsters() {
  localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(monsters));
}

function saveParties() {
  localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify(parties));
}

function sanitizeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
  } catch (error) {
    return '';
  }
}

function getUi() {
  return {
    partyRoot: document.getElementById('parties-container'),
    monsterForm: document.getElementById('monster-form'),
    monsterSearchInput: document.getElementById('monster-search-input'),
    monsterSearchResults: document.getElementById('monster-search-results'),
    addPartyBtn: document.getElementById('add-party-btn'),
    clearPartiesBtn: document.getElementById('clear-parties-btn'),
    compareBtn: document.getElementById('party-compare-btn'),
    pdfExportBtn: document.getElementById('pdf-export-btn'),
    newMonsterBtn: document.getElementById('new-monster-btn'),
    cancelMonsterEditBtn: document.getElementById('cancel-monster-edit'),
    monsterIdInput: document.getElementById('monster-id'),
    monsterNameInput: document.getElementById('monster-name'),
    monsterRaceInput: document.getElementById('monster-race'),
    monsterElementInput: document.getElementById('monster-element'),
    monsterAttackInput: document.getElementById('monster-attack'),
    monsterDefenseInput: document.getElementById('monster-defense'),
    monsterAgilityInput: document.getElementById('monster-agility'),
    monsterHpInput: document.getElementById('monster-hp'),
    monsterSpInput: document.getElementById('monster-sp'),
    monsterCrtInput: document.getElementById('monster-crt'),
    monsterWikiUrlInput: document.getElementById('monster-wiki-url'),
    monsterImageUrlInput: document.getElementById('monster-image-url')
  };
}

function authorizeMonsterManagerPage() {
  const password = window.prompt('管理者パスワードを入力してください。');
  if (password !== MONSTER_MANAGER_PASSWORD) {
    if (password !== null) window.alert('パスワードが正しくありません。');
    window.location.replace('index.html');
    return false;
  }

  document.body.classList.add('manager-authorized');
  return true;
}

function calculatePartyTotal(party) {
  if (!party || !Array.isArray(party.slots)) return 0;

  return party.slots.reduce((sum, selectedId) => {
    if (!selectedId) return sum;

    const selectedMonster = monsters.find((monster) => monster.id === selectedId);
    if (!selectedMonster) return sum;

    return sum + (selectedMonster.attack + selectedMonster.defense + selectedMonster.agility + selectedMonster.hp + selectedMonster.sp + selectedMonster.crt);
  }, 0);
}

function getPassiveBonuses(party, targetSlotIndex, targetMonster) {
  const bonuses = Object.fromEntries(PASSIVE_STATS.map(({ key }) => [key, 0]));

  party.slots.forEach((sourceId, sourceSlotIndex) => {
    if (!sourceId || sourceSlotIndex === targetSlotIndex) return;

    const sourceMonster = monsters.find((monster) => monster.id === sourceId);
    if (!sourceMonster) return;

    const matchesRace = sourceMonster.passiveTarget.includes(targetMonster.race);
    const matchesElement = sourceMonster.passiveTarget.includes(targetMonster.element);
    if (!matchesRace && !matchesElement) return;

    PASSIVE_STATS.forEach(({ key }) => {
      bonuses[key] += Number(sourceMonster[key]) || 0;
    });
  });

  return bonuses;
}

function normalizeSearchText(text) {
  return String(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[\s\u30fb・･]/g, '');
}

function searchMonsters(query) {
  const normalizedQuery = normalizeSearchText(query);

  return monsters.filter((monster) =>
    !normalizedQuery || normalizeSearchText(monster.name).includes(normalizedQuery)
  );
}

function renderMonsterSearchResults() {
  const ui = getUi();
  if (!ui.monsterSearchInput || !ui.monsterSearchResults) return;

  const query = ui.monsterSearchInput.value.trim();
  if (!query) {
    ui.monsterSearchResults.innerHTML = '<div class="empty-state">モンスター名を入力すると検索結果が表示されます</div>';
    return;
  }
  const results = searchMonsters(query);

  if (results.length === 0) {
    ui.monsterSearchResults.innerHTML = '<div class="empty-state">検索結果がありません</div>';
    return;
  }

  ui.monsterSearchResults.innerHTML = results.map((monster) => `
    <div class="monster-card-item">
      <div>
        <h4>${escapeHtml(monster.name)}</h4>
        <div class="monster-details">
          <span class="tag">種族: ${escapeHtml(monster.race)}</span>
          <span class="tag">属性: ${escapeHtml(monster.element)}</span>
          <span class="tag">対象: ${escapeHtml(monster.passiveTarget.join(', '))}</span>
        </div>
        <div class="monster-stats">
          <span>攻撃: ${monster.attack}</span>
          <span>防御: ${monster.defense}</span>
          <span>素早さ: ${monster.agility}</span>
          <span>HP: ${monster.hp}</span>
          <span>SP: ${monster.sp}</span>
          <span>Crt: ${monster.crt}</span>
        </div>
        ${monster.wikiUrl ? `<a class="monster-wiki-link" href="${escapeHtml(monster.wikiUrl)}" target="_blank" rel="noopener noreferrer">Wikiリンク</a>` : ''}
      </div>

      <div class="monster-actions">
        <button class="secondary-btn" type="button" data-action="edit" data-monster-id="${monster.id}"><i class="fas fa-pencil" aria-hidden="true"></i>編集</button>
        <button class="danger-btn" type="button" data-action="delete" data-monster-id="${monster.id}"><i class="fas fa-trash" aria-hidden="true"></i>削除</button>
      </div>
    </div>
  `).join('');

  ui.monsterSearchResults.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => {
      const monsterId = button.dataset.monsterId;
      const monster = monsters.find((item) => item.id === monsterId);

      if (!monster) return;

      const ui2 = getUi();
      if (ui2.monsterIdInput) ui2.monsterIdInput.value = monster.id;
      if (ui2.monsterNameInput) ui2.monsterNameInput.value = monster.name;
      if (ui2.monsterRaceInput) ui2.monsterRaceInput.value = monster.race;
      if (ui2.monsterElementInput) ui2.monsterElementInput.value = monster.element;
      
      // チェックボックスをリセット
      document.querySelectorAll('input[name="passive-race"], input[name="passive-element"]').forEach(checkbox => {
        checkbox.checked = false;
      });

      // パッシブ対象のチェックボックスをチェック
      monster.passiveTarget.forEach(target => {
        const checkbox = document.querySelector(`input[name="passive-race"][value="${target}"], input[name="passive-element"][value="${target}"]`);
        if (checkbox) checkbox.checked = true;
      });

      if (ui2.monsterAttackInput) ui2.monsterAttackInput.value = monster.attack;
      if (ui2.monsterDefenseInput) ui2.monsterDefenseInput.value = monster.defense;
      if (ui2.monsterAgilityInput) ui2.monsterAgilityInput.value = monster.agility;
      if (ui2.monsterHpInput) ui2.monsterHpInput.value = monster.hp;
      if (ui2.monsterSpInput) ui2.monsterSpInput.value = monster.sp;
      if (ui2.monsterCrtInput) ui2.monsterCrtInput.value = monster.crt;
      if (ui2.monsterWikiUrlInput) ui2.monsterWikiUrlInput.value = monster.wikiUrl || '';
      if (ui2.monsterImageUrlInput) ui2.monsterImageUrlInput.value = monster.imageUrl || '';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  ui.monsterSearchResults.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => {
      const monsterId = button.dataset.monsterId;
      if (!window.confirm('このモンスターを削除しますか？')) return;

      monsters = monsters.filter((monster) => monster.id !== monsterId);

      parties = parties.map((party) => ({
        ...party,
        slots: party.slots.map((slotId) => (slotId === monsterId ? '' : slotId))
      }));

      saveMonsters();
      saveParties();
      renderMonsterSearchResults();
      renderParties();
    });
  });
}

function renderParties() {
  const ui = getUi();
  if (!ui.partyRoot) return;

  if (!parties.length) parties = [createNewParty()];

  ui.partyRoot.innerHTML = parties.map((party, partyIndex) => {
    const partyTotal = calculatePartyTotal(party);
    const selectedMonsters = party.slots
      .map((monsterId, slotIndex) => ({
        monster: monsters.find((item) => item.id === monsterId),
        slotIndex
      }))
      .filter(({ monster }) => monster);

    return `
      <article class="party-card" data-party-id="${party.id}">
        <div class="party-header">
          <h3>パーティー ${partyIndex + 1}</h3>
          <div class="party-actions">
            <button class="danger-btn delete-party-btn" type="button" data-party-id="${party.id}"><i class="fas fa-trash" aria-hidden="true"></i>削除</button>
            <button class="secondary-btn duplicate-party-btn" type="button" data-party-id="${party.id}">複製</button>
          </div>
        </div>

        <div class="party-total">合計: ${partyTotal}</div>

        <div class="slot-grid">
          ${Array.from({ length: 6 }, (_, slotIndex) => {
            const selectedId = party.slots[slotIndex] || '';
            const selectedMonster = monsters.find((monster) => monster.id === selectedId);
            const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';

            return `
              <div class="slot-card">
                <div class="slot-heading">
                  <label for="slot-${escapeHtml(party.id)}-${slotIndex}">${slotLabel}</label>
                  ${selectedMonster ? renderMonsterImage(selectedMonster) : ''}
                </div>
                <div class="monster-selection-row">
                  <div class="monster-dropdown-wrapper">
                    <input
                      id="slot-${escapeHtml(party.id)}-${slotIndex}"
                      type="text"
                      class="monster-search-field"
                      data-party-id="${escapeHtml(party.id)}"
                      data-slot-index="${slotIndex}"
                      placeholder="モンスター名で検索..."
                      value="${selectedMonster ? escapeHtml(selectedMonster.name) : ''}"
                      autocomplete="off"
                    />
                    <div class="monster-dropdown-list" style="display: none;">
                      <div class="dropdown-item dropdown-clear-item" data-monster-id="">未選択</div>
                      ${monsters.map((monster) => {
                        const imageUrl = sanitizeUrl(monster.imageUrl);
                        return `
                          <div class="dropdown-item" data-monster-id="${escapeHtml(monster.id)}">
                            ${imageUrl ? `<img class="dropdown-monster-image" src="${escapeHtml(imageUrl)}" alt="" aria-hidden="true" loading="lazy" decoding="async" />` : ''}
                            <span>${escapeHtml(monster.name)}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>

                ${selectedMonster ? `
                  <div class="monster-detail">
                    <div class="monster-detail-tags">
                      <span class="tag">種族: ${escapeHtml(selectedMonster.race || '未設定')}</span>
                      <span class="tag">属性: ${escapeHtml(selectedMonster.element || '未設定')}</span>
                    </div>
                    <table class="monster-passive-table">
                      <thead>
                        <tr>${PASSIVE_STATS.map(({ shortLabel }) => `<th scope="col">${shortLabel}</th>`).join('')}</tr>
                      </thead>
                      <tbody>
                        <tr>${PASSIVE_STATS.map(({ key }) => `<td>${Number(selectedMonster[key]) || 0}</td>`).join('')}</tr>
                      </tbody>
                    </table>
                    <button
                      type="button"
                      class="ghost-btn clear-monster-btn"
                      data-party-id="${escapeHtml(party.id)}"
                      data-slot-index="${slotIndex}"
                      aria-label="${slotLabel}をクリア"
                    ><i class="fas fa-eraser" aria-hidden="true"></i>クリア</button>
                  </div>
                ` : '<div class="empty-state">未選択</div>'}
              </div>
            `;
          }).join('')}
        </div>

        ${selectedMonsters.length ? `
          <section class="party-passive-summary" aria-label="選択モンスターのパッシブ反映一覧">
            <h4>選択モンスターのパッシブ反映一覧</h4>
            <div class="passive-summary-table-wrap">
              <table class="passive-summary-table">
                <thead>
                  <tr>
                    <th scope="col">モンスター</th>
                    <th scope="col">種族</th>
                    <th scope="col">属性</th>
                    <th scope="col">パッシブ対象</th>
                    ${PASSIVE_STATS.map(({ label }) => `<th scope="col">${label}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${selectedMonsters.map(({ monster, slotIndex }) => {
                    const bonuses = getPassiveBonuses(party, slotIndex, monster);

                    return `
                      <tr>
                        <th scope="row">
                          ${escapeHtml(monster.name)}
                        </th>
                        <td>${escapeHtml(monster.race || '未設定')}</td>
                        <td>${escapeHtml(monster.element || '未設定')}</td>
                        <td>${escapeHtml(monster.passiveTarget.join('、') || 'なし')}</td>
                        ${PASSIVE_STATS.map(({ key }) => {
                          const individual = Number(monster[key]) || 0;
                          const bonus = bonuses[key];
                          return `
                            <td>
                              <span class="passive-value-equation">
                                <span>${individual}</span>
                                <span class="passive-value-bonus">+${bonus}</span>
                                <strong>${individual + bonus}</strong>
                              </span>
                            </td>
                          `;
                        }).join('')}
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </section>
        ` : ''}
      </article>
    `;
  }).join('');

  attachMonsterImageHandlers(ui.partyRoot);
  attachPartyEvents();
}

function renderMonsterImage(monster) {
  const wikiUrl = sanitizeUrl(monster.wikiUrl);
  const imageUrl = sanitizeUrl(monster.imageUrl);
  const frame = `
    <div class="monster-image-frame" aria-label="${escapeHtml(monster.name)}の画像">
      <span class="monster-image-placeholder">NOIMAGE</span>
      ${imageUrl ? `<img class="monster-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(monster.name)}" />` : ''}
    </div>
  `;
  return wikiUrl
    ? `<a class="monster-wiki-link" href="${escapeHtml(wikiUrl)}" target="_blank" rel="noopener noreferrer">${frame}</a>`
    : frame;
}

function attachMonsterImageHandlers(root) {
  root.querySelectorAll('.monster-image').forEach((image) => {
    const frame = image.closest('.monster-image-frame');
    image.addEventListener('load', () => frame.classList.add('has-image'));
    image.addEventListener('error', () => frame.classList.remove('has-image'));
    if (image.complete && image.naturalWidth > 0) frame.classList.add('has-image');
  });
}

function attachPartyEvents() {
  document.querySelectorAll('.clear-monster-btn').forEach((button) => {
    button.addEventListener('click', () => {
      clearPartySlot(button.dataset.partyId, Number(button.dataset.slotIndex));
    });
  });

  document.querySelectorAll('.delete-party-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const partyId = button.dataset.partyId;

      if (parties.length <= 1) {
        alert('最低でも1つのパーティーは必要です。');
        return;
      }

      parties = parties.filter((party) => party.id !== partyId);
      saveParties();
      renderParties();
    });
  });

  document.querySelectorAll('.duplicate-party-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const sourceParty = parties.find((party) => party.id === button.dataset.partyId);
      if (!sourceParty) return;

      parties.push({
        id: createId('party'),
        slots: [...sourceParty.slots]
      });
      saveParties();
      renderParties();
    });
  });

  document.querySelectorAll('.monster-search-field').forEach((input) => {
    input.addEventListener('focus', (event) => {
      const dropdown = event.target.nextElementSibling;
      if (dropdown) {
        dropdown.style.display = 'block';
      }
    });

    input.addEventListener('input', (event) => {
      const query = normalizeSearchText(event.target.value);
      const dropdown = event.target.nextElementSibling;
      
      if (!dropdown) return;

      if (!event.target.value.trim()) {
        const targetParty = parties.find((party) => party.id === event.target.dataset.partyId);
        const slotIndex = Number(event.target.dataset.slotIndex);
        if (targetParty && targetParty.slots[slotIndex]) {
          clearPartySlot(event.target.dataset.partyId, slotIndex, true);
          return;
        }
      }

      const items = dropdown.querySelectorAll('.dropdown-item');
      items.forEach((item) => {
        const monsterName = normalizeSearchText(item.textContent);
        if (monsterName.includes(query) || !query) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });

    input.addEventListener('blur', (event) => {
      setTimeout(() => {
        const dropdown = event.target.nextElementSibling;
        if (dropdown) {
          dropdown.style.display = 'none';
        }
      }, 200);
    });
  });

  document.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', (event) => {
      const dropdownItem = event.target.closest('.dropdown-item');
      const monsterId = dropdownItem.dataset.monsterId;
      const searchField = event.target.closest('.monster-dropdown-wrapper').querySelector('.monster-search-field');
      const partyId = searchField.dataset.partyId;
      const slotIndex = Number(searchField.dataset.slotIndex);

      if (!monsterId) {
        clearPartySlot(partyId, slotIndex);
        return;
      }

      const targetParty = parties.find((party) => party.id === partyId);
      if (!targetParty) return;

      targetParty.slots[slotIndex] = monsterId;
      saveParties();
      renderParties();
    });
  });
}

function clearPartySlot(partyId, slotIndex, restoreFocus = false) {
  const targetParty = parties.find((party) => party.id === partyId);
  if (!targetParty || !Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= targetParty.slots.length) return;
  if (!targetParty.slots[slotIndex]) return;

  targetParty.slots[slotIndex] = '';
  saveParties();
  renderParties();

  if (restoreFocus) {
    const searchField = Array.from(document.querySelectorAll('.monster-search-field'))
      .find((input) => input.dataset.partyId === partyId && Number(input.dataset.slotIndex) === slotIndex);
    searchField?.focus();
  }
}

function resetMonsterForm() {
  const ui = getUi();
  if (ui.monsterForm) ui.monsterForm.reset();
  if (ui.monsterIdInput) ui.monsterIdInput.value = '';
  if (ui.monsterSearchInput) ui.monsterSearchInput.value = '';
  
  // チェックボックスをリセット
  document.querySelectorAll('input[name="passive-race"], input[name="passive-element"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  renderMonsterSearchResults();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildPartyReportHtml() {
  let html = `
    <style>
      .pdf-print-content, .party-print-root { padding: 6mm; color: #000; background: #fff; font-family: "Segoe UI", "Yu Gothic", sans-serif; }
      .pdf-party { margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid; }
      .pdf-party h2 { margin: 0 0 3px; font-size: 11px; line-height: 1.1; }
      .pdf-summary-table { width: 100%; border-collapse: collapse; font-size: 7px; line-height: 1.1; }
      .pdf-summary-table { table-layout: fixed; }
      .pdf-summary-table th, .pdf-summary-table td { padding: 1px 2px; border: 1px solid #777; text-align: left; vertical-align: middle; }
      .pdf-summary-table tr { page-break-inside: avoid; break-inside: avoid; }
      .pdf-summary-table thead { background: #eee; }
      .pdf-summary-table .monster-image-cell { width: 20px; padding: 1px; text-align: center; }
      .pdf-summary-table .monster-image { position: static; inset: auto; display: block; width: 18px; height: 18px; margin: auto; object-fit: contain; }
      .pdf-summary-table th[scope="row"] { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pdf-summary-table .passive-value-cell { padding: 1px; text-align: center; white-space: nowrap; font-size: 6px; }
      .pdf-summary-table .passive-value-individual { color: #374151; }
      .pdf-summary-table .passive-value-bonus { color: #006b5b; }
      .pdf-summary-table .passive-value-total { color: #173f8a; font-weight: 700; }
    </style>
  `;

  parties.forEach((party, partyIndex) => {
    const selectedMonsters = party.slots
      .map((monsterId, slotIndex) => ({
        monster: monsters.find((item) => item.id === monsterId),
        slotIndex
      }))
      .filter(({ monster }) => monster);
    if (!selectedMonsters.length) {
      html += `
        <section class="pdf-party">
          <h2>パーティー ${partyIndex + 1}</h2>
          <p class="pdf-empty-party">編成されたモンスターがありません。</p>
        </section>
      `;
      return;
    }

    html += `
      <section class="pdf-party">
        <h2>パーティー ${partyIndex + 1}</h2>
        <table class="pdf-summary-table">
          <colgroup>
            <col style="width: 4%"><col style="width: 20%"><col style="width: 7%"><col style="width: 7%"><col style="width: 14%">
            ${PASSIVE_STATS.map(() => '<col style="width: 2.6%"><col style="width: 2.6%"><col style="width: 2.8%">').join('')}
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2"></th><th rowspan="2">モンスター</th><th rowspan="2">種族</th><th rowspan="2">属性</th><th rowspan="2">パッシブ対象</th>
              ${PASSIVE_STATS.map(({ label }) => `<th colspan="3">${label}</th>`).join('')}
            </tr>
            <tr>${PASSIVE_STATS.map(() => '<th>個</th><th>＋</th><th>計</th>').join('')}</tr>
          </thead>
          <tbody>
    `;

    selectedMonsters.forEach(({ monster, slotIndex }) => {
      const bonuses = getPassiveBonuses(party, slotIndex, monster);
      html += `
        <tr>
          <td class="monster-image-cell">${monster.imageUrl ? `<img class="monster-image" src="${escapeHtml(monster.imageUrl)}" alt="">` : ''}</td>
          <th scope="row">${escapeHtml(monster.name)}</th>
          <td>${escapeHtml(monster.race || '未設定')}</td>
          <td>${escapeHtml(monster.element || '未設定')}</td>
          <td>${escapeHtml(monster.passiveTarget.join('、') || 'なし')}</td>
          ${PASSIVE_STATS.map(({ key }) => {
            const individual = Number(monster[key]) || 0;
            const bonus = bonuses[key];
            return `<td class="passive-value-cell passive-value-individual">${individual}</td><td class="passive-value-cell passive-value-bonus">${bonus}</td><td class="passive-value-cell passive-value-total">${individual + bonus}</td>`;
          }).join('')}
        </tr>
      `;
    });

    html += '</tbody></table></section>';
  });

  return html;
}

function createPartyReportContent(className) {
  const content = document.createElement('div');
  content.className = className;
  content.innerHTML = buildPartyReportHtml();
  return content;
}

function showPartyComparison() {
  const existing = document.getElementById('party-compare-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'party-compare-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;overflow:hidden;background:#fff;';
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'secondary-btn';
  closeBtn.innerHTML = '<i class="fas fa-xmark" aria-hidden="true"></i>閉じる';
  closeBtn.style.cssText = 'margin:8px;flex:none;z-index:5;background:#e8f0fe;color:#111;border:1px solid #6aa9ff;cursor:pointer;';
  closeBtn.addEventListener('click', () => overlay.remove());
  const content = createPartyReportContent('pdf-print-content party-comparison-content');
  content.style.display = 'block';
  content.style.padding = '2px';
  content.style.cssText += ';flex:1;min-height:0;overflow:auto;';
  const pdfBtn = document.createElement('button');
  pdfBtn.type = 'button';
  pdfBtn.className = 'primary-btn';
  pdfBtn.innerHTML = '<i class="fas fa-file-pdf" aria-hidden="true"></i>PDF出力';
  pdfBtn.style.cssText = 'margin:8px 8px 8px 0;flex:none;z-index:5;cursor:pointer;';
  pdfBtn.addEventListener('click', generatePdfFromParties);
  const toolbar = document.createElement('div');
  toolbar.style.cssText = 'display:flex;align-items:center;position:sticky;top:0;flex:none;z-index:4;background:#fff;';
  toolbar.append(closeBtn, pdfBtn);
  overlay.append(toolbar, content);
  document.body.appendChild(overlay);
  synchronizeComparisonColumnWidths(content);
}

function synchronizeComparisonColumnWidths(content) {
  const statColumnWidth = 32;
  const tables = Array.from(content.querySelectorAll('.pdf-summary-table'));
  if (!tables.length) return;

  const columnWidths = [];
  tables.forEach((table) => {
    table.style.tableLayout = 'auto';
    table.style.width = 'max-content';
    table.style.minWidth = '0';
    table.style.fontSize = '9px';
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.querySelectorAll('colgroup col').forEach((column) => {
      column.removeAttribute('style');
    });
  });

  tables.forEach((table) => {
    table.querySelectorAll('tbody tr').forEach((row) => {
      let columnIndex = 0;
      row.querySelectorAll('th, td').forEach((cell) => {
        const span = Number(cell.colSpan) || 1;
        const width = cell.getBoundingClientRect().width / span;
        for (let index = 0; index < span; index += 1) {
          columnWidths[columnIndex] = Math.max(columnWidths[columnIndex] || 0, width);
          columnIndex += 1;
        }
      });
    });
  });

  tables.forEach((table) => {
    const columns = Array.from(table.querySelectorAll('colgroup col'));
    columns.forEach((column, index) => {
      const statColumnType = index >= 5 ? (index - 5) % 3 : -1;
      const width = statColumnType >= 0 ? statColumnWidth : Math.ceil(columnWidths[index] || 28);
      Object.assign(column.style, { width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` });
    });
    table.style.tableLayout = 'fixed';
    table.style.width = `${columns.reduce((total, column, index) => {
      const statColumnType = index >= 5 ? (index - 5) % 3 : -1;
      const width = statColumnType >= 0 ? statColumnWidth : columnWidths[index];
      return total + Math.ceil(width || 28);
    }, 0)}px`;
  });
}

async function updateCommitDisplay() {
  const versionEl = document.getElementById('app-version');
  if (!versionEl) return;

  try {
    const response = await fetch('https://api.github.com/repos/monbasyama/monbas_passive_calculator/commits?per_page=1');
    if (!response.ok) return;

    const match = (response.headers.get('Link') || '').match(/[?&]page=(\d+)>;\s*rel="last"/);
    const revision = match ? match[1] : '1';
    versionEl.textContent = `ver 1.0.${revision}`;
  } catch {}
}

function generatePdfFromParties() {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('PDF出力画面を開けませんでした。ポップアップを許可してください。');
    return;
  }

  const printDocument = printWindow.document;
  printDocument.open();
  printDocument.write(`<!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>パーティー比較</title>
        <style>
          @page { margin: 8mm; }
          html, body { margin: 0; min-height: 0; background: #fff; }
        </style>
      </head>
      <body><main class="party-print-root">${buildPartyReportHtml()}</main></body>
    </html>`);
  printDocument.close();

  const images = Array.from(printDocument.images);
  const imageLoads = images.map((image) => {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      let timeoutId;
      const finish = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      timeoutId = setTimeout(finish, 8000);
    });
  });

  Promise.all(imageLoads).then(() => {
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus();
    printWindow.print();
  });
}

function initializePartyPage() {
  monsters = loadMonsters();
  parties = loadParties();

  const ui = getUi();

  if (ui.addPartyBtn) {
    ui.addPartyBtn.addEventListener('click', () => {
      parties.push(createNewParty());
      saveParties();
      renderParties();
    });
  }

  if (ui.clearPartiesBtn) {
    ui.clearPartiesBtn.addEventListener('click', () => {
      if (!window.confirm('すべてのパーティーがクリアされます。よろしいですか？')) return;

      parties = [createNewParty()];
      saveParties();
      renderParties();
    });
  }

  if (ui.compareBtn) {
    ui.compareBtn.addEventListener('click', showPartyComparison);
  }

  if (ui.pdfExportBtn) {
    ui.pdfExportBtn.addEventListener('click', generatePdfFromParties);
  }

  if (ui.partyRoot) {
    renderParties();
  }
}

function initializeMonsterCatalogPage() {
  monsters = loadMonsters();
  const filterForm = document.getElementById('monster-catalog-filter-form');
  const resetButton = document.getElementById('catalog-filter-reset');

  if (filterForm) {
    filterForm.addEventListener('input', renderMonsterCatalogResults);
    filterForm.addEventListener('change', renderMonsterCatalogResults);
  }

  if (resetButton && filterForm) {
    resetButton.addEventListener('click', () => {
      filterForm.reset();
      renderMonsterCatalogResults();
    });
  }

  renderMonsterCatalogResults();
}

function renderMonsterCatalogResults() {
  const filterForm = document.getElementById('monster-catalog-filter-form');
  const results = document.getElementById('monster-catalog-results');
  const resultCount = document.getElementById('monster-catalog-result-count');
  if (!filterForm || !results || !resultCount) return;

  const nameQuery = document.getElementById('catalog-name-filter').value.trim().toLocaleLowerCase();
  const checkedValues = (selector) => Array.from(filterForm.querySelectorAll(`${selector}:checked`), (input) => input.value);
  const races = checkedValues('.catalog-race-filter');
  const elements = checkedValues('.catalog-element-filter');
  const passiveRaces = checkedValues('.catalog-passive-race-filter');
  const passiveElements = checkedValues('.catalog-passive-element-filter');
  const ranges = PASSIVE_STATS.reduce((filterRanges, { key }) => {
    filterRanges[key] = {};
    ['min', 'max'].forEach((bound) => {
      const input = filterForm.querySelector(`[data-stat="${key}"][data-bound="${bound}"]`);
      filterRanges[key][bound] = input.value === '' ? null : Number(input.value);
    });
    return filterRanges;
  }, {});

  const filteredMonsters = monsters.filter((monster) => {
    const nameMatches = monster.name.toLocaleLowerCase().includes(nameQuery);
    const raceMatches = !races.length || races.includes(monster.race);
    const elementMatches = !elements.length || elements.includes(monster.element);
    const passiveRaceMatches = !passiveRaces.length || passiveRaces.some((target) => monster.passiveTarget.includes(target));
    const passiveElementMatches = !passiveElements.length || passiveElements.some((target) => monster.passiveTarget.includes(target));
    const statsMatch = PASSIVE_STATS.every(({ key }) => {
      const value = Number(monster[key]) || 0;
      const { min, max } = ranges[key];
      return (min === null || value >= min) && (max === null || value <= max);
    });

    return nameMatches && raceMatches && elementMatches && passiveRaceMatches && passiveElementMatches && statsMatch;
  });

  resultCount.textContent = `${filteredMonsters.length} / ${monsters.length} 件`;
  results.innerHTML = filteredMonsters.length
    ? filteredMonsters.map((monster) => {
      const image = monster.imageUrl
        ? `<img class="catalog-monster-image" src="${escapeHtml(monster.imageUrl)}" alt="${escapeHtml(monster.name)}" loading="lazy">`
        : '<span class="catalog-no-image">画像なし</span>';
      const linkedImage = monster.imageUrl && monster.wikiUrl
        ? `<a href="${escapeHtml(monster.wikiUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(monster.name)}のWikiを開く">${image}</a>`
        : image;
      return `
        <tr>
          <td>${linkedImage}</td>
          <th scope="row">${escapeHtml(monster.name)}</th>
          <td>${escapeHtml(monster.race || '未設定')}</td>
          <td>${escapeHtml(monster.element || '未設定')}</td>
          <td>${escapeHtml(monster.passiveTarget.join('、') || 'なし')}</td>
          ${PASSIVE_STATS.map(({ key }) => `<td>${Number(monster[key]) || 0}</td>`).join('')}
        </tr>
      `;
    }).join('')
    : '<tr><td class="catalog-empty-state" colspan="11">条件に一致するモンスターがいません。</td></tr>';
}

function initializeMonsterPage() {
  if (!authorizeMonsterManagerPage()) return;

  monsters = loadMonsters();
  parties = loadParties();

  const ui = getUi();

  if (ui.newMonsterBtn) {
    ui.newMonsterBtn.addEventListener('click', resetMonsterForm);
  }

  if (ui.cancelMonsterEditBtn) {
    ui.cancelMonsterEditBtn.addEventListener('click', resetMonsterForm);
  }

  if (ui.monsterForm) {
    ui.monsterForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const id = ui.monsterIdInput ? ui.monsterIdInput.value : '';
      const name = ui.monsterNameInput ? ui.monsterNameInput.value.trim() : '';
      const race = ui.monsterRaceInput ? ui.monsterRaceInput.value.trim() : '';
      const element = ui.monsterElementInput ? ui.monsterElementInput.value.trim() : '';
      
      // パッシブ対象を収集
      const passiveTarget = [];
      document.querySelectorAll('input[name="passive-race"]:checked, input[name="passive-element"]:checked').forEach(checkbox => {
        passiveTarget.push(checkbox.value);
      });
      
      const attack = Number(ui.monsterAttackInput ? ui.monsterAttackInput.value : 0);
      const defense = Number(ui.monsterDefenseInput ? ui.monsterDefenseInput.value : 0);
      const agility = Number(ui.monsterAgilityInput ? ui.monsterAgilityInput.value : 0);
      const hp = Number(ui.monsterHpInput ? ui.monsterHpInput.value : 0);
      const sp = Number(ui.monsterSpInput ? ui.monsterSpInput.value : 0);
      const crt = Number(ui.monsterCrtInput ? ui.monsterCrtInput.value : 0);
      const wikiUrl = sanitizeUrl(ui.monsterWikiUrlInput ? ui.monsterWikiUrlInput.value : '');
      const imageUrl = sanitizeUrl(ui.monsterImageUrlInput ? ui.monsterImageUrlInput.value : '');

      if (!name) {
        alert('モンスター名を入力してください。');
        return;
      }

      if (!race) {
        alert('種族を選択してください。');
        return;
      }

      if (!element) {
        alert('属性を選択してください。');
        return;
      }

      if (id) {
        const targetMonster = monsters.find((monster) => monster.id === id);
        if (targetMonster) {
          targetMonster.name = name;
          targetMonster.race = race;
          targetMonster.element = element;
          targetMonster.passiveTarget = passiveTarget;
          targetMonster.attack = attack;
          targetMonster.defense = defense;
          targetMonster.agility = agility;
          targetMonster.hp = hp;
          targetMonster.sp = sp;
          targetMonster.crt = crt;
          targetMonster.wikiUrl = wikiUrl;
          targetMonster.imageUrl = imageUrl;
        }
      } else {
        monsters.push({
          id: createId('monster'),
          name,
          race,
          element,
          passiveTarget,
          attack,
          defense,
          agility,
          hp,
          sp,
          crt,
          wikiUrl,
          imageUrl
        });
      }

      saveMonsters();
      renderMonsterSearchResults();
      renderParties();
      resetMonsterForm();
    });
  }

  if (ui.monsterSearchInput) {
    ui.monsterSearchInput.addEventListener('input', renderMonsterSearchResults);
  }

  renderMonsterSearchResults();
}

function startApp() {
  updateCommitDisplay();

  const isPartyPage = !!document.getElementById('parties-container');
  const isMonsterPage = !!document.getElementById('monster-search-input');
  const isMonsterCatalogPage = !!document.getElementById('monster-catalog-filter-form');

  if (isPartyPage) {
    initializePartyPage();
  }

  if (isMonsterPage) {
    initializeMonsterPage();
  }

  if (isMonsterCatalogPage) {
    initializeMonsterCatalogPage();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
