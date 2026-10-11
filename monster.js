const MONSTER_IMAGE_URLS = {
  'おめがリオ': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9kVmtBdzR4ZS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'おめがレイ': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9QUFFTZUp2Ty5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'お日様散々ミネルヴァ': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC8xNTdiYkdhdS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'お月見ティアマト': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC83dG9uNUVQZy5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'すちゃらか千代女': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9FTFVrR25XNy5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'だいろ神': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC91YmtUQ1d2Zi5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'つまみ食い阿修羅': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9NMmprOW1kTi5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'はっちゃけランダ': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC85R1ZmZ0dsei5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'ぺこら': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9TOHQ1Q29Cei5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'めっちゃサマー☆バラキエル': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC81S1hkY29adS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'わくどきファフニール': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9ObXBYTjVIRi5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アイアンメイデン': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9VeVRTOEJGWC5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アストラルヴィシュヌ': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9CRm80UTRveS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アテン': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9hU1B6ZVBGNS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アムルタルト': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9EZW12Q1VDOS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アムルタート': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9PY09mMThaSS5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アリオク': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9xd0NTYTBqNC5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19',
  'アリス': 'https://cdn.gamerch.com/resize/eyJidWNrZXQiOiJnYW1lcmNoLWltZy1jb250ZW50cyIsImtleSI6Indpa2lcLzEzODZcL2VudHJ5XC9WU3pJbllyRC5wbmciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjg1fSwidG9Gb3JtYXQiOiJ3ZWJwIn19'
};

