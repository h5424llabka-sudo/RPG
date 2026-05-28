// ゲームデータとマップ定義
const ASSET_CONFIG = {
  characters: {
    kanato: { src: 'assets/pipo-charachip001a.png', frameW: 32, frameH: 32, cols: 3,
      dirRows: { down:0, left:1, right:2, up:3 }, sheetOffsetX: 0, sheetOffsetY: 0,
      fallbackColor: '#5588ff', name: 'かなと' },
    dog: { src: null, frameW: 32, frameH: 32, cols: 3,
      dirRows: { down:0, left:1, right:2, up:2 }, sheetOffsetX: 0, sheetOffsetY: 0,
      fallbackColor: '#cc8833', name: 'いぬ' },
    turtle: { src: null, frameW: 32, frameH: 32, cols: 3,
      dirRows: { down:0, left:1, right:2, up:2 }, sheetOffsetX: 0, sheetOffsetY: 0,
      fallbackColor: '#44aa66', name: 'かめ' },
    mama: { src: null, frameW: 32, frameH: 32, cols: 3,
      dirRows: { down:0, left:1, right:2, up:2 }, sheetOffsetX: 0, sheetOffsetY: 0,
      fallbackColor: '#ff88aa', name: 'まま' },
    papa: { src: null, frameW: 32, frameH: 32, cols: 3,
      dirRows: { down:0, left:1, right:2, up:2 }, sheetOffsetX: 0, sheetOffsetY: 0,
      fallbackColor: '#8866cc', name: 'ぱぱ' },
  },
  tiles: {
    grass:  { src: null, color: '#5aaa33', topColor: '#6dcc44' },
    water:  { src: null, color: '#2255cc', topColor: '#3377ee' },
    tree:   { src: null, color: '#224411', topColor: '#336622' },
    rock:   { src: null, color: '#666666', topColor: '#888888' },
    wall:   { src: null, color: '#776655', topColor: '#998866' },
    road:   { src: null, color: '#bbaa88', topColor: '#ccbb99' },
    sand:   { src: null, color: '#ddcc88', topColor: '#eedd99' },
    floor:  { src: null, color: '#ccbb99', topColor: '#ddccaa' },
    house:  { src: null, color: '#aa7733', topColor: '#cc8844' },
    bridge: { src: null, color: '#996633', topColor: '#bb8844' },
    exit:   { src: null, color: '#88ffbb', topColor: '#aaffcc' },
    inn:    { src: null, color: '#ffcc88', topColor: '#ffddaa' },
    flower: { src: null, color: '#66bb44', topColor: '#88dd55' },
  },
  enemies: {
    ghost:  { src: null, w: 64, h: 64, color: '#ccaaff', rimColor: '#9977dd' },
    slime:  { src: null, w: 56, h: 48, color: '#88ffcc', rimColor: '#44cc88' },
    wolf:   { src: null, w: 72, h: 64, color: '#886644', rimColor: '#664422' },
    fairy:  { src: null, w: 56, h: 56, color: '#ffaaee', rimColor: '#cc66bb' },
    boss:   { src: null, w: 96, h: 96, color: '#dd3333', rimColor: '#881111' },
  },
};
const TILE_ID = { G:'grass', W:'water', T:'tree', L:'wall', R:'road', S:'sand', F:'floor', H:'house', B:'bridge', E:'exit', I:'inn', X:'flower', K:'rock' };
const PASSABLE = { grass:true, water:false, tree:false, wall:false, rock:false, road:true, sand:true, floor:true, house:false, bridge:true, exit:true, inn:true, flower:true };
const NPC_DEFS = {
  // ================================
  // 拠点: 流山鰭ヶ崎
  // ================================
  hiregasaki: [
    { id:'elder', x:7, y:4, dir:'down', color:'#888855', name:'おじいさん', dialogue:[
      'かなとよ、大丈夫かい？',
      '突然魔物が街に現れて、みんなさらわれてしまったんじゃなあ。',
      'ままは「まが谷の森」の奥にいるって聞いたぞ。',
      '南の出口から行けるぞ。気をつけてな。'] },
    { id:'neighbor', x:14, y:5, dir:'left', color:'#aa8866', name:'近所のおばさん', dialogue:[
      'かなとくん！',
      'ままさんは魔物にさらわれたみたいよ。',
      '南の「まが谷の森」の山小屋に隔離されてるって。',
      '山小屋の鍵は森の奥の魔力充電鬼でかかってるんだって！'] },
    { id:'innkeeper', x:5, y:9, dir:'down', color:'#aa7744', name:'宿屋のおじさん', dialogue:['宿屋へようこそ！','一泊10Gで体を休めていけ。'], isInn: true },
    { id:'kid', x:16, y:9, dir:'right', color:'#ffcc66', name:'小学生', dialogue:['まが谷の森は南の出口から行けるよ！','魔物は強いから気をつけてね！'] },
  ],
  // ================================
  // 第1章: まが谷の森（外エリア）
  // ================================
  area1: [
    { id:'woodsman', x:5, y:15, dir:'right', color:'#886633', name:'木こりのおじさん', dialogue:[
      'この森に魔物が増えてさ、仕事にならんよ。',
      '森の奥に「まが谷の廃小屋」があるんだが、',
      '魔物の番人に鍵をかけられてるんだ。',
      '番人を倒せば小屋に入れるらしいぞ。',
      'まずは奥へ進んでみてくれ。'] },
  ],
  // ================================
  // 第1章: まが谷の廃小屋（ダンジョン）
  // ================================
  dungeon1: [
    { id:'mama', x:10, y:11, dir:'down', color:'#ff88aa', name:'まま', dialogue:[
      'かなと！よかった、来てくれたのね！',
      '魔物にさらわれてここに閉じ込められていたの。',
      '新しいお弁当のレシピを思いついたわ。',
      '早くお家に帰って作ってあげる！',
      '一緒に帰りましょう！'], isRescue: true, rescueChar: 'mama', requiresBossDefeated: true },
  ],
  // ================================
  // 旧マップ用（将来の章で使用）
  // ================================
  village: [
    { id:'elder', x:7, y:4, dir:'down', color:'#888855', name:'おじいさん', dialogue:['気をつけてな。'] },
    { id:'innkeeper', x:5, y:7, dir:'down', color:'#aa7744', name:'宿屋のおじさん', dialogue:['一泊10Gで体を休めていけ。'], isInn: true },
  ],
  forest: [
    { id:'fairy', x:14, y:2, dir:'down', color:'#ffaaee', name:'もりの妖精', dialogue:['ようこそ、そよ風の森へ。','この森のボスを倒せば','迷子のいぬを助けられるよ。','がんばって！'] },
    { id:'dog', x:22, y:10, dir:'down', color:'#cc8833', name:'いぬ', dialogue:['ワン！ ワン！','（いぬが嬉しそうに飛びついた！）','いぬが仲間になった！'], isRescue: true, rescueChar: 'dog', requiresBossDefeated: true },
  ],
  lake: [
    { id:'fisherman', x:5, y:8, dir:'right', color:'#5577aa', name:'釣り人', dialogue:['湖の真ん中に何かあるらしい。','でも水の上は歩けないからねえ...','かめに乗れたらなあ。'] },
    { id:'turtle', x:15, y:12, dir:'up', color:'#44aa66', name:'かめ', dialogue:['のんびり～。','（かめが振り返った！）','かめが仲間になった！','背中に乗せてあげるよ！'], isRescue: true, rescueChar: 'turtle' },
  ],
  town: [
    { id:'photographer', x:8, y:3, dir:'right', color:'#ffaacc', name:'おじさん', dialogue:['おお！ かなとじゃないか！','まま なら広場の奥にいたよ。','カメラを構えてたね。'] },
    { id:'mama', x:20, y:8, dir:'left', color:'#ff88aa', name:'まま', dialogue:['かなと！ 心配したわ！','写真を撮っていたら','迷子になっちゃった。','一緒に帰りましょう！'], isRescue: true, rescueChar: 'mama' },
  ],
  tower: [
    { id:'robot', x:10, y:10, dir:'down', color:'#aaaaaa', name:'ロボット', dialogue:['ビービー。','この塔は「ぱぱ」が作ったよ。','最上階にいるはずだよ。'] },
    { id:'papa', x:13, y:2, dir:'down', color:'#8866cc', name:'ぱぱ', dialogue:['かなと！ 来てくれたんだ！','塔のシステムを調べていたら','出られなくなっちゃってた。','帰ろう！みんなのところへ！'], isRescue: true, rescueChar: 'papa' },
  ],
};
const MAP_DATA = {
  // =============================
  // 拠点: 流山鰭ヶ崎
  // =============================
  hiregasaki: { name:'流山鰭ヶ崎', w:25, h:20, bgm:'village', enemies:[], encounter:false,
    startX:12, startY:17,
    nextMap:null,
    exitTo: { map:'area1', toX:12, toY:16 },
    tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGHHHGGGGGGGGGGGGGHHHGGGL',
      'LGHHHGGGGGGGGGGGGGHHHGGGL',
      'LGGGGGGRRRRRGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGXGL',
      'LGXGGGGIGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGRGGGGGGGGGGGGGGL',
      'LGGGGGGGGRGGGGGGGGGGGGGGL',
      'LGGGGGIGGRGGGGHHHHGGGGGGL',
      'LGGGGGGGGRGGGGHHHHGGGGGGL',
      'LGGGGGGGGRGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGXGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGEGGGGGGGGGGGL',
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
    ].reverse() },
  // =============================
  // 第1章: まが谷の森（外エリア、w:25 h:20）
  //   y=18: 北出口（hiregasaki へ戻る）E at x=12
  //   y=3:  番人ボス（ここを倒すと dungeon1 入口解放）
  //   y=2:  ダンジョン入口 E at x=12
  // =============================
  area1: { name:'まが谷の森', w:25, h:20, bgm:'forest',
    enemies:['ghost','slime'], encounterRate:0.04, encounterTiles:['grass'], encounter:true,
    startX:12, startY:16,
    exits:[
      { x:12, y:18, map:'hiregasaki', toX:12, toY:1 },
      { x:12, y:1,  map:'dungeon1',   toX:10, toY:3 },
    ],
    boss:{ id:'area1Boss', x:12, y:3, enemy:'boss', defeated:false,
      preText:['「まが谷の番人」が現れた！','この先は通さない！'],
      postText:['番人が消えた！','廃小屋の入口が開いた！'] },
    tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
      'LLLLLLLLLLLLELLLLLLLLLLLL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LTTTTTTTTTTTGTTTTTTTTTTTL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LTTTTTTTTTTTGTTTTTTTTTTTL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LTTTTTTTTTTTGTTTTTTTTTTTL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LLLLLLLLLLLHGHLLLLLLLLLLL',
      'LLLLLLLLLLLHEHLLLLLLLLLLL',
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
    ].reverse() },
  // =============================
  // 第1章: まが谷の廃小屋（ダンジョン、w:20 h:14）
  //   y=1:  出口 E at x=10 （森に戻る）
  //   y=9:  壁の隙間 F at x=10 ← ボスで塞がれる
  //   y=11: まま NPC
  // =============================
  dungeon1: { name:'まが谷の廃小屋', w:20, h:14, bgm:'tower',
    enemies:['ghost'], encounterRate:0.05, encounter:true,
    startX:10, startY:2,
    exits:[
      { x:10, y:1, map:'area1', toX:12, toY:4 },
    ],
    boss:{ id:'dungeon1Boss', x:10, y:9, enemy:'boss', defeated:false,
      preText:['邪悪な魔力が充満している…','「魔力充電鬼」が現れた！'],
      postText:['魔力充電鬼が消滅した！','奥の部屋の鎖が解けた！','ままを助けに行こう！'] },
    tiles:[
      'LLLLLLLLLLLLLLLLLLLL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LLLLLLLLLLFLLLLLLLLL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LFFFFFFFFFFFFFFFFFFL',
      'LLLLLLLLLLELLLLLLLLL',
      'LLLLLLLLLLLLLLLLLLLL',
    ].reverse() },
  // =============================
  // 旧マップ（将来の章で使用）
  // =============================
  village: { name:'はじまりの村', w:25, h:18, bgm:'village', enemies:[], nextMap:{x:12,y:0,map:'hiregasaki',toX:12,toY:17}, tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LHHHHGGGGGGGGGGGGGGGGGGGL',
      'LHHHHGGGGRRRRRRRGGGGGGGGL',
      'LGGGRRGGGGGGGGGGGGGGGGGGL',
      'LGGGGRGGGGGGGGGGGGGGGGGGL',
      'LXGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGRGGGGIGGGGGGGL',
      'LGGGGGGGGGGGRGGGGHHGGGGGL',
      'LGGGGGGGGGGGRGGGGHHGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LLLLLLLLLLLLELLLLLLLLLLLL',
    ].reverse(), startX:12, startY:1, encounter:false },
  forest: { name:'そよ風の森', w:25, h:18, bgm:'forest', enemies:['ghost','slime','wolf'], encounterRate:0.04, encounterTiles:['grass'], nextMap:{x:12,y:17,map:'village',toX:12,toY:0}, tiles:[
      'LLLLLLLLLLLLELLLLLLLLLLLL',
      'LTTTTTTTTTTGGGTTTTTTTTTTL',
      'LTTTTTTTTTTGGGTTTTTTTTTTL',
      'LTTTTGGGGGGGGGGGGGGGTTTTL',
      'LTTTTGGGGGKKGGGGGGGGTTTTL',
      'LTTTTGGGGGGGGGGGGGGGTTTTL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGTTTTTTTTTTTTTGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGKKGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LTTTTTTTTTTRRTTTTTTTTTTTL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LGGGGGGGGGGGGGGGGGGGGGGGL',
      'LLLLLLLLLLLLLLLLLLLLLLLLL',
    ].reverse(), startX:12, startY:16, encounter:true,
    boss:{ id:'forestBoss', x:22, y:9, enemy:'boss', defeated:false,
      preText:['もりのぬしが現れた！','いぬの邪魔をするな！'],
      postText:['もりのぬしは逃げ去った...','いぬが喜んでいる！'] }
  },
  lake: { name:'きらきら湖', w:25, h:18, bgm:'lake', enemies:['fairy','slime'], encounterRate:0.03, nextMap:{x:12,y:17,map:'forest',toX:12,toY:1}, tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLL', 'LGGGGGWWWWWWWWWWWGGGGGL', 'LGGGWWWWWWWWWWWWWWGGGGL', 'LGGWWWWWWWWWWWWWWWWGGGL',
      'LGGWWWWWWWWWWWWWWWWGGGL', 'LGGWWWWWBBBBWWWWWWWGGGL', 'LGGWWWWWBGGBWWWWWWWGGGL', 'LGGWWWWWBGGBWWWWWWWGGGL',
      'LGGWWWWWBBBBWWWWWWWGGGL', 'LGGWWWWWWWWWWWWWWWWGGGL', 'LGGWWWWWWWWWWWWWWWWGGGL', 'LGGWWWWWWWWWWWWWWWWGGGL',
      'LGGWWWWWWWWWWWWWWWWGGGL', 'LGGGGGGGGGGGGGGGGGGGGGL', 'LGGGGGGGGGGGGGGGGGGGGL', 'LGGGGGGGGGGGGGGGGGGGGL',
      'LRRRRRRRRERRRRRRRRRL', 'LLLLLLLLLLLLLLLLLLLLL', ].reverse(), startX:12, startY:15, encounter:true },
  town: { name:'写真の街', w:25, h:18, bgm:'town', enemies:['ghost','fairy'], encounterRate:0.03, nextMap:{x:12,y:17,map:'lake',toX:12,toY:1}, tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLL', 'LFFFFFFFFFFFFFFFFFFFFF L', 'LFHHHFFHHFFHHHFFFHHHFFL', 'LFHHHFFHHFFHHHFFFHHHFFL',
      'LFFFFFFF RRRRFFFFFFFFFFFL', 'LFFFFFFFRRRRRRFFFFFFFFF L', 'LFFFFFFRRRRRRRRRFFFFFFFL', 'LFFFFFFRFFFFFFFFRFFFFFFL',
      'LFFFFFFRFFFFFFFFRFFFFFFL', 'LFFFFFFRFFFFFFFFRFFFFFFL', 'LFFHHFFRFFFFFFFRFFHHFFL', 'LFFHHFFRFFFFFFFRFFHHFFL',
      'LFFFFFFRFFFFFFFRFFFFFFFL', 'LFFFFFFRRRRRRRRRFFFFFFFL', 'LGGGGGGGGGGGGGGGGGGGGGGL', 'LGGGGGGGGGGGGGGGGGGGGGGL',
      'LRRRRRRRRERRRRRRRRRL', 'LLLLLLLLLLLLLLLLLLLLL', ].reverse(), startX:12, startY:15, encounter:true },
  tower: { name:'カラクリの塔', w:25, h:18, bgm:'tower', enemies:['ghost','boss'], encounterRate:0.05, nextMap:{x:12,y:17,map:'town',toX:12,toY:1}, tiles:[
      'LLLLLLLLLLLLLLLLLLLLLLLL', 'LLFFFFFFFFFFFFFFFFFFLLL', 'LLFFFFHHHFFHHHFFFFFFLL', 'LLFFFFHHHFFHHHFFFFFFLL',
      'LLFFFFFFFFFFFFFFFFFFF LL', 'LLFFFFFF RRRRRFFFFFFFFLL', 'LLFFFFFRRRRRRRRFFFFFFLL', 'LLFFFFFRRFFFFFFFFRFFFFF LL',
      'LLFFFFFRRFFFFFFFFRFFFFFLL', 'LLFFFFFFRFFFFFFFFRFFFFLL', 'LLFFFFFFRFFFFFFFFRFFFFLL', 'LLLLLLLRRRRRRRRRRLLLLLL',
      'LLLLLLLRFFFFFFFFFFFLLLL', 'LLLLLLLRFFFFFFFFFFFLLLL', 'LLLLLLLLLLLLLLLLLLLLLL', 'LGGGGGGGGGGGGGGGGGGGGL', 'LRRRRRRRRERRRRRRRRRL', 'LLLLLLLLLLLLLLLLLLLLL', ].reverse(), startX:12, startY:15, encounter:true, isFinalDungeon:true },
};
const CHARACTER_STATS = {
  kanato: { maxHp:80, maxMp:30, atk:15, def:10, spd:12, name:'かなと', skills:[
      { name:'はげます', mpCost:8, effect:'buffAtk', target:'ally', desc:'味方の攻撃力UP！' },
      { name:'おやつ', mpCost:5, effect:'heal', target:'self', power:30, desc:'HPを30回復' },
    ] },
  dog: { maxHp:60, maxMp:25, atk:18, def:8, spd:20, name:'いぬ', skills:[
      { name:'ほえる', mpCost:6, effect:'stun', target:'enemy', desc:'敵を1ターン休みに！' },
      { name:'かみつく', mpCost:4, effect:'attack', target:'enemy', power:1.8, desc:'強烈な一撃！' },
    ] },
  turtle: { maxHp:120, maxMp:20, atk:10, def:25, spd:5, name:'かめ', skills:[
      { name:'からにこもる', mpCost:5, effect:'buffDef', target:'self', desc:'防御力を大幅UP！' },
      { name:'かばう', mpCost:8, effect:'protect', target:'ally', desc:'仲間をかばう！' },
    ] },
  mama: { maxHp:70, maxMp:50, atk:12, def:10, spd:14, name:'まま', skills:[
      { name:'フラッシュ', mpCost:12, effect:'blind', target:'allEnemy', desc:'敵全体を暗闇に！' },
      { name:'おべんとう', mpCost:20, effect:'healAll', target:'allAlly', power:50, desc:'全体を大回復！' },
    ] },
  papa: { maxHp:75, maxMp:45, atk:20, def:12, spd:15, name:'ぱぱ', skills:[
      { name:'分析ツール', mpCost:6, effect:'analyze', target:'enemy', desc:'敵の弱点を見破る！' },
      { name:'プログラム発動', mpCost:18, effect:'randomAll', target:'allEnemy', desc:'ランダム全体攻撃！' },
    ] },
};
const ENEMY_STATS = {
  ghost:     { name:'イタズラおばけ',     hp:35,  atk:8,  def:4,  spd:10, exp:15, gold:8,  skills:['おどかす'], color:'#ccaaff', weakTo:'light', level:1,
    drops:[{item:'herb',rate:0.60},{item:'rust_screw',rate:0.40},{item:'film',rate:0.05}] },
  ghost_lv2: { name:'イタズラおばけ(Lv2)',hp:50,  atk:12, def:6,  spd:12, exp:25, gold:12, skills:['おどかす'], color:'#dd99ff', weakTo:'light', level:2,
    drops:[{item:'herb',rate:0.70},{item:'rust_screw',rate:0.50},{item:'film',rate:0.08}] },
  ghost_lv3: { name:'シャドウおばけ',     hp:70,  atk:16, def:8,  spd:14, exp:40, gold:18, skills:['おどかす','つきまとう'], color:'#8844cc', weakTo:'light', level:3,
    drops:[{item:'herb',rate:0.80},{item:'magic_board',rate:0.30},{item:'film',rate:0.12}] },
  slime:     { name:'迷子スライム',        hp:25,  atk:5,  def:3,  spd:8,  exp:10, gold:5,  skills:['たいあたり'], color:'#88ffcc', weakTo:'fire', level:1,
    drops:[{item:'jelly',rate:0.70},{item:'rust_screw',rate:0.30},{item:'film',rate:0.05}] },
  slime_lv2: { name:'まるいスライム',     hp:40,  atk:8,  def:5,  spd:10, exp:18, gold:10, skills:['たいあたり','スライム液'], color:'#44ffee', weakTo:'fire', level:2,
    drops:[{item:'jelly',rate:0.80},{item:'rust_screw',rate:0.40},{item:'film',rate:0.08}] },
  slime_lv3: { name:'キングスライム',     hp:65,  atk:14, def:8,  spd:12, exp:35, gold:20, skills:['たいあたり','スライム液','分裂'], color:'#00ffff', weakTo:'fire', level:3,
    drops:[{item:'jelly',rate:0.90},{item:'old_gear',rate:0.40},{item:'film',rate:0.15}] },
  wolf:      { name:'もりのオオカミ',     hp:55,  atk:14, def:8,  spd:15, exp:25, gold:15, skills:['かみつく','おたけび'], color:'#886644', weakTo:'thunder', level:1,
    drops:[{item:'nut',rate:0.50},{item:'herb',rate:0.40},{item:'film',rate:0.05}] },
  wolf_lv2:  { name:'ダークウルフ',       hp:75,  atk:18, def:10, spd:17, exp:35, gold:22, skills:['かみつく','おたけび','ブレスアタック'], color:'#553322', weakTo:'thunder', level:2,
    drops:[{item:'nut',rate:0.60},{item:'herb',rate:0.50},{item:'film',rate:0.08}] },
  wolf_lv3:  { name:'スカイウルフ',       hp:95,  atk:22, def:12, spd:20, exp:50, gold:30, skills:['かみつく','おたけび','ブレスアタック'], color:'#334411', weakTo:'thunder', level:3,
    drops:[{item:'nut',rate:0.70},{item:'old_gear',rate:0.30},{item:'film',rate:0.12}] },
  fairy:     { name:'イタズラ妖精',       hp:40,  atk:10, def:6,  spd:18, exp:20, gold:12, skills:['まどわせ'], color:'#ffaaee', weakTo:'dark', level:1,
    drops:[{item:'sparkle_water',rate:0.60},{item:'nut',rate:0.40},{item:'film',rate:0.05}] },
  fairy_lv2: { name:'トリックフェアリー', hp:55,  atk:13, def:8,  spd:20, exp:30, gold:18, skills:['まどわせ','ぶぶん'], color:'#ff88dd', weakTo:'dark', level:2,
    drops:[{item:'sparkle_water',rate:0.70},{item:'nut',rate:0.50},{item:'film',rate:0.08}] },
  fairy_lv3: { name:'クイーンフェアリー', hp:75,  atk:17, def:10, spd:23, exp:45, gold:28, skills:['まどわせ','ぶぶん','魔法の光'], color:'#ffccff', weakTo:'dark', level:3,
    drops:[{item:'sparkle_water',rate:0.80},{item:'coil',rate:0.30},{item:'film',rate:0.12}] },
  boss:      { name:'もりのぬし',         hp:180, atk:22, def:15, spd:12, exp:80, gold:50, skills:['つよいひっかき','もりのおたけび'], color:'#dd3333', weakTo:'light', isBoss:true, level:1,
    drops:[{item:'boss_thorn',rate:1.00},{item:'rainbow_mushroom',rate:1.00},{item:'film',rate:1.00}] },
};
const COMMANDS = ['たたかう', 'スキル', 'ぼうぎょ', 'どうぐ', 'にげる'];

