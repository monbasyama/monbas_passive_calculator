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

let monsters = [];
let parties = [];

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function isValidMonster(monster) {
  return monster &&
    typeof monster === 'object' &&
    typeof monster.name === 'string' &&
    Array.isArray(monster.passives) &&
    monster.passives.every((passive) => {
      return passive && typeof passive.label === 'string' && Number.isFinite(Number(passive.value));
    });
}

function normalizeMonster(monster) {
  return {
    id: typeof monster.id === 'string' ? monster.id : createId('monster'),
    name: String(monster.name || '未設定').trim() || '未設定',
    passives: Array.isArray(monster.passives)
      ? monster.passives
          .filter((passive) => passive && typeof passive.label === 'string')
          .map((passive) => ({
            label: (passive.label || '').trim() || '項目',
            value: Number(passive.value) || 0
          }))
      : []
  };
}

function sanitizeMonsters(data) {
  if (!Array.isArray(data) || data.length === 0) return [...sampleMonsters];
  const normalized = data.map(normalizeMonster).filter(isValidMonster);
  return normalized.length ? normalized : [...sampleMonsters];
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
    localStorage.setItem(STORAGE_KEYS.monsters, JSON.stringify(sampleMonsters));
    return [...sampleMonsters];
  }
  try {
    const parsed = JSON.parse(stored);
    return sanitizeMonsters(parsed);
  } catch (error) {
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

function createNewParty() {
  return {
    id: createId('party'),
    slots: Array.from({ length: 6 }, () => '')
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPageUi() {
  return {
    partyRoot: document.getElementById('parties-container'),
    overallTotal: document.getElementById('overall-total'),
    monsterForm: document.getElementById('monster-form'),
    monsterList: document.getElementById('monster-list'),
    passiveEditor: document.getElementById('passive-editor'),
    addPartyBtn: document.getElementById('add-party-btn'),
    addPassiveBtn: document.getElementById('add-passive-row-btn'),
    pdfExportBtn: document.getElementById('pdf-export-btn'),
    newMonsterBtn: document.getElementById('new-monster-btn'),
    cancelMonsterEditBtn: document.getElementById('cancel-monster-edit'),
    monsterIdInput: document.getElementById('monster-id'),
    monsterNameInput: document.getElementById('monster-name')
  };
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

function renderParties() {
  const ui = getPageUi();
  if (!ui.partyRoot || !ui.overallTotal) return;

  if (!parties.length) parties = [createNewParty()];

  const overall = parties.reduce((sum, party) => sum + calculatePartyTotal(party), 0);
  ui.overallTotal.textContent = overall;

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
                <select data-party-id="${party.id}" data-slot-index="${slotIndex}" aria-label="${slotLabel}">
                  <option value="">未選択</option>
                  ${monsters.map((monster) => `
                    <option value="${monster.id}" ${monster.id === selectedId ? 'selected' : ''}>
                      ${monster.name}
                    </option>
                  `).join('')}
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
                ` : '<div class=\"empty-state\">未選択</div>'}
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

function renderMonsters() {
  const ui = getPageUi();
  if (!ui.monsterList) return;

  if (!monsters.length) {
    ui.monsterList.innerHTML = '<div class=\"empty-state\">登録済みのモンスターがありません。</div>';
    return;
  }

  ui.monsterList.innerHTML = monsters.map((monster) => `
    <div class=\"monster-card-item\">
      <div>
        <h4>${monster.name}</h4>
        <div class=\"monster-passives\">
          ${monster.passives.map((passive) => `<span class=\"tag\">${passive.label}: ${passive.value}</span>`).join('')}
        </div>
      </div>
      <div class=\"monster-actions\">
        <button class=\"secondary-btn\" type=\"button\" data-action=\"edit\" data-monster-id=\"${monster.id}\">編集</button>
        <button class=\"danger-btn\" type=\"button\" data-action=\"delete\" data-monster-id=\"${monster.id}\">削除</button>
      </div>
    </div>
  `).join('');

  ui.monsterList.querySelectorAll('[data-action=\"edit\"]').forEach((button) => {
    button.addEventListener('click', () => {
      const monsterId = button.dataset.monsterId;
      const monster = monsters.find((item) => item.id === monsterId);
      if (!monster) return;

      const ui2 = getPageUi();
      if (ui2.monsterIdInput) ui2.monsterIdInput.value = monster.id;
      if (ui2.monsterNameInput) ui2.monsterNameInput.value = monster.name;

      renderPassiveEditor(monster.passives);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  ui.monsterList.querySelectorAll('[data-action=\"delete\"]').forEach((button) => {
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
  const ui = getPageUi();
  if (!ui.passiveEditor) return;

  const sourcePassives = passives.length ? passives : [{ label: '', value: 0 }];

  ui.passiveEditor.innerHTML = sourcePassives.map((passive, index) => `
    <div class=\"passive-row\">
      <input class=\"passive-label\" type=\"text\" value=\"${escapeHtml(passive.label)}\" placeholder=\"例: 攻撃\" />
      <input class=\"passive-value\" type=\"number\" value=\"${Number(passive.value) || 0}\" placeholder=\"0\" />
      <button type=\"button\" class=\"remove-passive-btn\" data-index=\"${index}\">×</button>
    </div>
  `).join('');

  ui.passiveEditor.querySelectorAll('.remove-passive-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const rows = Array.from(ui.passiveEditor.querySelectorAll('.passive-row'));
      const rowIndex = Number(button.dataset.index);
      rows[rowIndex]?.remove();

      if (!ui.passiveEditor.querySelectorAll('.passive-row').length) {
        addPassiveInputToEditor();
      }
    });
  });
}

function addPassiveInputToEditor() {
  const ui = getPageUi();
  if (!ui.passiveEditor) return;

  const row = document.createElement('div');
  row.className = 'passive-row';
  row.innerHTML = `
    <input class=\"passive-label\" type=\"text\" placeholder=\"例: 攻撃\" />
    <input class=\"passive-value\" type=\"number\" value=\"0\" placeholder=\"0\" />
    <button type=\"button\" class=\"remove-passive-btn\">×</button>
  `;

  row.querySelector('.remove-passive-btn').addEventListener('click', () => {
    row.remove();
    if (!ui.passiveEditor.querySelectorAll('.passive-row').length) {
      addPassiveInputToEditor();
    }
  });

  ui.passiveEditor.appendChild(row);
}

function resetMonsterForm() {
  const ui = getPageUi();

  if (ui.monsterForm) ui.monsterForm.reset();
  if (ui.monsterIdInput) ui.monsterIdInput.value = '';
  renderPassiveEditor();
}

function generatePdfFromParties() {
  if (window.html2pdf) {
    const element = document.createElement('div');
    element.style.padding = '18px';
    element.style.fontFamily = '\"Segoe UI\", \"Yu Gothic\", sans-serif';
    element.style.lineHeight = '1.6';

    let html = `
      <h1 style="text-align: center; margin-bottom: 20px;">Monbas Passive Calculator</h1>
      <h2 style="text-align: center; margin-bottom: 30px;">全パーティー一覧</h2>
    `;

    parties.forEach((party, partyIndex) => {
      const total = calculatePartyTotal(party);
      html += `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h3 style="border-bottom: 1px solid #333; padding-bottom: 8px;">パーティー ${partyIndex + 1}</h3>
          <p style="font-weight: bold;">合計: ${total}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr style="background: #f3f4f6;">
              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">スロット</th>
              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">モンスター</th>
              <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">パッシブ</th>
            </tr>
      `;

      party.slots.forEach((slotId, slotIndex) => {
        const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';
        const monster = monsters.find((item) => item.id === slotId);

        if (monster) {
          const passiveText = monster.passives.map((p) => `${p.label}: ${p.value}`).join(', ');
          html += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${slotLabel}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${monster.name}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">${passiveText}</td>
            </tr>
          `;
        } else {
          html += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${slotLabel}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">未選択</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">-</td>
            </tr>
          `;
        }
      });

      html += '</table></div>';
    });

    element.innerHTML = html;

    const opt = {
      margin: 10,
      filename: 'monbas_passive_calculator.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(element).save();
    return;
  }

  window.print();
}

function initializePartyPage() {
  monsters = loadMonsters();
  parties = loadParties();

  const ui = getPageUi();

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

  const ui = getPageUi();

  if (ui.addPassiveBtn) {
    ui.addPassiveBtn.addEventListener('click', addPassiveInputToEditor);
  }

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
      const passEditor = ui.passiveEditor;

      const passives = Array.from(passEditor ? passEditor.querySelectorAll('.passive-row') : []).map((row) => {
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

  if (ui.monsterForm) {
    renderMonsters();
    renderPassiveEditor();
  }

  if (ui.monsterList) {
    renderMonsters();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const isPartyPage = !!document.getElementById('parties-container');
    const isMonsterPage = !!document.getElementById('monster-form');

    if (isPartyPage) {
      initializePartyPage();
    }

    if (isMonsterPage) {
      initializeMonsterPage();
    }
  });
} else {
  const isPartyPage = !!document.getElementById('parties-container');
  const isMonsterPage = !!document.getElementById('monster-form');

  if (isPartyPage) {
    initializePartyPage();
  }

  if (isMonsterPage) {
    initializeMonsterPage();
  }
}
