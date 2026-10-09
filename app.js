function generatePdfFromParties() {
  if (!window.html2pdf) {
    alert('PDF生成ライブラリを読み込み中です。少しお待ちください。');
    
    // html2pdf をダイナミックにロード
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      generatePdfFromParties();
    };
    script.onerror = () => {
      alert('PDFライブラリの読み込みに失敗しました。もう一度お試しください。');
    };
    document.head.appendChild(script);
    return;
  }

  const element = document.createElement('div');
  element.style.padding = '20px';
  element.style.fontFamily = 'sans-serif';

  let html = `
    <h1 style="text-align: center; margin-bottom: 20px;">Monbas Passive Calculator</h1>
    <h2 style="text-align: center; margin-bottom: 30px;">全パーティー一覧</h2>
  `;

  parties.forEach((party, partyIndex) => {
    const partyTotal = calculatePartyTotal(party);
    html += `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="border-bottom: 2px solid #333; padding-bottom: 10px;">パーティー ${partyIndex + 1}</h3>
        <p style="font-weight: bold; margin-bottom: 15px;">合計: ${partyTotal}</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #ccc;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc;">スロット</th>
            <th style="text-align: left; padding: 8px; border: 1px solid #ccc;">モンスター</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ccc;">パッシブ</th>
          </tr>
    `;

    party.slots.forEach((slotId, slotIndex) => {
      const slotLabel = slotIndex < 5 ? `モンスター ${slotIndex + 1}` : '助っ人';
      const monster = monsters.find((item) => item.id === slotId);

      if (monster) {
        const passiveText = monster.passives.map((p) => `${p.label}: ${p.value}`).join(', ');
        html += `
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 8px; border: 1px solid #ccc;">${slotLabel}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">${monster.name}</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc;">${passiveText}</td>
          </tr>
        `;
      } else {
        html += `
          <tr style="border-bottom: 1px solid #ccc;">
            <td style="padding: 8px; border: 1px solid #ccc;">${slotLabel}</td>
            <td style="padding: 8px; border: 1px solid #ccc;">未選択</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ccc;">-</td>
          </tr>
        `;
      }
    });

    html += `
        </table>
      </div>
    `;
  });

  element.innerHTML = html;

  const opt = {
    margin: 10,
    filename: 'monbas_passive_calculator.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    window.html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF生成エラー:', error);
    alert('PDFの生成に失敗しました。');
  }
}
