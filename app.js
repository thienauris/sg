(function () {
  const $ = (id) => document.getElementById(id);
  const PLACES = window.PLACES_DATA || [];
  const DISTRICTS = window.DISTRICTS || [];
  const DISHES = window.DISHES || [];
  const state = { type: "cafe", districts: new Set(), dishes: new Set(), purpose: "work", list: [], idx: 0 };

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

  function pick() {
    return PLACES
      .filter((p) => p.type === state.type && inDistricts(p) &&
        (state.type !== "food" || !state.dishes.size || p.tags.some((t) => state.dishes.has(t))))
      .map((p) => ({ p, s: score(p) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 20)
      .map((x) => x.p);
  }

  function updateFoot() {
    const n = pick().length;
    $("foot").textContent = n
      ? "Có " + n + (n === 20 ? "+" : "") + " quán hợp gu · số sao & review Google Maps ngày " + window.CHECKED_AT
      : "Chưa có quán nào khớp – thử chọn thêm quận hoặc món khác nhé";
    $("go").disabled = !n;
  }

  // ---------- results ----------
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

  function showResults() {
    state.list = pick();
    state.idx = 0;
    const L = state.list;
    $("tabs").innerHTML = L.map((p, i) => '<button class="tab' + (i ? "" : " on") + '" data-i="' + i + '">' + (i + 1) + ". " + esc(p.name) + "</button>").join("");
    $("dots").innerHTML = L.map((_, i) => "<span" + (i ? "" : ' class="on"') + "></span>").join("");
    $("deck").innerHTML = L.length ? L.map(cardHTML).join("") : '<div class="empty">Chưa có quán khớp gu này.</div>';
    $("deck").scrollLeft = 0;
    $("tabs").scrollLeft = 0;
    $("count").textContent = "1 / " + L.length;
    const what = state.type === "cafe" ? "Cà phê" : (state.dishes.size ? [...state.dishes].join(", ") : "Quán ăn");
    $("sub").textContent = what + " · " + (state.districts.size ? [...state.districts].join(", ") : "Mọi quận");
    $("quiz").classList.add("hidden");
    $("results").classList.remove("hidden");
    $("btn-back").classList.remove("hidden");
    $("logo").classList.add("hidden");
  }

  function setActive(i) {
    if (i === state.idx) return;
    state.idx = i;
    [...$("tabs").children].forEach((t, j) => t.classList.toggle("on", j === i));
    [...$("dots").children].forEach((d, j) => d.classList.toggle("on", j === i));
    $("count").textContent = i + 1 + " / " + state.list.length;
    const t = $("tabs").children[i];
    if (t) $("tabs").scrollTo({ left: t.offsetLeft - $("tabs").clientWidth / 2 + t.offsetWidth / 2, behavior: "smooth" });
  }

  let raf = 0;
  $("deck").addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const d = $("deck");
      const w = d.firstElementChild ? d.firstElementChild.offsetWidth + 12 : d.clientWidth;
      setActive(Math.max(0, Math.min(state.list.length - 1, Math.round(d.scrollLeft / w))));
    });
  });
  $("tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-i]");
    if (!b) return;
    const c = $("deck").children[+b.dataset.i];
    if (c) $("deck").scrollTo({ left: c.offsetLeft - 14, behavior: "smooth" });
  });

  function back() {
    $("results").classList.add("hidden");
    $("quiz").classList.remove("hidden");
    $("btn-back").classList.add("hidden");
    $("logo").classList.remove("hidden");
    $("sub").textContent = "Phán quán Sài Gòn theo gu của anh";
  }

  $("go").addEventListener("click", showResults);
  $("btn-back").addEventListener("click", back);
  $("btn-share").addEventListener("click", async () => {
    const p = state.list[state.idx];
    const onResults = !$("results").classList.contains("hidden") && p;
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
  updateFoot();
})();
