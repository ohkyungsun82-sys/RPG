<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Online RPG</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #111; font-family: 'Malgun Gothic', sans-serif; color: #fff; }
    canvas { display: block; width: 100vw; height: 100vh; }

    #authOverlay {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .auth-box {
      background: #1e272e; padding: 30px; border-radius: 12px; width: 340px;
      border: 2px solid #485460; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    }
    .auth-box h2 { margin-bottom: 20px; color: #f1c40f; }
    .auth-box input {
      width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #485460;
      background: #0f1419; color: #fff; border-radius: 6px; outline: none; font-size: 14px;
    }
    .btn-group { display: flex; gap: 10px; }
    .btn-group button {
      flex: 1; padding: 12px; border: none; border-radius: 6px; cursor: pointer;
      font-weight: bold; font-size: 14px; color: #fff; transition: 0.2s;
    }
    .btn-login { background: #2ecc71; }
    .btn-login:hover { background: #27ae60; }
    .btn-reg { background: #3498db; }
    .btn-reg:hover { background: #2980b9; }
    #authMsg { margin-top: 12px; font-size: 13px; color: #ff6b6b; min-height: 18px; }

    #noticeBanner {
      position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(90deg, #c0392b, #e74c3c, #c0392b);
      padding: 15px 40px; border-radius: 0 0 12px 12px; font-size: 20px; font-weight: bold;
      color: #fff; box-shadow: 0 5px 25px rgba(231, 76, 60, 0.7);
      border: 2px solid #f1c40f; border-top: none; z-index: 90; transition: top 0.4s ease;
    }

    #adminPanel {
      position: fixed; top: 15px; right: 15px; background: rgba(30, 39, 46, 0.9);
      padding: 12px; border-radius: 8px; border: 2px solid #f1c40f; display: none; z-index: 50;
    }
    #adminPanel input {
      padding: 8px; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff; width: 220px;
    }
    #adminPanel button {
      padding: 8px 14px; background: #f1c40f; color: #000; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; margin-left: 5px;
    }

    #hud {
      position: fixed; top: 15px; left: 15px; background: rgba(0,0,0,0.6);
      padding: 10px 15px; border-radius: 8px; font-size: 14px; pointer-events: none; z-index: 40;
    }

    #chatContainer {
      position: fixed; bottom: 15px; left: 15px; width: 360px; background: rgba(0, 0, 0, 0.65);
      border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); display: none; flex-direction: column; z-index: 50;
    }
    #chatMessages {
      height: 180px; overflow-y: auto; padding: 10px; font-size: 13px; display: flex; flex-direction: column; gap: 5px;
    }
    #chatInput {
      width: 100%; padding: 10px; border: none; border-top: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.8); color: #fff; outline: none; border-radius: 0 0 8px 8px;
    }
    .admin-chat { color: #f1c40f; font-weight: bold; }
    .sys-chat { color: #7bed9f; font-style: italic; }
  </style>
</head>
<body>

  <div id="noticeBanner">📢 [공지] <span id="noticeText"></span></div>

  <div id="authOverlay">
    <div class="auth-box">
      <h2>⚔️ ONLINE RPG</h2>
      <input type="text" id="username" placeholder="아이디 (sunnywp82 = 관리자)" maxlength="15">
      <input type="password" id="password" placeholder="비밀번호">
      <div class="btn-group">
        <button class="btn-login" id="loginBtn">로그인</button>
        <button class="btn-reg" id="regBtn">회원가입</button>
      </div>
      <div id="authMsg"></div>
    </div>
  </div>

  <div id="hud">이동: WASD / 방향키 | 공격: Space | 채팅: Enter</div>

  <div id="adminPanel">
    <span style="color:#f1c40f; font-weight:bold; margin-right:6px;">👑 관리자 공지</span>
    <input type="text" id="noticeInput" placeholder="전체 공지 내용 입력...">
    <button id="noticeBtn">발송</button>
  </div>

  <div id="chatContainer">
    <div id="chatMessages"></div>
    <input type="text" id="chatInput" placeholder="엔터를 눌러 채팅 입력 (/공지 내용)" maxlength="80">
  </div>

  <canvas id="game"></canvas>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    (() => {
      document.addEventListener('contextmenu', e => e.preventDefault());
      document.addEventListener('keydown', e => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
          e.preventDefault();
        }
      });

      const socket = io();
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      let myId = null;
      let state = { players: {}, monsters: {} };
      let effects = [];
      const keys = {};

      function playNoticeSound() {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          const actx = new AudioCtx();
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, idx) => {
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, actx.currentTime + idx * 0.12);
            gain.gain.setValueAtTime(0.25, actx.currentTime + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.12 + 0.35);
            osc.connect(gain);
            gain.connect(actx.destination);
            osc.start(actx.currentTime + idx * 0.12);
            osc.stop(actx.currentTime + idx * 0.12 + 0.35);
          });
        } catch (e) {}
      }

      const usernameEl = document.getElementById('username');
      const passwordEl = document.getElementById('password');
      const authMsgEl = document.getElementById('authMsg');
      const chatInput = document.getElementById('chatInput');
      const noticeInput = document.getElementById('noticeInput');

      document.getElementById('loginBtn').onclick = () => {
        socket.emit('login', { username: usernameEl.value, password: passwordEl.value });
      };
      document.getElementById('regBtn').onclick = () => {
        socket.emit('register', { username: usernameEl.value, password: passwordEl.value });
      };

      socket.on('authMsg', msg => authMsgEl.textContent = msg);

      socket.on('loginSuccess', data => {
        myId = data.id;
        document.getElementById('authOverlay').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        if (data.isAdmin) document.getElementById('adminPanel').style.display = 'block';
      });

      document.getElementById('noticeBtn').onclick = () => {
        if (noticeInput.value.trim()) {
          socket.emit('notice', noticeInput.value);
          noticeInput.value = '';
          noticeInput.blur();
        }
      };

      let noticeTimer = null;
      socket.on('notice', data => {
        playNoticeSound();
        const banner = document.getElementById('noticeBanner');
        document.getElementById('noticeText').textContent = `${data.msg} - ${data.admin}`;
        banner.style.top = '0px';
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => { banner.style.top = '-100px'; }, 6000);
      });

      socket.on('chat', data => {
        const box = document.getElementById('chatMessages');
        const div = document.createElement('div');
        if (data.sys) {
          div.className = 'sys-chat';
          div.textContent = data.msg;
        } else if (data.isAdmin) {
          div.className = 'admin-chat';
          div.textContent = `👑 [관리자] ${data.name}: ${data.msg}`;
        } else {
          div.textContent = `${data.name}: ${data.msg}`;
        }
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
      });

      window.addEventListener('keydown', e => {
        if (!myId) return;
        if (e.key === 'Enter') {
          if (document.activeElement === chatInput) {
            if (chatInput.value.trim()) socket.emit('chat', chatInput.value);
            chatInput.value = '';
            chatInput.blur();
          } else if (document.activeElement === noticeInput) {
            document.getElementById('noticeBtn').click();
          } else {
            chatInput.focus();
          }
          return;
        }
        if (document.activeElement === chatInput || document.activeElement === noticeInput) return;

        keys[e.code] = true;
        if (e.code === 'Space' && !e.repeat) socket.emit('attack');
      });

      window.addEventListener('keyup', e => keys[e.code] = false);

      socket.on('state', data => state = data);
      socket.on('effect', ef => effects.push({ x: ef.x, y: ef.y, r: 20, maxR: ef.isAdmin ? 120 : 75, alpha: 1, isAdmin: ef.isAdmin }));

      setInterval(() => {
        if (!myId || document.activeElement === chatInput || document.activeElement === noticeInput) return;
        let dx = 0, dy = 0;
        if (keys['ArrowUp'] || keys['KeyW']) dy -= 1;
        if (keys['ArrowDown'] || keys['KeyS']) dy += 1;
        if (keys['ArrowLeft'] || keys['KeyA']) dx -= 1;
        if (keys['ArrowRight'] || keys['KeyD']) dx += 1;
        if (dx !== 0 || dy !== 0) socket.emit('move', { dx, dy });
      }, 1000 / 30);

      function draw() {
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const me = state.players[myId];
        const camX = me ? me.x - canvas.width / 2 : 1200 - canvas.width / 2;
        const camY = me ? me.y - canvas.height / 2 : 1200 - canvas.height / 2;

        ctx.save();
        ctx.translate(-camX, -camY);

        ctx.strokeStyle = '#2f3640';
        ctx.lineWidth = 2;
        for (let x = 0; x <= 2400; x += 100) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 2400); ctx.stroke();
        }
        for (let y = 0; y <= 2400; y += 100) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2400, y); ctx.stroke();
        }
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 2400, 2400);

        for (let id in state.monsters) {
          const m = state.monsters[id];
          ctx.fillStyle = '#e74c3c';
          ctx.fillRect(m.x - 18, m.y - 18, 36, 36);
          ctx.fillStyle = '#000';
          ctx.fillRect(m.x - 20, m.y - 30, 40, 6);
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(m.x - 20, m.y - 30, (m.hp / m.maxHp) * 40, 6);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Lv.${m.lv} 몬스터`, m.x, m.y - 36);
        }

        for (let id in state.players) {
          const p = state.players[id];
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = p.isAdmin ? '#f1c40f' : (id === myId ? '#fff' : '#000');
          ctx.lineWidth = p.isAdmin ? 4 : 2;
          ctx.stroke();

          ctx.fillStyle = '#000';
          ctx.fillRect(p.x - 22, p.y - 32, 44, 6);
          ctx.fillStyle = '#2ecc71';
          ctx.fillRect(p.x - 22, p.y - 32, (p.hp / p.maxHp) * 44, 6);

          ctx.fillStyle = p.isAdmin ? '#f1c40f' : '#fff';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          const prefix = p.isAdmin ? '👑 [관리자] ' : '';
          ctx.fillText(`${prefix}${p.username} (Lv.${p.lv})`, p.x, p.y - 40);

          if (p.chatText) {
            ctx.font = '13px sans-serif';
            const tw = ctx.measureText(p.chatText).width + 16;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(p.x - tw / 2, p.y - 75, tw, 24);
            ctx.fillStyle = '#fff';
            ctx.fillText(p.chatText, p.x, p.y - 58);
          }
        }

        for (let i = effects.length - 1; i >= 0; i--) {
          const ef = effects[i];
          ctx.strokeStyle = ef.isAdmin ? `rgba(241, 196, 15, ${ef.alpha})` : `rgba(52, 152, 219, ${ef.alpha})`;
          ctx.lineWidth = ef.isAdmin ? 5 : 3;
          ctx.beginPath();
          ctx.arc(ef.x, ef.y, ef.r, 0, Math.PI * 2);
          ctx.stroke();
          ef.r += (ef.maxR - ef.r) * 0.25;
          ef.alpha -= 0.08;
          if (ef.alpha <= 0) effects.splice(i, 1);
        }

        ctx.restore();
        requestAnimationFrame(draw);
      }
      draw();
    })();
  </script>
</body>
</html>
