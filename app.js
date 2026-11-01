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
const APPS = [['msgs', '메시지', 'msg'], ['mail', '메일', 'mail'], ['gallery', '갤러리', 'pic'], ['clock', '시계', 'clock'], ['notes', '메모', 'note'], ['cal', '캘린더', 'cal']];
const DOCK = [['calls', 'tel'], [null, 'cam'], ['maps', 'pin'], [null, 'set']];
const T0 = Date.now(); // 시계는 9:40에서 시작해 실제 시간처럼 흐른다
const hm = () => { const m = 9 * 60 + 40 + Math.floor((Date.now() - T0) / 60000); return [Math.floor(m / 60) % 24, m % 60]; };
const p2 = (n) => String(n).padStart(2, '0');
let D, EVENTS, THREADS, MAIL_BODY, ATT, CALLS;
// 2026년 11월 달력 위젯 (오늘 = 14일, 매년 반복 일정은 점 + 목록으로 표시)
function calWidget() {
  const Y = 2026, M = 11, T = 14, first = new Date(Y, M - 1, 1).getDay(), n = new Date(Y, M, 0).getDate();
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


// ---- iOS 전화 앱 ----
const PH = '<path d="M22 16.920v3a2 2 0 0 1-2.180 2 19.790 19.790 0 0 1-8.630-3.070 19.500 19.500 0 0 1-6-6 19.790 19.790 0 0 1-3.070-8.670A2 2 0 0 1 4.110 2h3a2 2 0 0 1 2 1.720 12.840 12.840 0 0 0 .7 2.810 2 2 0 0 1-.45 2.110L8.090 9.910a16 16 0 0 0 6 6l1.270-1.270a2 2 0 0 1 2.110-.45 12.840 12.840 0 0 0 2.810.7A2 2 0 0 1 22 16.920z" fill="#fff"/>';
const TI = {
  fav: '<path d="M12 3l2.700 5.600 6.100.9-4.400 4.300 1 6.100L12 17l-5.400 2.900 1-6.100L3.200 9.500l6.100-.9z"/>',
  rec: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.500 2"/>',
  con: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  key: '<g fill="currentColor" stroke="none"><circle cx="6" cy="5" r="1.800"/><circle cx="12" cy="5" r="1.800"/><circle cx="18" cy="5" r="1.800"/><circle cx="6" cy="11" r="1.800"/><circle cx="12" cy="11" r="1.800"/><circle cx="18" cy="11" r="1.800"/><circle cx="6" cy="17" r="1.800"/><circle cx="12" cy="17" r="1.800"/><circle cx="18" cy="17" r="1.800"/><circle cx="12" cy="22" r="1.800"/></g>',
  vm: '<circle cx="7" cy="12" r="3.500"/><circle cx="17" cy="12" r="3.500"/><path d="M7 15.500h10"/>',
};
const TABS = [['fav', '즐겨찾기'], ['rec', '최근 기록'], ['con', '연락처'], ['key', '키패드'], ['vm', '음성 사서함']];
const CONTACTS = ['재무 실장', '참모', '청년부 대표', '행정 실장'];
const NUM = { '재무 실장': '010-4417-2903', '참모': '010-3258-7716', '청년부 대표': '010-9624-1380', '행정 실장': '010-5571-4062' };
const WD = '일월화수목금토';
let dial = '';
function tabs(on) {
  return '<div class="tabs">' + TABS.map(([k, n]) => `<button class="${k === on ? 'on' : ''}" data-go="calls" data-a="${k}"><svg viewBox="0 0 24 24">${TI[k]}</svg>${n}</button>`).join('') + '</div>';
}
let callSeg = 'all', CALL = null, CT = [], actx;
const later = (fn, ms) => CT.push(setTimeout(fn, ms));
function beep(freqs, dur, at = 0, vol = 0.1) {
  try {
    actx ||= new AudioContext(); actx.resume();
    const t = actx.currentTime + at, g = actx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.setValueAtTime(vol, t + dur - 0.03); g.gain.linearRampToValueAtTime(0, t + dur);
    g.connect(actx.destination);
    freqs.forEach((f) => { const o = actx.createOscillator(); o.frequency.value = f; o.connect(g); o.start(t); o.stop(t + dur); });
  } catch {}
}
const dtmf = (k) => { const i = '123456789*0#'.indexOf(k); if (i >= 0) beep([[697, 770, 852, 941][(i / 3) | 0], [1209, 1336, 1477][i % 3]], 0.12); };
function say(text, A) {
  try { if (!/[가-힣]/.test(text)) return; const u = new SpeechSynthesisUtterance(text.replace(/…/g, '')); u.lang = 'ko-KR'; u.pitch = A.pitch; u.rate = A.rate; speechSynthesis.speak(u); } catch {}
}
function stopCall() { CT.forEach((t) => { clearTimeout(t); clearInterval(t); }); CT = []; try { speechSynthesis.cancel(); } catch {} }
// 발신: 신호음 2회 → 상대가 받고 짧게 반응한 뒤 끊음 (사람마다 말투만 다름)
function startCall(name, from) {
  stopCall(); CALL = { name, from, t0: 0, lines: [] };
  go('dialing', name);
  const A = D.answers[name], rings = A ? 2 : 3;
  for (let i = 0; i < rings; i++) later(() => beep([440, 480], 1), i * 3000);
  const ans = rings * 3000 - 400;
  if (!A) return later(() => { const d = $('#ds'); if (d) d.textContent = '연결할 수 없습니다'; hangBeeps(); later(endCall, 1800); }, ans);
  later(() => {
    CALL.t0 = Date.now(); beep([1000], 0.06);
    const ds = $('#ds'), tick = () => { const s = Math.floor((Date.now() - CALL.t0) / 1000); ds.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
    tick(); CT.push(setInterval(tick, 500));
    let at = 700;
    A.lines.forEach((ln) => { later(() => { const c = $('#caps'); if (c) c.insertAdjacentHTML('beforeend', `<div class="cap">${ln}</div>`); CALL.lines.push([name, ln]); say(ln, A); }, at); at += ln === '…' ? 900 : 900 + ln.length * 130; });
    later(() => { ds.textContent = '통화 종료'; hangBeeps(); later(endCall, 1400); }, at + 400);
  }, ans);
}
const hangBeeps = () => [0, 0.25, 0.5].forEach((t) => beep([480], 0.15, t));
function endCall() {
  if (!CALL) return; stopCall();
  const c = CALL; CALL = null;
  if (c.t0) {
    const s = Math.max(1, Math.round((Date.now() - c.t0) / 1000));
    D.calls.unshift({ n: c.name, d: '11월 14일', t: (([h, m]) => (h < 12 ? '오전 ' : '오후 ') + (h % 12 || 12) + ':' + p2(m))(hm()), m: s + '초', dir: 'out', rec: c.lines.filter((l) => l[1] !== '…').map(([n, t]) => [n, t]) });
  }
  go('calls', c.from || 'rec');
}
const acts = (name) => {
  const ic = (p) => `<svg viewBox="0 0 24 24" style="width:26px;height:26px;fill:none;stroke:#0a84ff;stroke-width:1.8;stroke-linejoin:round">${p}</svg>`;
  const ti = THREADS.findIndex((x) => x.n === name);
  return `<div class="acts"><button data-go="${ti < 0 ? 'msgs' : 'thread'}" data-a="${ti}"><i>${ic('<path d="M12 4C7 4 3 7.300 3 11.500c0 2.300 1.200 4.300 3 5.700L5 21l4.200-2.200c.9.200 1.800.3 2.800.3 5 0 9-3.300 9-7.500S17 4 12 4z"/>')}</i>메시지</button><button data-dial="${name}"><i><svg viewBox="0 0 24 24" style="width:26px;height:26px">${PH.replace('fill="#fff"', 'fill="#0a84ff"')}</svg></i>음성</button><button><i>${ic('<rect x="2.500" y="6" width="13" height="12" rx="3"/><path d="M15.500 10.500l6-3.500v10l-6-3.500z"/>')}</i>영상</button><button data-go="mail"><i>${ic('<rect x="3" y="5.500" width="18" height="13" rx="2.500"/><path d="M3.500 7.500l8.500 6 8.500-6"/>')}</i>메일</button></div>`;
};
function phone(s, arg) {
  if (s === 'dialing') return app(`<div class="dialing"><div class="dn">${arg}</div><div class="ds" id="ds">발신 중...</div><div class="dgrid">${['소리 끔', '키패드', '스피커', '통화 추가', 'FaceTime', '연락처'].map((x) => `<span>${x}</span>`).join('')}</div><div class="caps" id="caps"></div><div class="dbtns"><button class="cc end" data-end><svg viewBox="0 0 24 24" style="transform:rotate(135deg)">${PH}</svg></button></div></div>`);
  if (s === 'contact') return app(`<button class="back" data-go="calls" data-a="con">‹ 연락처</button><div class="scroll"><div class="cd"><span class="av big">${arg[0]}</span><h2>${arg}</h2></div>${acts(arg)}<div class="card"><div class="cl">휴대전화</div><div class="cs" style="color:#0a84ff;font-size:16px">${NUM[arg] || arg}</div></div><div class="card" style="padding:4px 16px">${D.calls.map((c, i) => c.n === arg ? `<button class="row" data-go="call" data-a="${i}" style="padding:10px 0;width:100%"><span class="mid"><div class="nm" style="font-weight:500">${c.dir === 'in' ? '↙ 수신' : '↗ 발신'} · ${c.m}</div><div class="sn" style="color:#8f979f;font-size:13px">${c.d} ${c.t}</div></span></button>` : '').join('') || '<div class="cs" style="padding:10px 0">통화 기록 없음</div>'}</div></div>`);
  if (s === 'call') {
    const c = D.calls[arg], [mo, da] = c.d.match(/\d+/g), w = WD[new Date(2026, mo - 1, da).getDay()];
    const tr = c.rec ? `<div class="card"><div class="cl" style="margin-bottom:8px">통화 내용</div>${c.rec.map(([n, t]) => `<div class="tl"><b>${n}</b>${t}</div>`).join('')}</div>` : '';
    return app(`<button class="back" data-go="calls" data-a="rec">‹ 최근 기록</button><div class="scroll"><div class="cd"><span class="av big">${c.n[0]}</span><h2>${c.n}</h2></div>${acts(c.n)}<div class="card"><div class="cl">${c.d} ${w}요일 ${c.t}</div><div class="cs">${c.dir === 'in' ? '수신' : '발신'} 전화 · ${c.m}</div></div>${tr}<div class="card"><div class="cl">휴대전화</div><div class="cs" style="color:#0a84ff;font-size:16px">${NUM[c.n] || c.n}</div></div></div>`);
  }
  const tab = arg || 'rec';
  if (tab === 'key') {
    const keys = [['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'], ['*', ''], ['0', '+'], ['#', '']];
    return app(`<div class="kp"><div class="num" id="num">${dial}</div><div class="add">${dial ? '번호 추가' : ''}</div><div class="kg">${keys.map(([k, l]) => `<button data-k="${k}"><b>${k}</b><small>${l}</small></button>`).join('')}<span></span><button class="cc" data-call><svg viewBox="0 0 24 24">${PH}</svg></button><button class="bs" data-bs>⌫</button></div></div>` + tabs('key'));
  }
  if (tab === 'con') return app('<div class="hd"><h1>연락처</h1></div><div class="scroll">' + CONTACTS.map((n) => `<button class="row" data-go="contact" data-a="${n}" style="align-items:center;padding:12px 20px"><span class="av" style="width:40px;height:40px;font-size:16px">${n[0]}</span><span class="nm" style="font-weight:500">${n}</span></button>`).join('') + '</div>' + tabs('con'));
  if (tab === 'fav') return app('<div class="hd"><h1>즐겨찾기</h1></div><div class="empty">즐겨찾기가 없습니다</div>' + tabs('fav'));
  if (tab === 'vm') return app('<div class="hd"><h1>음성 사서함</h1></div><div class="empty">음성 사서함이 없습니다</div>' + tabs('vm'));
  const rows = callSeg === 'miss' ? '<div class="empty" style="padding-top:120px">부재중 전화가 없습니다</div>' : D.calls.map((c, i) => `<div class="row" style="align-items:center;padding:11px 20px"><span class="mid"><div class="nm" style="font-weight:600">${c.n}</div><div class="sn" style="color:#8f979f;font-size:13px">${c.dir === 'in' ? '↙' : '↗'} 휴대전화</div></span><span class="dt">${c.d}</span><button class="ibtn" data-go="call" data-a="${i}">ⓘ</button></div>`).join('');
  return app(`<div class="hd" style="padding-bottom:6px"><h1>최근 기록</h1></div><div class="seg"><button class="${callSeg === 'all' ? 'on' : ''}" data-seg="all">전체</button><button class="${callSeg === 'miss' ? 'on' : ''}" data-seg="miss">부재중</button></div><div class="scroll">${rows}</div>` + tabs('rec'));
}

let cur = 'lock';
function status() { const [h, m] = hm(); $('#clk').textContent = h + ':' + p2(m); $('.lt').textContent = p2(h) + ':' + p2(m); }
setInterval(status, 1000);
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
  if (s === 'notes') return app('<div class="hd"><h1>메모</h1><p>메모 ' + D.notes.length + '개</p></div><div class="scroll">' + D.notes.map((n, i) => `<button class="row" data-go="note" data-a="${i}"><span class="mid"><div class="nm">${n.t}</div><div class="sn" style="color:#8f979f">${n.b.split('\n')[0]}</div></span><span class="dt">${n.d}</span></button>`).join('') + '</div>');
  if (s === 'note') { const n = D.notes[arg]; return app(`<button class="back" data-go="notes">‹ 메모</button><div class="scroll" style="padding:14px 22px"><div class="when" style="margin:0 0 10px">${n.d}</div><h2 style="font-size:22px;margin-bottom:14px">${n.t}</h2><p style="white-space:pre-wrap;font-size:16px;line-height:1.65;color:#e4e7ea">${n.b}</p></div>`); }
  if (s === 'cal') return app('<div class="hd"><h1>일정</h1><p>2026년 11월 14일 토요일</p></div><div class="scroll">' + D.cal.map((g) => `<div class="sec">${g.d}${g.l ? ' · ' + g.l : ''}</div>` + g.e.map(([t, n, r]) => `<div class="row" style="align-items:center"><span class="bar"></span><span class="mid"><div class="nm">${n}</div><div class="sn" style="color:#8f979f">${t}${r ? ' · ' + r : ''}</div></span></div>`).join('')).join('') + '</div>');
  if (s === 'clock') return app('<div class="hd"><h1>알람</h1></div><div class="scroll">' + D.alarms.map(([t, n, r, on]) => `<div class="row" style="align-items:center"><span class="mid"><div style="font-size:44px;font-weight:300;color:${on ? '#fff' : '#6b7178'}">${t}</div><div class="sn" style="color:#8f979f">${n}, ${r}</div></span><button class="tg ${on ? 'on' : ''}" data-tg><i></i></button></div>`).join('') + '</div>');
  if (s === 'maps') return app('<div class="hd"><h1>지도</h1><p>즐겨찾는 장소</p></div><div class="scroll">' + D.places.map(([n, d]) => `<div class="row" style="align-items:center"><span class="av" style="background:#3a9187">📍</span><span class="mid"><div class="nm">${n}</div><div class="sn" style="color:#8f979f">${d}</div></span></div>`).join('') + '</div>');
  if (s === 'msgs') return app(`<div class="mh"><span>편집</span><button class="cmp"><svg viewBox="0 0 24 24"><path d="M12 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-6M18 3.500a2 2 0 112.800 2.800L12 15l-4 1 1-4z"/></svg></button></div><div class="hd" style="padding-top:2px"><h1>메시지</h1></div><div class="srch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.500"/><path d="M16 16l4 4"/></svg>검색</div><div class="scroll">` + THREADS.map((x, i) => `<button class="mrow" data-go="thread" data-a="${i}"><span class="ud">${x.m[x.m.length - 1][2] ? '' : '<b></b>'}</span><span class="av">${x.n[0]}</span><span class="mid"><span class="mt"><span class="nm">${x.n}</span><span class="dt">${x.d} ›</span></span><div class="sn2">${x.t}</div></span></button>`).join('') + '</div>');
  if (s === 'thread') { const x = THREADS[arg]; return app(`<div class="th"><button class="back" data-go="msgs">‹</button><div class="tc"><span class="av">${x.n[0]}</span><div>${x.n} ›</div></div></div><div class="scroll tbody">` + x.m.map((m) => `<div class="when">${m[0]}</div><div class="bubble ${m[2] ? 'me' : 'in'}">${m[1]}</div>`).join('') + '</div><div class="comp"><span class="plus">+</span><span class="fld">문자 메시지<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg></span></div>'); }
  if (s === 'mail') return app(`<div class="hd"><h1>받은편지함</h1><p>읽지 않음 1</p></div><div class="scroll"><button class="mail" data-go="mailview"><div style="display:flex;justify-content:space-between"><b><span class="dot"></span>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><div class="t">정치인 민현주 후견금 집행 내역 문서</div><div class="s">${MAIL_BODY}</div><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></button><div class="sec" style="color:#5f666d">이전 메일 없음</div></div>`);
  if (s === 'mailview') return app(`<button class="back" data-go="mail">‹ 받은편지함</button><div class="scroll" style="padding:16px 20px"><div style="display:flex;justify-content:space-between"><b>재무 실장</b><span class="dt">10월 23일 오후 11:18</span></div><h2 style="font-size:19px;margin:14px 0">정치인 민현주 후견금 집행 내역 문서</h2><p style="font-size:15px;line-height:1.6;color:#d5d9dd">${MAIL_BODY}</p><div class="att"><span class="hw">HWPX</span><span>${ATT}</span></div></div>`);
  if (s === 'calls' || s === 'call' || s === 'dialing') return phone(s, arg);
  if (s === 'gallery') return app(`<div class="hd"><h1>갤러리</h1><p>청년부 앨범</p><p style="color:#fff;font-size:13px">즐겨찾기 ${D.photos.filter((p) => p.fav).length} · 청년부 2,184</p></div><div class="scroll"><div class="gal">` + D.photos.map((p, i) => `<button data-view="${i}"><img src="${p.src}" alt="">${p.fav ? '<span class="heart">♥</span>' : ''}</button>`).join('') + '</div></div>');
}

let vi = 0, lastPt = '', sx = 0;
function openViewer(i) {
  vi = i; const p = D.photos[i], nm = 'IMG_' + String(i + 1).padStart(4, '0') + '_' + p.name + '.JPG';
  $('#viewer').innerHTML = `<button>‹ 갤러리</button><img src="${p.src}" alt=""><div class="info"><b>${nm}</b><span>${p.fav ? '<i class="fv">♥</i> 즐겨찾기 · ' : ''}청년부 앨범</span></div>`;
  layers('viewer');
}
const stepViewer = (d) => { const n = vi + d; if (n >= 0 && n < D.photos.length) openViewer(n); };
document.addEventListener('pointerdown', (e) => (lastPt = e.pointerType), true);
$('#viewer').addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
$('#viewer').addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) stepViewer(dx < 0 ? 1 : -1); });
document.addEventListener('click', (e) => {
  if (e.target.matches('#viewer img')) { if (lastPt === 'mouse') { const r = e.target.getBoundingClientRect(); stepViewer(e.clientX < r.left + r.width / 2 ? -1 : 1); } return; }
  const t = e.target.closest('[data-go],[data-tg],[data-k],[data-bs],[data-call],[data-end],[data-dial],[data-seg],[data-view],#fp,#hind,#viewer button,#pcancel');
  if (t && t.id === 'pcancel') return go('lock');
  if (t && (t.dataset.k !== undefined || t.dataset.bs !== undefined)) { if (t.dataset.k !== undefined) dtmf(t.dataset.k); dial = t.dataset.bs !== undefined ? dial.slice(0, -1) : (dial + t.dataset.k).slice(0, 15); $('#num').textContent = dial; document.querySelector('.add').textContent = dial ? '번호 추가' : ''; return; }
  if (t && t.dataset.call !== undefined) return dial && startCall(dial, 'key');
  if (t && t.dataset.end !== undefined) return endCall();
  if (t && t.dataset.dial !== undefined) return startCall(t.dataset.dial, 'rec');
  if (t && t.dataset.seg !== undefined) { callSeg = t.dataset.seg; return go('calls', 'rec'); }
  if (t && t.dataset.tg !== undefined) return t.classList.toggle('on');
  if (!t) return;
  if (t.id === 'fp') { layers('pass'); $('#pw').focus(); return; }
  if (t.id === 'hind') return cur === 'lock' ? 0 : go('home');
  if (t.dataset.view !== undefined) return openViewer(+t.dataset.view);
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
