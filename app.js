const STORAGE_KEYS = {
  monsters: 'monbas_monsters_v1',
  parties: 'monbas_parties_v1'
};

const sampleMonsters = [
  { id: 'monster-fire-dragon', name: '火竜', passives: [{ label: '攻撃', value: 18 }, { label: 'スキル', value: 12 }, { label: '防御', value: 10 }] },
  { id: 'monster-ice-wolf', name: '氷狼', passives: [{ label: '敏捷', value: 16 }, { label: '攻撃', value: 9 }, { label: '回避', value: 15 }] },
  { id: 'monster-sky-bird', name: '空鳥', passives: [{ label: '移動', value: 20 }, { label: '攻撃', value: 7 }, { label: '魔力', value: 14 }] },
  { id: 'monster-stone-giant', name: '岩巨人', passives: [{ label: '防御', value: 22 }, { label: 'HP', value: 16 }, { label: '攻撃', value: 11 }] },
  { id: 'monster-moon-cat', name: '月猫', passives: [{ label: '会心', value: 13 }, { label: '攻撃', value: 10 }, { label: '回復', value: 8 }] }
];

function isValidMonster(monster) {
  return monster && typeof monster === 'object' && typeof monster.name === 'string' && Array.isArray(monster.passives) && monster.passives.every((passive) => {
    return passive && typeof passive.label === 'string' && Number.isFinite(Number(passive.value));
  });
}

function normalizeMonster(monster) {
  return {
    id: typeof monster.id === 'string' ? monster.id : createId('monster'),
    name: String(monster.name || '未設定').trim() || '未設定',
    passives: Array.isArray(monster.passives) ? monster.passives
      .filter((passive) => passive && typeof passive.label === 'string')
      .map((passive) => ({ label: passive.label.trim() || '項目', value: Number(passive.value) || 0 })) : []
  };
}

function sanitizeMonsters(data) {
  if (!Array.isArray(data) || data.length === 0) return [...sampleMonsters];
  const normalized = data.map(normalizeMonster).filter(isValidMonster);
  return normalized.length ? normalized : [...sampleMonsters];
}

function sanitizeParties(data) {
  if (!Array.isArray(data) || data.length === 0) return [createNewParty()];
  return data.filter((party) => party && Array.isArray(party.slots)).map((party) => ({
    id: typeof party.id === 'string' ? party.id : createId('party'),
    slots: Array.from({ length: 6 }, (_, index) => typeof party.slots[index] === 'string' ? party.slots[index] : '')
  }));
}

let monsters = loadMonsters();
let parties = loadParties();

const tabButtons = document.querySelectorAll('.tab-btn');
const partyBuilderSection = document.getElementById('party-builder-section');
const monsterManagementSection = document.getElementById('monster-management-section');
const partiesContainer = document.getElementById('parties-container');
const monsterList = document.getElementById('monster-list');
const passiveEditor = document.getElementById('passive-editor');
const monsterForm = document.getElementById('monster-form');
const monsterNameInput = document.getElementById('monster-name');
const monsterIdInput = document.getElementById('monster-id');
const addPartyBtn = document.getElementById('add-party-btn');
const addPassiveBtn = document.getElementById('add-passive-row-btn');
const pdfExportBtn = document.getElementById('pdf-export-btn');
const overallTotalEl = document.getElementById('overall-total');
const newMonsterBtn = document.getElementById('new-monster-btn');
const cancelMonsterEditBtn = document.getElementById('cancel-monster-edit');

initialize();

function initialize() {
  ensureDefaultParties();
  bindTabEvents();
  bindEventListeners();
  renderMonsters();
  renderParties();
  renderPassiveEditor();
}

function bindTabEvents() {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      partyBuilderSection.classList.toggle('active-panel', target === 'party-builder-section');
      partyBuilderSection.classList.toggle('hidden-panel', target !== 'party-builder-section');
      monsterManagementSection.classList.toggle('active-panel', target === 'monster-management-section');
      monsterManagementSection.classList.toggle('hidden-panel', target !== 'monster-management-section');
    });
  });
}

