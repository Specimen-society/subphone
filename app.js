const $ = (s) => document.querySelector(s);
const ic = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
// Lucide 계열 선 아이콘 (증거 이미지와 동일한 스타일)
const ICON = {
  msg: ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  mail: ic('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.970 5.700a1.940 1.940 0 0 1-2.060 0L2 7"/>'),
  pic: ic('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.090-3.090a2 2 0 0 0-2.830 0L6 21"/>'),
  clock: ic('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  note: ic('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8"/>'),
  cal: ic('<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>'),
  tel: ic('<path d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .7 2.810 2 2 0 0 1-.45 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.45 12.840 12.840 0 0 0 2.810.7A2 2 0 0 1 22 16.920z"/>'),
  cam: ic('<rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.500" r="3"/>'),
  pin: ic('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2"/>'),
  set: ic('<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.930 4.930l1.410 1.410M17.660 17.660l1.410 1.410M2 12h2M20 12h2M6.340 17.660l-1.410 1.410M19.070 4.930l-1.410 1.410"/>'),
};
const APPS = [['msgs', '메시지', 'msg', '#34a853'], ['mail', '메일', 'mail', '#3b72e0'], ['gallery', '갤러리', 'pic', '#d9714a'], [null, '시계', 'clock', '#4a5058'], [null, '메모', 'note', '#d6aa38'], [null, '캘린더', 'cal', '#c9473f']];
const DOCK = [['calls', 'tel', '#2f9e56'], [null, 'cam', '#585e69'], [null, 'pin', '#3a9187'], [null, 'set', '#6b717b']];
const TIME = { lock: '9:40', home: '9:40', msgs: '9:41', thread: '9:41', mail: '9:42', mailview: '9:42', calls: '9:42', gallery: '9:43' };
let D, THREADS, MAIL_BODY, ATT, CALLS;
let cur = 'lock';
function status(s) { $('#clk').textContent = TIME[s] || '9:40'; }
function layers(which) { for (const k of ['lock', 'pass', 'home', 'app', 'viewer']) $('#' + k).hidden = k !== which; }
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
  if (s === 'gallery') return app('<div class="hd"><h1>갤러리</h1><p>청년부 앨범</p><p style="color:#fff;font-size:13px">즐겨찾기 1 · 청년부 2,184</p></div><div class="scroll"><div class="gal">' + D.imgs.map((src, i) => `<button data-view="${i}"><img src="${src}" alt="">${i ? '' : '<span class="heart">♥</span>'}</button>`).join('') + '</div></div>');
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-view],#fp,#hind,#viewer button,#pcancel');
  if (t && t.id === 'pcancel') return go('lock');
  if (!t) return;
  if (t.id === 'fp') { layers('pass'); $('#pw').focus(); return; }
  if (t.id === 'hind') return cur === 'lock' ? 0 : go('home');
  if (t.dataset.view !== undefined) { $('#viewer').innerHTML = `<button>‹ 갤러리</button><img src="${D.imgs[t.dataset.view]}" alt="">`; return layers('viewer'); }
  if (t.closest('#viewer')) return layers('app');
  if (!t.dataset.go) { t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); return; }
  go(t.dataset.go, t.dataset.a);
});

// shrink the frame to fit short desktop windows
function fit() { const k = Math.min(1, (innerHeight - 16) / 892, (innerWidth - 16) / 420); $('#phone').style.transform = k < 1 ? `scale(${k})` : ''; }
addEventListener('resize', fit); fit();

// 암호로 data.enc.json 복호화 (내용은 암호 없이는 소스에서도 볼 수 없음)
let ENC, fails = 0;
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
$('#pform').onsubmit = async (e) => {
  e.preventDefault();
  ENC ||= await (await fetch('data.enc.json')).json();
  try {
    const km = await crypto.subtle.importKey('raw', new TextEncoder().encode($('#pw').value), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(ENC.salt), iterations: ENC.iter, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    D = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(ENC.iv) }, key, b64(ENC.ct))));
    ({ threads: THREADS, mailBody: MAIL_BODY, att: ATT, calls: CALLS } = D);
    $('#pw').value = ''; return go('home');
  } catch {
    const f = $('#pform'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
    $('#pw').value = ''; $('#pw').focus();
    $('#perr').textContent = ++fails >= 3 ? '암호가 올바르지 않습니다. 힌트: 내 것' : '암호가 올바르지 않습니다';
  }
};
