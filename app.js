(function () {
  const $ = (id) => document.getElementById(id);
  const PLACES = window.PLACES_DATA || [];
  const DISTRICTS = window.DISTRICTS || [];
  const DISHES = window.DISHES || [];
  const state = { type: "cafe", districts: new Set(), dishes: new Set(), purpose: "work", list: [], idx: 0, hist: [] };

  const PURPOSES = {
    cafe: [["work", "💻", "Làm việc", "Yên, ngồi lâu"], ["chill", "💞", "Chill / hẹn", "Đẹp, thư giãn"], ["taste", "☕", "Đồ uống ngon", "Vị là trên hết"]],
    food: [["taste", "😋", "Ngon nhất", "Điểm Google cao"], ["chill", "🥂", "Hẹn hò / đi nhóm", "Không gian ổn"], ["popular", "🔥", "Đông khách", "Review nhiều nhất"]]
  };
  const PLABEL = { work: "làm việc", chill: "chill / hẹn hò", taste: "ngon", popular: "đông khách" };
  const GRADS = [["#2D5A40", "#5B8C6E"], ["#6B4A3A", "#B07D5B"], ["#3B4C6B", "#6D86B0"], ["#7A3E48", "#C0727E"], ["#4A5A2D", "#8AA05B"], ["#5A3D6B", "#9474AE"]];
  const EMOJI = { cafe: ["☕", "🫖", "🥐", "🧋"], food: ["🍜", "🍲", "🍚", "🥢"] };

  const fmt = (n) => n.toLocaleString("vi-VN");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // điểm Google "đáng tin": kéo quán ít review về mức trung bình
  const trust = (p) => (p.rating * p.reviews + 4.3 * 300) / (p.reviews + 300);

  // ---------- quán đã quẹt: lưu trên máy, đồng bộ lên tài khoản khi đăng nhập ----------
  const LS = "laka_swipes";
  let SW = {};
  try { SW = JSON.parse(localStorage.getItem(LS) || "{}"); } catch (_) {}
  const BY = {};
  PLACES.forEach((p) => (BY[p.pid] = p));
  const saveLocal = () => { try { localStorage.setItem(LS, JSON.stringify(SW)); } catch (_) {} };
  function setSwipe(pid, a) {
    if (a) SW[pid] = { a, t: Date.now() }; else delete SW[pid];
    saveLocal();
    Cloud.push(pid, a);
    refreshCounts();
  }

  // ---------- chips ----------
  $("districts").innerHTML = DISTRICTS.map((d) => '<button class="chip" data-v="' + esc(d) + '">' + esc(d) + "</button>").join("");

  function renderPurpose() {
    const opts = PURPOSES[state.type];
    if (!opts.some((o) => o[0] === state.purpose)) state.purpose = opts[0][0];
    $("purpose").innerHTML = opts.map((o) =>
      '<button class="opt' + (o[0] === state.purpose ? " on" : "") + '" data-v="' + o[0] + '"><span class="e">' + o[1] + "</span><b>" + o[2] + "</b><span>" + o[3] + "</span></button>"
    ).join("");
  }

  function inDistricts(p) { return !state.districts.size || state.districts.has(p.district); }

  function renderDishes() {
    const counts = {};
    PLACES.forEach((p) => { if (p.type === "food" && inDistricts(p)) p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)); });
    [...state.dishes].forEach((t) => { if (!counts[t]) state.dishes.delete(t); });
    $("dishes").innerHTML = DISHES.filter((t) => counts[t]).map((t) =>
      '<button class="chip' + (state.dishes.has(t) ? " on" : "") + '" data-v="' + esc(t) + '">' + esc(t) + "<small>" + counts[t] + "</small></button>"
    ).join("");
    $("fcount").textContent = state.dishes.size ? "Đã chọn " + state.dishes.size + " món" : "Tất cả món · vuốt ngang ⇆";
  }

  $("type").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    [...$("type").children].forEach((x) => x.classList.toggle("on", x === b));
    state.type = b.dataset.v;
    $("dish-sec").classList.toggle("hidden", state.type !== "food");
    renderPurpose();
    updateFoot();
  });
  $("purpose").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    [...$("purpose").children].forEach((x) => x.classList.toggle("on", x === b));
    state.purpose = b.dataset.v;
    updateFoot();
  });
  $("districts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    const v = b.dataset.v;
    state.districts.has(v) ? state.districts.delete(v) : state.districts.add(v);
    b.classList.toggle("on", state.districts.has(v));
    $("dcount").textContent = state.districts.size ? "Đã chọn " + state.districts.size + " quận" : "Tất cả quận · vuốt ngang ⇆";
    renderDishes();
    updateFoot();
  });
  $("dishes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    const v = b.dataset.v;
    state.dishes.has(v) ? state.dishes.delete(v) : state.dishes.add(v);
    b.classList.toggle("on", state.dishes.has(v));
    $("fcount").textContent = state.dishes.size ? "Đã chọn " + state.dishes.size + " món" : "Tất cả món · vuốt ngang ⇆";
    updateFoot();
  });

  function score(p) {
    const k = state.purpose;
    if (k === "popular") return Math.log10(p.reviews) * 10 + p.rating;
    if (k === "taste" && p.type === "food") return trust(p) * 20 + p.gu.taste;
    return p.gu[k] * 10 + trust(p) * 4;
  }

  // quán anh đã quẹt (thích, đi rồi, không thích) không hiện lại
  function pick() {
    return PLACES
      .filter((p) => p.type === state.type && inDistricts(p) && !SW[p.pid] &&
        (state.type !== "food" || !state.dishes.size || p.tags.some((t) => state.dishes.has(t))))
      .map((p) => ({ p, s: score(p) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((x) => x.p);
  }

  function updateFoot() {
    const n = pick().length;
    const hid = Object.keys(SW).length;
    $("foot").textContent = n
      ? "Có " + n + (n === 40 ? "+" : "") + " quán hợp gu" + (hid ? " (đã ẩn " + hid + " quán anh quẹt rồi)" : "") + " · số liệu Google Maps " + window.CHECKED_AT
      : "Chưa có quán nào khớp – thử chọn thêm quận hoặc món khác nhé";
    $("go").disabled = !n;
  }

  // ---------- results: quẹt kiểu Tinder ----------
  function cardHTML(p, i) {
    const g = GRADS[i % GRADS.length];
    const em = EMOJI[p.type][i % 4];
    const k = state.purpose;
    const rows = p.type === "cafe"
      ? [["work", "Làm việc"], ["chill", "Chill / hẹn"], ["taste", "Đồ uống"]]
      : [["taste", "Độ ngon"], ["chill", "Không gian"]];
    const bars = rows.map(([key, lb]) =>
      '<div class="bar' + (key === k ? " hl" : "") + '"><span>' + lb + '</span><div class="t"><div style="width:' + p.gu[key] * 10 + '%"></div></div><b>' + p.gu[key] + "</b></div>"
    ).join("");
    const shown = state.dishes.size ? p.tags.filter((t) => state.dishes.has(t)).concat(p.tags.filter((t) => !state.dishes.has(t))) : p.tags;
    const tags = p.type === "food" && shown.length ? '<div class="tags">' + shown.slice(0, 5).map((t) => "<span>" + esc(t) + "</span>").join("") + "</div>" : "";
    return (
      '<article class="card" data-i="' + i + '">' +
        '<div class="hero" style="background:linear-gradient(135deg,' + g[0] + "," + g[1] + ')">' +
          '<span class="rank">#' + (i + 1) + " " + PLABEL[k] + "</span>" +
          '<span class="emoji">' + em + "</span>" +
          "<div><h2>" + esc(p.name) + '</h2><div class="cat">' + esc(p.cat) + " · " + esc(p.district) + "</div></div>" +
        "</div>" +
        '<div class="body">' +
          '<div class="gg"><span class="stars"><i>★</i>' + p.rating.toFixed(1) + '</span><span class="rev">' + fmt(p.reviews) + ' đánh giá Google</span><span class="open">● Đang hoạt động</span></div>' +
          tags +
          '<div class="verdict"><b>LakaSG phán</b>' + esc(p.verdict) + "</div>" +
          '<div class="bars">' + bars + "</div>" +
          '<div class="addr">📍 ' + esc(p.address) + "</div>" +
          '<div class="acts"><a class="btn s" target="_blank" rel="noopener" href="' + p.mapsUrl + '">Xem ảnh & review</a>' +
          '<a class="btn p" target="_blank" rel="noopener" href="' + p.dirUrl + '">Chỉ đường →</a></div>' +
        "</div>" +
      "</article>"
    );
  }

  const STAMPS = '<div class="stamp like">MUỐN ĐI</div><div class="stamp nope">KHÔNG THÍCH</div><div class="stamp been">ĐI RỒI</div>';

  function showResults() {
    state.list = pick();
    state.idx = 0;
    state.hist = [];
    show("results");
    renderStack();
  }

  function resultsTitle() {
    const what = state.type === "cafe" ? "Cà phê" : (state.dishes.size ? [...state.dishes].join(", ") : "Quán ăn");
    $("sub").textContent = what + " · " + (state.districts.size ? [...state.districts].join(", ") : "Mọi quận");
  }

  function renderStack() {
    const L = state.list, i = state.idx, d = $("deck");
    $("sw-undo").disabled = !state.hist.length;
    ["sw-nope", "sw-been", "sw-like"].forEach((id) => ($(id).disabled = i >= L.length));
    $("count").innerHTML = i < L.length ? "Quán <b>" + (i + 1) + "</b> / " + L.length : "Hết quán";
    const n = Object.values(SW).filter((x) => x.a === "like").length;
    $("rinfo").textContent = n ? "♥ " + n + " quán muốn đi" : "";
    if (i >= L.length) {
      d.innerHTML = '<div class="done"><b>🎉</b>' + (L.length ? "Anh đã quẹt hết quán hợp gu này rồi." : "Chưa có quán mới khớp gu này.") +
        '<button class="btn p" id="d-again">Chọn gu khác</button><button class="btn s" id="d-mine">Xem quán của anh ♥</button></div>';
      $("d-again").onclick = () => show("quiz");
      $("d-mine").onclick = () => show("mine");
      return;
    }
    d.innerHTML = state.list.slice(i, i + 3).map((p, k) => cardHTML(p, i + k)).reverse().join("");
    const arr = [...d.children];
    arr.forEach((c, k) => {
      const depth = arr.length - 1 - k;
      c.style.zIndex = 10 - depth;
      if (depth) { c.style.transform = "translateY(" + depth * 10 + "px) scale(" + (1 - depth * 0.04) + ")"; c.style.pointerEvents = "none"; }
    });
    const top = d.lastElementChild;
    top.insertAdjacentHTML("afterbegin", STAMPS);
    drag(top);
  }

  function stamp(c, dx, dy) {
    const s = c.querySelectorAll(".stamp");
    if (!s.length) return;
    const up = dy < -40 && Math.abs(dy) > Math.abs(dx);
    s[0].style.opacity = !up && dx > 0 ? Math.min(1, dx / 100) : 0;
    s[1].style.opacity = !up && dx < 0 ? Math.min(1, -dx / 100) : 0;
    s[2].style.opacity = up ? Math.min(1, -dy / 110) : 0;
  }

  function drag(c) {
    let sx = 0, sy = 0, dx = 0, dy = 0, id = null, moved = false;
    c.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0; moved = false;
      c.style.transition = "none";
    });
    c.addEventListener("pointermove", (e) => {
      if (e.pointerId !== id) return;
      dx = e.clientX - sx; dy = e.clientY - sy;
      if (!moved && Math.hypot(dx, dy) > 8) { moved = true; try { c.setPointerCapture(id); } catch (_) {} }
      if (moved) { c.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + dx / 18 + "deg)"; stamp(c, dx, dy); }
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      if (!moved) return;
      const up = dy < -110 && Math.abs(dy) > Math.abs(dx);
      const a = up ? "been" : dx > 100 ? "like" : dx < -100 ? "nope" : null;
      if (a) fly(a, c, dx, dy);
      else { c.style.transition = "transform .25s"; c.style.transform = ""; stamp(c, 0, 0); }
    };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
    // vừa kéo xong thì không tính là bấm link
    c.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  }

  let busy = false;
  function fly(a, c, dx, dy) {
    c = c || $("deck").lastElementChild;
    const p = state.list[state.idx];
    if (busy || !c || !p || !c.classList.contains("card")) return;
    busy = true;
    const W = window.innerWidth * 1.4;
    const to = a === "like" ? [W, dy || 0] : a === "nope" ? [-W, dy || 0] : [dx || 0, -window.innerHeight * 1.2];
    stamp(c, a === "like" ? 200 : a === "nope" ? -200 : 0, a === "been" ? -200 : 0);
    c.style.transition = "transform .3s ease-in";
    c.style.transform = "translate(" + to[0] + "px," + to[1] + "px) rotate(" + (a === "been" ? 0 : to[0] / 40) + "deg)";
    setSwipe(p.pid, a);
    state.hist.push(p.pid);
    state.idx++;
    setTimeout(() => { busy = false; renderStack(); }, 260);
  }

  function undo() {
    if (busy || !state.hist.length) return;
    setSwipe(state.hist.pop(), null);
    state.idx--;
    renderStack();
  }
  $("sw-nope").onclick = () => fly("nope");
  $("sw-been").onclick = () => fly("been");
  $("sw-like").onclick = () => fly("like");
  $("sw-undo").onclick = undo;

  // ---------- điều hướng ----------
  let cur = "quiz", prev = "quiz";
  function show(id) {
    if (id !== cur) prev = cur;
    cur = id;
    ["quiz", "results", "mine"].forEach((x) => $(x).classList.toggle("hidden", x !== id));
    $("btn-back").classList.toggle("hidden", id === "quiz");
    $("logo").classList.toggle("hidden", id !== "quiz");
    if (id === "quiz") { $("sub").textContent = "Phán quán Sài Gòn theo gu của anh"; updateFoot(); }
    if (id === "results") resultsTitle();
    if (id === "mine") { $("sub").textContent = "Quán của anh"; renderMine(); renderAcct(); }
  }
  function back() {
    if (cur === "mine" && prev === "results") { show("results"); prev = "quiz"; renderStack(); }
    else show("quiz");
  }

  // ---------- màn "quán của anh" ----------
  let lt = "like";
  const LT = { like: "Chưa có quán nào. Quẹt phải ♥ quán anh muốn đi nhé.", been: "Quẹt lên ✓ những quán anh đi rồi.", nope: "Quẹt trái ✕ quán anh không thích." };
  const LN = { like: "♥ Muốn đi", been: "✓ Đi rồi", nope: "✕ Đã bỏ" };
  function refreshCounts() {
    const c = { like: 0, been: 0, nope: 0 };
    Object.values(SW).forEach((x) => { if (c[x.a] !== undefined) c[x.a]++; });
    $("me-n").textContent = c.like;
    $("me-n").classList.toggle("hidden", !c.like);
    [...$("lseg").children].forEach((b) => (b.textContent = LN[b.dataset.v] + " " + c[b.dataset.v]));
  }
  function renderMine() {
    refreshCounts();
    [...$("lseg").children].forEach((b) => b.classList.toggle("on", b.dataset.v === lt));
    const L = Object.entries(SW).filter(([pid, x]) => x.a === lt && BY[pid]).sort((a, b) => b[1].t - a[1].t).map(([pid]) => BY[pid]);
    $("mylist").innerHTML = L.length ? L.map((p) =>
      '<div class="it"><div class="n"><b>' + esc(p.name) + "</b><span>★" + p.rating.toFixed(1) + " · " + esc(p.district) + " · " + (p.type === "cafe" ? "Cà phê" : esc(p.tags[0] || "Quán ăn")) + "</span></div>" +
      (lt === "like" ? '<button data-a="been" data-p="' + p.pid + '">✓ Đi rồi</button>' : "") +
      '<button data-a="" data-p="' + p.pid + '" title="Bỏ khỏi danh sách, quán sẽ hiện lại khi quẹt">↺</button>' +
      '<a target="_blank" rel="noopener" href="' + p.dirUrl + '">Đi →</a></div>'
    ).join("") : '<div class="empty">' + LT[lt] + "</div>";
  }
  $("lseg").addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { lt = b.dataset.v; renderMine(); } });
  $("mylist").addEventListener("click", (e) => { const b = e.target.closest("button[data-p]"); if (b) { setSwipe(b.dataset.p, b.dataset.a || null); renderMine(); } });
  $("btn-me").onclick = () => (cur === "mine" ? back() : show("mine"));

  // ---------- tài khoản (Supabase) ----------
  const Cloud = (() => {
    const cfg = window.LAKA_CLOUD || {};
    let sb = null;
    try { if (cfg.url && cfg.key && window.supabase) sb = window.supabase.createClient(cfg.url, cfg.key); } catch (_) {}
    let user = null;
    async function sync() {
      const { data, error } = await sb.from("swipes").select("pid,action,updated_at");
      if (error) throw error;
      const remote = {};
      data.forEach((r) => (remote[r.pid] = { a: r.action, t: Date.parse(r.updated_at) }));
      const up = [];
      for (const pid in SW) if (!remote[pid] || remote[pid].t < SW[pid].t) up.push({ pid, action: SW[pid].a, updated_at: new Date(SW[pid].t).toISOString() });
      for (const pid in remote) if (!SW[pid] || SW[pid].t < remote[pid].t) SW[pid] = remote[pid];
      if (up.length) { const r = await sb.from("swipes").upsert(up); if (r.error) throw r.error; }
      saveLocal();
      refreshCounts();
      if (cur === "mine") renderMine();
      if (cur === "quiz") updateFoot();
    }
    if (sb) sb.auth.onAuthStateChange((_ev, session) => {
      const was = user && user.id;
      user = session ? session.user : null;
      if (user && user.id !== was) setTimeout(() => sync().catch(() => {}), 0);
      if (cur === "mine") renderAcct();
    });
    return {
      on: !!sb,
      user: () => user,
      push(pid, a) {
        if (!sb || !user) return;
        (a ? sb.from("swipes").upsert({ pid, action: a, updated_at: new Date().toISOString() }) : sb.from("swipes").delete().eq("pid", pid)).then(() => {}, () => {});
      },
      signIn: (email, password) => sb.auth.signInWithPassword({ email, password }),
      signUp: (email, password) => sb.auth.signUp({ email, password }),
      async signOut() {
        await sb.auth.signOut();
        user = null; SW = {}; saveLocal();
        refreshCounts(); renderMine(); renderAcct();
      },
    };
  })();

  function renderAcct() {
    const u = Cloud.user();
    if (!Cloud.on) { $("acct").innerHTML = "<h3>Tài khoản</h3><p>Danh sách đang lưu trên máy này.</p>"; return; }
    if (u) {
      $("acct").innerHTML = '<div class="me"><div><h3>Chào anh 👋</h3><p>' + esc(u.email) + " · đã đồng bộ</p></div>" + '<button class="btn s" id="a-out">Đăng xuất</button></div>';
      $("a-out").onclick = () => Cloud.signOut();
      return;
    }
    $("acct").innerHTML = "<h3>Đăng nhập để giữ danh sách trên mọi máy</h3>" +
      '<form id="a-f"><input type="email" id="a-e" placeholder="Email" autocomplete="email" required>' +
      '<input type="password" id="a-p" placeholder="Mật khẩu (từ 6 ký tự)" autocomplete="current-password" minlength="6" required>' +
      '<div class="row"><button class="btn p" data-m="in">Đăng nhập</button><button class="btn s" data-m="up">Tạo tài khoản</button></div>' +
      '<div class="msg" id="a-m"></div></form>';
    let mode = "in";
    $("a-f").addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (b) mode = b.dataset.m; });
    $("a-f").addEventListener("submit", async (e) => {
      e.preventDefault();
      const m = $("a-m");
      m.className = "msg"; m.textContent = "Đang xử lý…";
      const email = $("a-e").value.trim(), pw = $("a-p").value;
      try {
        const { data, error } = mode === "up" ? await Cloud.signUp(email, pw) : await Cloud.signIn(email, pw);
        if (error) throw error;
        if (mode === "up" && !data.session) { m.className = "msg ok"; m.textContent = "Đã tạo tài khoản. Anh mở email xác nhận rồi đăng nhập nhé."; }
      } catch (err) {
        const t = String((err && err.message) || err);
        m.textContent = /Invalid login/i.test(t) ? "Sai email hoặc mật khẩu."
          : /already registered/i.test(t) ? "Email này đã có tài khoản, anh bấm Đăng nhập nhé."
          : /confirm/i.test(t) ? "Anh xác nhận email trước nhé."
          : "Lỗi: " + t;
      }
    });
  }

  $("go").addEventListener("click", showResults);
  $("btn-back").addEventListener("click", back);
  $("btn-share").addEventListener("click", async () => {
    const p = state.list[state.idx];
    const onResults = cur === "results" && p;
    const data = onResults
      ? { title: "LakaSG", text: p.name + " – ★" + p.rating + " (" + fmt(p.reviews) + " review Google). " + p.verdict, url: p.mapsUrl }
      : { title: "LakaSG", text: "Phán quán Sài Gòn theo gu", url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.text + " " + data.url); alert("Đã copy link!"); }
    } catch (_) {}
  });

  renderPurpose();
  renderDishes();
  refreshCounts();
  updateFoot();
})();
