const STORAGE_KEYS = {
  monsters: 'monbas_monsters_v1',
  parties: 'monbas_parties_v1',
  monsterDataVersion: 'monbas_monster_data_version'
};

const RACE_OPTIONS = ['魔神', '神族', '異端', '魔族', '精霊', '鬼族', '魔獣', '聖獣', '飛天', '聖人'];
const ELEMENT_OPTIONS = ['闇', '火', '水', '風', '雷', '無', '光'];
const MONSTER_DATA_VERSION = '2026-10-roster';
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
        crt: Number(monster.crt) || 0
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
      const migratedMonsters = [...MONSTER_DATA, ...existingCustomMonsters];
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

function getUi() {
  return {
    partyRoot: document.getElementById('parties-container'),
    monsterForm: document.getElementById('monster-form'),
    monsterSearchInput: document.getElementById('monster-search-input'),
    monsterSearchResults: document.getElementById('monster-search-results'),
    addPartyBtn: document.getElementById('add-party-btn'),
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
    monsterCrtInput: document.getElementById('monster-crt')
  };
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

function searchMonsters(query) {
  const lowerQuery = query.toLowerCase().trim();

  return monsters.filter((monster) => 
    !lowerQuery || monster.name.toLowerCase().includes(lowerQuery)
  );
}

function renderMonsterSearchResults() {
  const ui = getUi();
  if (!ui.monsterSearchInput || !ui.monsterSearchResults) return;

  const query = ui.monsterSearchInput.value;
  if (!query.trim()) {
    ui.monsterSearchResults.innerHTML = '';
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
      </div>

      <div class="monster-actions">
        <button class="secondary-btn" type="button" data-action="edit" data-monster-id="${monster.id}">編集</button>
        <button class="danger-btn" type="button" data-action="delete" data-monster-id="${monster.id}">削除</button>
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

    return `
      <article class="party-card" data-party-id="${party.id}">
        <div class="party-header">
          <h3>パーティー ${partyIndex + 1}</h3>
          <button class="danger-btn delete-party-btn" type="button" data-party-id="${party.id}">削除</button>
        </div>

        <div class="party-total">合計: ${partyTotal}</div>

        <div class="slot-grid">
          ${Array.from({ length: 6 }, (_, slotIndex) => {
            const selectedId = party.slots[slotIndex] || '';
            const selectedMonster = monsters.find((monster) => monster.id === selectedId);
            const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';

            return `
              <div class="slot-card">
                <label for="slot-${party.id}-${slotIndex}">${slotLabel}</label>
                <div class="monster-dropdown-wrapper">
                  <input 
                    type="text" 
                    class="monster-search-field"
                    data-party-id="${party.id}" 
                    data-slot-index="${slotIndex}"
                    placeholder="モンスター名で検索..."
                    value="${selectedMonster ? selectedMonster.name : ''}"
                    autocomplete="off"
                  />
                  <div class="monster-dropdown-list" style="display: none;">
                    ${monsters.map((monster) => `
                      <div class="dropdown-item" data-monster-id="${monster.id}">
                        ${escapeHtml(monster.name)}
                      </div>
                    `).join('')}
                  </div>
                </div>

                ${selectedMonster ? `
                  <div class="monster-detail">
                    <strong>${escapeHtml(selectedMonster.name)}</strong>
                    <div class="monster-stats">
                      <span>攻撃: ${selectedMonster.attack}</span>
                      <span>防御: ${selectedMonster.defense}</span>
                      <span>素早さ: ${selectedMonster.agility}</span>
                      <span>HP: ${selectedMonster.hp}</span>
                      <span>SP: ${selectedMonster.sp}</span>
                      <span>Crt: ${selectedMonster.crt}</span>
                    </div>
                  </div>
                ` : '<div class="empty-state">未選択</div>'}
              </div>
            `;
          }).join('')}
        </div>
      </article>
    `;
  }).join('');

  attachPartyEvents();
}