function parseTileRow(str) {
  return str.split('').filter(c => c in TILE_ID || c === ' ').map(c => c === ' ' ? 'grass' : TILE_ID[c]);
}
function normalizeRowTiles(rowTiles, width) {
  if (rowTiles.length === width) return rowTiles;
  const filledTiles = [...rowTiles];
  const lastTile = filledTiles[filledTiles.length - 1] || 'wall';
  const fillTile = lastTile === 'wall' ? (filledTiles[filledTiles.length - 2] || 'grass') : lastTile;
  while (filledTiles.length < width) {
    filledTiles.push(fillTile);
  }
  if (filledTiles.length > width) {
    filledTiles.length = width;
  }
  return filledTiles;
}
function buildMap(mapDef) {
  let grid = mapDef.tiles.map(parseTileRow).map((row) => normalizeRowTiles(row, mapDef.w));
  while (grid.length < mapDef.h) {
    grid.push(Array.from({ length: mapDef.w }, () => 'wall'));
  }
  if (grid.length > mapDef.h) {
    grid.length = mapDef.h;
  }
  // NPCを配置し、すでに救出済みのキャラは隠す
  const npcs = (NPC_DEFS[mapDef.id] || []).map(n => {
    let isAlive = true;
    if (n.isRescue && typeof GameState !== 'undefined' && GameState.rescuedChars && GameState.rescuedChars.includes(n.rescueChar)) {
      isAlive = false;
    }
    return { ...n, alive: isAlive };
  });
  return { ...mapDef, grid, npcs, id: mapDef.id };
}
function getTile(map, tx, ty) {
  if (ty < 0 || ty >= map.h || tx < 0 || tx >= map.w) return 'wall';
  return map.grid[ty]?.[tx] || 'grass';
}
function isPassable(map, tx, ty, hasTurtle) {
  const tile = getTile(map, tx, ty);
  if (tile === 'water') return !!hasTurtle;
  return PASSABLE[tile] !== false;
}

