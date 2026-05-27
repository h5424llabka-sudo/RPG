const Input = { keys:{}, pressed:{}, update(){ this.pressed = {}; }, isDown(k){ return !!this.keys[k]; }, wasPressed(k){ return !!this.pressed[k]; } };
window.addEventListener('keydown', e => {
  if (!Input.keys[e.key]) Input.pressed[e.key] = true;
  Input.keys[e.key] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
});
window.addEventListener('keyup', e => { delete Input.keys[e.key]; });
const DIRECTION_VECTORS = {
  ArrowLeft:  { dx: -1, dy: 0, dir: 'left' },
  ArrowRight: { dx:  1, dy: 0, dir: 'right' },
  ArrowUp:    { dx:  0, dy: 1, dir: 'up' },
  ArrowDown:  { dx:  0, dy: -1, dir: 'down' },
};
function isConfirm() { return Input.wasPressed('z') || Input.wasPressed('Z') || Input.wasPressed('Enter'); }
function isCancel() { return Input.wasPressed('x') || Input.wasPressed('X') || Input.wasPressed('Escape'); }
function getMovementInput() {
  for (const key of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown']) {
    if (Input.isDown(key)) return DIRECTION_VECTORS[key];
  }
  return null;
}
function canTriggerEncounter(map, tx, ty) {
  const tile = getTile(map, tx, ty);
  if (!map.encounter || !map.encounterRate) return false;
  if (Array.isArray(map.encounterTiles)) return map.encounterTiles.includes(tile);
  return tile === 'grass';
}

function getRandomEnemyEncounter(baseEnemies) {
  if (!baseEnemies || baseEnemies.length === 0) return [];
  const pattern = Math.random();
  let enemyTypes = [];
  if (pattern < 0.5) {
    const base = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    const level = Math.random() < 0.5 ? '' : (Math.random() < 0.5 ? '_lv2' : '_lv3');
    enemyTypes = [base + level];
  } else if (pattern < 0.7) {
    const base = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    const level = Math.random() < 0.5 ? '' : '_lv2';
    enemyTypes = [base + level, base + level];
  } else if (pattern < 0.85) {
    const b1 = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    const b2 = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    enemyTypes = [b1, b2];
  } else {
    const b1 = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    const b2 = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    const b3 = baseEnemies[Math.floor(Math.random() * baseEnemies.length)];
    enemyTypes = [b1, b2, b3];
  }
  return enemyTypes;
}
function isEntityBlocking(map, tx, ty) {
  if (map.npcs.some(n => n.alive && n.x === tx && n.y === ty)) return true;
  if (map.boss && !map.boss.defeated && map.boss.x === tx && map.boss.y === ty) return true;
  return false;
}

const GameState = {
  scene:'title', currentMap:null, camera:{x:0,y:0}, party:[], rescuedChars:[], gold:30, totalExp:0,
  defeatedBosses:{}, mapProgress:{}, player:{x:12,y:1,dir:'down',moveTimer:0,walkanim:0}, followers:[], followerHistory:[], dialogue:null, battleData:null, menu:null, stepCount:0, shopOpen:false, endingTriggered:false,
};

function initPartyMember(key) {
  const s = CHARACTER_STATS[key];
  return { key, ...s, hp:s.maxHp, mp:s.maxMp, level:1, exp:0, buffAtk:0, buffDef:0, isGuarding:false, isStunned:false, isBlind:false, xpToNext:30 };
}
function initGame() {
  GameState.party = [initPartyMember('kanato')];
  GameState.rescuedChars = ['kanato'];
  GameState.gold = 30;
  GameState.totalExp = 0;
  GameState.defeatedBosses = {};
  GameState.followerHistory = [];
  GameState.followers = [];
  loadMap('village');
}

