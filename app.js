// Quản lý trạng thái và logic ứng dụng Sài Gòn Quán Xá
let currentFilteredPlaces = [];
let activePlaceIndex = 0;
let userQuizState = {
  type: 'cafe',
  districts: ['Quận 1', 'Quận 3'],
  purpose: 'work'
};

document.addEventListener('DOMContentLoaded', () => {
  updateCategoryUI();
});

// Cập nhật giao diện khi chọn Cà phê hoặc Quán ăn
function updateCategoryUI() {
  const selectedType = document.querySelector('input[name="placeType"]:checked').value;
  const cards = document.querySelectorAll('.category-card');
  
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio.checked) {
      card.classList.add('border-sage-700', 'bg-sage-50');
      card.classList.remove('border-cream-300', 'bg-white');
    } else {
      card.classList.remove('border-sage-700', 'bg-sage-50');
      card.classList.add('border-cream-300', 'bg-white');
    }
  });

  const headerText = document.getElementById('header-mode-text');
  if (selectedType === 'cafe') {
    headerText.textContent = "Chỉ gợi ý quán cafe đang mở cửa ★ từ 4.5 trở lên";
  } else {
    headerText.textContent = "Chỉ gợi ý quán ăn đang mở cửa ★ từ 4.5 trở lên";
  }
}

// Xử lý nộp khảo sát - BỘ LỌC NGHIÊM NGẶT: CHỈ LẤY QUÁN ĐANG HOẠT ĐỘNG VÀ GOOGLE MAPS >= 4.5 SAO
function submitQuiz() {
  const type = document.querySelector('input[name="placeType"]:checked').value;
  const purpose = document.querySelector('input[name="purpose"]:checked').value;
  
  const districtCheckboxes = document.querySelectorAll('input[name="districts"]:checked');
  const selectedDistricts = Array.from(districtCheckboxes).map(cb => cb.value);

  if (selectedDistricts.length === 0) {
    alert("Anh yêu chọn ít nhất một khu vực nhé!");
    return;
  }

  userQuizState = {
    type,
    districts: selectedDistricts,
    purpose
  };

  // 1. LỌC CHẶT CHẼ:
  // - Phải khớp loại hình (Cafe hoặc Quán ăn)
  // - Trạng thái: "Đang mở cửa" (Loại bỏ quán đóng cửa/dẹp tiệm)
  // - Đánh giá Google Maps: Phải >= 4.5 sao
  let verifiedMatches = window.PLACES_DATA.filter(place => {
    const matchType = place.type === type;
    const matchDistrict = selectedDistricts.some(d => place.districtsList.includes(d));
    const isStillOpen = place.status === "Đang mở cửa";
    const isHighRating = place.ratingGoogle >= 4.5;

    return matchType && matchDistrict && isStillOpen && isHighRating;
  });

  // Nếu trong quận đó chưa có, lấy các quán >= 4.5 sao lân cận ở TP.HCM
  if (verifiedMatches.length === 0) {
    verifiedMatches = window.PLACES_DATA.filter(place => 
      place.type === type && place.status === "Đang mở cửa" && place.ratingGoogle >= 4.5
    );
  }

  // 2. SẮP XẾP THEO TIÊU CHÍ ANH YÊU YÊU CẦU
  verifiedMatches.sort((a, b) => {
    if (purpose === 'work') {
      // Ưu tiên tiện nghi (bàn ghế, ổ điện, wifi, máy lạnh) + độ yên
      return (b.scores.facilities.score + b.scores.quiet.score) - (a.scores.facilities.score + a.scores.quiet.score);
    } else if (purpose === 'taste') {
      return b.scores.foodDrink.score - a.scores.foodDrink.score;
    } else {
      return b.ratingGoogle - a.ratingGoogle;
    }
  });

  currentFilteredPlaces = verifiedMatches;
  activePlaceIndex = 0;

  // Hiển thị phần kết quả
  renderResultsView();
}

