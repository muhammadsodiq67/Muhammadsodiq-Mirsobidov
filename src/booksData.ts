export interface Chapter {
  title: string;
  pages: string;
  excerpt: string;
}

export interface Book {
  id: string;
  title: string;
  grade: number;
  subject: string;
  author: string;
  year: number;
  pages: number;
  coverColor: string;
  icon: string;
  description: string;
  chapters: Chapter[];
}

export const schoolBooks: Book[] = [
  // 1-Sinf
  {
    id: "b_1_1",
    title: "Alifbe",
    grade: 1,
    subject: "Ona tili",
    author: "K. Qosimov, S. Fuzailov",
    year: 2023,
    pages: 120,
    coverColor: "from-blue-500 to-indigo-600",
    icon: "BookOpen",
    description: "Birinchi sinf o'quvchilari uchun harf va tovushlarni o'rgatuvchi asosiy qo'llanma.",
    chapters: [
      { title: "A va O tovushlari va harflari", pages: "4-15", excerpt: "A va O tovushlarining talaffuzi va yozilishi. Bo'g'inli o'qish mashqlari." },
      { title: "M, N, B, T harflari bilan tanishuv", pages: "16-32", excerpt: "Harflarni bir-biriga qo'shib bo'g'inlar va sodda so'zlar tuzish." },
      { title: "Kishi ismlari, katta harflar imlosi", pages: "33-50", excerpt: "Gap boshida va kishi ismlarida bosh harfning ishlatilishi." },
      { title: "O'qish va yozish ko'nikmalarini rivojlantirish", pages: "51-120", excerpt: "Kichik matnlar va hikoyalarni ifodali o'qish hamda chiroyli yozuv sirlari." }
    ]
  },
  {
    id: "b_1_2",
    title: "Matematika",
    grade: 1,
    subject: "Matematika",
    author: "M. Jumaev, B. Toshmurodov",
    year: 2023,
    pages: 160,
    coverColor: "from-emerald-500 to-teal-600",
    icon: "Calculator",
    description: "Sodda arifmetik amallar, shakllar va 10 ichida hisoblash asoslari.",
    chapters: [
      { title: "Narsalarning xossalari va guruhlar", pages: "5-25", excerpt: "Rangi, shakli, o'lchami bo'yicha guruhlash. Katta-kichik, baland-past tushunchalari." },
      { title: "1 dan 5 gacha bo'lgan sonlar", pages: "26-60", excerpt: "Sonlarni yozish, taqqoslash va qo'shish-ayirish amallari." },
      { title: "6 dan 10 gacha bo'lgan sonlar", pages: "61-110", excerpt: "O'nlik tushunchasi, geometrik shakllar (uchburchak, to'rtburchak, doira)." },
      { title: "10 ichida amallarni mustahkamlash", pages: "111-160", excerpt: "Matnli oddiy masalalar va mantiqiy savollar." }
    ]
  },
  {
    id: "b_1_3",
    title: "Tarbiya",
    grade: 1,
    subject: "Ma'naviyat",
    author: "A. Madvaliev, S. Tursunova",
    year: 2023,
    pages: 96,
    coverColor: "from-rose-500 to-pink-600",
    icon: "Heart",
    description: "Odob-axloq, vatanparvarlik va kattalarga hurmat ko'nikmalarini shakllantirish darsligi.",
    chapters: [
      { title: "Oila va men", pages: "4-18", excerpt: "Oiladagi muomala madaniyati, ota-onani hurmat qilish." },
      { title: "Sinfdoshlar va do'stlik", pages: "19-40", excerpt: "Maktabdagi birinchi kunlar va do'stlar bilan ahil yashash qoidalari." },
      { title: "Tabiatni asraymiz", pages: "41-65", excerpt: "Gullar dardi, hayvonlarga nisbatan shafqatli bo'lish." },
      { title: "Sog'lom hayot - quvnoq hayot", pages: "66-96", excerpt: "Kun tartibi, gigiyena qoidalari va jismoniy tarbiya ahamiyati." }
    ]
  },

  // 2-Sinf
  {
    id: "b_2_1",
    title: "Ona Tili va O'qish Savodxonligi",
    grade: 2,
    subject: "Ona tili",
    author: "R. Safarova va boshqalar",
    year: 2022,
    pages: 144,
    coverColor: "from-blue-600 to-cyan-500",
    icon: "BookOpen",
    description: "Bo'g'inlar, so'z turkumlari, to'g'ri o'qish va bayon qilish mahorati.",
    chapters: [
      { title: "Nutq va gap", pages: "5-28", excerpt: "Og'zaki va yozma nutq farqlari. Gap oxirida tinish belgilari." },
      { title: "Unli va undosh tovushlar imlosi", pages: "29-65", excerpt: "Yangi imlo qoidalariga ko'ra so'zlarni bo'g'inga bo'lish va ko'chirish." },
      { title: "So'z va uning ma'nosi", pages: "66-105", excerpt: "Ma'nodosh va qarama-qarshi ma'noli so'zlar bilan ishlash." },
      { title: "Sodda matnlar tahlili", pages: "106-144", excerpt: "O'qilgan hikoyalarning g'oyasini tushunish va qayta hikoya qilish." }
    ]
  },
  {
    id: "b_2_2",
    title: "Matematika",
    grade: 2,
    subject: "Matematika",
    author: "N. Abduraxmonova",
    year: 2022,
    pages: 176,
    coverColor: "from-teal-500 to-green-600",
    icon: "Calculator",
    description: "100 ichida qo'shish va ayirish, ko'paytirish jadvaliga kirish darsligi.",
    chapters: [
      { title: "Ikki xonali sonlar ustida amallar", pages: "4-45", excerpt: "100gacha bo'lgan sonlarni taqqoslash va birlik, o'nliklar tizimi." },
      { title: "Uzunlik, og'irlik va vaqt o'lchovlari", pages: "46-85", excerpt: "Santimetr, detsimetr va metr. Kilogramm tushunchasi. Soatni o'rganish." },
      { title: "Ko'paytirish va bo'lish amali", pages: "86-135", excerpt: "2 va 3 sonlariga ko'paytirish jadvali bilan tanishuv." },
      { title: "Geometrik masalalar", pages: "136-176", excerpt: "Kvadrat va to'g'ri to'rtburchakning perimetrini topish." }
    ]
  },
  {
    id: "b_2_3",
    title: "Tabiiy Fanlar (Science)",
    grade: 2,
    subject: "Tabiiy fanlar",
    author: "S. Maxmudova",
    year: 2022,
    pages: 112,
    coverColor: "from-amber-500 to-orange-600",
    icon: "Compass",
    description: "Atrofdagi dunyo, o'simliklar, hayvonot olami va ob-havo hodisalari.",
    chapters: [
      { title: "Atrof-muhit va biz", pages: "5-25", excerpt: "Tirik va jonsiz tabiat ob'ektlari farqi." },
      { title: "O'simliklar hayoti", pages: "26-55", excerpt: "O'simlikning qismlari, ularning o'sishi uchun zarur sharoitlar." },
      { title: "Fasllar almashinuvi", pages: "56-85", excerpt: "Bahor, yoz, kuz, qish fasllari va hayvonot olamidagi o'zgarishlar." },
      { title: "Kosmos va Yer", pages: "86-112", excerpt: "Sun'iy va tabiiy yorug'lik manbalari, Quyosh va Yer harakati." }
    ]
  },

  // 3-Sinf
  {
    id: "b_3_1",
    title: "Ona Tili va O'qish Savodxonligi",
    grade: 3,
    subject: "Ona tili",
    author: "R. Safarova, M. Inoyatova",
    year: 2023,
    pages: 160,
    coverColor: "from-blue-500 to-indigo-600",
    icon: "BookOpen",
    description: "Gap bo'laklari, sifat va turdosh otlar tizimi, ijodiy matn yozish sirlari.",
    chapters: [
      { title: "Gapning bosh bo'laklari", pages: "4-35", excerpt: "Ega va kesim munosabatlari. Sodda yoyiq gaplar tuzish." },
      { title: "Ot va uning so'roqlari", pages: "36-70", excerpt: "Kim? nima? so'rog'iga javob bo'luvchi so'zlar, egalik qo'shimchalari." },
      { title: "Sifatning so'z turkumi sifatidagi orni", pages: "71-110", excerpt: "Qanday? qanaqa? so'roqlari, narsalarning rang-tusi va xususiyatlari." },
      { title: "Insho va bayon yozishga tayyorgarlik", pages: "111-160", excerpt: "Rasm asosida kichik hikoyalar yozish ko'nikmalari." }
    ]
  },
  {
    id: "b_3_2",
    title: "Matematika",
    grade: 3,
    subject: "Matematika",
    author: "S. Burxonov va boshqalar",
    year: 2023,
    pages: 192,
    coverColor: "from-emerald-500 to-teal-600",
    icon: "Calculator",
    description: "1000 ichida amallar, ko'paytirish va bo'lish jadvalini to'liq o'rganish.",
    chapters: [
      { title: "1000 ichida raqamlash va xonalar", pages: "5-45", excerpt: "Xonalar yig'indisi ko'rinishida yozish va xona qo'shiluvchilari." },
      { title: "Ko'paytirish va bo'lish amallari jadvali", pages: "46-110", excerpt: "4 dan 9 gacha bo'lgan barcha sonlar uchun ko'paytirish jadvali." },
      { title: "Uch xonali sonlar ustida ustun usulida amallar", pages: "111-155", excerpt: "Qo'shish va ayirishni ustun shaklida hisoblash." },
      { title: "Sodda tenglamalar va ularni yechish", pages: "156-192", excerpt: "Noma'lum qo'shiluvchi va kamayuvchini topish formulalari." }
    ]
  },

  // 4-Sinf
  {
    id: "b_4_1",
    title: "Ona Tili va O'qish Savodxonligi",
    grade: 4,
    subject: "Ona tili",
    author: "R. Safarova, Sh. Nurullaeva",
    year: 2020,
    pages: 176,
    coverColor: "from-blue-700 to-sky-600",
    icon: "BookOpen",
    description: "So'z yasalishi, fe'l zamonlari va boshlang'ich maktab yakuniy darsligi.",
    chapters: [
      { title: "Fe'l va uning zamonlari", pages: "4-40", excerpt: "O'tgan, hozirgi va kelgusi zamon fe'llarining farqlari va qo'shimchalari." },
      { title: "Son - so'z turkumi", pages: "41-75", excerpt: "Sanoq va tartib sonlar, ularning gapda qo'llanilishi." },
      { title: "Kombinatsiyalangan matnlar bilan ishlash", pages: "76-120", excerpt: "Ma'lumotlar jadvali va grafiklardagi matnlarni tushunish." },
      { title: "Yakuniy takrorlash va testlar", pages: "121-176", excerpt: "Boshlang'ich sinfda o'rganilgan barcha qoidalarni mustahkamlash darslari." }
    ]
  },
  {
    id: "b_4_2",
    title: "Matematika",
    grade: 4,
    subject: "Matematika",
    author: "M. Loran",
    year: 2020,
    pages: 208,
    coverColor: "from-teal-600 to-cyan-700",
    icon: "Calculator",
    description: "Ko'p xonali sonlar ustida to'rt amal, boshlang'ich geometriya asoslari.",
    chapters: [
      { title: "Kop xonali sonlar va xona sinflari", pages: "5-50", excerpt: "Millionliklar va milliardliklar sinfi haqida tushuncha." },
      { title: "Ko'p xonali sonlarni yozma ko'paytirish va bo'lish", pages: "51-125", excerpt: "Ikki va uch xonali sonlarga burchakli bo'lish usullari." },
      { title: "Tezlik, vaqt va masofa masalalari", pages: "126-170", excerpt: "Harakatga doir murakkabroq masalalarni formula orqali echish." },
      { title: "Geometrik jismlar va hajm", pages: "171-208", excerpt: "Kub va parallelepipedning hajmini o'lchash va hisoblash." }
    ]
  },

  // 5-Sinf
  {
    id: "b_5_1",
    title: "Ona Tili",
    grade: 5,
    subject: "Ona tili",
    author: "N. Maxmudov, A. Sobirov",
    year: 2021,
    pages: 224,
    coverColor: "from-indigo-500 to-blue-700",
    icon: "BookOpen",
    description: "Fonetika, orfografiya va so'z o'zgarishi qonuniyatlari kirish darsligi.",
    chapters: [
      { title: "Fonetika va grafika", pages: "5-48", excerpt: "Tovushlar va harflar munosabati, tovush o'zgarishlari (tushishi, ortishi, almashishi)." },
      { title: "Leksikologiya", pages: "49-98", excerpt: "So'zning leksik ma'nosi, omonim, sinonim, antonim va ko'p ma'noli so'zlar." },
      { title: "Morfemika va sozning tarkibi", pages: "99-158", excerpt: "Asos va qo'shimcha, so'z yasovchi va shakl yasovchi qo'shimchalar farqi." },
      { title: "Orfografiya qoidalari", pages: "159-224", excerpt: "Asos va qo'shimchalar tutashgan o'rinda harflarning to'g'ri yozilishi." }
    ]
  },
  {
    id: "b_5_2",
    title: "Adabiyot",
    grade: 5,
    subject: "Adabiyot",
    author: "S. Quronov va boshqalar",
    year: 2021,
    pages: 256,
    coverColor: "from-amber-600 to-orange-700",
    icon: "BookOpen",
    description: "Xalq og'zaki ijodi, ertaklar, dostonlar va mumtoz o'zbek adiblari ijodidan namunalar.",
    chapters: [
      { title: "Xalq og'zaki ijodi javohirlari", pages: "4-55", excerpt: "Ertaklar, maqollar va topishmoqlar, o'zbek xalq dostonlarining o'ziga xosligi." },
      { title: "Alisher Navoiy hayoti va g'azallari", pages: "56-110", excerpt: "Navoiyning bolaligi, uning hikmatli asarlari va g'azallari tahlili." },
      { title: "G'afur G'ulom - Shum bola hikoyasi", pages: "111-180", excerpt: "Asardagi yumor, o'zbekona urf-odatlar va sarguzashtlar tahlili." },
      { title: "Jahon adabiyoti durdonalari", pages: "181-256", excerpt: "Hans Kristian Andersen va birodarlar Grimmlar ertaklari." }
    ]
  },
  {
    id: "b_5_3",
    title: "Matematika",
    grade: 5,
    subject: "Matematika",
    author: "B. Toshmurodov, A. Rasulov",
    year: 2021,
    pages: 288,
    coverColor: "from-teal-600 to-emerald-700",
    icon: "Calculator",
    description: "Kasrlar ustida amallar, natural sonlar va boshlang'ich algebra elementlari.",
    chapters: [
      { title: "Natural sonlar va ular ustida amallar", pages: "5-68", excerpt: "Qo'shish va ko'paytirishning qonuniyatlari, daraja tushunchasi." },
      { title: "Oddiy kasrlar", pages: "69-140", excerpt: "Sural va maxraj, to'g'ri va noto'g'ri kasrlar, kasrlarni qisqartirish." },
      { title: "O'nli kasrlar", pages: "141-220", excerpt: "O'nli kasrlarni qo'shish, ayirish, ko'paytirish va bo'lish algoritmlari." },
      { title: "Foiz tushunchasi va sodda amaliy masalalar", pages: "221-288", excerpt: "Sondan foizni topish va foizga doir iqtisodiy masalalar yechimi." }
    ]
  },

  // 6-Sinf
  {
    id: "b_6_1",
    title: "Botanika (Biologiya)",
    grade: 6,
    subject: "Biologiya",
    author: "J. Pratov, K. Tojibaev",
    year: 2022,
    pages: 192,
    coverColor: "from-green-600 to-emerald-500",
    icon: "Compass",
    description: "O'simliklar dunyosi, hujayra tuzilishi va tabiiy florani o'rganish darsligi.",
    chapters: [
      { title: "Botanika faniga kirish, o'simlik xujayrasi", pages: "5-35", excerpt: "Mikroskop ostida hujayra tuzilishi, plastidalar va qobiq sirlari." },
      { title: "Ildiz va uning turlari", pages: "36-70", excerpt: "Ildiz tizimi turlari, ildizning shimish va tuproqda mahkamlash vazifasi." },
      { title: "Gullash va meva hosil bo'lishi", pages: "71-125", excerpt: "Changlanish, urug'lanish va mevalarning turli shakllari." },
      { title: "O'zbekistonning dorivor va nodir o'simliklari", pages: "126-192", excerpt: "Qizil kitobga kiritilgan muhofaza qilinuvchi o'simliklar ro'yxati." }
    ]
  },
  {
    id: "b_6_2",
    title: "Matematika",
    grade: 6,
    subject: "Matematika",
    author: "M. Mirzaev, S. Karimov",
    year: 2022,
    pages: 256,
    coverColor: "from-teal-500 to-indigo-600",
    icon: "Calculator",
    description: "Ratsional sonlar, nisbat va mutanosiblik, koordinatalar tekisligi.",
    chapters: [
      { title: "Nisbat va proporsiya", pages: "4-50", excerpt: "Proporsiyaning asosiy xossasi, to'g'ri va teskari mutanosibliklar." },
      { title: "Musbat va manfiy sonlar ustida amallar", pages: "51-120", excerpt: "Qarama-qarshi sonlar va modul tushunchasi, butun sonlarni qo'shish." },
      { title: "Ratsional sonlar", pages: "121-190", excerpt: "Ratsional sonlar ustida to'rt amalni bajarish qoidalari." },
      { title: "Koordinata tekisligi", pages: "191-256", excerpt: "Nuqta koordinatalarini aniqlash va tekislikda shakllar chizish." }
    ]
  },
  {
    id: "b_6_3",
    title: "Qadimgi Dunyo Tarixi",
    grade: 6,
    subject: "Tarix",
    author: "A. Sagdullaev, V. Kostetskiy",
    year: 2022,
    pages: 208,
    coverColor: "from-yellow-700 to-amber-800",
    icon: "Compass",
    description: "Ibtidoiy jamiyat, Qadimgi Misr, Rim, Gretsiya va O'rta Osiyo xalqlari tarixi.",
    chapters: [
      { title: "Ibtidoiy jamoa tuzumi", pages: "5-30", excerpt: "Insoniyatning paydo bo'lishi, tosh va bronza davrlari taraqqiyoti." },
      { title: "Qadimgi Misr va Bobil podsholigi", pages: "31-75", excerpt: "Nil bo'yidagi madaniyat, fir'avnlar, piramidalar va Mixxat yozuvlari." },
      { title: "Qadimgi Yunoniston va Rim imperiyasi", pages: "76-145", excerpt: "Sparta, Afina demokratiyasi, buyuk imperatorlar va Rim shahri tarixi." },
      { title: "Eng qadimgi o'lkalar - Baqtriya va So'g'diyona", pages: "146-208", excerpt: "O'rta Osiyodagi eng qadimgi davlatlar va arxeologik yodgorliklar." }
    ]
  },

  // 7-Sinf
  {
    id: "b_7_1",
    title: "Algebra",
    grade: 7,
    subject: "Matematika",
    author: "Sh. Alimov, O. Xolmuhamedov",
    year: 2021,
    pages: 240,
    coverColor: "from-teal-600 to-emerald-800",
    icon: "Calculator",
    description: "Birhadlar va ko'phadlar, qisqa ko'paytirish formulalari va chiziqli tenglamalar.",
    chapters: [
      { title: "Algebraik ifodalar", pages: "5-40", excerpt: "Sonli va harfli ifodalar, o'zgaruvchilar va ularning qiymatlari." },
      { title: "Birhadlar va ko'phadlar", pages: "41-100", excerpt: "Birhadlarni ko'paytirish, ko'phadlarni qo'shish va ko'paytirish qoidalari." },
      { title: "Qisqa ko'paytirish formulalari", pages: "101-165", excerpt: "Kvadratlar ayirmasi, yig'indining kvadrati va kublari shakllari." },
      { title: "Chiziqli tenglamalar tizimi", pages: "166-240", excerpt: "Ikki o'zgaruvchili tenglamalarni o'rniga qo'yish va chiziqli qo'shish usullarida yechish." }
    ]
  },
  {
    id: "b_7_2",
    title: "Geometriya",
    grade: 7,
    subject: "Matematika",
    author: "A. Rahimov, N. Jumayev",
    year: 2021,
    pages: 144,
    coverColor: "from-indigo-600 to-blue-800",
    icon: "Calculator",
    description: "Uchburchaklar, parallel to'g'ri chiziqlar va boshlang'ich teoremalar.",
    chapters: [
      { title: "Boshlang'ich tushunchalar", pages: "5-30", excerpt: "Nuqta, to'g'ri chiziq, nur va burchaklar. Burchak turlari." },
      { title: "Uchburchaklarning tenglik alomatlari", pages: "31-75", excerpt: "Birinchi, ikkinchi va uchinchi tenglik alomatlarining isboti." },
      { title: "To'g'ri chiziqlarning parallelligi", pages: "76-110", excerpt: "Parallel chiziqlar aksiomasi, kesishganda hosil bo'lgan ichki burchaklar xossalari." },
      { title: "Geometrik yasashlar", pages: "111-144", excerpt: "Sirkul va chizg'ich yordamida burchak bissektrisasini yasash." }
    ]
  },
  {
    id: "b_7_3",
    title: "Fizika",
    grade: 7,
    subject: "Fizika",
    author: "P. Habibullaev, A. Boydedaqov",
    year: 2021,
    pages: 176,
    coverColor: "from-sky-600 to-blue-700",
    icon: "Zap",
    description: "Mexanika asoslari, tezlik, kuch, press va bosim o'rganish darsligi.",
    chapters: [
      { title: "Fizika nimani o'rganadi? Fizik o'lchovlar", pages: "5-32", excerpt: "Tabiat hodisalari, materiya, asboblar xatoligi va xalqaro birliklar tizimi (SI)." },
      { title: "To'g'ri chiziqli tekis harakat", pages: "33-72", excerpt: "Tezlik va tezlanish tushunchalari, yo'l formulalari." },
      { title: "Tabiatdagi kuchlar va Nyuton qonunlari", pages: "73-125", excerpt: "Og'irlik kuchi, ishqalanish kuchi va elastiklik. Inersiya tushunchasi." },
      { title: "Qattiq jismlar, suyuqliklar va gazlar bosimi", pages: "126-176", excerpt: "Paskal qonuni, gidravlik press va Arximed kuchi hodisasi." }
    ]
  },

  // 8-Sinf
  {
    id: "b_8_1",
    title: "Algebra",
    grade: 8,
    subject: "Matematika",
    author: "Sh. Alimov, H. Halimov",
    year: 2022,
    pages: 224,
    coverColor: "from-teal-700 to-emerald-900",
    icon: "Calculator",
    description: "Kvadrat ildizlar, kvadrat tenglamalar, tengsizliklar va irratsional algebraik shakllar.",
    chapters: [
      { title: "Haqiqiy sonlar va kvadrat ildizlar", pages: "5-50", excerpt: "Irratsional sonlar tushunchasi va ildizdan chiqarish amallari." },
      { title: "Kvadrat tenglamalar va Viyet teoremasi", pages: "51-120", excerpt: "Diskriminant formulasi, to'liq va chala kvadrat tenglamalar, Viyet qoidasi." },
      { title: "Tengsizliklar va ularning xossalari", pages: "121-175", excerpt: "Sonli tengsizliklarni qo'shish va ko'paytirish, tengsizliklar tizimi yechimi." },
      { title: "Daraja xossalari", pages: "176-224", excerpt: "Butun ko'rsatkichli daraja xususiyatlari va ularni soddalashtirish." }
    ]
  },
  {
    id: "b_8_2",
    title: "Kimyo",
    grade: 8,
    subject: "Kimyo",
    author: "I. Asqarov, N. Toxtaboev",
    year: 2022,
    pages: 192,
    coverColor: "from-rose-600 to-red-800",
    icon: "Zap",
    description: "Kimyoning asosiy qonunlari, Mendeleev davriy jadvali, atom tuzilishi va kimyoviy bog'lanish.",
    chapters: [
      { title: "Kimyoning asosiy qonunlari", pages: "5-40", excerpt: "Modda massasining saqlanish qonuni, doimiylik va Avogadro aksiomasi." },
      { title: "Mendeleyev davriy qonuni", pages: "41-90", excerpt: "Davrlar va guruhlar, metallar va nometallarning o'zgarish qonuniyati." },
      { title: "Atom tuzilishi", pages: "91-135", excerpt: "Protonlar, neytronlar, elektronlar va energetik pog'onalar tuzilishi." },
      { title: "Kimyoviy bog'lanish turlari", pages: "136-192", excerpt: "Kovalent, ion, metall va vodorod bog'lanishlar tafovuti." }
    ]
  },
  {
    id: "b_8_3",
    title: "Odam va uning salomatligi (Biologiya)",
    grade: 8,
    subject: "Biologiya",
    author: "J. Qodirov, S. Mirzayev",
    year: 2022,
    pages: 208,
    coverColor: "from-emerald-600 to-green-700",
    icon: "Compass",
    description: "Inson tanasi anatomiyasi, organlar tizimi va salomatlik gigiyenasi.",
    chapters: [
      { title: "Inson organizmiga umumiy tavsif", pages: "5-30", excerpt: "To'qimalar (epiteliy, biriktiruvchi, mushak, nerv) va gomeostaz barqarorligi." },
      { title: "Tayanch-harakat tizimi", pages: "31-70", excerpt: "Skelet suyaklari tuzilishi, bo'g'imlar va mushaklarning ishlash mexanizmi." },
      { title: "Yurak va qon aylanish tizimi", pages: "71-120", excerpt: "Katta va kichik qon aylanish doiralari, yurak klapanlari ishi." },
      { title: "Nerv tizimi va oliy nerv faoliyati", pages: "121-208", excerpt: "Bosh orqa miya tuzilishi, reflekslar, uyqu va xotira mohiyati." }
    ]
  },

  // 9-Sinf
  {
    id: "b_9_1",
    title: "Algebra",
    grade: 9,
    subject: "Matematika",
    author: "Sh. Alimov, Yu. Kolyagin",
    year: 2020,
    pages: 240,
    coverColor: "from-teal-600 to-teal-900",
    icon: "Calculator",
    description: "Trigonometriya elementalari, ketma-ketliklar, progressiyalar va ehtimollar nazariyasi.",
    chapters: [
      { title: "Trigonometrik munosabatlar", pages: "5-55", excerpt: "Sinus, kosinus, tangens va kotangens burchaklar ostida qiymatlari." },
      { title: "Sonli ketma-ketliklar va progressiyalar", pages: "56-120", excerpt: "Arifmetik va geometrik progressiya hadlarini topish formulalari." },
      { title: "Ehtimollar nazariyasi elementlari", pages: "121-170", excerpt: "Hodisalar, kombinatorika qoidalari va o'rtacha qiymat hisoblash." },
      { title: "Yakuniy takrorlash", pages: "171-240", excerpt: "To'qqizinchi sinfgacha o'tilgan barcha algebra savollari jamlanmasi." }
    ]
  },
  {
    id: "b_9_2",
    title: "Fizika",
    grade: 9,
    subject: "Fizika",
    author: "M. Qoriyev, N. Toshxojayev",
    year: 2020,
    pages: 224,
    coverColor: "from-sky-700 to-indigo-800",
    icon: "Zap",
    description: "Elektrodinamika, elektr toki, magnit maydoni va elektromagnit to'lqinlar.",
    chapters: [
      { title: "Elektr maydoni va Kulon qonuni", pages: "5-45", excerpt: "Zaryadlangan zarralar, elektr maydon kuchlanganligi." },
      { title: "O'zgarmas elektr toki", pages: "46-105", excerpt: "Om qonuni, zanjirning parallel va ketma-ket ulanishi, tok kuchi." },
      { title: "Magnit maydoni", pages: "106-160", excerpt: "Amper kuchi, Lorens kuchi va magnit induksiyasi hodisasi." },
      { title: "Yorug'lik hodisalari", pages: "161-224", excerpt: "Yorug'likning qaytishi, sinishi va optik linzalar tizimi." }
    ]
  },

  // 10-Sinf
  {
    id: "b_10_1",
    title: "Algebra va Analiz Asoslari",
    grade: 10,
    subject: "Matematika",
    author: "M. Mirzaev, Sh. Alimov",
    year: 2021,
    pages: 272,
    coverColor: "from-teal-800 to-cyan-900",
    icon: "Calculator",
    description: "Funksiyalar, kosinuslar va sinuslar teoremalari, limitlar va hosilaga kirish.",
    chapters: [
      { title: "Funksiyalar va ularning xossalari", pages: "5-60", excerpt: "Toq va juft funksiyalar, davriy va teskari funksiya tushunchalari." },
      { title: "Trigonometrik tenglamalar", pages: "61-135", excerpt: "Sodda trigonometrik tenglamalar va ularni yechish usullari." },
      { title: "Hosilaga kirish", pages: "136-210", excerpt: "Funksiya orttirmasi, hosila geometrik va fizik ma'nosi." },
      { title: "Hosilaning tatbiqlari", pages: "211-272", excerpt: "Funksiyaning o'sish va kamayish oraliqlarini topish, ekstremum nuqtalar." }
    ]
  },
  {
    id: "b_10_2",
    title: "O'zbekiston Tarixi",
    grade: 10,
    subject: "Tarix",
    author: "Q. Usmonov, M. Sodiqov",
    year: 2021,
    pages: 256,
    coverColor: "from-amber-700 to-yellow-950",
    icon: "Compass",
    description: "XIX asr oxiridan boshlab mustaqillik arafasigacha bo'lgan davrdagi O'zbekiston siyosiy va ijtimoiy hayoti.",
    chapters: [
      { title: "Chor Rossiyasi mustamlakachiligi", pages: "5-55", excerpt: "Turkiston general-gubernatorligi tashkil etilishi, iqtisodiy asoratlar." },
      { title: "Jadidchilik harakati va Turkiston muxtoriyati", pages: "56-115", excerpt: "Behbudiy, Fitrat, Cho'lpon hayoti, jadid maktablari va mustaqillik orzusi." },
      { title: "Ikkinchi jahon urushi davri va o'zbek xalqi jasorati", pages: "116-190", excerpt: "Front orqasidagi qiyinchiliklar, evakuatsiya qilingan bolalarni qabul qilish." },
      { title: "Mustaqillikka intilish davri", pages: "191-256", excerpt: "Milliy o'zlikni anglashning kuchayishi, o'zbek tiliga davlat tili statusining berilishi." }
    ]
  },

  // 11-Sinf
  {
    id: "b_11_1",
    title: "Algebra va Analiz Asoslari",
    grade: 11,
    subject: "Matematika",
    author: "M. Mirzaev, J. Azimov",
    year: 2022,
    pages: 288,
    coverColor: "from-emerald-800 to-indigo-950",
    icon: "Calculator",
    description: "Boshlang'ich funksiya, integrallar, stereometriya va makon geometriyasi.",
    chapters: [
      { title: "Boshlang'ich funksiya va integral", pages: "5-65", excerpt: "Aniq va aniqmas integral tushunchalari, Nyuton-Leybnits formulasi." },
      { title: "Stereometriya aksiomalari", pages: "66-120", excerpt: "Fazoda to'g'ri chiziq va tekisliklar munosabati, parallellik alomatlari." },
      { title: "Ko'pyoqlar va ularning sirtlari", pages: "121-200", excerpt: "Prizma, piramida, paralelepiped va ularning to'la sirti hajmi." },
      { title: "Aylanish jismlari", pages: "201-288", excerpt: "Tsilindr, konus va shar hajmlarini hisoblash formulalari." }
    ]
  },
  {
    id: "b_11_2",
    title: "Informatika va Axborot Texnologiyalari",
    grade: 11,
    subject: "Informatika",
    author: "M. Fayziyeva va boshqalar",
    year: 2022,
    pages: 160,
    coverColor: "from-blue-900 to-indigo-950",
    icon: "Compass",
    description: "Sun'iy intellekt, ma'lumotlar bazasi, dasturlash va kibexavfsizlik asoslari darsligi.",
    chapters: [
      { title: "Sun'iy intellekt texnologiyalari", pages: "4-35", excerpt: "Neyron tarmoqlar, kompyuter ko'rish va tabiiy tilni qayta ishlash asoslari." },
      { title: "Python dasturlash tilida murakkab loyihalar", pages: "36-80", excerpt: "Ma'lumotlar tahlili, Pandas va NumPy kutubxonalari bilan ishlash." },
      { title: "Kiberxavfsizlik va axborot himoyasi", pages: "81-120", excerpt: "Shifrlash usullari, zararli dasturlar va xavfsiz tarmoq me'morchiligi." },
      { title: "Veb loyihalar yaratish", pages: "121-160", excerpt: "HTML/CSS/JS bilan birga zamonaviy JavaScript freymvorklari va amaliyot vizualizatsiyasi." }
    ]
  }
];