// ============================================================
// Step1: やり込みシステム用データ定義
// ============================================================

// ----- アイテム定義 -----
const ITEMS = {
  // 食材系
  herb:             { name:'もりのハーブ',       category:'food',  desc:'香り高い薬草。お弁当の材料に。' },
  jelly:            { name:'ぷるぷるゼリー',     category:'food',  desc:'スライムが落としたゼリー状の液体。' },
  sparkle_water:    { name:'きらきら水',         category:'food',  desc:'妖精の泉からとれる澄んだ水。' },
  nut:              { name:'大粒の木の実',       category:'food',  desc:'栄養満点のおいしい木の実。' },
  rainbow_mushroom: { name:'伝説のにじいろ茸',   category:'food',  desc:'七色に輝く幻のキノコ。超レア。' },
  // ジャンクパーツ系
  rust_screw:       { name:'錆びたネジ',         category:'parts', desc:'どこかの機械のネジ。まだ使えそう。' },
  old_gear:         { name:'古びた歯車',         category:'parts', desc:'年季の入った小さな歯車。' },
  coil:             { name:'超伝導コイル',       category:'parts', desc:'高度な技術で作られたコイル。' },
  magic_board:      { name:'怪しい魔力基盤',     category:'parts', desc:'魔力が通う不思議な電子基板。' },
  boss_thorn:       { name:'ぬしのトゲ',         category:'parts', desc:'ボスから確定で手に入る鋭いトゲ。' },
  // ガチャ資源
  film:             { name:'思い出のフイルム',   category:'gacha', desc:'ままに現像してもらうと何かが出る！' },
};