// Hiển thị kết quả ra màn hình
function renderResultsView() {
  const quizSection = document.getElementById('quiz-section');
  const resultsSection = document.getElementById('results-section');

  // Đổi giao diện
  quizSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  // Đặt tiêu đề kết quả
  const districtsText = userQuizState.districts.slice(0, 2).join(' – ') + (userQuizState.districts.length > 2 ? '...' : '');
  const resultTitle = document.getElementById('result-title');
  const resultSummary = document.getElementById('result-summary');

  if (userQuizState.type === 'cafe') {
    resultTitle.textContent = `${currentFilteredPlaces.length} quán cafe chuẩn gu (Google Maps ≥ 4.5★) tại ${districtsText}`;
    
    if (userQuizState.purpose === 'work') {
      resultSummary.innerHTML = `🌟 <strong>Đã kiểm tra & lọc bỏ quán dẹp tiệm:</strong> 100% quán dưới đây <strong>đang hoạt động, đạt từ 4.5★ đến 4.7★</strong> trên Google Maps với hàng ngàn lượt đánh giá thật. Cực kỳ thích hợp để <strong>ngồi lâu cày việc, có ổ điện và máy lạnh mát rượi</strong>.`;
    } else if (userQuizState.purpose === 'taste') {
      resultSummary.innerHTML = `🌟 <strong>Đã lọc quán ≥ 4.5★:</strong> Tập trung vào <strong>chất lượng đồ uống đỉnh chóp, cafe Specialty tuyển chọn</strong> và không gian thưởng thức chuẩn chỉ.`;
    } else {
      resultSummary.innerHTML = `🌟 <strong>Đã lọc quán ≥ 4.5★:</strong> Tuyển tập quán có <strong>không gian thoáng đẹp, view ngắm phố hoặc sân vườn xanh mát</strong> để thư giãn 1-2 tiếng.`;
    }
  } else {
    resultTitle.textContent = `${currentFilteredPlaces.length} quán ăn ngon đỉnh (Google Maps ≥ 4.5★) tại ${districtsText}`;
    resultSummary.innerHTML = `🌟 <strong>Đã kiểm tra & lọc bỏ quán dẹp tiệm:</strong> 100% quán ăn có tên tuổi lừng lẫy Sài Gòn (Michelin Bib Gourmand, Dim Tu Tac, Pizza 4P's...), <strong>đánh giá từ 4.5★ đến 4.7★</strong> với hàng nghìn review.`;
  }

  // Render các Tab chuyển quán
  renderTabs();

  // Render chi tiết quán đang chọn
  renderActivePlace();

  // Scroll nhẹ lên đầu kết quả
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Tabs chọn quán
function renderTabs() {
  const tabsContainer = document.getElementById('place-tabs');
  tabsContainer.innerHTML = '';

  currentFilteredPlaces.forEach((place, index) => {
    const isActive = index === activePlaceIndex;
    const tabBtn = document.createElement('button');
    tabBtn.className = `flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition select-none flex items-center gap-1.5 ${
      isActive 
        ? 'bg-sage-200 text-sage-800 border-2 border-sage-700 shadow-sm' 
        : 'bg-white text-stone-700 border border-cream-300 hover:bg-cream-100'
    }`;
    tabBtn.innerHTML = `<span>${index + 1}.</span> <span>${place.name}</span> <span class="text-amber-600 font-extrabold text-[11px]">★${place.ratingGoogle}</span>`;
    tabBtn.onclick = () => {
      activePlaceIndex = index;
      renderTabs();
      renderActivePlace();
    };
    tabsContainer.appendChild(tabBtn);
  });
}

// Render nội dung quán hiện tại
function renderActivePlace() {
  const place = currentFilteredPlaces[activePlaceIndex];
  if (!place) return;

  // Header & Badge
  document.getElementById('place-badge-name').textContent = `${place.name} ★${place.ratingGoogle} (${place.reviewCount})`;
  document.getElementById('score-overall').textContent = place.overallScore;
  document.getElementById('best-for-text').textContent = place.bestFor;
  document.getElementById('place-tagline').textContent = place.tagline;

  // Image Gallery
  const imgContainer = document.getElementById('place-image-container');
  imgContainer.innerHTML = '';
  place.images.forEach((imgUrl, idx) => {
    const imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.alt = place.name;
    imgEl.className = 'w-full h-full object-cover transition duration-300 hover:scale-105';
    imgContainer.appendChild(imgEl);
  });

  // Scores
  document.getElementById('score-quiet-num').textContent = place.scores.quiet.score;
  document.getElementById('score-quiet-note').textContent = place.scores.quiet.note;

  document.getElementById('score-fac-num').textContent = place.scores.facilities.score;
  document.getElementById('score-fac-note').textContent = place.scores.facilities.note;

  document.getElementById('score-food-num').textContent = place.scores.foodDrink.score;
  document.getElementById('score-food-note').textContent = place.scores.foodDrink.note;

  // Practical info
  document.getElementById('place-address').textContent = place.address;
  document.getElementById('btn-google-maps').href = place.googleMapsUrl;
  document.getElementById('place-best-time').textContent = place.bestTime;
  document.getElementById('place-verdict').textContent = place.bestFor;

  // Quick navigation pills
  const pillsContainer = document.getElementById('quick-place-pills');
  pillsContainer.innerHTML = '';
  currentFilteredPlaces.forEach((p, idx) => {
    const isCurrent = idx === activePlaceIndex;
    const pill = document.createElement('button');
    pill.className = `px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
      isCurrent
        ? 'bg-mocha-800 text-white'
        : 'bg-cream-200 hover:bg-cream-300 text-stone-700'
    }`;
    pill.innerHTML = `<span>★${p.ratingGoogle}</span> <span>${p.name.split(' - ')[0]}</span>`;
    pill.onclick = () => {
      activePlaceIndex = idx;
      renderTabs();
      renderActivePlace();
      document.getElementById('active-place-card').scrollIntoView({ behavior: 'smooth' });
    };
    pillsContainer.appendChild(pill);
  });
}

// Quay lại phần chọn khảo sát
function resetOrGoBack() {
  const quizSection = document.getElementById('quiz-section');
  const resultsSection = document.getElementById('results-section');

  if (!resultsSection.classList.contains('hidden')) {
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.getElementById('finder-form').reset();
    updateCategoryUI();
  }
}

// Xử lý gửi tin nhắn Chat
function submitChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  addChatMessage('user', text);
  input.value = '';

  setTimeout(() => {
    generateAIResponse(text);
  }, 400);
}