function loadMap(mapId) {
  const def = MAP_DATA[mapId];
  if (!def) return;
  def.id = mapId;
  const map = buildMap(def);
  GameState.currentMap = map;
  const startX = GameState.mapProgress[mapId+'_startX'] || def.startX;
  const startY = GameState.mapProgress[mapId+'_startY'] || def.startY;
  GameState.player = { x:startX, y:startY, dir:'down', moveTimer:0, walkanim:0 };
  GameState.followerHistory = [];
  GameState.followers = GameState.party.slice(1).map((m,i)=>({ key:m.key, x:startX, y:startY+1+i, dir:'down', walkanim:0 }));
  if (def.boss) { map.boss = { ...def.boss, defeated: !!GameState.defeatedBosses[mapId+'_boss'] }; }
  updateCamera();
}

function updateCamera() {
  const p=GameState.player; const map = GameState.currentMap;
  GameState.camera.x = Math.min(Math.max(0, p.x - Math.floor(VIEW_W/2)), map.w - VIEW_W);
  GameState.camera.y = Math.min(Math.max(0, p.y - Math.floor(VIEW_H/2)), map.h - VIEW_H);
}

const MOVE_DELAY = 150;
function updateMap(dt) {
  const gs = GameState;
  const p = gs.player;
  const map = gs.currentMap;
  const hasTurtle = gs.rescuedChars.includes('turtle');
  p.moveTimer = Math.max(0, p.moveTimer - dt);
  if (p.moveTimer <= 0) {
    const move = getMovementInput();
    if (move) {
      const { dx, dy, dir } = move;
      p.dir = dir;
      const nx = p.x + dx;
      const ny = p.y + dy;
      if (isPassable(map, nx, ny, hasTurtle) && !isEntityBlocking(map, nx, ny)) {
        gs.followerHistory.unshift({ x:p.x, y:p.y, dir:p.dir });
        if (gs.followerHistory.length > 10) gs.followerHistory.pop();
        p.x = nx; p.y = ny;
        p.walkanim = (p.walkanim + 1) % 3;
        p.moveTimer = MOVE_DELAY;
        gs.stepCount++;
        updateCamera();
        gs.followers.forEach((f, idx) => {
          const hist = gs.followerHistory[idx];
          if (hist) {
            f.x = hist.x;
            f.y = hist.y;
            f.dir = hist.dir;
            f.walkanim = p.walkanim;
          }
        });
        if (canTriggerEncounter(map, nx, ny) && Math.random() < map.encounterRate) { startBattle(getRandomEnemyEncounter(map.enemies)); return; }
        const tile = getTile(map, nx, ny);
        if (tile === 'exit' && map.nextMap) {
          const nm = map.nextMap;
          gs.mapProgress[map.id+'_startX'] = nm.toX;
          gs.mapProgress[map.id+'_startY'] = nm.toY;
          loadMap(nm.map);
          return;
        }
      }
    }
  }
  if (isConfirm()) {
    const facingX = p.x + (p.dir==='right'?1:p.dir==='left'?-1:0);
    const facingY = p.y + (p.dir==='up'?1:p.dir==='down'?-1:0);
    const npc = map.npcs.find(n=>n.alive && n.x===facingX && n.y===facingY);
    if (npc) {
      startDialogue(npc.dialogue,npc,()=>{
        if (npc.isRescue) {
          const canRescue = !npc.requiresBossDefeated || (map.boss && map.boss.defeated);
          if (canRescue && !gs.rescuedChars.includes(npc.rescueChar)) { 
            rescueCharacter(npc.rescueChar); 
            npc.isRescue=false; 
          }
        }
        if (npc.isInn) {
          if (gs.gold>=10) { gs.gold-=10; gs.party.forEach(m=>{ m.hp=m.maxHp; m.mp=m.maxMp; }); startDialogue(['ぐっすり眠れた！','HP・MPが全回復した！'],null,null); }
          else { startDialogue(['お金が足りないよ！','10Gひつようだよ。'],null,null); }
        }
      });
      return;
    }
    if (map.boss && !map.boss.defeated) {
      const boss=map.boss; const dist=Math.abs(p.x-boss.x)+Math.abs(p.y-boss.y);
      if (dist<=2) {
        startDialogue(boss.preText,null,()=>{
          startBattle(['boss'],true,()=>{
            map.boss.defeated=true; gs.defeatedBosses[map.id+'_boss']=true;
            startDialogue(boss.postText,null,()=>{
              if (map.id==='forest') {
                const dogNpc=map.npcs.find(n=>n.id==='dog'); if (dogNpc) startDialogue(dogNpc.dialogue,dogNpc,()=>rescueCharacter('dog'));
              }
            });
          });
        });
      }
    }
  }
  if (isCancel()) openMenu();
}

