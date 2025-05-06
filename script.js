
const pairs = [
  { name: "勝 × 凝", score: 1, events: [], history: [1] },
  { name: "熊 × 張", score: 1, events: [], history: [1] },
  { name: "張 × 芊", score: 1, events: [], history: [1] },
  { name: "芊 × 梁", score: 1, events: [], history: [1] }
];
let charts = [];
let profile = JSON.parse(localStorage.getItem("profile")) || { nickname: "匿名使用者", coins: 100, holdings: [], events: [] };

function renderPairs() {
  const list = document.getElementById('pair-list');
  const select = document.getElementById('pairSelect');
  list.innerHTML = '';
  select.innerHTML = '';
  charts = [];

  pairs.forEach((pair, index) => {
    const div = document.createElement('div');
    div.className = 'pair';
    div.innerHTML = `
      <h3>${pair.name}</h3>
      <p>戀愛股價：<strong>${pair.score.toFixed(2)} 倍</strong></p><p>我的投稿：${(profile.events || []).join("<br>") || "無"}</p>
      <button onclick="invest(${index})">投資 ❤️</button>
      <ul>${pair.events.map(e => `<li>📝 ${e}</li>`).join('')}</ul>
      <canvas id="chart-${index}"></canvas>
    `;
    list.appendChild(div);

    const ctx = document.getElementById(`chart-${index}`).getContext("2d");
    charts.push(new Chart(ctx, {
      type: "line",
      data: {
        labels: pair.history.map((_, i) => i + 1),
        datasets: [{
          label: "戀愛股價",
          data: pair.history,
          borderColor: "#ff4081",
          tension: 0.3
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    }));

    const option = document.createElement('option');
    option.value = index;
    option.textContent = pair.name;
    select.appendChild(option);
  });
}

function invest(index) {
  if (profile.coins >= 1) {
    profile.coins -= 1;
    profile.holdings.push(pairs[index].name);
    pairs[index].score += 1;
    pairs[index].history.push(pairs[index].score);
    renderPairs();
localStorage.setItem("profile", JSON.stringify(profile));
    renderProfile();
localStorage.setItem("profile", JSON.stringify(profile));
  } else {
    alert("幣值不足！");
  }
}

function submitEvent() {
  const index = document.getElementById('pairSelect').value;
  const type = document.getElementById('eventType').value;
  const text = document.getElementById('eventText').value.trim();
  if (!text) return alert("請輸入事件內容");

  let effect = 0;
  if (type === 'positive') effect = 1.2;
  else if (type === 'negative') effect = -1;
  else if (type === 'together') effect = pairs[index].score * 50;
  else if (type === 'breakup') effect = -2 * pairs[index].score;

  pairs[index].score = Math.max(0, pairs[index].score + effect);
  pairs[index].events.push(text + ` (${type})`);
if (!profile.events) profile.events = [];
profile.events.push(pairs[index].name + ": " + text + ` (${type})`);
  pairs[index].history.push(pairs[index].score);
  document.getElementById('eventText').value = '';
  renderPairs();
localStorage.setItem("profile", JSON.stringify(profile));
}

function saveProfile() {
  profile.nickname = document.getElementById("nicknameInput").value || profile.nickname;
  localStorage.setItem("profile", JSON.stringify(profile));
  renderProfile();
localStorage.setItem("profile", JSON.stringify(profile));
}

function renderProfile() {
  const div = document.getElementById("profileDisplay");
  div.innerHTML = `
    <p>暱稱：${profile.nickname}</p><p>我的投稿：${(profile.events || []).join("<br>") || "無"}</p>
    
    <p>剩餘幣值：${profile.coins}</p><p>我的投稿：${(profile.events || []).join("<br>") || "無"}</p>
    <p>持有股票：${profile.holdings.join(', ') || '尚未投資'}</p><p>我的投稿：${(profile.events || []).join("<br>") || "無"}</p>
  `;
}

function addNewPair() {
  const input = document.getElementById('newPairInput');
  const name = input.value.trim();
  if (!name) return alert("請輸入配對名稱");
  pairs.push({ name, score: 1, events: [], history: [1] });
  input.value = '';
  renderPairs();
localStorage.setItem("profile", JSON.stringify(profile));
}

function showSection(section) {
  document.getElementById('market-section').style.display = section === 'market' ? 'block' : 'none';
  document.getElementById('profile-section').style.display = section === 'profile' ? 'block' : 'none';
}

setInterval(() => {
  pairs.forEach(p => {
    p.score += 0.1;
    p.history.push(p.score);
  });
  renderPairs();
localStorage.setItem("profile", JSON.stringify(profile));
}, 180000); // 每三分鐘漲一次

renderPairs();
localStorage.setItem("profile", JSON.stringify(profile));
renderProfile();
localStorage.setItem("profile", JSON.stringify(profile));