function bindEventListeners() {
  addPartyBtn.addEventListener('click', () => {
    parties.push(createNewParty());
    saveParties();
    renderParties();
  });

  addPassiveBtn.addEventListener('click', addPassiveInputToEditor);
  pdfExportBtn.addEventListener('click', generatePdfFromParties);
  newMonsterBtn.addEventListener('click', resetMonsterForm);
  cancelMonsterEditBtn.addEventListener('click', resetMonsterForm);

  monsterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = monsterIdInput.value;
    const name = monsterNameInput.value.trim();
    const passives = Array.from(passiveEditor.querySelectorAll('.passive-row')).map((row) => {
      const labelInput = row.querySelector('.passive-label');
      const valueInput = row.querySelector('.passive-value');
      const label = labelInput ? labelInput.value.trim() : '';
      const value = Number(valueInput ? valueInput.value : 0);
      if (!label || Number.isNaN(value)) return null;
      return { label, value };
    }).filter(Boolean);

    if (!name || passives.length === 0) {
      alert('モンスター名と少なくとも1つのパッシブ値を入力してください。');
      return;
    }

    if (id) {
      const targetMonster = monsters.find((monster) => monster.id === id);
      if (targetMonster) {
        targetMonster.name = name;
        targetMonster.passives = passives;
      }
    } else {
      monsters.push({ id: createId('monster'), name, passives });
    }

    saveMonsters();
    renderMonsters();
    renderParties();
    resetMonsterForm();
  });
}

function loadMonsters() {
  const stored = localStorage.getItem(STORAGE_KEYS.monsters);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(sampleMonsters));
    return [...sampleMonsters];
  }

  try {
    const parsed = JSON.parse(stored);
    return sanitizeMonsters(parsed);
  } catch {
    localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(sampleMonsters));
    return [...sampleMonsters];
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
  } catch {
    const defaultParty = createNewParty();
    localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify([defaultParty]));
    return [defaultParty];
  }
}

function ensureDefaultParties() {
  if (!Array.isArray(parties) || parties.length === 0) {
    parties = [createNewParty()];
    saveParties();
  }
}

function saveMonsters() { localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(monsters)); }
function saveParties() { localStorage.setItem(STORAGE_KEYS.parties, JSON.stringify(parties)); }