const MONSTER_WIKI_URLS = {
  'おめがリオ': 'https://gamerch.com/monbas/780875',
  'おめがレイ': 'https://gamerch.com/monbas/780873',
  'お日様散々ミネルヴァ': 'https://gamerch.com/monbas/1003375',
  'お月見ティアマト': 'https://gamerch.com/monbas/798210',
  'すちゃらか千代女': 'https://gamerch.com/monbas/1016466',
  'だいろ神': 'https://gamerch.com/monbas/923547',
  'つまみ食い阿修羅': 'https://gamerch.com/monbas/902756',
  'はっちゃけランダ': 'https://gamerch.com/monbas/817784',
  'ぺこら': 'https://gamerch.com/monbas/932202',
  'めっちゃサマー☆バラキエル': 'https://gamerch.com/monbas/935841',
  'わくどきファフニール': 'https://gamerch.com/monbas/825328',
  'アイアンメイデン': 'https://gamerch.com/monbas/266266',
  'アストラルヴィシュヌ': 'https://gamerch.com/monbas/985063',
  'アテン': 'https://gamerch.com/monbas/966068',
  'アムルタルト': 'https://gamerch.com/monbas/902755',
  'アムルタート': 'https://gamerch.com/monbas/810635',
  'アリオク': 'https://gamerch.com/monbas/947146',
  'アリス': 'https://gamerch.com/monbas/238173',
  'イナンナ': 'https://gamerch.com/monbas/986602',
  'イライラ三蔵法師': 'https://gamerch.com/monbas/872472',
  'イルミネーション如来': 'https://gamerch.com/monbas/551410',
  'イーリス': 'https://gamerch.com/monbas/867446',
  'ウィル・オ・テューポーン': 'https://gamerch.com/monbas/803461',
  'エジソン': 'https://gamerch.com/monbas/809568',
  'エストリエ': 'https://gamerch.com/monbas/915289',
  'エレボス': 'https://gamerch.com/monbas/822458',
  'オーディン': 'https://gamerch.com/monbas/633363',
  'カオス・エレボス': 'https://gamerch.com/monbas/954318',
  'カーリー': 'https://gamerch.com/monbas/342070',
  'カリュブディス': 'https://gamerch.com/monbas/945394',
  'キョンキョン': 'https://gamerch.com/monbas/932202',
  'キョンシー・麒麟': 'https://gamerch.com/monbas/946324',
  'ギャルサンタ・ゴアブ': 'https://gamerch.com/monbas/890511',
  'クイーンビー': 'https://gamerch.com/monbas/1000837',
  'クサビラ神': 'https://gamerch.com/monbas/938111',
  'クリぼっちマスティマ': 'https://gamerch.com/monbas/551413',
  'ケツァルコアトル': 'https://gamerch.com/monbas/217415',
  'サハギンと愉快な仲間たち': 'https://gamerch.com/monbas/836186',
  'サマースルト': 'https://gamerch.com/monbas/865900',
  'サマービーチスター・ラー': 'https://gamerch.com/monbas/788609',
  'サマーンティス': 'https://gamerch.com/monbas/865901',
  'サレオス': 'https://gamerch.com/monbas/878876',
  'サレオスの姉御': 'https://gamerch.com/monbas/961928',
  'サタン': 'https://gamerch.com/monbas/272265',
  'サンタヘスティアー': 'https://gamerch.com/monbas/890510',
  'シスター・オーディン': 'https://gamerch.com/monbas/946323',
  'ジングルケロ・タニグク': 'https://gamerch.com/monbas/814992',
  'スイカ割り・カボ': 'https://gamerch.com/monbas/279782',
  'スカジ': 'https://gamerch.com/monbas/251922',
  'スルト': 'https://gamerch.com/monbas/535272',
  'セドナ': 'https://gamerch.com/monbas/804866',
  'ソロネ': 'https://gamerch.com/monbas/339988',
  'ゾンビフルフル': 'https://gamerch.com/monbas/877691',
  'タナトス': 'https://gamerch.com/monbas/899407',
  'タニグク': 'https://gamerch.com/monbas/357692',
  'タラスク': 'https://gamerch.com/monbas/875177',
  'チビサタン': 'https://gamerch.com/monbas/255677',
  'ツイゴアブ': 'https://gamerch.com/monbas/390004',
  'ツクヨミ': 'https://gamerch.com/monbas/714259',
  'ツチミカド': 'https://gamerch.com/monbas/928690',
  'ティアマト': 'https://gamerch.com/monbas/303447',
  'テューポーン': 'https://gamerch.com/monbas/366299',
  'テュール': 'https://gamerch.com/monbas/1007419',
  'ディオニュソス': 'https://gamerch.com/monbas/951402',
  'ナアマ': 'https://gamerch.com/monbas/351652',
  'ナタク': 'https://gamerch.com/monbas/203227',
  'ニャルラトホテピョン': 'https://gamerch.com/monbas/565449',
  'ヌアザ': 'https://gamerch.com/monbas/774789',
  'ネヴァン': 'https://gamerch.com/monbas/991423',
  'ノトス': 'https://gamerch.com/monbas/276525',
  'ハツヒノメイデン': 'https://gamerch.com/monbas/817783',
  'バカンスメイデン': 'https://gamerch.com/monbas/382606',
  'バラキエル': 'https://gamerch.com/monbas/478729',
  'フォカロル': 'https://gamerch.com/monbas/982934',
  'フォービ': 'https://gamerch.com/monbas/927787',
  'フランケンタロス': 'https://gamerch.com/monbas/469436',
  'ブライダル・アールマティ': 'https://gamerch.com/monbas/263734',
  'ブライダル・エジソン': 'https://gamerch.com/monbas/854381',
  'ブライダル・ケツァルコアトル': 'https://gamerch.com/monbas/263981',
  'ブライダル・メティス': 'https://gamerch.com/monbas/926026',
  'ヘスティアー': 'https://gamerch.com/monbas/793607',
  'ヘルマプロディートス♂': 'https://gamerch.com/monbas/355391',
  'ベルゼブブ': 'https://gamerch.com/monbas/374642',
  'ペルケレ': 'https://gamerch.com/monbas/856799',
  'ホラガルレス': 'https://gamerch.com/monbas/785615',
  'ホルス': 'https://gamerch.com/monbas/289705',
  'ホルス伯爵': 'https://gamerch.com/monbas/803459',
  'ホーリーナイトラグエル': 'https://gamerch.com/monbas/310360',
  'マスティマ': 'https://gamerch.com/monbas/297069',
  'マナナン': 'https://gamerch.com/monbas/905978',
  'ママラガン': 'https://gamerch.com/monbas/284066',
  'ママラガンスカル': 'https://gamerch.com/monbas/464049',
  'マリナ': 'https://gamerch.com/monbas/828172',
  'マリークリスマス': 'https://gamerch.com/monbas/208843',
  'マンティス': 'https://gamerch.com/monbas/821103',
  'ミネルヴァ': 'https://gamerch.com/monbas/886901',
  'メタトロン': 'https://gamerch.com/monbas/997153',
  'メティス': 'https://gamerch.com/monbas/851807',
  'モフモフクイーン': 'https://gamerch.com/monbas/939925',
  'モーセ': 'https://gamerch.com/monbas/980691',
  'ヤンデレ・ツクヨミ': 'https://gamerch.com/monbas/854380',
  'ヨルズ': 'https://gamerch.com/monbas/766222',
  'ラグエル': 'https://gamerch.com/monbas/228971',
  'ラブハリケーンマナナン': 'https://gamerch.com/monbas/961926',
  'ランダ': 'https://gamerch.com/monbas/288769',
  'ラー': 'https://gamerch.com/monbas/378264',
  'リズ＆ディア': 'https://gamerch.com/monbas/395618',
  'リズ＆ディア【猫コスver】': 'https://gamerch.com/monbas/395666',
  'リンゴ': 'https://gamerch.com/monbas/255675',
  'ルフ': 'https://gamerch.com/monbas/949217',
  'ロキ': 'https://gamerch.com/monbas/844716',
  'ワッカ＆カムイ': 'https://gamerch.com/monbas/259483',
  'ヴィシュヌ': 'https://gamerch.com/monbas/862449',
  '三蔵法師': 'https://gamerch.com/monbas/795786',
  '乙姫': 'https://gamerch.com/monbas/685513',
  '大はしゃぎタラスク': 'https://gamerch.com/monbas/935842',
  '九尾の狐': 'https://gamerch.com/monbas/300676',
  '優柔不断コアトル': 'https://gamerch.com/monbas/894883',
  '内気な花嫁ソロネ': 'https://gamerch.com/monbas/770257',
  '南国ノトス': 'https://gamerch.com/monbas/382609',
  '夏季雷セト': 'https://gamerch.com/monbas/788608',
  '天使長ミカエル': 'https://gamerch.com/monbas/859708',
  '天璋院ひめの': 'https://gamerch.com/monbas/834736',
  '女媧': 'https://gamerch.com/monbas/912895',
  '女郎蜘蛛': 'https://gamerch.com/monbas/278491',
  '安全祈願ヨルズ': 'https://gamerch.com/monbas/894882',
  '小悪魔リリム': 'https://gamerch.com/monbas/836189',
  '巫女エル': 'https://gamerch.com/monbas/212356',
  '幻の花嫁クサビラ神': 'https://gamerch.com/monbas/988938',
  '新春スマッシュワッカ＆カムイ': 'https://gamerch.com/monbas/565453',
  '春暁スサノオ': 'https://gamerch.com/monbas/240243',
  '暴君花嫁スカジ': 'https://gamerch.com/monbas/770256',
  '服部半蔵': 'https://gamerch.com/monbas/972210',
  '未知との遭遇ブラフマー': 'https://gamerch.com/monbas/652347',
  '本気Dオオゲツヒメ': 'https://gamerch.com/monbas/941847',
  '本気グレープ': 'https://gamerch.com/monbas/759925',
  '本気パイン': 'https://gamerch.com/monbas/759926',
  '本気メロン': 'https://gamerch.com/monbas/759927',
  '毘沙門天': 'https://gamerch.com/monbas/885038',
  '深淵同調サタン': 'https://gamerch.com/monbas/256373',
  '火雷大神': 'https://gamerch.com/monbas/959052',
  '爆発寸前ヌアザ': 'https://gamerch.com/monbas/825327',
  '爆買いアスタロト': 'https://gamerch.com/monbas/318999',
  '独り占めヘカトンケイル': 'https://gamerch.com/monbas/224032',
  '狼男ヘラクレス': 'https://gamerch.com/monbas/295671',
  '猛虎ナタク': 'https://gamerch.com/monbas/318996',
  '白無垢九尾': 'https://gamerch.com/monbas/362776',
  '百々目鬼': 'https://gamerch.com/monbas/922403',
  '真っ逆サマーエストリエ': 'https://gamerch.com/monbas/256373',
  '秋振舞ナアマ': 'https://gamerch.com/monbas/798206',
  '終焉の黒翼ベルゼブブ': 'https://gamerch.com/monbas/920126',
  '聖夜のアイドル乙姫': 'https://gamerch.com/monbas/814993',
  '聖夜の秘密ウンディーネ': 'https://gamerch.com/monbas/310357',
  '花より団子・カリュブディス': 'https://gamerch.com/monbas/988939',
  '花園ゆりね': 'https://gamerch.com/monbas/932200',
  '若かりし頃の獅子仙人': 'https://gamerch.com/monbas/530511',
  '邪神ちゃん': 'https://gamerch.com/monbas/932199',
  '釈迦如来': 'https://gamerch.com/monbas/334028',
  '闇堕ち白雪姫': 'https://gamerch.com/monbas/652348',
  '阿修羅': 'https://gamerch.com/monbas/658084',
  '雪アリス': 'https://gamerch.com/monbas/954319',
  '雪兎ちゃう': 'https://gamerch.com/monbas/834730',
  '風神Pwithおに☆むす': 'https://gamerch.com/monbas/839106',
  '風紀委員長イシス': 'https://gamerch.com/monbas/332334',
  '魔女っ子アリス': 'https://gamerch.com/monbas/295683',
  '魔法少女カーリー': 'https://gamerch.com/monbas/877686',
  '麒麟': 'https://gamerch.com/monbas/870251',
  '黒引振袖女郎蜘蛛': 'https://gamerch.com/monbas/362777',
  '屋台フィーバーイーリス': 'https://gamerch.com/monbas/955949',
  '笑門来福タナトス': 'https://gamerch.com/monbas/955950',
  '白雪姫': 'https://gamerch.com/monbas/180950',
  'ベルフェゴール': 'https://gamerch.com/monbas/160253',
  '望月千代女': 'https://gamerch.com/monbas/160243',
  'タミエル': 'https://gamerch.com/monbas/268465'
};

