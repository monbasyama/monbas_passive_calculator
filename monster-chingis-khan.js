// Load this file after monster.js and before app.js to add Chinggis Khan to the catalog.
(() => {
  if (!Array.isArray(MONSTER_DATA)) return;

  const monster = {
    id: 'monster-supplied-chingis-khan',
    name: 'チンギス・ハーン',
    race: '異端',
    element: '風',
    passiveTarget: ['異端'],
    attack: 10,
    defense: 0,
    agility: 0,
    hp: 35,
    sp: 0,
    crt: 0,
    wikiUrl: 'https://gamerch.com/monbas/1031997',
    imageUrl: 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC90d0tVczFPdS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19'
  };

  const existingIndex = MONSTER_DATA.findIndex((entry) => entry.name === monster.name);
  if (existingIndex !== -1) {
    MONSTER_DATA.splice(existingIndex, 1);
  }

  const chibiSatanIndex = MONSTER_DATA.findIndex((entry) => entry.name === 'チビサタン');
  MONSTER_DATA.splice(chibiSatanIndex === -1 ? MONSTER_DATA.length : chibiSatanIndex + 1, 0, monster);
})();