function rescueCharacter(key) {
  if (GameState.rescuedChars.includes(key)) return;
  GameState.rescuedChars.push(key);
  GameState.party.push(initPartyMember(key));
  const p=GameState.player;
  GameState.followers.push({ key, x:p.x, y:p.y-1, dir:'down', walkanim:0 });
}

function startDialogue(lines,npc=null,onClose=null) {
  GameState.scene='dialogue';
  GameState.dialogue={ lines, idx:0, npc, onClose, timer:0, charIdx:0 };
}

function updateDialogue(dt) {
  const d = GameState.dialogue;
  if (!d) { GameState.scene='map'; return; }
  d.timer += dt;
  d.charIdx = Math.min(d.lines[d.idx].length, Math.floor(d.timer/40));
  if (isConfirm()) {
    if (d.charIdx < d.lines[d.idx].length) d.charIdx = d.lines[d.idx].length;
    else if (d.idx < d.lines.length - 1) { d.idx++; d.timer=0; d.charIdx=0; }
    else { GameState.scene='map'; GameState.dialogue=null; if (d.onClose) d.onClose(); }
  }
}

function startBattle(enemyTypes,isBoss=false,onVictory=null) {
  const enemies = enemyTypes.map(type => { const def=ENEMY_STATS[type]||ENEMY_STATS.ghost; return { ...def, type, hp:def.hp, maxHp:def.hp, isStunned:false, isBlind:false, analyzed:false }; });
  GameState.scene='battle';
  GameState.battleData={ enemies, isBoss, onVictory, turn:'player', phase:'select', selectedCmd:0, selectedMember:0, selectedSkill:0, selectedEnemyIdx:0, targetMode:false, log:['戦闘開始！'], logTimer:0, pendingActions:[], animations:[], shakeTimer:0, flashColor:null, victoryDelay:0, skillMode:false, damageFloating:[] };
}

function updateBattle(dt) {
  const bd = GameState.battleData;
  if (!bd) return;
  bd.logTimer = Math.max(0, bd.logTimer - dt);
  bd.shakeTimer = Math.max(0, bd.shakeTimer - dt);
  if (bd.phase==='victory') {
    bd.victoryDelay -= dt;
    if (bd.victoryDelay <=0) {
      const totalExp=bd.enemies.reduce((a,e)=>a+(e.exp||10),0);
      const totalGold=bd.enemies.reduce((a,e)=>a+(e.gold||5),0);
      GameState.gold += totalGold;
      GameState.party.forEach(m=>{ m.exp += totalExp; if (m.exp >= m.xpToNext) levelUp(m); });
      GameState.scene='map'; GameState.battleData=null; if (bd.onVictory) bd.onVictory();
    }
    return;
  }
  if (bd.phase==='defeat') { if (isConfirm()) { GameState.scene='gameover'; GameState.battleData=null; } return; }
  if (bd.phase==='select') handleBattleInput();
  else if (bd.phase==='result') { if (bd.logTimer <= 0) { if (bd.pendingActions.length > 0) executeBattleAction(bd.pendingActions.shift()); else startEnemyTurn(); } }
  else if (bd.phase==='enemy') { if (bd.logTimer <= 0) { if (bd.pendingActions.length>0) executeEnemyAction(bd.pendingActions.shift()); else { if (GameState.party.every(m=>m.hp<=0)) { bd.phase='defeat'; addLog('全滅してしまった...'); } else { bd.phase='select'; bd.selectedMember=0; bd.selectedCmd=0; GameState.party.forEach(m=>{m.isGuarding=false;}); } } } }
}