function createNewParty() {
  return { id: createId('party'), slots: Array.from({ length: 6 }, () => '') };
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function renderParties() {
  if (!parties.length) parties = [createNewParty()];
  const overall = parties.reduce((sum, party) => sum + calculatePartyTotal(party), 0);
  overallTotalEl.textContent = overall;

  partiesContainer.innerHTML = parties.map((party, partyIndex) => {
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
                <select data-party-id="${party.id}" data-slot-index="${slotIndex}" aria-label="${slotLabel}">
                  <option value="">未選択</option>
                  ${monsters.map((monster) => `<option value="${monster.id}" ${monster.id === selectedId ? 'selected' : ''}>${monster.name}</option>`).join('')}
                </select>
                ${selectedMonster ? `
                  <div class="monster-detail">
                    <strong>${selectedMonster.name}</strong>
                    ${selectedMonster.passives.map((passive) => `
                      <div class="passive-item">
                        <span>${passive.label}</span>
                        <strong>${passive.value}</strong>
                      </div>
                    `).join('')}
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

  document.querySelectorAll('select[data-party-id]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const partyId = event.target.dataset.partyId;
      const slotIndex = Number(event.target.dataset.slotIndex);
      const targetParty = parties.find((party) => party.id === partyId);
      if (!targetParty) return;
      targetParty.slots[slotIndex] = event.target.value;
      saveParties();
      renderParties();
    });
  });
}

function calculatePartyTotal(party) {
  if (!party || !Array.isArray(party.slots)) return 0;
  return party.slots.reduce((sum, selectedId) => {
    if (!selectedId) return sum;
    const selectedMonster = monsters.find((monster) => monster.id === selectedId);
    if (!selectedMonster) return sum;
    return sum + selectedMonster.passives.reduce((acc, passive) => acc + Number(passive.value || 0), 0);
  }, 0);
}

function renderMonsters() {
  if (!monsters.length) {
    monsterList.innerHTML = '<div class="empty-state">登録済みのモンスターがありません。</div>';
    return;
  }

  monsterList.innerHTML = monsters.map((monster) => `
    <div class="monster-card-item">
      <div>
        <h4>${monster.name}</h4>
        <div class="monster-passives">
          ${monster.passives.map((passive) => `<span class="tag">${passive.label}: ${passive.value}</span>`).join('')}
        </div>
      </div>
      <div class="monster-actions">
        <button class="secondary-btn" type="button" data-action="edit" data-monster-id="${monster.id}">編集</button>
        <button class="danger-btn" type="button" data-action="delete" data-monster-id="${monster.id}">削除</button>
      </div>
    </div>
  `).join('');

  monsterList.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => {
      const monsterId = button.dataset.monsterId;
      const monster = monsters.find((item) => item.id === monsterId);
      if (!monster) return;
      monsterIdInput.value = monster.id;
      monsterNameInput.value = monster.name;
      renderPassiveEditor(monster.passives);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  monsterList.querySelectorAll('[data-action="delete"]').forEach((button) => {
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
      renderMonsters();
      renderParties();
    });
  });
}

function renderPassiveEditor(passives = []) {
  const sourcePassives = passives.length ? passives : [{ label: '', value: 0 }];
  passiveEditor.innerHTML = sourcePassives.map((passive, index) => `
    <div class="passive-row">
      <input class="passive-label" type="text" value="${escapeHtml(passive.label)}" placeholder="例: 攻撃" />
      <input class="passive-value" type="number" value="${Number(passive.value) || 0}" placeholder="0" />
      <button type="button" class="remove-passive-btn" data-index="${index}">×</button>
    </div>
  `).join('');

  passiveEditor.querySelectorAll('.remove-passive-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const rows = Array.from(passiveEditor.querySelectorAll('.passive-row'));
      const rowIndex = Number(button.dataset.index);
      rows[rowIndex]?.remove();
      if (!passiveEditor.querySelectorAll('.passive-row').length) addPassiveInputToEditor();
    });
  });
}

function addPassiveInputToEditor() {
  const row = document.createElement('div');
  row.className = 'passive-row';
  row.innerHTML = `
    <input class="passive-label" type="text" placeholder="例: 攻撃" />
    <input class="passive-value" type="number" value="0" placeholder="0" />
    <button type="button" class="remove-passive-btn">×</button>
  `;
  row.querySelector('.remove-passive-btn').addEventListener('click', () => {
    row.remove();
    if (!passiveEditor.querySelectorAll('.passive-row').length) addPassiveInputToEditor();
  });
  passiveEditor.appendChild(row);
}

function resetMonsterForm() {
  monsterForm.reset();
  monsterIdInput.value = '';
  renderPassiveEditor();
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
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF生成ライブラリの読み込みに失敗しました。');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = 48;

  doc.setFontSize(18);
  doc.text('Monbas Passive Calculator', 40, y);
  y += 28;

  doc.setFontSize(12);
  doc.text('全パーティー一覧', 40, y);
  y += 22;

  parties.forEach((party, partyIndex) => {
    const partyTotal = calculatePartyTotal(party);

    if (y > 720) {
      doc.addPage();
      y = 48;
    }

    doc.setFontSize(14);
    doc.setTextColor(34, 87, 213);
    doc.text(`パーティー ${partyIndex + 1}`, 40, y);
    y += 18;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`合計: ${partyTotal}`, 40, y);
    y += 16;

    party.slots.forEach((slotId, slotIndex) => {
      const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';
      const monster = monsters.find((item) => item.id === slotId);

      if (y > 760) {
        doc.addPage();
        y = 48;
      }

      if (monster) {
        doc.text(`${slotLabel}: ${monster.name}`, 52, y);
        y += 14;

        monster.passives.forEach((passive) => {
          doc.text(`- ${passive.label}: ${passive.value}`, 70, y);
          y += 12;
        });
      } else {
        doc.text(`${slotLabel}: 未選択`, 52, y);
        y += 12;
      }

      y += 8;
    });

    y += 10;
  });

  doc.save('monbas_passive_calculator.pdf');
}
