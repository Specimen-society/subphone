const $ = (s) => document.querySelector(s);
const ic = (d) => `<svg viewBox="0 0 24 24">${d}</svg>`;
// iOS 기본 앱 아이콘 (직접 그린 SVG, 60x60)
const sv = (b) => `<svg viewBox="0 0 60 60">${b}</svg>`;
const grad = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="60" height="60" fill="url(#${id})"/>`;
const petals = ['#ffd426', '#ff9f0a', '#ff453a', '#ff5fa0', '#bf5af2', '#5e7cff', '#32c8e6', '#34c759'].map((c, i) => `<ellipse cx="30" cy="19" rx="6.500" ry="11" fill="${c}" opacity=".8" style="mix-blend-mode:multiply" transform="rotate(${i * 45} 30 30)"/>`).join('');
const ticks = Array.from({ length: 12 }, (_, i) => `<path d="M30 10v${i % 3 ? 2 : 4}" stroke="#111" stroke-width="${i % 3 ? 1 : 1.6}" transform="rotate(${i * 30} 30 30)"/>`).join('');
const ICON = {
  msg: sv(grad('g1', '#67f07f', '#0cbf2f') + '<ellipse cx="30" cy="28" rx="20" ry="15.500" fill="#fff"/><path d="M13 47c5-2 8-5 8-9l7 3z" fill="#fff"/>'),
  mail: sv(grad('g2', '#3fb4ff', '#1566f0') + '<rect x="10" y="16" width="40" height="28" rx="4.500" fill="#fff"/><path d="M11.500 19l18.500 14 18.500-14" stroke="#2a7cf0" stroke-width="2.600" fill="none" stroke-linejoin="round"/>'),
  pic: sv('<rect width="60" height="60" fill="#fff"/>' + petals),
  clock: sv('<rect width="60" height="60" fill="#000"/><circle cx="30" cy="30" r="25" fill="#fff"/>' + ticks + '<path d="M30 30V16M30 30l9 5" stroke="#111" stroke-width="2.600" stroke-linecap="round"/><path d="M30 34V12" stroke="#ff9f0a" stroke-width="1.200"/><circle cx="30" cy="30" r="2" fill="#ff9f0a"/>'),
  note: sv('<rect width="60" height="60" fill="#fff"/><rect width="60" height="17" fill="#ffd60a"/><path d="M8 28h44M8 38h44M8 48h44" stroke="#d6d6da" stroke-width="1.200"/>'),
  cal: sv('<rect width="60" height="60" fill="#fff"/><text x="30" y="18" text-anchor="middle" font-size="11" font-weight="700" fill="#ff3b30">토</text><text x="30" y="49" text-anchor="middle" font-size="31" font-weight="300" fill="#111">24</text>'),
  tel: sv(grad('g3', '#67f07f', '#0cbf2f') + '<g transform="translate(13 13) scale(1.580)" fill="#fff"><path d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .7 2.810 2 2 0 0 1-.45 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.45 12.840 12.840 0 0 0 2.810.7A2 2 0 0 1 22 16.920z"/></g>'),
  cam: sv(grad('g4', '#d8d8dd', '#8e8e93') + '<path d="M12 22h8l3-5h14l3 5h8a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V25a3 3 0 0 1 3-3z" fill="#2c2c2e"/><circle cx="30" cy="33" r="9.500" fill="#8e8e93"/><circle cx="30" cy="33" r="7" fill="#1c1c1e"/>'),
  pin: sv('<rect width="60" height="60" fill="#f2efe6"/><path d="M0 40L60 12v10L0 52z" fill="#fff"/><path d="M0 8h22v22H0z" fill="#bfe6a8"/><path d="M38 36h22v24H38z" fill="#9dd5f5"/><path d="M0 42L60 14" stroke="#ffcf4d" stroke-width="5"/><circle cx="31" cy="26" r="9" fill="#ff453a"/><circle cx="31" cy="26" r="3.500" fill="#fff"/>'),
  set: sv(grad('g5', '#a9a9af', '#5d5d62') + '<circle cx="30" cy="30" r="15.500" fill="none" stroke="#e1e1e6" stroke-width="6.500" stroke-dasharray="6.100 6.100"/><circle cx="30" cy="30" r="14" fill="#e1e1e6"/><circle cx="30" cy="30" r="6" fill="#6e6e73"/>'),
};
const APPS = [['msgs', '메시지', 'msg'], ['mail', '메일', 'mail'], ['gallery', '갤러리', 'pic'], [null, '시계', 'clock'], [null, '메모', 'note'], [null, '캘린더', 'cal']];
const DOCK = [['calls', 'tel'], [null, 'cam'], [null, 'pin'], [null, 'set']];
const TIME = { lock: '9:40', home: '9:40', msgs: '9:41', thread: '9:41', mail: '9:42', mailview: '9:42', calls: '9:42', gallery: '9:43' };
let D, EVENTS, THREADS, MAIL_BODY, ATT, CALLS;
// 2026년 10월 달력 위젯 (오늘 = 24일, 매년 반복 일정은 점 + 목록으로 표시)
function calWidget() {
  const Y = 2026, M = 10, T = 24, first = new Date(Y, M - 1, 1).getDay(), n = new Date(Y, M, 0).getDate();
  const ev = EVENTS.filter((e) => e.m === M).map((e) => e.d);
  let cells = '일월화수목금토'.split('').map((w) => `<b class="wd">${w}</b>`).join('') + '<i></i>'.repeat(first);
  for (let d = 1; d <= n; d++) cells += `<span class="${d === T ? 'today' : ''}${ev.includes(d) ? ' ev' : ''}">${d}</span>`;
  return `<div class="widget"><div class="wh"><b>${M}월</b><span>${Y}</span></div><div class="cg">${cells}</div>` +
    EVENTS.map((e) => `<div class="we"><i></i><span>${e.m}월 ${e.d}일 · ${e.t}</span><em>${e.r}</em></div>`).join('') + '</div>';
}
function initPages() {
  const p = $('#pages'), dots = document.querySelectorAll('.dots i');
  p.onscroll = () => { const k = Math.round(p.scrollLeft / p.clientWidth); dots.forEach((d, i) => d.classList.toggle('on', i === k)); };
  dots.forEach((d, i) => (d.onclick = () => p.scrollTo({ left: i * p.clientWidth, behavior: 'smooth' })));
}

let cur = 'lock';
function status(s) { $('#clk').textContent = TIME[s] || '9:40'; }
function layers(which) { for (const k of ['lock', 'pass', 'home', 'app', 'viewer']) $('#' + k).hidden = k !== which; }
const app = (html) => { $('#app').innerHTML = html; layers('app'); };

function go(s, arg) {
  cur = s; status(s);
  if (s === 'lock') return layers('lock');
  if (s === 'home') {
    const apps = '<div class="grid">' + APPS.map(([t, n, i]) => `<button class="ap" data-go="${t || ''}"><span class="ico">${ICON[i]}</span>${n}</button>`).join('') + '</div>';
    $('#home').innerHTML = `<div class="pages" id="pages"><div class="pg">${apps}</div><div class="pg">${calWidget()}</div></div><div class="dots"><i class="on"></i><i></i></div><div class="dock">` + DOCK.map(([t, i]) => `<button data-go="${t || ''}"><span class="ico">${ICON[i]}</span></button>`).join('') + '</div>';
    initPages();
    return layers('home');
  }
  if (s === 'msgs') return app('<div class="hd"><h1>메시지</h1><p>대화 3</p></div><div class="scroll">' + THREADS.map((x, i) => `<button class="row" data-go="thread" data-a="${i}"><span class="av">${x.n[0]}</span><span class="mid"><div class="nm">${x.n}</div><div class="sn">${x.t}</div></span><span class="dt">${x.d}</span></button>`).join('') + '</div>');
  if (s === 'thread') { const x = THREADS[arg]; return app(`<button class="back" data-go="msgs">‹ 메시지</button><div class="hd"><h1 style="font-size:20px;text-align:center">${x.n}</h1></div><div class="scroll">` + x.m.map((m) => `<div class="when">${m[0]}</div><div class="bubble ${m[2] ? 'me' : ''}">${m[1]}</div>`).join('') + '</div>'); }
  if (s === 'mail') return app(`<div class="hd"><h1>받은편지함</h1><p>읽지 않음 1</p></div><div class="scroll"><button class="mail" data-go="mailview"><div style="display:flex;justify-content:space-between"><b><span class="dot"></span>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><div class="t">정치인 민현주 후견금 집행 내역 문서</div><div class="s">${MAIL_BODY}</div><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></button><div class="sec" style="color:#5f666d">이전 메일 없음</div></div>`);
  if (s === 'mailview') return app(`<button class="back" data-go="mail">‹ 받은편지함</button><div class="scroll" style="padding:16px 20px"><div style="display:flex;justify-content:space-between"><b>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><h2 style="font-size:19px;margin:14px 0">정치인 민현주 후견금 집행 내역 문서</h2><p style="font-size:15px;line-height:1.6;color:#d5d9dd">${MAIL_BODY}</p><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></div>`);
  if (s === 'calls') return app('<div class="hd"><h1>통화</h1></div><div class="sec" style="margin-top:6px">최근 기록</div><div class="scroll">' + CALLS.map(([n, d, t, m]) => `<div class="row call"><span class="av">↗</span><span class="mid"><div class="nm">${n}</div><div class="sn" style="color:#8f979f">발신 · ${m}</div></span><span class="dt">${d}<br>${t}</span></div>`).join('') + '</div>');
  if (s === 'gallery') return app(`<div class="hd"><h1>갤러리</h1><p>청년부 앨범</p><p style="color:#fff;font-size:13px">즐겨찾기 ${D.photos.filter((p) => p.fav).length} · 청년부 2,184</p></div><div class="scroll"><div class="gal">` + D.photos.map((p, i) => `<button data-view="${i}"><img src="${p.src}" alt="">${p.fav ? '<span class="heart">♥</span>' : ''}</button>`).join('') + '</div></div>');
}

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-view],#fp,#hind,#viewer button,#pcancel');
  if (t && t.id === 'pcancel') return go('lock');
  if (!t) return;
  if (t.id === 'fp') { layers('pass'); $('#pw').focus(); return; }
  if (t.id === 'hind') return cur === 'lock' ? 0 : go('home');
  if (t.dataset.view !== undefined) { const i = +t.dataset.view, p = D.photos[i], nm = 'IMG_' + String(i + 1).padStart(4, '0') + '_' + p.name + '.JPG'; $('#viewer').innerHTML = `<button>‹ 갤러리</button><img src="${p.src}" alt=""><div class="info"><b>${nm}</b><span>${p.fav ? '<i class="fv">♥</i> 즐겨찾기 · ' : ''}청년부 앨범</span></div>`; return layers('viewer'); }
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
    ({ events: EVENTS, threads: THREADS, mailBody: MAIL_BODY, att: ATT, calls: CALLS } = D);
    $('#pw').value = ''; return go('home');
  } catch {
    const f = $('#pform'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake');
    $('#pw').value = ''; $('#pw').focus();
    $('#perr').textContent = ++fails >= 3 ? '암호가 올바르지 않습니다. 힌트: 내 것' : '암호가 올바르지 않습니다';
  }
};

// 전원 버튼: 화면 끄기 / 켜면 잠금 화면(암호는 다시 입력)
$('#pwr').onclick = () => { const off = $('#off'); if (off.hidden) off.hidden = false; else { off.hidden = true; $('#pw').value = ''; go('lock'); } };