// ----- お弁当レシピ定義 -----
// applyFn(targets, party) : 戦闘中・フィールドで使用時に呼び出す副作用関数
const RECIPES = [
  {
    id: 'jelly_dish',
    name: 'スライムのぷるぷるゼリー寄せ',
    cost: { jelly:3, sparkle_water:1 },
    desc: '味方単体のHPを40、MPを10回復。',
    target: 'single',
    apply(target) {
      target.hp = Math.min(target.maxHp, target.hp + 40);
      target.mp = Math.min(target.maxMp, target.mp + 10);
    },
  },
  {
    id: 'herb_tea',
    name: 'もりのリフレッシュハーブティー',
    cost: { herb:3, sparkle_water:2 },
    desc: '全体HP30回復＆暗闇を除去。',
    target: 'all',
    apply(target) {
      target.hp = Math.min(target.maxHp, target.hp + 30);
      target.isBlind = false;
    },
  },
  {
    id: 'nut_onigiri',
    name: 'がんばり木の実おにぎり',
    cost: { nut:2, herb:1 },
    desc: '全体の攻撃力を3ターン20%上昇（重ね掛け可）。',
    target: 'all',
    apply(target) {
      target.buffAtk = (target.buffAtk || 0) + 0.7; // ≒+20% (1+0.7*0.3≈1.21)
    },
  },
  {
    id: 'rainbow_bento',
    name: '愛情たっぷり！にじいろ特製幕の内',
    cost: { rainbow_mushroom:1, jelly:2, nut:2 },
    desc: '全員をHP・MP全快で完全蘇生。',
    target: 'all',
    apply(target) {
      target.hp = target.maxHp;
      target.mp = target.maxMp;
    },
  },
];

