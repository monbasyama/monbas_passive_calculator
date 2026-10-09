:root {
  --bg: #f4f7fb;
  --panel: #ffffff;
  --panel-alt: #edf2ff;
  --line: #dfe7f6;
  --text: #1d2433;
  --muted: #5f6d86;
  --primary: #3b82f6;
  --primary-strong: #2457d5;
  --secondary: #eef6ff;
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #ef4444;
  --shadow: 0 8px 20px rgba(34, 60, 100, 0.08);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: "Segoe UI", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
  background: linear-gradient(180deg, #eef4ff 0%, var(--bg) 100%);
  color: var(--text);
}
button, input, select { font: inherit; }
button { cursor: pointer; }

.app-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}
.eyebrow {
  margin: 0 0 8px;
  color: var(--primary-strong);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 12px;
}
h1, h2, h3, p { margin-top: 0; }
h1 {
  margin-bottom: 0;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
}
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.tab-btn {
  appearance: none;
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--text);
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
}
.tab-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: var(--shadow);
}
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 24px;
}
.hidden-panel { display: none; }
.active-panel { display: block; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.summary-card {
  background: linear-gradient(135deg, #e8f0ff, #f0f7ff);
  border: 1px solid var(--line);
  border-radius: 18px;
  margin-bottom: 18px;
  padding: 18px 20px;
}
.summary-label {
  display: block;
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 8px;
}
#overall-total {
  font-size: clamp(1.8rem, 2vw, 2.4rem);
}
.parties-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
}
.party-card {
  border: 1px solid var(--line);
  background: var(--panel-alt);
  border-radius: 18px;
  padding: 18px;
}
.party-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.party-total {
  font-size: 0.95rem;
  color: var(--muted);
  background: rgba(59, 130, 246, 0.08);
  padding: 8px 12px;
  border-radius: 10px;
}
.slot-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 14px;
}
.slot-card {
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 14px;
  padding: 12px;
}
.slot-card label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--muted);
}
.slot-card select {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #fff;
  padding: 8px 10px;
  margin-bottom: 10px;
}
.monster-detail {
  border-top: 1px solid var(--line);
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.monster-detail strong { font-size: 0.98rem; }
.passive-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--muted);
  padding: 4px 0;
  border-bottom: 1px dashed var(--line);
}
.passive-item:last-child { border-bottom: none; }
.empty-state {
  color: var(--muted);
  font-size: 0.85rem;
  text-align: center;
  padding: 8px 0 2px;
}
.primary-btn, .secondary-btn, .ghost-btn, .danger-btn {
  appearance: none;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
}
.primary-btn {
  background: var(--primary);
  color: white;
}
.primary-btn:hover { background: var(--primary-strong); }
.secondary-btn {
  background: var(--secondary);
  color: var(--primary-strong);
  border: 1px solid rgba(59, 130, 246, 0.2);
}
.ghost-btn {
  background: transparent;
  color: var(--primary-strong);
  border: 1px dashed rgba(59, 130, 246, 0.5);
}
.danger-btn {
  background: #fff1f2;
  color: var(--danger);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.monster-form-card {
  background: #f9fbff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 20px;
}
.field-grid { display: grid; gap: 16px; }
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-group label { font-weight: 700; }
.full-width { grid-column: 1 / -1; }
input[type="text"], input[type="number"] {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
}
.passives-block { margin-top: 18px; }
.passives-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.passive-editor { display: grid; gap: 10px; }
.passive-row {
  display: grid;
  grid-template-columns: minmax(160px, 1.5fr) minmax(80px, 0.8fr) auto;
  gap: 10px;
  align-items: center;
}
.passive-row input { margin: 0; }
.remove-passive-btn {
  border: none;
  background: #fff1f2;
  color: var(--danger);
  border-radius: 10px;
  width: 42px;
  height: 42px;
  font-size: 1.1rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
.monster-list-wrap {
  border-top: 1px solid var(--line);
  padding-top: 18px;
}
.monster-list { display: grid; gap: 12px; }
.monster-card-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  background: #f7faff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 16px;
}
.monster-card-item h4 { margin: 0 0 8px; }
.monster-passives {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background: #edf5ff;
  color: var(--primary-strong);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: 700;
}
.monster-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
@media (max-width: 780px) {
  .app-shell { padding: 16px; }
  .topbar, .section-header, .party-header, .passives-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .slot-grid { grid-template-columns: 1fr; }
  .passive-row { grid-template-columns: 1fr; }
}
