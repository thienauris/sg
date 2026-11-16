(function () {
  const $ = (id) => document.getElementById(id);
  const PLACES = window.PLACES_DATA || [];
  const state = { type: "cafe", districts: new Set(), purpose: "work", list: [], idx: 0 };

  const PURPOSE = {
    work: { label: "Làm việc", key: "work" },
    chill: { label: "Chill / hẹn hò", key: "chill" },
    taste: { label: "Đồ uống / món ngon", key: "taste" }
  };
  const GRADS = [
    ["#2D5A40", "#5B8C6E"], ["#6B4A3A", "#B07D5B"], ["#3B4C6B", "#6D86B0"],
    ["#7A3E48", "#C0727E"], ["#4A5A2D", "#8AA05B"], ["#5A3D6B", "#9474AE"]
  ];
  const EMOJI = { cafe: ["☕", "🫖", "🥐", "🧋"], food: ["🍜", "🍲", "🍣", "🥢"] };

  const fmt = (n) => n.toLocaleString("vi-VN");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- quiz ----------
  function single(groupId, key) {
    $(groupId).addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]");
      if (!b) return;
      [...$(groupId).children].forEach((x) => x.classList.toggle("on", x === b));
      state[key] = b.dataset.v;
      updateFoot();
    });
  }
  single("type", "type");
  single("purpose", "purpose");

  $("districts").addEventListener("click", (e) => {
    const b = e.target.closest("[data-v]");
    if (!b) return;
    const v = b.dataset.v;
    state.districts.has(v) ? state.districts.delete(v) : state.districts.add(v);
    b.classList.toggle("on", state.districts.has(v));
    const n = state.districts.size;
    $("dcount").textContent = n ? "Đã chọn " + n + " khu" : "Tất cả 5 khu";
    updateFoot();
  });

  function pick() {
    const k = state.purpose;
    return PLACES
      .filter((p) => p.type === state.type && (!state.districts.size || state.districts.has(p.district)))
      .map((p) => ({ p, s: p.gu[k] * 10 + p.rating * 4 + Math.log10(p.reviews) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 10)
      .map((x) => x.p);
  }

  function updateFoot() {
    const n = pick().length;
    $("foot").textContent = n
      ? "Có " + n + " quán hợp gu · số sao & review Google Maps ngày " + window.CHECKED_AT
      : "Chưa có quán nào khớp – thử chọn thêm khu khác nhé";
    $("go").disabled = !n;
  }

  // ---------- results ----------
  function cardHTML(p, i) {
    const g = GRADS[i % GRADS.length];
    const em = EMOJI[p.type][i % 4];
    const k = state.purpose;
    const rows = [["work", "Làm việc"], ["chill", "Chill / hẹn"], ["taste", p.type === "cafe" ? "Đồ uống" : "Món ăn"]];
    const bars = rows.map(([key, lb]) =>
      '<div class="bar' + (key === k ? " hl" : "") + '"><span>' + lb + '</span><div class="t"><div style="width:' + p.gu[key] * 10 + '%"></div></div><b>' + p.gu[key] + "</b></div>"
    ).join("");
    return (
      '<article class="card" data-i="' + i + '">' +
        '<div class="hero" style="background:linear-gradient(135deg,' + g[0] + "," + g[1] + ')">' +
          '<span class="rank">#' + (i + 1) + " hợp gu " + PURPOSE[k].label.toLowerCase() + "</span>" +
          '<span class="emoji">' + em + "</span>" +
          "<div><h2>" + esc(p.name) + '</h2><div class="cat">' + esc(p.cat) + " · " + esc(p.district) + "</div></div>" +
        "</div>" +
        '<div class="body">' +
          '<div class="gg"><span class="stars"><i>★</i>' + p.rating.toFixed(1) + '</span><span class="rev">' + fmt(p.reviews) + ' đánh giá Google</span><span class="open">● Đang hoạt động</span></div>' +
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
    $("count").textContent = "1 / " + L.length;
    $("sub").textContent = (state.type === "cafe" ? "Cà phê" : "Quán ăn") + " · " + PURPOSE[state.purpose].label + " · " + (state.districts.size ? [...state.districts].join(", ") : "Mọi khu");
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

  updateFoot();
})();