function handleBattleInput() {
  const bd = GameState.battleData;
  const member = GameState.party[bd.selectedMember];
  const aliveEnemies = bd.enemies.filter(e=>e.hp>0);
  if (!bd.targetMode && !bd.skillMode) {
    if (Input.wasPressed('ArrowLeft')) bd.selectedCmd = Math.max(0, bd.selectedCmd-1);
    if (Input.wasPressed('ArrowRight')) bd.selectedCmd = Math.min(3, bd.selectedCmd+1);
    if (Input.wasPressed('ArrowUp')) bd.selectedCmd = Math.max(0, bd.selectedCmd-2);
    if (Input.wasPressed('ArrowDown')) bd.selectedCmd = Math.min(3, bd.selectedCmd+2);
    if (isConfirm()) {
      const cmd = COMMANDS[bd.selectedCmd];
      if (cmd==='たたかう') { bd.targetMode=true; bd.selectedEnemyIdx=0; }
      else if (cmd==='スキル') { bd.skillMode=true; bd.selectedSkill=0; }
      else if (cmd==='ぼうぎょ') { bd.pendingActions.push({type:'guard', member}); nextMemberOrExecute(); }
      else if (cmd==='にげる') {
        if (Math.random() < 0.6) { addLog('うまく逃げられた！'); bd.logTimer = 1200; setTimeout(()=>{ GameState.scene='map'; GameState.battleData=null; }, 1500); }
        else { addLog('逃げられなかった！'); bd.logTimer=800; nextMemberOrExecute(); }
      }
    }
  } else if (bd.targetMode) {
    if (Input.wasPressed('ArrowLeft')) bd.selectedEnemyIdx = Math.max(0, bd.selectedEnemyIdx-1);
    if (Input.wasPressed('ArrowRight')) bd.selectedEnemyIdx = Math.min(aliveEnemies.length-1, bd.selectedEnemyIdx+1);
    if (isConfirm()) {
      bd.pendingActions.push({type:'attack', member, targetIdx:bd.selectedEnemyIdx}); bd.targetMode=false; nextMemberOrExecute();
    }
    if (isCancel()) bd.targetMode=false;
  } else if (bd.skillMode) {
    const skills = member.skills || [];
    if (Input.wasPressed('ArrowUp')) bd.selectedSkill = Math.max(0, bd.selectedSkill-1);
    if (Input.wasPressed('ArrowDown')) bd.selectedSkill = Math.min(skills.length-1, bd.selectedSkill+1);
    if (isConfirm() && skills[bd.selectedSkill]) {
      const skill = skills[bd.selectedSkill];
      if (member.mp >= skill.mpCost) { bd.pendingActions.push({ type:'skill', member, skill, targetIdx:bd.selectedEnemyIdx }); bd.skillMode=false; bd.targetMode=false; nextMemberOrExecute(); }
      else addLog('MPが足りない！');
    }
    if (isCancel()) bd.skillMode=false;
  }
}

function nextMemberOrExecute() {
  const bd = GameState.battleData;
  bd.selectedMember++;
  if (bd.selectedMember >= GameState.party.length) {
    bd.pendingActions.sort((a,b)=>(b.member?.spd||0)-(a.member?.spd||0));
    bd.phase='result'; executeBattleAction(bd.pendingActions.shift());
  } else { bd.selectedCmd=0; bd.selectedSkill=0; bd.skillMode=false; }
}