const MONSTER_DATA = `
おめがリオ|異端|水|火＆水|10|15|0|20|25|0
おめがレイ|異端|火|火＆水|15|10|0|25|20|0
お日様散々ミネルヴァ|神族|光|水＆風＆光＆闇|8|8|8|20|20|0
お月見ティアマト|神族|無|神族|0|10|0|25|20|0
すちゃらか千代女|異端|無|聖獣＆異端|17|0|25|0|0|0
だいろ神|神族|風|水＆風|0|25|0|15|0|0
つまみ食い阿修羅|魔神|雷|火＆雷|15|0|5|15|0|0
はっちゃけランダ|魔族|光|風＆光|8|4|13|0|15|0
ぺこら|神族|光|神族＆飛天＆聖人|0|10|0|20|30|0
めっちゃサマー☆バラキエル|神族|火|火＆水＆雷|10|0|12|0|0|6
わくどきファフニール|魔獣|無|魔獣|40|0|0|0|0|0
アイアンメイデン|魔神|光|光|8|10|0|0|0|0
アストラルヴィシュヌ|神族|闇|神族＆飛天＆聖人＆聖獣|5|10|0|25|25|0
アテン|神族|火|火＆光|5|5|0|10|15|0
アムルタルト|神族|光|風＆光|0|8|0|20|20|0
アムルタート|神族|風|風|0|0|0|20|20|0
アリオク|魔神|闇|火＆闇|15|0|5|15|0|0
アリス|聖人|光|光|0|5|0|15|5|0
イナンナ|神族|雷|雷＆闇|18|0|0|15|0|0
イライラ三蔵法師|聖人|闇|水＆光＆闇|5|5|5|20|20|0
イルミネーション如来|神族|雷|雷＆光|10|10|0|0|0|0
イーリス|神族|光|光|0|0|15|0|10|0
ウィル・オ・テューポーン|魔神|火|火＆風|10|10|0|20|0|0
エジソン|聖人|雷|雷|0|0|14|0|0|14
エストリエ|魔族|光|魔族＆魔獣|8|0|13|0|14|0
エレボス|魔神|闇|闇|8|8|0|15|0|0
オーディン|神族|光|光|8|0|10|8|0|0
カオス・エレボス|魔神|水|水＆光＆闇|8|8|5|15|15|0
カーリー|魔神|闇|闇|5|0|5|10|0|0
カリュブディス|魔獣|水|水|0|0|0|45|0|0
キョンキョン|魔族|風|魔族＆鬼族＆異端|10|0|10|20|10|10
キョンシー・麒麟|聖獣|闇|雷＆光＆闇|8|0|15|0|0|5
ギャルサンタ・ゴアブ|魔神|雷|雷＆風|10|0|14|0|0|0
クイーンビー|魔獣|風|雷＆風|8|0|14|0|0|0
クサビラ神|神族|風|水＆風|0|10|0|15|15|0
クリぼっちマスティマ|魔神|水|水＆光＆闇|5|0|0|10|10|0
ケツァルコアトル|聖獣|風|風|5|0|10|0|5|0
サハギンと愉快な仲間たち|魔族|水|水|15|15|0|5|0|0
サマースルト|魔神|火|魔神|15|7|0|15|0|0
サマービーチスター・ラー|神族|火|神族|10|10|0|20|15|0
サマーンティス|魔獣|水|魔獣|0|0|35|0|0|0
サレオス|魔神|水|水|12|8|0|15|7|0
サレオスの姉御|魔神|火|火＆水|16|10|0|25|0|0
サタン|魔神|闇|パッシブなし|0|0|0|0|0|0
サンタヘスティアー|神族|水|火＆水|5|10|0|15|15|0
シスター・オーディン|神族|闇|光＆闇|8|0|10|15|25|0
ジングルケロ・タニグク|神族|光|水＆光|10|0|12|0|0|0
スイカ割り・カボ|魔神|闇|魔神|8|8|8|10|10|0
スカジ|魔神|水|水|8|8|0|8|0|0
スルト|魔神|火|火|12|7|0|13|0|0
セドナ|魔神|水|水＆闇|8|0|0|10|0|0
ソロネ|飛天|火|火|7|0|10|0|5|0
ゾンビフルフル|魔獣|闇|雷＆闇|8|8|4|20|0|4
タナトス|魔神|闇|闇|10|0|0|15|15|0
タニグク|神族|水|水|10|0|10|0|0|0
タラスク|魔獣|水|水＆闇|10|13|0|10|0|0
チビサタン|魔神|闇|魔神|5|5|5|20|20|0
ツイゴアブ|魔神|風|風|8|0|10|4|0|0
ツクヨミ|神族|闇|光＆闇|5|5|0|15|10|0
ツチミカド|聖人|無|聖人|15|8|0|25|25|0
ティアマト|神族|水|水|0|0|0|20|20|0
テューポーン|魔神|風|風|10|10|0|20|0|0
テュール|神族|火|火|22|0|0|10|0|0
ディオニュソス|神族|風|水＆風|5|0|5|15|0|0
ナアマ|魔族|闇|闇|0|5|5|5|15|0
ナタク|神族|火|火|10|0|0|10|0|0
ニャルラトホテピョン|魔神|光|魔神|10|0|10|15|15|0
ヌアザ|神族|水|水|8|12|0|15|5|0
ネヴァン|魔神|闇|闇|8|0|16|0|0|0
ノトス|神族|風|風|4|4|4|4|4|0
ハツヒノメイデン|魔神|火|火＆光|10|15|0|20|0|0
バカンスメイデン|魔神|水|水＆光|8|10|0|10|0|0
バラキエル|神族|雷|雷|8|0|12|0|0|6
フォカロル|魔神|風|水＆風|5|0|16|0|10|0
フォービ|魔神|火|火＆風|15|0|0|25|0|0
フランケンタロス|異端|雷|火＆雷|5|10|0|25|0|0
ブライダル・アールマティ|神族|光|光|5|5|0|10|25|0
ブライダル・エジソン|聖人|光|聖人|0|0|35|0|0|0
ブライダル・ケツァルコアトル|聖獣|光|聖獣|5|0|15|0|5|0
ブライダル・ホラガルレス|魔神|雷|魔神|15|0|12|15|0|0
ブライダル・メティス|神族|光|神族|0|10|0|20|20|0
ヘスティアー|神族|火|火|0|10|0|15|15|0
ヘルマプロディートス♂|魔神|水|水|10|10|0|25|0|0
ベルゼブブ|魔神|風|水＆雷＆風＆闇|10|0|10|0|0|50
ペルケレ|魔神|雷|雷＆闇|5|0|14|0|0|5
ホラガルレス|魔神|雷|雷|10|0|8|0|0|0
ホルス|神族|風|風|7|7|7|0|0|0
ホルス伯爵|神族|闇|風＆闇|5|5|12|0|10|0
ホーリーナイトラグエル|神族|光|光＆闇|10|5|5|0|0|0
マスティマ|魔神|光|光＆闇|5|0|0|10|0|0
マナナン|神族|水|水|6|10|0|15|20|0
ママラガン|魔神|雷|雷|7|0|0|15|0|0
ママラガンスカル|魔神|闇|雷＆闇|7|7|0|15|0|0
マリナ|神族|火|火＆光|0|5|0|10|10|0
マリークリスマス|聖人|光|光|5|5|0|10|0|0
マンティス|魔獣|風|風|0|0|14|0|0|14
ミネルヴァ|神族|闇|風＆闇|5|0|5|15|20|0
メタトロン|神族|光|火＆光＆無|10|0|19|0|15|0
メティス|神族|無|神族|5|8|0|10|10|0
モフモフクイーン|聖獣|風|聖人＆聖獣|0|20|0|25|10|0
モーセ|聖人|水|聖人＆異端|15|5|0|15|5|0
ヤンデレ・ツクヨミ|神族|闇|神族|8|8|0|20|20|0
ヨルズ|魔神|風|風|8|4|0|20|15|0
ラグエル|神族|闇|闇|10|5|5|0|0|0
ラブハリケーンマナナン|神族|風|水＆風＆光|4|13|0|20|25|0
ランダ|魔族|風|魔族|10|4|12|0|5|0
ラー|神族|火|火|10|5|0|20|0|0
リズ＆ディア|魔族|無|無・火・水・雷・風・光・闇|7|7|7|7|7|7
リズ＆ディア【猫コスver】|魔族|無|無・火・水・雷・風・光・闇|7|7|7|7|7|7
リンゴ|異端|無|異端|5|5|5|20|20|0
ルフ|飛天|雷|雷|5|5|5|10|0|0
ロキ|魔神|無|魔神|8|8|0|10|5|0
ワッカ＆カムイ|神族|水|水|0|8|0|15|15|0
ヴィシュヌ|神族|無|神族＆飛天＆聖人＆聖獣|0|10|0|25|20|0
三蔵法師|神族|光|光|5|5|5|20|20|0
乙姫|聖人|水|水|0|8|0|15|15|0
大はしゃぎタラスク|魔獣|水|魔神＆魔獣|10|13|0|20|0|0
九尾の狐|魔獣|火|火|10|0|5|5|0|0
優柔不断コアトル|聖獣|風|聖獣|0|0|35|0|0|0
内気な花嫁ソロネ|飛天|光|火＆光|7|0|12|10|20|0
南国ノトス|神族|水|水＆風|8|4|8|4|4|0
夏季雷セト|魔神|雷|雷＆風|10|0|10|0|0|15
天使長ミカエル|神族|光|神族＆飛天|8|8|8|15|15|0
天璋院ひめの|異端|光|魔獣＆異端|15|0|10|15|10|0
女媧|魔神|闇|魔獣＆魔族＆魔神|10|10|0|15|0|0
女郎蜘蛛|魔獣|闇|魔獣|8|8|10|15|0|0
安全祈願ヨルズ|魔神|無|魔神|8|10|0|20|20|0
小悪魔リリム|魔族|闇|魔族＆魔獣|0|0|5|5|35|0
巫女エル|神族|光|神族|10|5|0|15|5|0
幻の花嫁クサビラ神|神族|風|水＆風＆光|0|15|0|20|25|0
新春スマッシュワッカ＆カムイ|神族|風|神族|0|10|10|15|15|0
春暁スサノオ|神族|雷|雷|10|0|15|5|0|0
暴君花嫁スカジ|魔神|水|魔神|10|10|0|20|0|0
服部半蔵|異端|光|聖人＆異端|10|0|15|0|0|0
未知との遭遇ブラフマー|魔神|雷|雷|0|0|0|20|20|0
本気Dオオゲツヒメ|聖人|光|聖人|0|0|0|60|0|0
本気グレープ|異端|闇|異端|0|0|35|0|0|0
本気パイン|異端|火|異端|40|0|0|0|0|0
本気メロン|異端|無|異端|0|0|0|60|0|0
毘沙門天|鬼族|火|鬼族|20|10|0|30|0|0
深淵同調サタン|魔神|闇|魔神＆魔族＆魔獣＆鬼族|10|5|0|25|15|0
火雷大神|魔神|雷|火＆雷|10|0|0|15|10|0
爆発寸前ヌアザ|神族|火|火＆水|10|10|0|15|10|0
爆買いアスタロト|魔神|光|雷＆光|5|0|5|0|0|0
独り占めヘカトンケイル|魔神|無|魔神|0|10|0|15|0|0
狼男ヘラクレス|神族|無|神族|7|7|0|20|0|0
猛虎ナタク|神族|火|火|15|0|5|10|0|0
白無垢九尾|魔獣|光|火＆光|10|0|8|10|0|0
百々目鬼|鬼族|闇|鬼族|8|15|0|15|15|0
真っ逆サマーエストリエ|魔族|火|火＆光＆闇|14|0|14|0|14|0
秋振舞ナアマ|魔族|無|魔族|0|8|8|20|25|0
終焉の黒翼ベルゼブブ|魔神|雷|水＆雷＆風＆闇|10|0|15|0|0|50
聖夜のアイドル乙姫|聖人|闇|水＆光＆闇|0|8|0|15|15|0
聖夜の秘密ウンディーネ|精霊|水|水|10|10|0|10|0|0
花より団子・カリュブディス|魔獣|光|魔神＆魔獣|5|10|0|35|0|0
花園ゆりね|異端|無|異端＆聖人|18|5|0|25|0|15
若かりし頃の獅子仙人|聖獣|風|風|9|0|11|0|0|10
邪神ちゃん|魔神|闇|魔神＆魔族＆魔獣|12|0|5|30|0|0
釈迦如来|神族|光|光|10|10|0|0|0|0
闇堕ち白雪姫|聖人|闇|光＆闇|10|10|0|25|0|0
阿修羅|魔神|火|火|15|0|0|15|0|0
雪アリス|聖人|水|聖人＆聖獣|0|13|0|15|25|0
雪兎ちゃう|聖人|風|聖人＆聖獣|0|10|15|15|15|0
風神Pwithおに☆むす|魔神|水|魔神＆鬼族|8|8|0|20|15|0
風紀委員長イシス|神族|風|水＆風＆光|0|5|5|10|15|0
魔女っ子アリス|聖人|光|光|0|10|0|15|15|0
魔法少女カーリー|魔神|光|光＆闇|8|0|8|10|10|0
麒麟|聖獣|雷|雷＆光|5|0|13|0|0|5
黒引振袖女郎蜘蛛|魔獣|光|光＆闇|4|4|8|20|0|0
屋台フィーバーイーリス|神族|光|聖人＆神族＆飛天|0|0|15|5|25|0
笑門来福タナトス|魔神|光|魔神＆魔族|15|0|0|20|20|0
白雪姫|聖人|光|パッシブなし|0|0|0|0|0|0
ベルフェゴール|魔神|闇|パッシブなし|0|0|0|0|0|0
望月千代女|異端|風|パッシブなし|0|0|0|0|0|0
タミエル|飛天|光|パッシブなし|0|0|0|0|0|0
`.trim().split('\n').map((row, index) => {
  const [name, race, element, targets, attack, defense, agility, hp, sp, crt] = row.split('|');
  return {
    id: `monster-supplied-${String(index + 1).padStart(3, '0')}`,
    name,
    race,
    element,
    passiveTarget: targets === 'パッシブなし' ? [] : targets.split(/[＆・]/u),
    attack: Number(attack),
    defense: Number(defense),
    agility: Number(agility),
    hp: Number(hp),
    sp: Number(sp),
    crt: Number(crt),
    wikiUrl: MONSTER_WIKI_URLS[name] || '',
    imageUrl: MONSTER_IMAGE_URLS[name] || ''
  };
});
