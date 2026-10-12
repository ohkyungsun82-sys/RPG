const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const players = {};
const monsters = {};

function spawnMonster(id) {
  monsters[id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    hp: 30,
    maxHp: 30
  };
}

for (let i = 0; i < 5; i++) {
  spawnMonster(i);
}

io.on('connection', (socket) => {
  players[socket.id] = {
    x: 400,
    y: 300,
    hp: 100,
    maxHp: 100,
    lv: 1,
    exp: 0,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  };

  socket.emit('state', { players, monsters });

  socket.on('move', (data) => {
    const p = players[socket.id];
    if (!p) return;
    p.x = Math.max(20, Math.min(780, p.x + data.dx * 5));
    p.y = Math.max(20, Math.min(580, p.y + data.dy * 5));
  });

  socket.on('attack', () => {
    const p = players[socket.id];
    if (!p) return;
    
    io.emit('effect', { x: p.x, y: p.y });

    for (let id in monsters) {
      const m = monsters[id];
      const dist = Math.hypot(p.x - m.x, p.y - m.y);
      if (dist < 60) {
        m.hp -= 10 * p.lv;
        if (m.hp <= 0) {
          p.exp += 20;
          if (p.exp >= p.lv * 50) {
            p.exp = 0;
            p.lv++;
            p.maxHp += 20;
            p.hp = p.maxHp;
          }
          spawnMonster(id);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  for (let id in monsters) {
    const m = monsters[id];
    m.x = Math.max(20, Math.min(780, m.x + (Math.random() - 0.5) * 8));
    m.y = Math.max(20, Math.min(580, m.y + (Math.random() - 0.5) * 8));
    
    for (let pid in players) {
      const p = players[pid];
      if (Math.hypot(p.x - m.x, p.y - m.y) < 30) {
        p.hp -= 1;
        if (p.hp <= 0) {
          p.hp = p.maxHp;
          p.x = 400;
          p.y = 300;
          p.exp = 0;
        }
      }
    }
  }
  io.emit('state', { players, monsters });
}, 1000 / 30);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});