function attachPartyEvents() {
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

  document.querySelectorAll('.monster-search-field').forEach((input) => {
    input.addEventListener('focus', (event) => {
      const dropdown = event.target.nextElementSibling;
      if (dropdown) {
        dropdown.style.display = 'block';
      }
    });

    input.addEventListener('input', (event) => {
      const query = event.target.value.toLowerCase().trim();
      const dropdown = event.target.nextElementSibling;
      
      if (!dropdown) return;

      const items = dropdown.querySelectorAll('.dropdown-item');
      items.forEach((item) => {
        const monsterName = item.textContent.toLowerCase();
        if (monsterName.includes(query) || !query) {
          item.style.display = 'block';
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
      const monsterId = event.target.dataset.monsterId;
      const searchField = event.target.closest('.monster-dropdown-wrapper').querySelector('.monster-search-field');
      const partyId = searchField.dataset.partyId;
      const slotIndex = Number(searchField.dataset.slotIndex);
      
      const targetParty = parties.find((party) => party.id === partyId);
      if (!targetParty) return;

      targetParty.slots[slotIndex] = monsterId;
      saveParties();
      renderParties();
    });
  });
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

function generatePdfFromParties() {
  const printable = document.createElement('div');
  printable.className = 'pdf-print-content';
  printable.style.padding = '20px';
  printable.style.fontFamily = '"Segoe UI", "Yu Gothic", sans-serif';
  printable.style.color = '#000';
  printable.style.backgroundColor = '#fff';

  let html = `
    <h1 style="text-align:center; margin-bottom:16px; color:#000;">ちょいと召喚モンスターバスケット</h1>
    <h2 style="text-align:center; margin-bottom:26px; color:#000;">全パーティー一覧</h2>
  `;

  parties.forEach((party, partyIndex) => {
    const total = calculatePartyTotal(party);

    html += `
      <div style="margin-bottom: 28px; page-break-inside: avoid;">
        <h3 style="border-bottom: 2px solid #333; padding-bottom: 8px; color:#000;">パーティー ${partyIndex + 1}</h3>
        <p style="font-weight: bold; color:#000;">合計: ${total}</p>
        <table style="width:100%; border-collapse: collapse; font-size:12px;">
          <tr style="background:#e8e8e8;">
            <th style="border: 1px solid #333; padding:10px; text-align:left; color:#000; font-weight:bold;">スロット</th>
            <th style="border: 1px solid #333; padding:10px; text-align:left; color:#000; font-weight:bold;">モンスター</th>
            <th style="border: 1px solid #333; padding:10px; text-align:right; color:#000; font-weight:bold;">ステータス</th>
          </tr>
    `;

    party.slots.forEach((slotId, slotIndex) => {
      const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';
      const monster = monsters.find((item) => item.id === slotId);

      if (monster) {
        const stats = `攻撃: ${monster.attack}, 防御: ${monster.defense}, 素早さ: ${monster.agility}, HP: ${monster.hp}, SP: ${monster.sp}, Crt: ${monster.crt}`;
        html += `
          <tr>
            <td style="border:1px solid #333; padding:10px; color:#000;">${slotLabel}</td>
            <td style="border:1px solid #333; padding:10px; color:#000;">${escapeHtml(monster.name)}</td>
            <td style="border:1px solid #333; padding:10px; text-align:right; color:#000;">${stats}</td>
          </tr>
        `;
      } else {
        html += `
          <tr>
            <td style="border:1px solid #333; padding:10px; color:#999;">${slotLabel}</td>
            <td style="border:1px solid #333; padding:10px; color:#999;">未選択</td>
            <td style="border:1px solid #333; padding:10px; text-align:right; color:#999;">-</td>
          </tr>
        `;
      }
    });

    html += '</table></div>';
  });

  printable.innerHTML = html;
  document.body.appendChild(printable);
  window.addEventListener('afterprint', () => printable.remove(), { once: true });
  window.print();
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

  if (ui.pdfExportBtn) {
    ui.pdfExportBtn.addEventListener('click', generatePdfFromParties);
  }

  if (ui.partyRoot) {
    renderParties();
  }
}

function initializeMonsterPage() {
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
          crt
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
  const isPartyPage = !!document.getElementById('parties-container');
  const isMonsterPage = !!document.getElementById('monster-search-input');

  if (isPartyPage) {
    initializePartyPage();
  }

  if (isMonsterPage) {
    initializeMonsterPage();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
