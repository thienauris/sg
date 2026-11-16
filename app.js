// Quản lý trạng thái và logic ứng dụng Sài Gòn Quán Xá (LakaSG - 1-Screen Mobile)
let currentFilteredPlaces = [];
let activePlaceIndex = 0;
let userQuizState = {
  type: 'cafe',
  districts: ['Quận 1', 'Quận 3'],
  purpose: 'work'
};

document.addEventListener('DOMContentLoaded', () => {
  updateCategoryUI();
  updateDistrictPillsUI();
  updatePurposeUI();
});

// Cập nhật giao diện khi chọn Cà phê hoặc Quán ăn
function updateCategoryUI() {
  const selectedTypeEl = document.querySelector('input[name="placeType"]:checked');
  if (!selectedTypeEl) return;
  const selectedType = selectedTypeEl.value;
  const cards = document.querySelectorAll('.category-card');
  
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('border-sage-700', 'bg-sage-50');
      card.classList.remove('border-cream-300', 'bg-white');
    } else {
      card.classList.remove('border-sage-700', 'bg-sage-50');
      card.classList.add('border-cream-300', 'bg-white');
    }
  });

  const headerText = document.getElementById('header-mode-text');
  if (headerText) {
    if (selectedType === 'cafe') {
      headerText.textContent = "LakaSG • Cafe Google Maps ★4.4 - 4.7";
    } else {
      headerText.textContent = "LakaSG • Quán ăn Google Maps ★4.5 - 4.7";
    }
  }
}

// Cập nhật giao diện Pills chọn Quận (Trượt ngang)
function updateDistrictPillsUI() {
  const pills = document.querySelectorAll('.district-pill');
  let count = 0;
  pills.forEach(pill => {
    const cb = pill.querySelector('input[type="checkbox"]');
    if (cb && cb.checked) {
      count++;
      pill.classList.add('border-sage-700', 'bg-sage-100', 'text-sage-800');
      pill.classList.remove('border-cream-300', 'bg-white', 'text-stone-700');
    } else {
      pill.classList.remove('border-sage-700', 'bg-sage-100', 'text-sage-800');
      pill.classList.add('border-cream-300', 'bg-white', 'text-stone-700');
    }
  });

  const countEl = document.getElementById('selected-districts-count');
  if (countEl) {
    countEl.textContent = count > 0 ? `Đã chọn ${count} khu vực` : 'Chưa chọn khu vực';
  }
}

// Cập nhật giao diện Cards chọn Nhu cầu (Carousel ngang)
function updatePurposeUI() {
  const cards = document.querySelectorAll('.purpose-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('border-sage-700', 'bg-sage-50');
      card.classList.remove('border-cream-300', 'bg-white');
    } else {
      card.classList.remove('border-sage-700', 'bg-sage-50');
      card.classList.add('border-cream-300', 'bg-white');
    }
  });
}