function executeBattleAction(action) {
  const bd = GameState.battleData;
  if (!action) { startEnemyTurn(); return; }
  const m = action.member;
  const enemies = bd.enemies.filter(e=>e.hp>0);
  if (action.type==='guard') { m.isGuarding=true; addLog(`${m.name}はぼうぎょした！`); bd.logTimer=700; return; }
  if (action.type==='attack') {
    const target = enemies[action.targetIdx % enemies.length]; if (!target) return;
    let dmg = Math.max(1, Math.floor(m.atk * (1 + (m.buffAtk||0)*0.3) - target.def*0.5 + (Math.random()*6-3)));
    if (m.isBlind) dmg = Math.random() < 0.5 ? Math.floor(dmg*0.5) : 0;
    target.hp = Math.max(0, target.hp - dmg);
    addLog(`${m.name}の攻撃！ ${target.name}に${dmg}のダメージ！`);
    bd.damageFloating.push({damage:dmg, targetIdx:bd.enemies.indexOf(target), timer:1000});
    bd.shakeTimer=300;
    if (target.hp<=0) addLog(`${target.name}をたおした！`);
    bd.logTimer=900; checkBattleEnd(); return;
  }
  if (action.type==='skill') {
    const skill = action.skill; m.mp -= skill.mpCost; const target = enemies[action.targetIdx % enemies.length]; addLog(`${m.name}の「${skill.name}」！`);
    switch(skill.effect) {
      case 'heal': { const hAmt = skill.power || 30; m.hp=Math.min(m.maxHp,m.hp+hAmt); addLog(`${m.name}のHPが${hAmt}回復！`); break; }
      case 'healAll': { GameState.party.forEach(p=>{ const ha = skill.power||40; p.hp=Math.min(p.maxHp,p.hp+ha); }); addLog(`パーティ全員のHPが回復した！`); break; }
      case 'buffAtk': { const buffTarget=GameState.party[0]; buffTarget.buffAtk=(buffTarget.buffAtk||0)+1; addLog(`${buffTarget.name}の攻撃力があがった！`); break; }
      case 'buffDef': { m.buffDef=(m.buffDef||0)+2; addLog(`${m.name}の防御力が大幅にアップ！`); break; }
      case 'stun': if (target && Math.random() < 0.7) { target.isStunned=true; addLog(`${target.name}は1ターン行動できない！`); } else addLog(`しかし、うまく決まらなかった...`); break;
      case 'blind': enemies.forEach(e=>{ e.isBlind=true; }); addLog(`敵全体が暗闇になった！`); break;
      case 'attack': if (target) { let dmg=Math.max(1, Math.floor(m.atk * (skill.power||1.8) - target.def*0.3)); target.hp=Math.max(0,target.hp-dmg); addLog(`${target.name}に${dmg}のダメージ！`); bd.damageFloating.push({damage:dmg, targetIdx:bd.enemies.indexOf(target), timer:1000}); bd.shakeTimer=400; if (target.hp<=0) addLog(`${target.name}をたおした！`); checkBattleEnd(); } break;
      case 'analyze': if (target) { target.analyzed=true; addLog(`${target.name}の弱点は「${target.weakTo||'???'}」！`); } break;
      case 'randomAll': { let dmgTotal=0; enemies.forEach((e,ei)=>{ const d=Math.max(1, Math.floor(m.atk*(0.8+Math.random()*1.4)-e.def*0.3)); e.hp=Math.max(0,e.hp-d); dmgTotal += d; bd.damageFloating.push({damage:d, targetIdx:bd.enemies.indexOf(e), timer:1000}); if (e.hp<=0) addLog(`${e.name}をたおした！`); }); addLog(`敵全体に合計${dmgTotal}のダメージ！`); bd.shakeTimer=600; checkBattleEnd(); break; }
      case 'protect': addLog(`${m.name}は仲間をかばう体勢をとった！`); m.isProtecting = true; break;
    }
    bd.logTimer = 1000; return;
  }
}

function startEnemyTurn() {
  const bd = GameState.battleData; bd.phase='enemy'; const actions=[];
  bd.enemies.filter(e=>e.hp>0).forEach(e=>{ if (e.isStunned) { e.isStunned=false; actions.push({type:'stunned', enemy:e}); } else actions.push({type:'enemyAttack', enemy:e}); });
  bd.pendingActions = actions;
  if (actions.length>0) executeEnemyAction(bd.pendingActions.shift()); else { bd.phase='select'; bd.selectedMember=0; }
}

