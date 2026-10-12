const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

const DB_FILE = path.join(__dirname, 'users.json');
let usersDB = {};
if (fs.existsSync(DB_FILE)) {
  try { usersDB = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) { usersDB = {}; }
}
function saveDB() {
  try { fs.writeFileSync(DB_FILE, JSON.stringify(usersDB, null, 2)); } catch (e) {}
}

const WORLD_W = 2400;
const WORLD_H = 2400;
const players = {};
const monsters = {};

function spawnMonster(id) {
  const lv = Math.floor(Math.random() * 5) + 1;
  monsters[id] = {
    x: Math.floor(Math.random() * (WORLD_W - 200)) + 100,
    y: Math.floor(Math.random() * (WORLD_H - 200)) + 100,
    hp: lv * 40,
    maxHp: lv * 40,
    lv: lv
  };
}

for (let i = 0; i < 30; i++) spawnMonster(i);

io.on('connection', (socket) => {
  socket.on('register', ({ username, password }) => {
    if (!username || !password) return socket.emit('authMsg', '아이디와 비밀번호를 입력하세요.');
    const id = username.trim();
    if (id.length < 2 || id.length > 15) return socket.emit('authMsg', '아이디는 2~15자여야 합니다.');
    if (usersDB[id]) return socket.emit('authMsg', '이미 존재하는 아이디입니다.');

    usersDB[id] = {
      password,
      lv: 1,
      exp: 0,
      maxHp: 100,
      color: id === 'sunnywp82' ? '#f1c40f' : '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    };
    saveDB();
    socket.emit('authMsg', '회원가입 완료! 로그인을 눌러주세요.');
  });

  socket.on('login', ({ username, password }) => {
    if (!username || !password) return socket.emit('authMsg', '아이디와 비밀번호를 입력하세요.');
    const id = username.trim();
    const user = usersDB[id];
    if (!user || user.password !== password) return socket.emit('authMsg', '아이디 또는 비밀번호가 틀렸습니다.');

    for (let sid in players) {
      if (players[sid].username === id) return socket.emit('authMsg', '이미 접속 중인 계정입니다.');
    }

    const isAdmin = (id === 'sunnywp82');
    players[socket.id] = {
      username: id,
      isAdmin: isAdmin,
      x: WORLD_W / 2,
      y: WORLD_H / 2,
      hp: user.maxHp,
      maxHp: user.maxHp,
      lv: user.lv,
      exp: user.exp,
      color: isAdmin ? '#f1c40f' : user.color,
      chatText: '',
      chatTime: 0,
      lastAttack: 0
    };

    socket.emit('loginSuccess', { id: socket.id, username: id, isAdmin });
    io.emit('chat', { name: 'SYSTEM', msg: `${isAdmin ? '[관리자] ' : ''}${id}님이 월드에 입장했습니다.`, sys: true });
  });

  socket.on('move', (data) => {
    const p = players[socket.id];
    if (!p || typeof data.dx !== 'number' || typeof data.dy !== 'number') return;
    const dx = Math.sign(data.dx);
    const dy = Math.sign(data.dy);
    const speed = p.isAdmin ? 9 : 6;
    p.x = Math.max(30, Math.min(WORLD_W - 30, p.x + dx * speed));
    p.y = Math.max(30, Math.min(WORLD_H - 30, p.y + dy * speed));
  });

  socket.on('attack', () => {
    const p = players[socket.id];
    if (!p) return;
    const now = Date.now();
    if (now - p.lastAttack < 250) return;
    p.lastAttack = now;

    io.emit('effect', { x: p.x, y: p.y, isAdmin: p.isAdmin });

    const range = p.isAdmin ? 120 : 75;
    const dmg = p.isAdmin ? 999 : (15 + p.lv * 5);

    for (let id in monsters) {
      const m = monsters[id];
      if (Math.hypot(p.x - m.x, p.y - m.y) <= range) {
        m.hp -= dmg;
        if (m.hp <= 0) {
          p.exp += m.lv * 25;
          while (p.exp >= p.lv * 100) {
            p.exp -= p.lv * 100;
            p.lv++;
            p.maxHp += 30;
            p.hp = p.maxHp;
          }
          if (usersDB[p.username]) {
            usersDB[p.username].lv = p.lv;
            usersDB[p.username].exp = p.exp;
            usersDB[p.username].maxHp = p.maxHp;
            saveDB();
          }
          spawnMonster(id);
        }
      }
    }
  });

  socket.on('chat', (msg) => {
    const p = players[socket.id];
    if (!p || typeof msg !== 'string') return;
    const text = msg.trim().slice(0, 80);
    if (!text) return;

    if (text.startsWith('/공지 ') && p.isAdmin) {
      const noticeMsg = text.replace('/공지 ', '').trim();
      if (noticeMsg) io.emit('notice', { admin: p.username, msg: noticeMsg });
      return;
    }

    p.chatText = text;
    p.chatTime = Date.now() + 4000;
    io.emit('chat', { name: p.username, msg: text, isAdmin: p.isAdmin });
  });

  socket.on('notice', (msg) => {
    const p = players[socket.id];
    if (!p || !p.isAdmin || typeof msg !== 'string') return;
    const clean = msg.trim().slice(0, 100);
    if (clean) io.emit('notice', { admin: p.username, msg: clean });
  });

  socket.on('disconnect', () => {
    const p = players[socket.id];
    if (p) {
      io.emit('chat', { name: 'SYSTEM', msg: `${p.username}님이 퇴장했습니다.`, sys: true });
      delete players[socket.id];
    }
  });
});

setInterval(() => {
  const now = Date.now();
  for (let pid in players) {
    if (players[pid].chatTime && now > players[pid].chatTime) {
      players[pid].chatText = '';
    }
  }

  for (let id in monsters) {
    const m = monsters[id];
    m.x = Math.max(30, Math.min(WORLD_W - 30, m.x + (Math.random() - 0.5) * 6));
    m.y = Math.max(30, Math.min(WORLD_H - 30, m.y + (Math.random() - 0.5) * 6));

    for (let pid in players) {
      const p = players[pid];
      if (Math.hypot(p.x - m.x, p.y - m.y) < 32) {
        if (!p.isAdmin) p.hp -= 1;
        if (p.hp <= 0) {
          p.hp = p.maxHp;
          p.x = WORLD_W / 2;
          p.y = WORLD_H / 2;
          p.exp = Math.floor(p.exp * 0.5);
        }
      }
    }
  }
  io.emit('state', { players, monsters });
}, 1000 / 30);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