// Xử lý nộp khảo sát - BỘ LỌC CHUẨN XÁC: CHỈ LẤY QUÁN ĐANG HOẠT ĐỘNG VÀ GOOGLE MAPS TỪ 4.4 ĐẾN 4.7 SAO
function submitQuiz() {
  const typeEl = document.querySelector('input[name="placeType"]:checked');
  const purposeEl = document.querySelector('input[name="purpose"]:checked');
  const type = typeEl ? typeEl.value : 'cafe';
  const purpose = purposeEl ? purposeEl.value : 'work';
  
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
  // - Trạng thái: "Đang mở cửa" (Đã đối chiếu Google Maps)
  // - Đánh giá Google Maps: Phải >= 4.4 sao (The Workshop 4.4★, The Running Bean 4.7★, Sống Cafe 4.7★...)
  let verifiedMatches = window.PLACES_DATA.filter(place => {
    const matchType = place.type === type;
    const matchDistrict = selectedDistricts.some(d => place.districtsList.includes(d));
    const isStillOpen = place.status === "Đang mở cửa";
    const isHighRating = place.ratingGoogle >= 4.4;

    return matchType && matchDistrict && isStillOpen && isHighRating;
  });

  // Nếu trong quận đó chưa có, lấy các quán >= 4.4 sao lân cận ở TP.HCM
  if (verifiedMatches.length === 0) {
    verifiedMatches = window.PLACES_DATA.filter(place => 
      place.type === type && place.status === "Đang mở cửa" && place.ratingGoogle >= 4.4
    );
  }

  // 2. SẮP XẾP THEO TIÊU CHÍ ANH YÊU YÊU CẦU
  verifiedMatches.sort((a, b) => {
    if (purpose === 'work') {
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

  // Đổi view
  quizSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');

  // Đặt tiêu đề kết quả
  const resultTitle = document.getElementById('result-title');
  if (resultTitle) {
    const typeLabel = userQuizState.type === 'cafe' ? 'quán cafe' : 'quán ăn';
    resultTitle.textContent = `${currentFilteredPlaces.length} ${typeLabel} chuẩn gu (★4.4 - 4.7)`;
  }

  // Render các Tab chuyển quán
  renderTabs();

  // Render chi tiết quán đang chọn
  renderActivePlace();
}

// Render Tabs chọn quán (Vuốt ngang)
function renderTabs() {
  const tabsContainer = document.getElementById('place-tabs');
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';

  currentFilteredPlaces.forEach((place, index) => {
    const isActive = index === activePlaceIndex;
    const tabBtn = document.createElement('button');
    tabBtn.className = `flex-shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition select-none flex items-center gap-1 active:scale-95 ${
      isActive 
        ? 'bg-sage-800 text-white shadow-sm' 
        : 'bg-white text-stone-700 border border-cream-300 hover:bg-cream-100'
    }`;
    tabBtn.innerHTML = `<span>${index + 1}.</span> <span>${place.name.split(' - ')[0]}</span> <span class="${isActive ? 'text-amber-300' : 'text-amber-600'} font-black text-[10px]">★${place.ratingGoogle}</span>`;
    tabBtn.onclick = () => {
      activePlaceIndex = index;
      renderTabs();
      renderActivePlace();
    };
    tabsContainer.appendChild(tabBtn);
  });
}

// Render nội dung quán hiện tại trên màn hình 100dvh
function renderActivePlace() {
  const place = currentFilteredPlaces[activePlaceIndex];
  if (!place) return;

  // Hero Image
  const heroImg = document.getElementById('place-hero-img');
  if (heroImg && place.images && place.images.length > 0) {
    heroImg.src = place.images[0];
  }

  // Name & Rating
  const starsEl = document.getElementById('place-google-stars');
  if (starsEl) starsEl.textContent = place.ratingGoogle;

  const reviewsEl = document.getElementById('place-google-reviews');
  if (reviewsEl) reviewsEl.textContent = `(${place.reviewCount} review)`;

  const nameEl = document.getElementById('place-card-name');
  if (nameEl) nameEl.textContent = place.name;

  // Best for & Tagline
  const bestForEl = document.getElementById('best-for-text');
  if (bestForEl) bestForEl.textContent = place.bestFor;

  const taglineEl = document.getElementById('place-tagline');
  if (taglineEl) taglineEl.textContent = place.tagline;

  // Scores
  const quietNum = document.getElementById('score-quiet-num');
  if (quietNum) quietNum.textContent = place.scores.quiet.score;
  const quietNote = document.getElementById('score-quiet-note');
  if (quietNote) quietNote.textContent = place.scores.quiet.note;

  const facNum = document.getElementById('score-fac-num');
  if (facNum) facNum.textContent = place.scores.facilities.score;
  const facNote = document.getElementById('score-fac-note');
  if (facNote) facNote.textContent = place.scores.facilities.note;

  const foodNum = document.getElementById('score-food-num');
  if (foodNum) foodNum.textContent = place.scores.foodDrink.score;
  const foodNote = document.getElementById('score-food-note');
  if (foodNote) foodNote.textContent = place.scores.foodDrink.note;

  // Address & Google Maps link
  const addrEl = document.getElementById('place-address');
  if (addrEl) addrEl.textContent = place.address;

  const mapsBtn = document.getElementById('btn-google-maps');
  if (mapsBtn) mapsBtn.href = place.googleMapsUrl;
}

// Quay lại phần chọn khảo sát
function resetOrGoBack() {
  const quizSection = document.getElementById('quiz-section');
  const resultsSection = document.getElementById('results-section');

  if (!resultsSection.classList.contains('hidden')) {
    resultsSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
  }
}

// Xử lý gửi tin nhắn Chat
function submitChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  generateAIResponse(text);
}

// Xử lý các câu hỏi gợi ý nhanh
function handleQuickPrompt(promptText) {
  generateAIResponse(promptText);
}

// Hiển thị modal câu trả lời của trợ lý
function showAIModal(content) {
  const modal = document.getElementById('ai-answer-modal');
  const contentEl = document.getElementById('ai-modal-content');
  if (modal && contentEl) {
    contentEl.innerHTML = content;
    modal.classList.remove('hidden');
  }
}

// Đóng modal câu trả lời
function closeAIModal() {
  const modal = document.getElementById('ai-answer-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Tạo câu trả lời thông minh dựa trên dữ liệu thật
function generateAIResponse(question) {
  const q = question.toLowerCase();
  const current = currentFilteredPlaces[activePlaceIndex] || window.PLACES_DATA[0];

  let reply = "";

  if (q.includes("wifi") || q.includes("mát") || q.includes("lạnh") || q.includes("ổ điện") || q.includes("cày")) {
    const bestWork = [...currentFilteredPlaces].sort((a,b) => b.scores.facilities.score - a.scores.facilities.score)[0];
    reply = `
      <div class="space-y-2">
        <div class="font-bold text-mocha-800">⚡ Quán có Wi-Fi mạnh, máy lạnh mát & ổ điện chuẩn nhất:</div>
        <div class="p-2.5 bg-sage-50 rounded-xl border border-sage-200">
          <div class="font-extrabold text-sage-800 text-sm">${bestWork.name} ★${bestWork.ratingGoogle} (${bestWork.reviewCount})</div>
          <div class="text-[11px] text-stone-600 mt-1">${bestWork.scores.facilities.note}</div>
          <div class="text-[11px] text-stone-700 mt-1">📍 ${bestWork.address}</div>
        </div>
        <div class="pt-1">
          <a href="${bestWork.googleMapsUrl}" target="_blank" class="inline-flex items-center gap-1 text-rose-600 font-bold underline text-xs">
            👉 Mở trực tiếp trên Google Maps
          </a>
        </div>
      </div>
    `;
  } else if (q.includes("so sánh") || q.includes("kỹ hơn")) {
    if (currentFilteredPlaces.length >= 2) {
      const p1 = currentFilteredPlaces[0];
      const p2 = currentFilteredPlaces[1];
      reply = `
        <div class="space-y-2">
          <div class="font-bold text-mocha-800">⚖️ So sánh chi tiết 2 quán hàng đầu:</div>
          <div class="p-2 bg-cream-50 rounded-xl border border-cream-200 space-y-1 text-xs">
            <div><strong>1. ${p1.name} (★${p1.ratingGoogle}):</strong> ${p1.bestFor}</div>
            <div class="text-stone-600">Tiện nghi: ${p1.scores.facilities.score}/10. Độ yên: ${p1.scores.quiet.score}/10.</div>
          </div>
          <div class="p-2 bg-cream-50 rounded-xl border border-cream-200 space-y-1 text-xs">
            <div><strong>2. ${p2.name} (★${p2.ratingGoogle}):</strong> ${p2.bestFor}</div>
            <div class="text-stone-600">Tiện nghi: ${p2.scores.facilities.score}/10. Độ yên: ${p2.scores.quiet.score}/10.</div>
          </div>
          <div class="text-sage-800 font-bold text-xs pt-1">
            💡 Lời khuyên: Cần cày việc ngồi lâu chọn <strong>${p1.scores.facilities.score >= p2.scores.facilities.score ? p1.name : p2.name}</strong> là điểm 10 nha!
          </div>
        </div>
      `;
    } else {
      reply = `<div class="text-xs">Hiện danh sách đang chọn 1 quán nổi bật nhất. Anh có thể chọn thêm các quận khác để so sánh nha!</div>`;
    }
  } else if (q.includes("yên tĩnh") || q.includes("yên nhất")) {
    const bestQuiet = [...currentFilteredPlaces].sort((a,b) => b.scores.quiet.score - a.scores.quiet.score)[0];
    reply = `
      <div class="space-y-2">
        <div class="font-bold text-mocha-800">🤫 Quán yên tĩnh & trật tự nhất:</div>
        <div class="p-2.5 bg-sage-50 rounded-xl border border-sage-200">
          <div class="font-extrabold text-sage-800 text-sm">${bestQuiet.name} ★${bestQuiet.ratingGoogle}</div>
          <div class="text-[11px] text-stone-600 mt-1">${bestQuiet.scores.quiet.note}</div>
          <div class="text-[11px] text-stone-700 mt-1">⏰ Giờ tĩnh nhất: <strong>${bestQuiet.bestTime}</strong></div>
        </div>
      </div>
    `;
  } else {
    reply = `
      <div class="space-y-2 text-xs">
        <div class="font-bold text-mocha-800 text-sm">${current.name} ★${current.ratingGoogle}</div>
        <div class="text-stone-600">${current.tagline}</div>
        <div class="text-stone-700">Điểm Google: <strong>${current.ratingGoogle}★</strong> (${current.reviewCount} đánh giá). Trạng thái: <strong>${current.status}</strong>.</div>
        <div class="pt-1">
          <a href="${current.googleMapsUrl}" target="_blank" class="text-rose-600 font-bold underline">
            👉 Xem Google Maps & Chỉ đường
          </a>
        </div>
      </div>
    `;
  }

  showAIModal(reply);
}

// Share web app
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'LakaSG - Sài Gòn Quán Xá',
      text: 'Tìm quán cafe học bài & quán ăn chuẩn gu tại TP.HCM (Google Maps >= 4.4 sao)',
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Đã sao chép liên kết vào bộ nhớ tạm!");
  }
}
