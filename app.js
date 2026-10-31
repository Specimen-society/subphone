const $ = (s) => document.querySelector(s);
const ic = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
const ICON = {
  msg: ic('<path d="M4 5h16v11H9l-5 4z"/>'),
  mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  pic: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.500" cy="9.500" r="1.500"/><path d="M4 18l5-5 4 4 3-3 4 4"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  note: ic('<path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/>'),
  cal: ic('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>'),
  tel: ic('<path d="M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"/>'),
  cam: ic('<rect x="3" y="7" width="18" height="12" rx="3"/><circle cx="12" cy="13" r="3"/>'),
  pin: ic('<path d="M12 21s-6-6-6-11a6 6 0 0112 0c0 5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>'),
  set: ic('<circle cx="12" cy="12" r="3.500"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
};
const APPS = [['msgs', '메시지', 'msg', '#34a853'], ['mail', '메일', 'mail', '#3b72e0'], ['gallery', '갤러리', 'pic', '#d9714a'], [null, '시계', 'clock', '#4a5058'], [null, '메모', 'note', '#d6aa38'], [null, '캘린더', 'cal', '#c9473f']];
const DOCK = [['calls', 'tel', '#2f9e56'], [null, 'cam', '#585e69'], [null, 'pin', '#3a9187'], [null, 'set', '#6b717b']];
const TIME = { lock: '9:40', home: '9:40', msgs: '9:41', thread: '9:41', mail: '9:42', mailview: '9:42', calls: '9:42', gallery: '9:43' };
const THREADS = [
  { n: '참모', d: '10월 22일', t: '한정선 28일 봉헌 명단에 올렸습니다', m: [['10월 22일', '한정선 28일 봉헌 명단에 올렸습니다', 0]] },
  { n: '청년부 대표', d: '10월 19일', t: '국우민 동생 청년부 등록 완료', m: [['10월 19일', '국우민 동생 청년부 등록 완료', 0]] },
  { n: '재무 실장', d: '10월 19일', t: '나: 부자윤 이번 달 미납, 압박 바람', m: [['10월 19일', '부자윤 이번 달 미납, 압박 바람', 1]] },
];
const MAIL_BODY = '통화로 요청하신 민현주 대변인 관련 문서 전달드립니다.';
const ATT = '[정치인] 후견금 집행 내역_퐁당퐁당-민현주-대변인.hwpx';
const CALLS = [['행정 실장', '10월 23일', '오전 2:00', '10분'], ['재무 실장', '10월 22일', '오전 1:10', '5분']];

let cur = 'lock';
function status(s) { $('#clk').textContent = TIME[s] || '9:40'; }
function layers(which) { for (const k of ['lock', 'home', 'app', 'viewer']) $('#' + k).hidden = k !== which; }
const app = (html) => { $('#app').innerHTML = html; layers('app'); };

function go(s, arg) {
  cur = s; status(s);
  if (s === 'lock') return layers('lock');
  if (s === 'home') {
    $('#home').innerHTML = '<div class="grid">' + APPS.map(([t, n, i, c]) => `<button class="ap" data-go="${t || ''}"><span class="ico" style="background:${c}">${ICON[i]}</span>${n}</button>`).join('') + '</div><div class="dock">' + DOCK.map(([t, i, c]) => `<button data-go="${t || ''}"><span class="ico" style="background:${c}">${ICON[i]}</span></button>`).join('') + '</div>';
    return layers('home');
  }
  if (s === 'msgs') return app('<div class="hd"><h1>메시지</h1><p>대화 3</p></div><div class="scroll">' + THREADS.map((x, i) => `<button class="row" data-go="thread" data-a="${i}"><span class="av">${x.n[0]}</span><span class="mid"><div class="nm">${x.n}</div><div class="sn">${x.t}</div></span><span class="dt">${x.d}</span></button>`).join('') + '</div>');
  if (s === 'thread') { const x = THREADS[arg]; return app(`<button class="back" data-go="msgs">‹ 메시지</button><div class="hd"><h1 style="font-size:20px;text-align:center">${x.n}</h1></div><div class="scroll">` + x.m.map((m) => `<div class="when">${m[0]}</div><div class="bubble ${m[2] ? 'me' : ''}">${m[1]}</div>`).join('') + '</div>'); }
  if (s === 'mail') return app(`<div class="hd"><h1>받은편지함</h1><p>읽지 않음 1</p></div><div class="scroll"><button class="mail" data-go="mailview"><div style="display:flex;justify-content:space-between"><b><span class="dot"></span>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><div class="t">정치인 민현주 후견금 집행 내역 문서</div><div class="s">${MAIL_BODY}</div><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></button><div class="sec" style="color:#5f666d">이전 메일 없음</div></div>`);
  if (s === 'mailview') return app(`<button class="back" data-go="mail">‹ 받은편지함</button><div class="scroll" style="padding:16px 20px"><div style="display:flex;justify-content:space-between"><b>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><h2 style="font-size:19px;margin:14px 0">정치인 민현주 후견금 집행 내역 문서</h2><p style="font-size:15px;line-height:1.6;color:#d5d9dd">${MAIL_BODY}</p><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></div>`);
  if (s === 'calls') return app('<div class="hd"><h1>통화</h1></div><div class="sec" style="margin-top:6px">최근 기록</div><div class="scroll">' + CALLS.map(([n, d, t, m]) => `<div class="row call"><span class="av">↗</span><span class="mid"><div class="nm">${n}</div><div class="sn" style="color:#8f979f">발신 · ${m}</div></span><span class="dt">${d}<br>${t}</span></div>`).join('') + '</div>');
  if (s === 'gallery') return app('<div class="hd"><h1>갤러리</h1><p>청년부 앨범</p><p style="color:#fff;font-size:13px">즐겨찾기 1 · 청년부 2,184</p></div><div class="scroll"><div class="gal">' + Array.from({ length: 17 }, (_, i) => `<button data-view="${i}"><img src="img/${i}.jpg" alt="">${i ? '' : '<span class="heart">♥</span>'}</button>`).join('') + '</div></div>');
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-view],#fp,#hind,#viewer button');
  if (!t) return;
  if (t.id === 'fp') return go('home');
  if (t.id === 'hind') return cur === 'lock' ? 0 : go('home');
  if (t.dataset.view !== undefined) { $('#viewer').innerHTML = `<button>‹ 갤러리</button><img src="img/${t.dataset.view}.jpg" alt="">`; return layers('viewer'); }
  if (t.closest('#viewer')) return layers('app');
  if (!t.dataset.go) { t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); return; }
  go(t.dataset.go, t.dataset.a);
});

// shrink the frame to fit short desktop windows
function fit() { const k = Math.min(1, (innerHeight - 16) / 872, (innerWidth - 16) / 413); $('#phone').style.transform = k < 1 ? `scale(${k})` : ''; }
addEventListener('resize', fit); fit();