// ----- カラクリガジェット定義 -----
const GADGETS = [
  {
    id: 'megaphone',
    name: '友情の拡声メガホン',
    forChar: 'kanato',
    cost: { rust_screw:5, boss_thorn:1 },
    desc: '「はげます」の攻撃バフ倍率が30%→50%に強化。',
    effect: 'megaphone',
  },
  {
    id: 'spike_collar',
    name: 'トゲトゲ合金首輪',
    forChar: 'dog',
    cost: { boss_thorn:2, rust_screw:3 },
    desc: '通常攻撃時、15%の確率でかみつくが自動追撃。',
    effect: 'spike_collar',
  },
  {
    id: 'titanium_shell',
    name: 'チタン合金甲羅シールド',
    forChar: 'turtle',
    cost: { old_gear:4, magic_board:2 },
    desc: 'からにこもる使用時、3ターン毎ターンHP10%自動回復。',
    effect: 'titanium_shell',
  },
  {
    id: 'hyper_shutter',
    name: 'ハイパースピードシャッター',
    forChar: 'mama',
    cost: { old_gear:3, coil:1 },
    desc: 'フラッシュの消費MPが12→6に半減。',
    effect: 'hyper_shutter',
  },
  {
    id: 'hyper_processor',
    name: 'ハイパー・プロセッサ・コプロ',
    forChar: 'papa',
    cost: { magic_board:3, coil:2 },
    desc: 'プログラム発動の最低ダメージ倍率が0.8→1.2に上昇。',
    effect: 'hyper_processor',
  },
];

