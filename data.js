// LakaSG – dữ liệu quán TP.HCM
// Số sao, số review và tình trạng hoạt động lấy trực tiếp từ Google Maps ngày 16/11/2026.
// Chỉ giữ quán: KHÔNG bị Google đánh dấu "đóng cửa vĩnh viễn / tạm thời", ★ >= 4.4, >= 300 review.
// pid = Google Place ID, dùng để mở đúng quán trên Google Maps.
// gu = điểm LakaSG tự chấm theo gu (không phải điểm Google): work = ngồi làm việc, chill = hẹn hò/thư giãn, taste = đồ ngon.

window.CHECKED_AT = "16/11/2026";

window.PLACES_DATA = [
  // ===================== CÀ PHÊ =====================
  // Quận 1
  { name: "The Workshop Coffee", type: "cafe", district: "Quận 1", cat: "Specialty coffee", rating: 4.4, reviews: 4178, address: "27 Ngô Đức Kế, Q.1", pid: "ChIJdyfroEYvdTER2m7eTz44Bns", gu: { work: 9, chill: 7, taste: 8 }, verdict: "Xưởng cà phê trên lầu, bàn dài, khách ôm laptop đông – đúng chỗ cày deadline." },
  { name: "The Running Bean", type: "cafe", district: "Quận 1", cat: "Cà phê & brunch", rating: 4.7, reviews: 6118, address: "115 Hồ Tùng Mậu, Q.1", pid: "ChIJ6Uq31EYvdTERN7N12l_J-yo", gu: { work: 8, chill: 8, taste: 8 }, verdict: "Rộng, sáng, có brunch – làm việc buổi sáng rồi ăn trưa luôn tại chỗ." },
  { name: "Tonkin Specialty Coffee", type: "cafe", district: "Quận 1", cat: "Specialty coffee", rating: 4.8, reviews: 4830, address: "91 Lý Tự Trọng, Q.1", pid: "ChIJzaevQMcvdTERYE3UhLKg5NE", gu: { work: 6, chill: 7, taste: 9 }, verdict: "Dân mê hạt specialty nên ghé – điểm Google cao mà review rất dày." },
  { name: "OKKIO Caffe Đồng Khởi", type: "cafe", district: "Quận 1", cat: "Cà phê", rating: 4.6, reviews: 541, address: "151 Đồng Khởi, Q.1", pid: "ChIJDQ1r0-svdTER10fnSvktlVw", gu: { work: 6, chill: 9, taste: 8 }, verdict: "Ngay trung tâm, không gian xinh – hẹn bạn 1–2 tiếng là hợp nhất." },
  { name: "Soo Kafe Bến Thành", type: "cafe", district: "Quận 1", cat: "Cà phê", rating: 4.6, reviews: 2053, address: "35 Phan Chu Trinh, Q.1", pid: "ChIJLUnNLj8vdTERtZ0FtgSj9-A", gu: { work: 6, chill: 8, taste: 8 }, verdict: "Sát chợ Bến Thành, ghé nghỉ chân giữa buổi dạo phố rất tiện." },
  { name: "Little HaNoi Egg Coffee", type: "cafe", district: "Quận 1", cat: "Cà phê trứng", rating: 4.8, reviews: 5764, address: "119/5 Phạm Ngũ Lão (lối Yersin), Q.1", pid: "ChIJqZ7MThYvdTERh6VZ5ryLuDk", gu: { work: 4, chill: 8, taste: 9 }, verdict: "Đến vì ly cà phê trứng kiểu Hà Nội – uống để thưởng thức, không phải để cày." },

  // Quận 3
  { name: "Every Half Coffee Roasters – Tú Xương", type: "cafe", district: "Quận 3", cat: "Specialty coffee", rating: 4.7, reviews: 1614, address: "6E Tú Xương, Q.3", pid: "ChIJfWlc0YYvdTERTN5qKEvgQcM", gu: { work: 8, chill: 8, taste: 9 }, verdict: "Roastery có tiếng, cà phê chắc tay, ngồi làm việc lẫn tán gẫu đều ổn." },
  { name: "Epic Coffee Roaster", type: "cafe", district: "Quận 3", cat: "Specialty coffee", rating: 4.5, reviews: 694, address: "49 Ngô Thời Nhiệm, Q.3", pid: "ChIJizoBS4ovdTEReKpg9EOx5xE", gu: { work: 7, chill: 7, taste: 8 }, verdict: "Góc rang xay nhỏ trên con đường rợp cây – yên vừa đủ để tập trung." },
  { name: "Saigon Coffee Roastery", type: "cafe", district: "Quận 3", cat: "Specialty coffee", rating: 4.5, reviews: 823, address: "232/13 Võ Thị Sáu, Q.3", pid: "ChIJjdN6NR0vdTERWxIp9PGNd0U", gu: { work: 7, chill: 7, taste: 9 }, verdict: "Nằm trong hẻm nên tách tiếng xe – chỗ của người uống cà phê nghiêm túc." },
  { name: "Cheo Leo Cafe", type: "cafe", district: "Quận 3", cat: "Cà phê vợt lâu đời", rating: 4.4, reviews: 1174, address: "109/36 Nguyễn Thiện Thuật, Q.3", pid: "ChIJh9llDR8vdTERBjmUkPp6GPk", gu: { work: 3, chill: 8, taste: 8 }, verdict: "Cà phê vợt trong hẻm, chất Sài Gòn xưa – đi để cảm, không để làm việc." },
  { name: "Barista Collective", type: "cafe", district: "Quận 3", cat: "Specialty coffee", rating: 4.6, reviews: 944, address: "191 Trần Văn Đang, Q.3", pid: "ChIJp_4KrqQvdTERkOYqzlUySsQ", gu: { work: 7, chill: 7, taste: 9 }, verdict: "Quán của dân pha chế, menu specialty phong phú – hợp người sành vị." },
  { name: "The Hummingbird Café & Roastery", type: "cafe", district: "Quận 3", cat: "Cà phê & roastery", rating: 4.6, reviews: 737, address: "103Bis Võ Thị Sáu, Q.3", pid: "ChIJ42LbhmovdTER40L9GxG-Jl4", gu: { work: 7, chill: 8, taste: 8 }, verdict: "Cân bằng giữa đẹp và ngon – ngồi lâu hay hẹn hò đều không lệch gu." },

  // Bình Thạnh
  { name: "Bosgaurus Coffee – Saigon Pearl", type: "cafe", district: "Bình Thạnh", cat: "Specialty coffee", rating: 4.5, reviews: 1406, address: "Biệt thự 1D5, Saigon Pearl, Bình Thạnh", pid: "ChIJFbNbZhkpdTEREnQAU62EGgY", gu: { work: 8, chill: 8, taste: 9 }, verdict: "Biệt thự rộng trong Saigon Pearl, cà phê rang tại chỗ – làm việc cả ngày được." },
  { name: "Cú Trên Cây Coffee", type: "cafe", district: "Bình Thạnh", cat: "Cà phê học bài", rating: 4.4, reviews: 1889, address: "262 Ung Văn Khiêm, Bình Thạnh", pid: "ChIJSUxqhQ0ndTERuimyNs-6qY0", gu: { work: 8, chill: 6, taste: 6 }, verdict: "Sinh viên quanh Hutech, UEF hay ngồi học – giá mềm, ngồi lâu thoải mái." },
  { name: "Bamos Coffee 24h", type: "cafe", district: "Bình Thạnh", cat: "Cà phê 24h", rating: 4.7, reviews: 2576, address: "69 Ngô Tất Tố, Bình Thạnh", pid: "ChIJfS0PNO0pdTER2U9eJatCYaA", gu: { work: 9, chill: 6, taste: 6 }, verdict: "Mở 24h – cứu tinh của dân chạy deadline xuyên đêm." },
  { name: "COFFEE 24/24", type: "cafe", district: "Bình Thạnh", cat: "Cà phê 24h", rating: 4.9, reviews: 2605, address: "96 D5, Bình Thạnh", pid: "ChIJtR2E-PApdTERisXz_qR6vbQ", gu: { work: 9, chill: 6, taste: 6 }, verdict: "Đúng như tên, thức cùng anh tới sáng – điểm Google rất cao." },
  { name: "PỜ Café", type: "cafe", district: "Bình Thạnh", cat: "Cà phê", rating: 4.8, reviews: 945, address: "160/27 Bùi Đình Túy, Bình Thạnh", pid: "ChIJ173rcQApdTEREFG-yhdodTs", gu: { work: 6, chill: 9, taste: 7 }, verdict: "Quán hẻm nhỏ xinh, nhẹ nhàng – hợp ngồi tâm sự hơn là mở laptop." },
  { name: "Cà Kê Café", type: "cafe", district: "Bình Thạnh", cat: "Cà phê", rating: 4.5, reviews: 649, address: "29/12 Nguyễn Gia Trí (D2), Bình Thạnh", pid: "ChIJRUdImaUpdTERO15bESUfMdY", gu: { work: 6, chill: 8, taste: 7 }, verdict: "Đúng chất cà kê dê ngỗng – rủ bạn thân tới ngồi tán." },

  // Phú Nhuận
  { name: "The Xi Cafe", type: "cafe", district: "Phú Nhuận", cat: "Cà phê", rating: 4.7, reviews: 990, address: "14E Đặng Văn Ngữ, Phú Nhuận", pid: "ChIJ-zOPgAUpdTERe7FLltfCx9Q", gu: { work: 7, chill: 8, taste: 7 }, verdict: "Điểm cao, review dày – an toàn cho cả làm việc lẫn hẹn hò." },
  { name: "DOME ドームカフェ", type: "cafe", district: "Phú Nhuận", cat: "Cà phê kiểu Nhật", rating: 4.5, reviews: 454, address: "10/16 Đoàn Thị Điểm, Phú Nhuận", pid: "ChIJu5UG5y0pdTER8IbC9F2vpks", gu: { work: 8, chill: 7, taste: 7 }, verdict: "Phong cách Nhật trong hẻm, khách nói nhỏ – dễ vào guồng tập trung." },
  { name: "Oasis Cafe – Koi Fish", type: "cafe", district: "Phú Nhuận", cat: "Cà phê sân vườn", rating: 4.5, reviews: 10809, address: "176/1B Lê Văn Sỹ, Phú Nhuận", pid: "ChIJbaeNZCspdTEREadFbltGF9s", gu: { work: 5, chill: 9, taste: 6 }, verdict: "Hồ cá koi, hơn 10 nghìn review – đưa người yêu đi ngắm cá là chắc ăn." },
  { name: "Thanh Coffee", type: "cafe", district: "Phú Nhuận", cat: "Cà phê", rating: 4.5, reviews: 1322, address: "1 Nhiêu Tứ, Phú Nhuận", pid: "ChIJC6LjDwApdTERVqoQpm_NkGE", gu: { work: 7, chill: 7, taste: 7 }, verdict: "Quán quen của khu Nhiêu Tứ – không màu mè, ngồi lâu thoải mái." },
  { name: "Chidori – Coffee in Bed", type: "cafe", district: "Phú Nhuận", cat: "Cà phê", rating: 4.5, reviews: 868, address: "06 Hoa Cau, Phú Nhuận", pid: "ChIJzRNiZkMpdTER0XJoBZ2QEcc", gu: { work: 4, chill: 9, taste: 7 }, verdict: "Ngồi nệm như ở nhà – chill, đọc sách, chứ đừng mang deadline tới." },
  { name: "The Comma", type: "cafe", district: "Phú Nhuận", cat: "Cà phê", rating: 4.5, reviews: 632, address: "21 Hoa Mai, Phú Nhuận", pid: "ChIJq-gjtPspdTERingY2rxYXj0", gu: { work: 7, chill: 8, taste: 7 }, verdict: "Một dấu phẩy giữa ngày – khu Hoa Mai yên, hợp làm việc nhẹ." },

  // Thảo Điền
  { name: "XLIII Specialty Coffee", type: "cafe", district: "Thảo Điền", cat: "Specialty coffee", rating: 5.0, reviews: 3579, address: "19 Đường số 2, Làng Báo, Thảo Điền", pid: "ChIJj1QO7EQndTERNrMVJRqmUyU", gu: { work: 7, chill: 8, taste: 10 }, verdict: "5.0★ trên hơn 3.500 review – hiếm quán nào giữ được điểm này." },
  { name: "Café Slow Thảo Điền", type: "cafe", district: "Thảo Điền", cat: "Cà phê", rating: 4.5, reviews: 725, address: "39 Lê Văn Miến, Thảo Điền", pid: "ChIJPewRCkIndTERemsRdznN_nE", gu: { work: 7, chill: 9, taste: 7 }, verdict: "Đúng tên – chậm lại, ngồi cả buổi chiều không ai hối." },
  { name: "OKKIO Caffe Thảo Điền", type: "cafe", district: "Thảo Điền", cat: "Cà phê", rating: 4.5, reviews: 609, address: "110 Xuân Thủy, Thảo Điền", pid: "ChIJ5818SKQndTERr-cMa-oJEu0", gu: { work: 7, chill: 8, taste: 8 }, verdict: "Bản Thảo Điền của OKKIO – rộng hơn, dễ kiếm bàn hơn chi nhánh Q.1." },
  { name: "Aramour Coffee Roasters", type: "cafe", district: "Thảo Điền", cat: "Specialty coffee", rating: 4.5, reviews: 682, address: "7 Lê Văn Miến, Thảo Điền", pid: "ChIJyx8_wRwndTERRWGeFd1cwt0", gu: { work: 7, chill: 7, taste: 9 }, verdict: "Roastery cho người kén hạt – gọi pour-over là đúng bài." },
  { name: "Faro Cafe – Thảo Điền Villa", type: "cafe", district: "Thảo Điền", cat: "Cà phê biệt thự", rating: 4.6, reviews: 476, address: "81 Xuân Thủy, Thảo Điền", pid: "ChIJMUoy_uAndTERwJOULyC2gug", gu: { work: 6, chill: 9, taste: 7 }, verdict: "Biệt thự xanh mát – chụp ảnh, hẹn hò cuối tuần rất ăn ảnh." },
  { name: "Dolphy Café", type: "cafe", district: "Thảo Điền", cat: "Cà phê", rating: 4.6, reviews: 523, address: "23 Nguyễn Văn Hưởng, Thảo Điền", pid: "ChIJrWa4iOEndTERRZcOzztEmSI", gu: { work: 7, chill: 8, taste: 7 }, verdict: "Khúc Nguyễn Văn Hưởng vắng xe – ngồi làm việc khá yên." },

  // ===================== QUÁN ĂN =====================
  // Quận 1
  { name: "Dim Tu Tac – Đông Du", type: "food", district: "Quận 1", cat: "Dimsum Quảng Đông", rating: 4.5, reviews: 4865, address: "55 Đông Du, Q.1", pid: "ChIJO5FZBkIvdTER0RBWzFc-6NQ", gu: { work: 3, chill: 8, taste: 9 }, verdict: "Dimsum đông khách, đi nhóm gọi nhiều xửng chia nhau là vui nhất." },
  { name: "Propaganda", type: "food", district: "Quận 1", cat: "Món Việt", rating: 4.4, reviews: 4861, address: "21 Hàn Thuyên, Q.1", pid: "ChIJ2-WrjTcvdTERNwe9MG_XXGM", gu: { work: 3, chill: 8, taste: 8 }, verdict: "Món Việt bày đẹp, tường tranh cổ động, ngay cạnh Nhà thờ Đức Bà." },
  { name: "MANA Station – Tiệm Ăn Món Việt", type: "food", district: "Quận 1", cat: "Món Việt", rating: 4.6, reviews: 843, address: "57 Hai Bà Trưng, Q.1", pid: "ChIJu5OhvtMvdTERBiJ0Bxi-X3I", gu: { work: 3, chill: 7, taste: 8 }, verdict: "Cơm món Việt gọn gàng giữa trung tâm – ăn trưa văn phòng ổn áp." },
  { name: "Bánh Canh Cua 87", type: "food", district: "Quận 1", cat: "Bánh canh cua", rating: 4.4, reviews: 1322, address: "87 Trần Khắc Chân, Q.1", pid: "ChIJBYD4rjgpdTERYZY2MCqxlio", gu: { work: 1, chill: 5, taste: 9 }, verdict: "Tô bánh canh cua đậm, đầy topping – món đặc sản phải thử." },
  { name: "Hàng Dương Quán", type: "food", district: "Quận 1", cat: "Nhà hàng", rating: 4.5, reviews: 728, address: "32-34 Ngô Đức Kế, Q.1", pid: "ChIJ8bkqqCpTaDERsRgpzDYTR18", gu: { work: 2, chill: 7, taste: 8 }, verdict: "Ăn xong bước qua The Workshop uống cà phê – combo phố Ngô Đức Kế." },
  { name: "Nhà hàng Mandarine", type: "food", district: "Quận 1", cat: "Món Việt sang trọng", rating: 4.4, reviews: 762, address: "11A Ngô Văn Năm, Q.1", pid: "ChIJuQl4J08vdTERgWe1mE_kEmA", gu: { work: 2, chill: 9, taste: 8 }, verdict: "Không gian nhà xưa sang trọng – dành cho dịp đặc biệt hoặc tiếp khách." },

  // Quận 3
  { name: "Pizza 4P's Hai Bà Trưng", type: "food", district: "Quận 3", cat: "Pizza", rating: 4.9, reviews: 25236, address: "151A-151B Hai Bà Trưng, Q.3", pid: "ChIJC-nWiTYvdTERGMJvRSoZ2f4", gu: { work: 2, chill: 9, taste: 10 }, verdict: "4.9★ trên hơn 25 nghìn review – nên đặt bàn trước giờ cao điểm." },
  { name: "Hum Signature", type: "food", district: "Quận 3", cat: "Nhà hàng chay", rating: 4.6, reviews: 5028, address: "34 Võ Văn Tần, Q.3", pid: "ChIJiyyZnzAvdTER1sKiGy0rPCE", gu: { work: 2, chill: 9, taste: 8 }, verdict: "Chay mà sang, không gian xanh yên – dẫn người ăn kiêng đi là ghi điểm." },
  { name: "Lil' Sago – Hotpot & more", type: "food", district: "Quận 3", cat: "Lẩu", rating: 4.7, reviews: 1804, address: "299 Võ Văn Tần, Q.3", pid: "ChIJSSR7ESMvdTERBpAzEc3_N24", gu: { work: 1, chill: 8, taste: 8 }, verdict: "Lẩu cho hội bạn tối mưa – điểm Google cao, review dày." },

  // Bình Thạnh
  { name: "Ram Quảng Ngon", type: "food", district: "Bình Thạnh", cat: "Đặc sản Quảng", rating: 4.5, reviews: 1102, address: "55 hẻm 36 D2, Bình Thạnh", pid: "ChIJvU_-kKQodTERjeH08rei_FA", gu: { work: 1, chill: 6, taste: 9 }, verdict: "Ram cuốn cải, mì Quảng – đúng vị miền Trung giữa Sài Gòn." },
  { name: "Nhà hàng Thị Tấm", type: "food", district: "Bình Thạnh", cat: "Món Việt", rating: 4.4, reviews: 1895, address: "38 D5, Bình Thạnh", pid: "ChIJsfgdPqModTERXuZdETNZCWA", gu: { work: 2, chill: 7, taste: 8 }, verdict: "Cơm nhà kiểu Việt, ăn gia đình hay nhóm bạn đều hợp." },
  { name: "Tiệm ăn Gặm", type: "food", district: "Bình Thạnh", cat: "Món gà", rating: 4.5, reviews: 561, address: "8/10 Nguyễn Thiện Thuật, Bình Thạnh", pid: "ChIJA6DClKcpdTERosE1J-kaHqU", gu: { work: 1, chill: 6, taste: 8 }, verdict: "Chuyên gà, ngồi gặm cho đã – tiệm nhỏ mà được chấm cao." },
  { name: "Quán Sáu Tỷ", type: "food", district: "Bình Thạnh", cat: "Món cá, ven sông", rating: 4.4, reviews: 461, address: "129/19 Bình Quới, Thanh Đa", pid: "ChIJaVGPD4spdTERVCJOQoNqu7w", gu: { work: 1, chill: 8, taste: 8 }, verdict: "Ăn cá ở bán đảo Thanh Đa – xa trung tâm nhưng đáng chạy xe." },
  { name: "Quán Nhậu 256", type: "food", district: "Bình Thạnh", cat: "Quán nhậu", rating: 4.5, reviews: 400, address: "256 Nguyễn Gia Trí (D2), Bình Thạnh", pid: "ChIJAcLMbQApdTERpGPiAXOQF-8", gu: { work: 1, chill: 7, taste: 8 }, verdict: "Lai rai sau giờ làm khu D2 – mồi được khen nhiều." },

  // Phú Nhuận
  { name: "Tám Riêu – Phan Xích Long", type: "food", district: "Phú Nhuận", cat: "Bún riêu, lẩu cua", rating: 4.8, reviews: 2143, address: "235 Phan Xích Long, Phú Nhuận", pid: "ChIJ6a85G0QpdTERuHywhPCTLkc", gu: { work: 1, chill: 7, taste: 9 }, verdict: "Riêu cua là món chủ lực, 4.8★ – Phan Xích Long ăn món Việt là đây." },
  { name: "Man Tang Guo", type: "food", district: "Phú Nhuận", cat: "Lẩu", rating: 4.7, reviews: 2045, address: "169-171 Phan Xích Long, Phú Nhuận", pid: "ChIJq_WrgjkpdTEReUSj_mNbzi4", gu: { work: 1, chill: 8, taste: 8 }, verdict: "Lẩu đông vui cho hội bạn, review khen đều tay." },
  { name: "TIỆM LẨU 1996", type: "food", district: "Phú Nhuận", cat: "Lẩu", rating: 4.9, reviews: 1217, address: "29 Nguyễn Đình Chiểu, Phú Nhuận", pid: "ChIJc_jCGoQpdTERtFMwfNvkKhs", gu: { work: 1, chill: 8, taste: 9 }, verdict: "4.9★ trên hơn 1.200 review – lẩu mà điểm cao cỡ này thì đáng thử." },
  { name: "Haru Sushi Phú Nhuận", type: "food", district: "Phú Nhuận", cat: "Sushi", rating: 4.5, reviews: 1963, address: "211-213 Phan Xích Long, Phú Nhuận", pid: "ChIJPzxAYNAodTERuy_Rrv9pKg0", gu: { work: 2, chill: 8, taste: 8 }, verdict: "Sushi giá dễ chịu, hẹn hò nhẹ nhàng hợp lý." },
  { name: "Aroy Thái", type: "food", district: "Phú Nhuận", cat: "Món Thái", rating: 4.6, reviews: 816, address: "86 Hoa Cúc, Phú Nhuận", pid: "ChIJKQgDnp4pdTERP8txddtR6Pk", gu: { work: 1, chill: 7, taste: 8 }, verdict: "Chua cay kiểu Thái trong khu Hoa Cúc – đổi gió cực ổn." },

  // Thảo Điền
  { name: "Madame Lam", type: "food", district: "Thảo Điền", cat: "Món Việt", rating: 4.8, reviews: 2028, address: "10 Trần Ngọc Diện, Thảo Điền", pid: "ChIJEYKTCNondTERAbSWd7LtfQc", gu: { work: 2, chill: 9, taste: 9 }, verdict: "Món Việt bày biện tinh tế – dẫn khách nước ngoài là chuẩn." },
  { name: "ZumWhere Thảo Điền", type: "food", district: "Thảo Điền", cat: "Izakaya", rating: 4.8, reviews: 2463, address: "17 Trần Ngọc Diện, Thảo Điền", pid: "ChIJhZ21BDondTERFidurn2E0dc", gu: { work: 1, chill: 9, taste: 9 }, verdict: "Izakaya hiện đại, đồ nướng + đồ uống – tối thứ Sáu là hợp." },
  { name: "Mặn Mòi Thảo Điền", type: "food", district: "Thảo Điền", cat: "Món Việt", rating: 4.6, reviews: 1559, address: "32 Đường số 11, Thảo Điền", pid: "ChIJzyToihQmdTERk5dktz1npps", gu: { work: 2, chill: 8, taste: 8 }, verdict: "Cơm Việt đậm đà trong khu Tây – đúng tên, ăn là nhớ." },
  { name: "La Lola Thảo Điền", type: "food", district: "Thảo Điền", cat: "Địa Trung Hải", rating: 4.8, reviews: 779, address: "80 Xuân Thủy, Thảo Điền", pid: "ChIJu0ExLAAndTERHNWH2Y8Lnco", gu: { work: 2, chill: 9, taste: 9 }, verdict: "Tapas Địa Trung Hải, không khí hẹn hò lãng mạn." },
  { name: "Pasta Fresca Thảo Điền", type: "food", district: "Thảo Điền", cat: "Món Ý", rating: 4.5, reviews: 863, address: "28 Thảo Điền", pid: "ChIJ9Z0ZRiImdTERhg22J1qFLdg", gu: { work: 2, chill: 8, taste: 8 }, verdict: "Mì Ý tươi làm tại chỗ – bữa tối nhẹ nhàng cho hai người." },
  { name: "Matsuri Vincom Thảo Điền", type: "food", district: "Thảo Điền", cat: "Món Nhật", rating: 4.8, reviews: 1491, address: "Vincom Mega Mall, 161 Võ Nguyên Giáp", pid: "ChIJ8X-sLlIndTERQPWwyAptWpM", gu: { work: 2, chill: 7, taste: 8 }, verdict: "Trong Vincom, dễ gửi xe – ăn Nhật xong đi dạo mall luôn." }
];

window.PLACES_DATA.forEach((p, i) => {
  p.id = "p" + i;
  p.mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.name) + "&query_place_id=" + p.pid;
  p.dirUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(p.name) + "&destination_place_id=" + p.pid;
});
