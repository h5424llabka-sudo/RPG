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
  village: [
    { id:'elder', x:7, y:4, dir:'down', color:'#888855', name:'おじいさん', dialogue:['ここは「はじまりの村」じゃ。','かなとよ、北の「そよ風の森」に','いぬが迷い込んだと聞いたぞ。','気をつけてな。'] },
    { id:'shopkeeper', x:14, y:7, dir:'down', color:'#55aa55', name:'お店の人', dialogue:['いらっしゃい！','ここで道具が買えるよ！','（※ショップ機能は準備中）'] },
    { id:'innkeeper', x:5, y:7, dir:'down', color:'#aa7744', name:'宿屋のおじさん', dialogue:['宿屋へようこそ！','一泊10Gで体を休めていけ。','（Zキーで休む）'], isInn: true },
    { id:'girl', x:11, y:11, dir:'right', color:'#ff88bb', name:'村の女の子', dialogue:['ねえねえ！','北の森でへんなおばけが','でるって聞いたよ。','気をつけてね！'] },
    { id:'dog_hint', x:16, y:5, dir:'left', color:'#cc8833', name:'男の子', dialogue:['森の奥に白いいぬがいたよ！','「ボスのもり」を倒せば','助けられるかも！'] },
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
  village: { name:'はじまりの村', w:25, h:18, bgm:'village', enemies:[], nextMap:{x:12,y:0,map:'forest',toX:12,toY:0}, tiles:[
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
  ghost: { name:'イタズラおばけ', hp:35, atk:8, def:4, spd:10, exp:15, gold:8, skills:['おどかす'], color:'#ccaaff', weakTo:'light', level:1 },
  ghost_lv2: { name:'イタズラおばけ(Lv2)', hp:50, atk:12, def:6, spd:12, exp:25, gold:12, skills:['おどかす'], color:'#dd99ff', weakTo:'light', level:2 },
  ghost_lv3: { name:'シャドウおばけ', hp:70, atk:16, def:8, spd:14, exp:40, gold:18, skills:['おどかす','つきまとう'], color:'#8844cc', weakTo:'light', level:3 },
  slime: { name:'迷子スライム', hp:25, atk:5, def:3, spd:8, exp:10, gold:5, skills:['たいあたり'], color:'#88ffcc', weakTo:'fire', level:1 },
  slime_lv2: { name:'まるいスライム', hp:40, atk:8, def:5, spd:10, exp:18, gold:10, skills:['たいあたり','スライム液'], color:'#44ffee', weakTo:'fire', level:2 },
  slime_lv3: { name:'キングスライム', hp:65, atk:14, def:8, spd:12, exp:35, gold:20, skills:['たいあたり','スライム液','分裂'], color:'#00ffff', weakTo:'fire', level:3 },
  wolf: { name:'もりのオオカミ', hp:55, atk:14, def:8, spd:15, exp:25, gold:15, skills:['かみつく','おたけび'], color:'#886644', weakTo:'thunder', level:1 },
  wolf_lv2: { name:'ダークウルフ', hp:75, atk:18, def:10, spd:17, exp:35, gold:22, skills:['かみつく','おたけび','ブレスアタック'], color:'#553322', weakTo:'thunder', level:2 },
  wolf_lv3: { name:'スカイウルフ', hp:95, atk:22, def:12, spd:20, exp:50, gold:30, skills:['かみつく','おたけび','ブレスアタック'], color:'#334411', weakTo:'thunder', level:3 },
  fairy: { name:'イタズラ妖精', hp:40, atk:10, def:6, spd:18, exp:20, gold:12, skills:['まどわせ'], color:'#ffaaee', weakTo:'dark', level:1 },
  fairy_lv2: { name:'トリックフェアリー', hp:55, atk:13, def:8, spd:20, exp:30, gold:18, skills:['まどわせ','ぶぶん'], color:'#ff88dd', weakTo:'dark', level:2 },
  fairy_lv3: { name:'クイーンフェアリー', hp:75, atk:17, def:10, spd:23, exp:45, gold:28, skills:['まどわせ','ぶぶん','魔法の光'], color:'#ffccff', weakTo:'dark', level:3 },
  boss: { name:'もりのぬし', hp:180, atk:22, def:15, spd:12, exp:80, gold:50, skills:['つよいひっかき','もりのおたけび'], color:'#dd3333', weakTo:'light', isBoss:true, level:1 },
};
const COMMANDS = ['たたかう', 'スキル', 'ぼうぎょ', 'にげる'];

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
    console.warn(`MAP_DATA[${mapDef.id}] has ${grid.length} rows; trimming to ${mapDef.h}`);
    grid.length = mapDef.h;
  }
  return { ...mapDef, grid, npcs: (NPC_DEFS[mapDef.id] || []).map(n => ({ ...n, alive:true })), id: mapDef.id };
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