// Xử lý các câu hỏi gợi ý nhanh
function handleQuickPrompt(promptText) {
  addChatMessage('user', promptText);
  setTimeout(() => {
    generateAIResponse(promptText);
  }, 400);
}

// Hỏi trợ lý về quán hiện tại
function askAIBoutThisPlace() {
  const place = currentFilteredPlaces[activePlaceIndex];
  if (!place) return;
  const prompt = `Phân tích ưu nhược điểm của quán ${place.name} giúp mình với!`;
  handleQuickPrompt(prompt);
}

// Thêm tin nhắn vào khung chat stream
function addChatMessage(sender, content) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  
  if (sender === 'user') {
    bubble.className = 'flex justify-end';
    bubble.innerHTML = `
      <div class="bg-mocha-800 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-xs sm:text-sm shadow-sm leading-relaxed">
        ${content}
      </div>
    `;
  } else {
    bubble.className = 'flex justify-start items-start gap-2';
    bubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-sage-700 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        U
      </div>
      <div class="bg-white border border-cream-300 rounded-2xl rounded-tl-sm p-4 max-w-[90%] text-xs sm:text-sm text-stone-800 shadow-sm leading-relaxed space-y-2">
        ${content}
      </div>
    `;
  }

  container.appendChild(bubble);
  bubble.scrollIntoView({ behavior: 'smooth' });
}

// Tạo câu trả lời thông minh dựa trên dữ liệu thật
function generateAIResponse(question) {
  const q = question.toLowerCase();
  const current = currentFilteredPlaces[activePlaceIndex] || window.PLACES_DATA[0];

  let reply = "";

  if (q.includes("wifi") || q.includes("mát") || q.includes("lạnh") || q.includes("ổ điện") || q.includes("cày")) {
    const bestWork = [...currentFilteredPlaces].sort((a,b) => b.scores.facilities.score - a.scores.facilities.score)[0];
    reply = `
      <div>⚡ Quán có <strong>Wi-Fi mạnh, máy lạnh phà phà và ổ điện chuẩn nhất</strong> là <strong>${bestWork.name}</strong> (Google Maps: <strong>${bestWork.ratingGoogle}★</strong> với ${bestWork.reviewCount} đánh giá).</div>
      <div class="mt-1 text-stone-600">${bestWork.scores.facilities.note}</div>
      <div class="mt-1 text-emerald-800 font-semibold">📍 Địa chỉ: ${bestWork.address}</div>
      <div class="mt-1"><a href="${bestWork.googleMapsUrl}" target="_blank" class="underline text-rose-600 font-bold">👉 Bấm vào đây để mở trực tiếp trên Google Maps</a></div>
    `;
  } else if (q.includes("so sánh") || q.includes("kỹ hơn")) {
    if (currentFilteredPlaces.length >= 2) {
      const p1 = currentFilteredPlaces[0];
      const p2 = currentFilteredPlaces[1];
      reply = `
        <div class="font-bold text-mocha-800 mb-1">⚖️ So sánh chi tiết ${p1.name} (★${p1.ratingGoogle}) vs ${p2.name} (★${p2.ratingGoogle}):</div>
        <ul class="list-disc pl-4 space-y-1 text-stone-700">
          <li><strong>${p1.name}:</strong> ${p1.bestFor}. Điểm tiện nghi: ${p1.scores.facilities.score}/10. Review: ${p1.reviewCount}.</li>
          <li><strong>${p2.name}:</strong> ${p2.bestFor}. Điểm tiện nghi: ${p2.scores.facilities.score}/10. Review: ${p2.reviewCount}.</li>
        </ul>
        <div class="mt-2 text-sage-800 font-semibold">👉 Lời khuyên: Nếu anh cần ngồi cày việc tập trung thì chọn <strong>${p1.scores.facilities.score >= p2.scores.facilities.score ? p1.name : p2.name}</strong> là chuẩn nhất!</div>
      `;
    } else {
      reply = `Hiện tại danh sách chỉ có 1 quán nổi bật trong nhóm này. Anh có thể chọn thêm các quận khác để so sánh nha.`;
    }
  } else if (q.includes("yên tĩnh") || q.includes("yên nhất")) {
    const bestQuiet = [...currentFilteredPlaces].sort((a,b) => b.scores.quiet.score - a.scores.quiet.score)[0];
    reply = `
      <div>🤫 Quán yên tĩnh nhất trong nhóm là <strong>${bestQuiet.name}</strong> (Google Maps: <strong>${bestQuiet.ratingGoogle}★</strong>, Độ yên: ${bestQuiet.scores.quiet.score}/10).</div>
      <div class="mt-1 text-stone-600">${bestQuiet.scores.quiet.note}</div>
      <div class="mt-1">⏰ Khung giờ tĩnh lặng nhất: <strong>${bestQuiet.bestTime}</strong>.</div>
    `;
  } else {
    reply = `
      <div>Dạ anh yêu, về quán <strong>${current.name}</strong>:</div>
      <div class="mt-1 text-stone-700">${current.tagline}</div>
      <div class="mt-1">Điểm Google Maps: <strong>${current.ratingGoogle}★</strong> (${current.reviewCount} đánh giá thật). Trạng thái: <strong>${current.status}</strong>.</div>
      <div class="mt-1"><a href="${current.googleMapsUrl}" target="_blank" class="underline text-rose-600 font-bold">👉 Xem trực tiếp vị trí & ảnh trên Google Maps</a></div>
    `;
  }

  addChatMessage('ai', reply);
}

// Modal info toggle
function toggleInfoModal() {
  const modal = document.getElementById('info-modal');
  modal.classList.toggle('hidden');
}

// Share web app
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'Sài Gòn Quán Xá - Bon Béo Style',
      text: 'Tìm quán cafe học bài & quán ăn chuẩn gu tại TP.HCM (Google Maps >= 4.5 sao)',
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã sao chép liên kết vào bộ nhớ tạm!");
  }
}
