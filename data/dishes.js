/**
 * Danh sách món ăn cho web app "MealMate"
 * Phân loại:
 * - 'lunch': Ăn trưa
 * - 'drink': Đồ uống
 * - 'snack': Ăn vặt
 * - 'party': Món nhậu
 */

export const DISHES = [
  // ==========================================
  // 1. ĂN TRƯA (LUNCH) - 32 món (nhiều món chay)
  // ==========================================
  {
    id: 'l01',
    name: 'Cơm tấm sườn bì chả',
    category: 'lunch',
    price: 45000,
    vegetarian: false,
    emoji: '🍛',
    comment: 'Hương vị Sài Gòn kinh điển, sườn nướng thơm nức mũi cả xóm!'
  },
  {
    id: 'l02',
    name: 'Cơm tấm sườn non hạt sen chay',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🍱',
    comment: 'Thanh tịnh tâm hồn, ăn xong thấy nhân từ với cả thế giới.'
  },
  {
    id: 'l03',
    name: 'Bún chả Hà Nội',
    category: 'lunch',
    price: 50000,
    vegetarian: false,
    emoji: '🥗',
    comment: 'Chả nướng than hoa thơm lừng quyện cùng nước mắm chua ngọt ấm bụng.'
  },
  {
    id: 'l04',
    name: 'Phở bò tái nạm',
    category: 'lunch',
    price: 55000,
    vegetarian: false,
    emoji: '🍜',
    comment: 'Nước dùng ninh xương ngọt thanh, húp một ngụm tỉnh cả người lười.'
  },
  {
    id: 'l05',
    name: 'Phở nấm hương đậu hũ chay',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🍜',
    comment: 'Hương hồi quế nấm thơm dịu, nhẹ bụng mà vẫn ấm lòng trưa nay.'
  },
  {
    id: 'l06',
    name: 'Bánh mì thịt nướng patê',
    category: 'lunch',
    price: 25000,
    vegetarian: false,
    emoji: '🥖',
    comment: 'Nhanh - gọn - giòn rụm, cứu rỗi những buổi trưa chạy deadline sấp mặt.'
  },
  {
    id: 'l07',
    name: 'Bánh mì bơ tỏi nấm chay',
    category: 'lunch',
    price: 20000,
    vegetarian: true,
    emoji: '🥖',
    comment: 'Rẻ bất ngờ, thơm phức mùi bơ thực vật và nấm xào tiêu đen.'
  },
  {
    id: 'l08',
    name: 'Bún bò Huế giò heo chả cua',
    category: 'lunch',
    price: 60000,
    vegetarian: false,
    emoji: '🍲',
    comment: 'Cay nồng đậm đà vị mắm ruốc, ăn xong mồ hôi tuôn như tắm.'
  },
  {
    id: 'l09',
    name: 'Bún bò Huế chay nấm bào ngư',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🍲',
    comment: 'Vị sả ớt thơm cay đúng điệu, đậu hũ thấm vị ăn cực dính.'
  },
  {
    id: 'l10',
    name: 'Cơm gà xối mỡ đùi góc tư',
    category: 'lunch',
    price: 50000,
    vegetarian: false,
    emoji: '🍗',
    comment: 'Da giòn tan rôm rốp, cơm đỏ béo ngậy, quên luôn chế độ ăn kiêng.'
  },
  {
    id: 'l11',
    name: 'Hủ tiếu Nam Vang thập cẩm',
    category: 'lunch',
    price: 55000,
    vegetarian: false,
    emoji: '🥣',
    comment: 'Tôm mực thịt bằm trứng cút, khô hay nước đều cuốn hút kỳ lạ.'
  },
  {
    id: 'l12',
    name: 'Hủ tiếu mì chay củ sen cà rốt',
    category: 'lunch',
    price: 30000,
    vegetarian: true,
    emoji: '🥣',
    comment: 'Nước hầm củ quả ngọt lịm tự nhiên, vừa ngon vừa lành cho bao tử.'
  },
  {
    id: 'l13',
    name: 'Bún đậu mắm tôm thập cẩm',
    category: 'lunch',
    price: 55000,
    vegetarian: false,
    emoji: '🥒',
    comment: 'Mắm tôm đánh sủi bọt thêm tắc ớt cay xè, chiều nay khỏi thở vào mặt ai!'
  },
  {
    id: 'l14',
    name: 'Bún đậu nước tương chả cốm chay',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🥢',
    comment: 'Đậu rán vàng giòn chấm tương ớt cay ngọt, phiên bản lịch sự thơm tho.'
  },
  {
    id: 'l15',
    name: 'Cơm rang dưa bò giòn hạt',
    category: 'lunch',
    price: 50000,
    vegetarian: false,
    emoji: '🍳',
    comment: 'Hạt cơm săn bóng giòn giòn, dưa chua xào bò mềm bao hao cơm.'
  },
  {
    id: 'l16',
    name: 'Cơm chiên trái thơm hạt điều chay',
    category: 'lunch',
    price: 45000,
    vegetarian: true,
    emoji: '🍍',
    comment: 'Màu vàng rực rỡ, vị chua ngọt lạ miệng kích thích mọi giác quan.'
  },
  {
    id: 'l17',
    name: 'Mì Quảng ếch om nghệ',
    category: 'lunch',
    price: 60000,
    vegetarian: false,
    emoji: '🍜',
    comment: 'Nước nhưn đậm đà chấm bánh tráng mè nướng giòn rụm.'
  },
  {
    id: 'l18',
    name: 'Mì Quảng chay đậu phụ nấm đùi gà',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🍜',
    comment: 'Sợi mì mềm vàng óng ả, rắc thêm đậu phộng rang giã nhỏ bùi béo.'
  },
  {
    id: 'l19',
    name: 'Bánh canh cua biển nguyên con',
    category: 'lunch',
    price: 120000,
    vegetarian: false,
    emoji: '🦀',
    comment: 'Thịt cua tươi rói ngập bát, ăn xong ví tiền thở dốc nhưng miệng mỉm cười.'
  },
  {
    id: 'l20',
    name: 'Bánh canh nấm rơm cốt dừa chay',
    category: 'lunch',
    price: 35000,
    vegetarian: true,
    emoji: '🥣',
    comment: 'Nước cốt dừa thơm béo thoang thoảng quyện sợi bánh mềm dẻo.'
  },
  {
    id: 'l21',
    name: 'Cơm niêu cá kho tộ canh cua mồng tơi',
    category: 'lunch',
    price: 95000,
    vegetarian: false,
    emoji: '🍲',
    comment: 'Cơm cháy giòn tan đáy niêu, cá kho keo quánh đậm đà chuẩn vị mẹ nấu.'
  },
  {
    id: 'l22',
    name: 'Cơm niêu đậu hũ sốt cà nấm kho tiêu',
    category: 'lunch',
    price: 45000,
    vegetarian: true,
    emoji: '🍲',
    comment: 'Mộc mạc giản dị mà vét sạch tận hạt cơm cháy cuối cùng trong niêu.'
  },
  {
    id: 'l23',
    name: 'Bún riêu cua đồng ốc to giò heo',
    category: 'lunch',
    price: 55000,
    vegetarian: false,
    emoji: '🥘',
    comment: 'Gạch cua bồng bềnh, cà chua đo đỏ, giấm bỗng chua thanh dịu ngọt.'
  },
  {
    id: 'l24',
    name: 'Bún riêu chay sữa đậu nành cà chua',
    category: 'lunch',
    price: 30000,
    vegetarian: true,
    emoji: '🥘',
    comment: 'Ria riêu giả bằng váng đậu và nấm cực khéo, vị chua nhẹ đưa miệng.'
  },
  {
    id: 'l25',
    name: 'Set Bento bò nướng sốt Teriyaki Nhật Bản',
    category: 'lunch',
    price: 135000,
    vegetarian: false,
    emoji: '🍱',
    comment: 'Sang chảnh chuẩn văn phòng xịn sò, thịt bò mềm tan thơm mùi tương Nhật.'
  },
  {
    id: 'l26',
    name: 'Set Sushi & Maki chay rau củ tươi',
    category: 'lunch',
    price: 75000,
    vegetarian: true,
    emoji: '🍣',
    comment: 'Cơm dẻo chua dịu cuộn bơ, dưa chuột và nấm đông cô sốt teriyaki.'
  },
  {
    id: 'l27',
    name: 'Cơm sườn que nướng sốt BBQ đút lò',
    category: 'lunch',
    price: 85000,
    vegetarian: false,
    emoji: '🍖',
    comment: 'Cầm cọng sườn gặm đã đời, sốt BBQ nâu óng bám dính từng thớ thịt.'
  },
  {
    id: 'l28',
    name: 'Mì cay hải sản 7 cấp độ',
    category: 'lunch',
    price: 65000,
    vegetarian: false,
    emoji: '🌶️',
    comment: 'Thử thách độ lì lợm của dạ dày, vừa ăn vừa xin thêm khăn giấy lau nước mắt.'
  },
  {
    id: 'l29',
    name: 'Bánh hỏi heo quay lá hẹ mắm nêm',
    category: 'lunch',
    price: 60000,
    vegetarian: false,
    emoji: '🥓',
    comment: 'Da heo nổ cốm giòn rụm, mỡ ngậy vừa phải ăn cùng bánh hỏi mềm mướt.'
  },
  {
    id: 'l30',
    name: 'Lẩu mini Tomyum một người ăn',
    category: 'lunch',
    price: 90000,
    vegetarian: false,
    emoji: '🍲',
    comment: 'Độc thân cũng phải ăn ngon! Nồi lẩu sôi sùng sục cay cay chua chua.'
  },
  {
    id: 'l31',
    name: 'Bún thịt nướng chả giò đậu phộng',
    category: 'lunch',
    price: 45000,
    vegetarian: false,
    emoji: '🥗',
    comment: 'Trộn đều bát bún với rau sống tươi non, chan mắm tỏi ớt là hết sẩy.'
  },
  {
    id: 'l32',
    name: 'Cơm chay thập cẩm tự chọn 5 món',
    category: 'lunch',
    price: 25000,
    vegetarian: true,
    emoji: '🥗',
    comment: 'Món ăn quốc dân của sinh viên cuối tháng: siêu no, siêu rẻ, bổ dưỡng!'
  },

  // ==========================================
  // 2. ĐỒ UỐNG (DRINK) - 22 món (đa phần chay)
  // ==========================================
  {
    id: 'd01',
    name: 'Cà phê sữa đá Sài Gòn',
    category: 'drink',
    price: 20000,
    vegetarian: true,
    emoji: '☕',
    comment: 'Cú đấm caffeine đập tan cơn buồn ngủ gà gật của buổi chiều.'
  },
  {
    id: 'd02',
    name: 'Bạc xỉu ba tầng ngọt ngào',
    category: 'drink',
    price: 25000,
    vegetarian: true,
    emoji: '🥛',
    comment: 'Dành cho hội ghiền cà phê nhưng sợ tim đập thình thịch.'
  },
  {
    id: 'd03',
    name: 'Trà sữa trân châu đường đen kem cheese',
    category: 'drink',
    price: 55000,
    vegetarian: true,
    emoji: '🧋',
    comment: 'Một ly trà sữa bằng ba ngày chạy bộ, nhưng nốt hôm nay thôi!'
  },
  {
    id: 'd04',
    name: 'Trà sữa truyền thống full topping trân châu',
    category: 'drink',
    price: 35000,
    vegetarian: true,
    emoji: '🧋',
    comment: 'Hút một hơi nhai mỏi cơ hàm, no đến tận bữa tối.'
  },
  {
    id: 'd05',
    name: 'Trà đào cam sả thanh mát',
    category: 'drink',
    price: 40000,
    vegetarian: true,
    emoji: '🍑',
    comment: 'Hương sả thoang thoảng, đào miếng giòn sần sật thổi bay nóng bức.'
  },
  {
    id: 'd06',
    name: 'Trà lài dâu tằm nha đam hạt chia',
    category: 'drink',
    price: 45000,
    vegetarian: true,
    emoji: '🍓',
    comment: 'Màu hồng ngọc xinh xắn, uống vào thấy tâm hồn đẹp gái/đẹp trai lên hẳn.'
  },
  {
    id: 'd07',
    name: 'Trà sen vàng củ năng kem sữa',
    category: 'drink',
    price: 55000,
    vegetarian: true,
    emoji: '🪷',
    comment: 'Vị bùi bùi của hạt sen, giòn ngọt của củ năng cùng lớp váng sữa béo ngậy.'
  },
  {
    id: 'd08',
    name: 'Trà tắc khổng lồ xí muội',
    category: 'drink',
    price: 15000,
    vegetarian: true,
    emoji: '🍋',
    comment: 'Bình dân vô địch, chua ngọt đê mê, vừa uống vừa buôn chuyện xuyên trưa.'
  },
  {
    id: 'd09',
    name: 'Nước mía sầu riêng cốt dừa',
    category: 'drink',
    price: 20000,
    vegetarian: true,
    emoji: '🥤',
    comment: 'Ngọt béo lịm tim, ngụm đầu bỡ ngỡ, ngụm thứ hai say đắm.'
  },
  {
    id: 'd10',
    name: 'Sinh tố bơ sáp dừa non',
    category: 'drink',
    price: 40000,
    vegetarian: true,
    emoji: '🥑',
    comment: 'Đặc sánh mịn màng, vị béo ngậy tự nhiên cung cấp vitamin tích cực.'
  },
  {
    id: 'd11',
    name: 'Nước ép cam cà rốt mật ong',
    category: 'drink',
    price: 35000,
    vegetarian: true,
    emoji: '🥕',
    comment: 'Nạp vitamin C sáng mắt đẹp da, rửa sạch mệt mỏi văn phòng.'
  },
  {
    id: 'd12',
    name: 'Matcha đá xay vụn sô-cô-la bánh quy',
    category: 'drink',
    price: 65000,
    vegetarian: true,
    emoji: '🍵',
    comment: 'Xanh mướt dịu mắt, vị đắng nhẹ tinh tế của trà xanh Kyoto.'
  },
  {
    id: 'd13',
    name: 'Cold Brew cam vàng ủ lạnh 24h',
    category: 'drink',
    price: 60000,
    vegetarian: true,
    emoji: '🍹',
    comment: 'Vị chua thanh mát lành, gu thưởng thức cà phê thời thượng của dân chill.'
  },
  {
    id: 'd14',
    name: 'Kombucha lựu đỏ lên men tự nhiên',
    category: 'drink',
    price: 50000,
    vegetarian: true,
    emoji: '🍷',
    comment: 'Lăn tăn bọt khí ga tự nhiên, hỗ trợ tiêu hóa sau bữa trưa no ứ nự.'
  },
  {
    id: 'd15',
    name: 'Nước dừa tươi xiêm gọt vỏ',
    category: 'drink',
    price: 25000,
    vegetarian: true,
    emoji: '🥥',
    comment: 'Thuần khiết từ thiên nhiên, ngọt thanh tự nhiên không hạt đường hoá học.'
  },
  {
    id: 'd16',
    name: 'Sữa tươi trân châu đường đen trứ danh',
    category: 'drink',
    price: 50000,
    vegetarian: true,
    emoji: '🧋',
    comment: 'Đường đen chảy vân hổ nghệ thuật, lắc 18 lần trước khi cắm ống hút nha!'
  },
  {
    id: 'd17',
    name: 'Trà mãng cầu xiêm chua ngọt giòn tép',
    category: 'drink',
    price: 35000,
    vegetarian: true,
    emoji: '🍈',
    comment: 'Cơn sốt đường phố một thời, nhai tép mãng cầu chua giòn đã cái nư.'
  },
  {
    id: 'd18',
    name: 'Trà măng cụt hoa đậu biếc đổi màu',
    category: 'drink',
    price: 45000,
    vegetarian: true,
    emoji: '🫐',
    comment: 'Vừa ngon vừa ảo diệu, chụp tấm hình sống ảo đăng story hút nghìn like.'
  },
  {
    id: 'd19',
    name: 'Cà phê muối xứ Huế đậm đà',
    category: 'drink',
    price: 30000,
    vegetarian: true,
    emoji: '☕',
    comment: 'Mặn mặn ngọt ngọt đăng đắng, vị giác thăng hoa sau lớp kem muối bồng bềnh.'
  },
  {
    id: 'd20',
    name: 'Cà phê trứng sủi bọt ngậy béo',
    category: 'drink',
    price: 45000,
    vegetarian: false, // có lòng đỏ trứng gà tươi
    emoji: '🥚',
    comment: 'Kem trứng đánh bông mịn như mây, thơm lừng hương cà phê robusta nồng đượm.'
  },
  {
    id: 'd21',
    name: 'Chè bưởi An Giang cốt dừa nước cốt lá dứa',
    category: 'drink',
    price: 25000,
    vegetarian: true,
    emoji: '🥣',
    comment: 'Cùi bưởi giòn sần sật không chút vị đắng, đậu xanh mềm thơm béo.'
  },
  {
    id: 'd22',
    name: 'Rau má đậu xanh sữa dừa đá xay',
    category: 'drink',
    price: 25000,
    vegetarian: true,
    emoji: '🌿',
    comment: 'Mát gan giải độc, da láng mịn như da em bé chỉ với một ly xanh mướt.'
  },

  // ==========================================
  // 3. ĂN VẶT (SNACK) - 18 món
  // ==========================================
  {
    id: 's01',
    name: 'Bánh tráng trộn khô bò trứng cút',
    category: 'snack',
    price: 25000,
    vegetarian: false,
    emoji: '🥗',
    comment: 'Món ăn vặt huyền thoại mọi cổng trường, ăn một miếng là gắp lia lịa.'
  },
  {
    id: 's02',
    name: 'Bánh tráng nướng Đà Lạt xúc xích phô mai',
    category: 'snack',
    price: 30000,
    vegetarian: false,
    emoji: '🍕',
    comment: 'Pizza Việt Nam phiên bản nướng than hồng, giòn rụm thơm lừng sốt me mayo.'
  },
  {
    id: 's03',
    name: 'Bánh tráng cuốn bơ tỏi chay',
    category: 'snack',
    price: 20000,
    vegetarian: true,
    emoji: '🌯',
    comment: 'Béo ngậy thơm nức mũi hành phi và sốt bơ trứng gà chay thơm lừng.'
  },
  {
    id: 's04',
    name: 'Cá viên chiên nước mắm tỏi ớt',
    category: 'snack',
    price: 45000,
    vegetarian: false,
    emoji: '🍢',
    comment: 'Đảo đẫm nước mắm keo tỏi ớt xào tóp mỡ, hít hà mùi thơm điếc mũi.'
  },
  {
    id: 's05',
    name: 'Đậu hũ chiên giòn lắc phô mai xí muội',
    category: 'snack',
    price: 25000,
    vegetarian: true,
    emoji: '🧀',
    comment: 'Vỏ ngoài giòn tan, bên trong mềm mướt như tan trong miệng.'
  },
  {
    id: 's06',
    name: 'Khoai tây chiên sốt phô mai kéo sợi',
    category: 'snack',
    price: 35000,
    vegetarian: true,
    emoji: '🍟',
    comment: 'Kéo sợi phô mai dài cả mét, ăn một miếng quên hết âu lo đời thường.'
  },
  {
    id: 's07',
    name: 'Bắp xào bơ tôm khô hành hoa',
    category: 'snack',
    price: 25000,
    vegetarian: false,
    emoji: '🌽',
    comment: 'Hạt bắp ngọt lịm óng ả quyện bơ thơm lừng và ruốc tôm mằn mặn.'
  },
  {
    id: 's08',
    name: 'Bắp mỹ hấp lá dứa hạt sen chay',
    category: 'snack',
    price: 20000,
    vegetarian: true,
    emoji: '🌽',
    comment: 'Vị ngọt mộc mạc của đồng quê, nhâm nhi lành bụng không lo mỡ máu.'
  },
  {
    id: 's09',
    name: 'Xoài non lắc muối ớt tôm cay xè',
    category: 'snack',
    price: 25000,
    vegetarian: false,
    emoji: '🥭',
    comment: 'Chua chua cay cay rớt nước miếng, nhìn thôi tuyến nước bọt đã hoạt động hết công suất.'
  },
  {
    id: 's10',
    name: 'Cóc bao tử ngâm chua ngọt giòn tan',
    category: 'snack',
    price: 20000,
    vegetarian: true,
    emoji: '🍏',
    comment: 'Giòn sần sật, ngâm thấm đẫm ớt hiểm cay nồng, ăn tỉnh cả ngủ gật.'
  },
  {
    id: 's11',
    name: 'Chân gà sả tắc rút xương sốt Thái',
    category: 'snack',
    price: 65000,
    vegetarian: false,
    emoji: '🍗',
    comment: 'Giòn sừn sựt đẫm sốt cay ngọt chua thơm nức mùi lá chanh và tắc.'
  },
  {
    id: 's12',
    name: 'Bánh chuối nếp nướng chan nước cốt dừa',
    category: 'snack',
    price: 20000,
    vegetarian: true,
    emoji: '🍌',
    comment: 'Lớp nếp dẻo thơm khói lá chuối, bên trong ngọt lịm chuối sứ chín tới.'
  },
  {
    id: 's13',
    name: 'Nem chua rán phố cổ Hà Nội giòn rụm',
    category: 'snack',
    price: 45000,
    vegetarian: false,
    emoji: '🌭',
    comment: 'Chấm đẫm tương ớt cay nồng, ăn kèm dưa leo giòn rụm chuẩn bài học trò.'
  },
  {
    id: 's14',
    name: 'Khoai lang kén vàng ươm vừng đen',
    category: 'snack',
    price: 25000,
    vegetarian: true,
    emoji: '🍠',
    comment: 'Bên ngoài giòn xốp, bên trong ngọt bùi dẻo quánh hương nước cốt dừa.'
  },
  {
    id: 's15',
    name: 'Trứng cút lộn xào me tỏi ớt tóp mỡ',
    category: 'snack',
    price: 35000,
    vegetarian: false,
    emoji: '🥚',
    comment: 'Sốt me sánh kẹo chua ngọt, chấm bánh mì vét sạch đĩa không chừa giọt nào.'
  },
  {
    id: 's16',
    name: 'Gỏi cuốn tôm thịt chấm tương đen',
    category: 'snack',
    price: 35000,
    vegetarian: false,
    emoji: '🌯',
    comment: 'Thanh đạm mát ruột, tương chấm pha bơ đậu phộng rắc hành phi béo ngậy.'
  },
  {
    id: 's17',
    name: 'Gỏi cuốn chay ngũ sắc sốt mè rang',
    category: 'snack',
    price: 25000,
    vegetarian: true,
    emoji: '🥗',
    comment: 'Rực rỡ sắc màu bắp cải tím, cà rốt, bơ dưa, ăn bao nhiêu cũng không béo.'
  },
  {
    id: 's18',
    name: 'Bánh bao chiên nhân nấm thịt xá xíu',
    category: 'snack',
    price: 25000,
    vegetarian: false,
    emoji: '🥟',
    comment: 'Vỏ vàng ươm giòn tan, nhân xá xíu ứa nước ngọt ngào thơm nức mũi.'
  },

  // ==========================================
  // 4. MÓN NHẬU (PARTY) - 18 món
  // ==========================================
  {
    id: 'p01',
    name: 'Mực một nắng nướng sa tế cay xè',
    category: 'party',
    price: 160000,
    vegetarian: false,
    emoji: '🦑',
    comment: 'Mực dày mình ngọt lịm, nướng than hoa quẹt sa tế tốn bia phải biết!'
  },
  {
    id: 'p02',
    name: 'Tôm sú sốt Thái cay nồng tái chanh',
    category: 'party',
    price: 150000,
    vegetarian: false,
    emoji: '🦐',
    comment: 'Tôm tươi giòn ngọt, sốt cay nồng bật khóc nhưng vẫn đâm đầu chấm tiếp.'
  },
  {
    id: 'p03',
    name: 'Nấm đùi gà nướng mỡ hành muối ớt chay',
    category: 'party',
    price: 55000,
    vegetarian: true,
    emoji: '🍄',
    comment: 'Nấm nướng xèo xèo mọng nước, dai ngọt chẳng thua gì thịt bò thứ thiệt.'
  },
  {
    id: 'p04',
    name: 'Sụn gà rang muối Hồng Kông giòn sần sật',
    category: 'party',
    price: 85000,
    vegetarian: false,
    emoji: '🍗',
    comment: 'Nhai rôm rốp vui tai, muối sả ớt bám đều mặn mà mồi bén số 1.'
  },
  {
    id: 'p05',
    name: 'Đậu hũ lướt ván mỡ hành chấm mắm tôm',
    category: 'party',
    price: 40000,
    vegetarian: false, // mắm tôm
    emoji: '🧈',
    comment: 'Đậu mềm như lụa, lướt chảo vàng mặt, mỡ hành xanh mướt ngậy béo.'
  },
  {
    id: 'p06',
    name: 'Đậu hũ non tẩm bột chiên xù sốt tương cay chay',
    category: 'party',
    price: 40000,
    vegetarian: true,
    emoji: '🧈',
    comment: 'Mồi nhắm chay bất bại, vừa rẻ vừa bén, ngồi lai rai tới bến.'
  },
  {
    id: 'p07',
    name: 'Lạc rang tỏi ớt húng quế mằn mặn',
    category: 'party',
    price: 25000,
    vegetarian: true,
    emoji: '🥜',
    comment: 'Món quốc dân bàn nhậu: đĩa lạc nhỏ nhưng kéo dài câu chuyện thâu đêm.'
  },
  {
    id: 'p08',
    name: 'Bò tơ nướng tảng cuốn rau rừng bánh tráng',
    category: 'party',
    price: 190000,
    vegetarian: false,
    emoji: '🥩',
    comment: 'Thịt bò tơ mềm ngọt cuốn xấp rau rừng chấm mắm nêm đậm vị Củ Chi.'
  },
  {
    id: 'p09',
    name: 'Lẩu bò nhúng giấm ba chỉ cuộn nấm',
    category: 'party',
    price: 260000,
    vegetarian: false,
    emoji: '🍲',
    comment: 'Hơi sang xịn mịn! Nước giấm chua ngọt sôi sục, nhúng thịt mềm mướt.'
  },
  {
    id: 'p10',
    name: 'Lẩu nấm dưỡng sinh thảo mộc chay',
    category: 'party',
    price: 180000,
    vegetarian: true,
    emoji: '🍲',
    comment: 'Thanh lọc cơ thể trên bàn tiệc, 7 loại nấm quý ngọt lành thơm dịu kì.'
  },
  {
    id: 'p11',
    name: 'Ếch xào lăn cốt dừa cà ri béo ngậy',
    category: 'party',
    price: 110000,
    vegetarian: false,
    emoji: '🐸',
    comment: 'Thịt ếch săn chắc ngọt thơm, chấm bánh mì nóng giòn ăn no căng bụng.'
  },
  {
    id: 'p12',
    name: 'Ốc hương sốt trứng muối kéo sợi bánh mì',
    category: 'party',
    price: 140000,
    vegetarian: false,
    emoji: '🐚',
    comment: 'Trứng muối béo ngậy thơm lừng ôm trọn từng con ốc hương giòn ngọt.'
  },
  {
    id: 'p13',
    name: 'Ốc bươu nhồi thịt băm hấp lá gừng',
    category: 'party',
    price: 95000,
    vegetarian: false,
    emoji: '🐌',
    comment: 'Rút cọng sả húp ngụm nước ốc ngọt lịm cay ấm cả khoang miệng.'
  },
  {
    id: 'p14',
    name: 'Rau củ luộc kho quẹt tôm khô tóp mỡ',
    category: 'party',
    price: 75000,
    vegetarian: false,
    emoji: '🥦',
    comment: 'Đĩa rau xanh mát quệt chảo kho quẹt keo sền sệt mặn ngọt đậm đà.'
  },
  {
    id: 'p15',
    name: 'Rau củ thập cẩm luộc chấm kho quẹt nấm chay',
    category: 'party',
    price: 55000,
    vegetarian: true,
    emoji: '🥦',
    comment: 'Kho quẹt làm từ đậu nấm rim đường thốt nốt, quẹt hết đĩa rau vẫn thèm.'
  },
  {
    id: 'p16',
    name: 'Dê xào xả ớt lăn vừng mè nóng hổi',
    category: 'party',
    price: 145000,
    vegetarian: false,
    emoji: '🐐',
    comment: 'Thịt dê thơm nức không chút mùi hôi, cay nồng ấm lòng những ngày mưa.'
  },
  {
    id: 'p17',
    name: 'Thịt ba chỉ nướng kim chi kiểu Hàn Quốc',
    category: 'party',
    price: 130000,
    vegetarian: false,
    emoji: '🥓',
    comment: 'Xèo xèo trên vỉ nướng, cuốn xà lách chấm ssamjang cay nồng say đắm.'
  },
  {
    id: 'p18',
    name: 'Thịt nướng xông khói áp chảo sốt tiêu đen',
    category: 'party',
    price: 120000,
    vegetarian: false,
    emoji: '🍖',
    comment: 'Hương khói thơm quyến rũ, cắn miếng thịt mọng nước thấm đẫm tiêu hạt.'
  }
];

// Helper để lấy danh sách theo danh mục hoặc bộ lọc
export function getFilteredDishes({ category = 'all', maxBudget = Infinity, onlyVegetarian = false } = {}) {
  return DISHES.filter(dish => {
    const matchCategory = category === 'all' || dish.category === category;
    const matchBudget = dish.price <= maxBudget;
    const matchVeg = onlyVegetarian ? dish.vegetarian === true : true;
    return matchCategory && matchBudget && matchVeg;
  });
}