// ----- 思い出写真カード定義 -----
// rarity: 'N'(60%), 'R'(30%), 'SR'(10%)
// effectFn(lv) -> パッシブ効果のオブジェクトを返す（calcAlbumPassiveで利用）
const PHOTO_CARDS = [
  {
    id: 'running',
    name: 'かなとといぬの朝のかけっこ',
    rarity: 'N',
    desc: '朝もやの中、二人が仲良く走っている写真。',
    weight: 60,
    effect(lv) { return { spdBonus: lv * 2 }; }, // Lv1:+2 ～ Lv5:+10
  },
  {
    id: 'picnic',
    name: 'まま特製の湖畔ピクニック',
    rarity: 'R',
    desc: 'きらきら湖を背景に、おにぎりを囲む家族写真。',
    weight: 30,
    effect(lv) { return { hpRegenRatioAfterBattle: lv * 0.03 }; }, // Lv1:3%～Lv5:15%
  },
  {
    id: 'workshop',
    name: 'ぱぱのカラクリ工作室',
    rarity: 'R',
    desc: '火花が散る中、ぱぱがおもちゃを作って見せている写真。',
    weight: 30,
    effect(lv) { return { mpBonus: lv * 5 }; }, // Lv1:+5 ～ Lv5:+25
  },
  {
    id: 'sleeping',
    name: '家族みんなで川の字ねんね',
    rarity: 'SR',
    desc: '冒険の後、全員が川の字で眠っている幸せな写真。',
    weight: 5,
    effect(lv) { return { hpBonus: lv * 15, debuffResist: lv * 0.10 }; }, // Lv1:HP+15,耐性10% ～ Lv5:HP+75,耐性50%
  },
  {
    id: 'boss_fight',
    name: 'もりのぬしとの対峙',
    rarity: 'SR',
    desc: '巨大なもりのぬしに勇気を出して立ち向かったあの瞬間。',
    weight: 5,
    effect(lv) { return { atkRatio: lv * 0.06 }; }, // Lv1:6% ～ Lv5:30% 与ダメアップ
  },
];
// 全カードの重みの合計（ガチャ抽選計算用）
const PHOTO_TOTAL_WEIGHT = PHOTO_CARDS.reduce((s, c) => s + c.weight, 0);