function executeEnemyAction(action) {
  const bd = GameState.battleData; if (!action) return;
  if (action.type==='stunned') { addLog(`${action.enemy.name}はしびれて動けない！`); bd.logTimer=700; return; }
  if (action.type==='enemyAttack') {
    const e = action.enemy; const aliveParty = GameState.party.filter(m=>m.hp>0); if (!aliveParty.length) return;
    const target = aliveParty[Math.floor(Math.random()*aliveParty.length)];
    let def = target.def + (target.buffDef||0)*5; if (target.isGuarding) def *= 2;
    let dmg = Math.max(1, Math.floor(e.atk * (0.8+Math.random()*0.4) - def*0.4));
    if (e.isBlind) dmg = Math.random() < 0.5 ? Math.floor(dmg*0.5) : 0;
    target.hp = Math.max(0, target.hp - dmg);
    addLog(`${e.name}の攻撃！ ${target.name}に${dmg}のダメージ！`);
    const memberIdx = GameState.party.indexOf(target);
    if (memberIdx >= 0) bd.damageFloating.push({damage:dmg, targetIdx:10+memberIdx, isPlayer:true, timer:1000});
    bd.logTimer=900;
    if (target.hp<=0) addLog(`${target.name}はたおれた...`);
    if (GameState.party.every(m=>m.hp<=0)) { bd.phase='defeat'; addLog('全滅してしまった...'); }
  }
}

function checkBattleEnd() {
  const bd = GameState.battleData;
  if (bd.enemies.every(e=>e.hp<=0)) { bd.phase='victory'; bd.victoryDelay=2000; addLog('しょうり！'); bd.pendingActions=[]; }
}

function addLog(msg) { const bd = GameState.battleData; if (!bd) return; bd.log.push(msg); if (bd.log.length > 5) bd.log.shift(); }

function levelUp(member) {
  member.level++; member.xpToNext = Math.floor(member.xpToNext * 1.4); member.maxHp += 10; member.hp = member.maxHp; member.maxMp += 5; member.mp = member.maxMp; member.atk += 3; member.def += 2; member.spd += 1; if (GameState.battleData) addLog(`${member.name}がLv${member.level}になった！`); }

function openMenu() { GameState.scene='menu'; GameState.menu={ selected:0, items:['パーティ確認','もどる'], subMode:null }; }

function updateMenu() {
  const m = GameState.menu;
  if (!m) { GameState.scene='map'; return; }
  if (!m.subMode) {
    if (Input.wasPressed('ArrowUp')) m.selected = Math.max(0, m.selected-1);
    if (Input.wasPressed('ArrowDown')) m.selected = Math.min(m.items.length-1, m.selected+1);
    if (isConfirm()) {
      if (m.items[m.selected] === 'もどる' || m.items[m.selected] === 'とじる') { GameState.scene='map'; GameState.menu=null; }
      else if (m.items[m.selected] === 'パーティ確認') m.subMode='party';
    }
    if (isCancel()) { GameState.scene='map'; GameState.menu=null; }
  } else if (isCancel() || isConfirm()) { m.subMode = null; }
}

let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min(timestamp - lastTime, 100);
  lastTime = timestamp;
  switch (GameState.scene) {
    case 'title': if (isConfirm()) { initGame(); GameState.scene='map'; } break;
    case 'map': updateMap(dt); break;
    case 'dialogue': updateDialogue(dt); break;
    case 'battle': updateBattle(dt); break;
    case 'menu': updateMenu(); break;
    case 'gameover': if (isConfirm()) GameState.scene='title'; break;
    case 'ending': if (isConfirm()) GameState.scene='title'; break;
  }
  ctx.clearRect(0,0,640,480);
  switch (GameState.scene) {
    case 'title': renderTitle(); break;
    case 'map': renderMap(); break;
    case 'dialogue': renderDialogue(); break;
    case 'battle': renderBattle(); break;
    case 'menu': renderMenu(); break;
    case 'gameover': renderGameOver(); break;
    case 'ending': renderEnding(); break;
  }
  Input.update();
  requestAnimationFrame(gameLoop);
}

preloadAssets();
setInterval(() => {
  const gs = GameState;
  if (gs.scene==='map' && gs.rescuedChars.length >=5 && !gs.endingTriggered && gs.currentMap?.id==='village') {
    gs.endingTriggered = true;
    startDialogue(['みんな、ただいま！','かなとのだいぼうけんが','おわった！'], null, () => { GameState.scene='ending'; });
  }
}, 1000);
requestAnimationFrame(gameLoop);
