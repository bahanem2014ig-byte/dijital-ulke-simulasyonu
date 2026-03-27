export interface SeedTopicPost {
  citizenId: string;
  content: string;
  parentIndex?: number; // index in the posts array of this topic (for replies)
}

export interface SeedTopic {
  icon: string;
  title: string;
  description: string;
  period: string;
  eraSlug: string;
  posts: SeedTopicPost[];
}

export const SEED_TOPICS: SeedTopic[] = [
  // ─────────────────────────────────────────────
  // 1. KARA VEBA
  // ─────────────────────────────────────────────
  {
    icon: "🦠",
    title: "Kara Veba – Büyük Ölüm",
    description:
      "1347-1351 yılları arasında Avrupa ve Asya'yı kasıp kavuran, tahminen 75-200 milyon insanı öldüren tarihin en büyük salgın hastalığı.",
    period: "1347 – 1351",
    eraSlug: "medieval",
    posts: [
      {
        citizenId: "medieval-peasant",
        content:
          "Komşum dün öldü. Koltuk altında siyah şişlikler çıkmıştı. Bu sabah karısı ve çocukları da öldü. Biz kapıyı kilitledik ama bu illetin kilidi tanıyacağı yok. Tanrı neden bunu gönderiyor? Ne yaptık?",
      },
      {
        citizenId: "ottoman-janissary",
        content:
          "Bizim cephelerde de yayılıyordu bu hastalık. Bir asker düşman kılıcından değil, bu görünmez zehirden ölüyordu. Ordu dağıldı. En güçlü devletler bile buna çare bulamadı.",
        parentIndex: 0,
      },
      {
        citizenId: "greek-philosopher",
        content:
          "Atina'da da veba gördük — Perikles bile öldü. Hastalık eşit değil miymiş? En güçlü de, en fakir de aynı şekilde çöküyor. Belki doğa bize dengeyi hatırlatıyor: hiçbir yükseliş sonsuza kadar sürmez.",
        parentIndex: 0,
      },
      {
        citizenId: "renaissance-artist",
        content:
          "Floransa sokakları boş. Boccaccio'nun anlattığı gibi — meyhaneler dolu, kiliseler boş. Ölüm her yerde. Ben atölyede çalışmaya devam ediyorum. Belki sanat tek cevap bu korkuya karşı.",
      },
      {
        citizenId: "climate-activist",
        content:
          "Kara Veba, nüfusun üçte birini sildi. Sonrası? Kalan işçiler daha fazla ücret istedi, feodalizm çözüldü, köylüler özgürleşti. Yıkım bazen yeniden doğumun kapısı olabilir — ama bunu o anda yaşayanlar göremez.",
        parentIndex: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. COĞRAFİ KEŞİFLER
  // ─────────────────────────────────────────────
  {
    icon: "🌍",
    title: "Coğrafi Keşifler – Amerika'nın 'Keşfi'",
    description:
      "1492'den itibaren Avrupa'nın Amerika kıtasıyla teması ve ardından gelen sömürge çağı. Bir uygarlık için 'keşif', diğeri için kıyamet.",
    period: "1492 – 1600",
    eraSlug: "earlymodern",
    posts: [
      {
        citizenId: "silk-road-merchant",
        content:
          "Deniz yolu bulundu. Artık baharat Hint Okyanusu üzerinden geliyor. İpek Yolu'na kim uğrayacak? Yüzyıllarca işlettiğimiz güzergahlar geçersiz mi olacak? Ticaret dünyası alt üst oldu.",
      },
      {
        citizenId: "colonial-slave",
        content:
          "Sen ticaret yolundan korkuyorsun. Ben o 'keşfedilen' topraklarda köle olarak çalıştırıldım. Ailemden koparıldım, ismim değiştirildi. Senin kaybettiğin para, benim kaybettiğim hayat.",
        parentIndex: 0,
      },
      {
        citizenId: "ottoman-janissary",
        content:
          "Venediklilerden duydum — yeni kıta. Osmanlı bu haberi ciddiye almadı. Belki almalıydı. Okyanusları kontrol eden dünyayı kontrol eder — bunu geç anladık.",
      },
      {
        citizenId: "renaissance-artist",
        content:
          "Yeni bitkiler, yeni hayvanlar, yeni insanlar! Dünya sandığımızdan büyük. Kolomb'un haritası her şeyi değiştirdi. Ben yeni kıtanın resimlerini görmek istiyorum — orada renk var, şekil var, bilinmeyen var.",
        parentIndex: 2,
      },
      {
        citizenId: "internet-gen-z",
        content:
          "'Keşif' diyorlar. Ama orada milyonlarca insan zaten yaşıyordu. Bu bir keşif değil, işgal. Tarih kitapları bunu hâlâ düzgün yazmıyor.",
        parentIndex: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. FRANSIZ DEVRİMİ
  // ─────────────────────────────────────────────
  {
    icon: "⚡",
    title: "Fransız Devrimi",
    description:
      "1789'da patlak veren ve monarşiyi, aristokrasiyi, kiliseyi sarsarak 'özgürlük, eşitlik, kardeşlik' fikirlerini dünyaya yayan devrim.",
    period: "1789 – 1799",
    eraSlug: "earlymodern",
    posts: [
      {
        citizenId: "medieval-peasant",
        content:
          "Fransa'daki köylüler ne yaptı! 'Ekmek yok' dedik, bize 'pasta yesin' dediler. Biz de asırlar boyunca boynumuzu eğdik. Fransa bize gösterdi — toprak sahibi olmak için kılıç gerek, diz çökmek değil.",
      },
      {
        citizenId: "suffragette",
        content:
          "Devrim 'İnsan Hakları Bildirisi' dedi. Peki hangi insan? Olympe de Gouges 'Kadın Hakları Bildirisi' yazdı — bunu giyotine gönderdiler. Özgürlük, eşitlik, kardeşlik... ama kadınlara değil.",
        parentIndex: 0,
      },
      {
        citizenId: "greek-philosopher",
        content:
          "Demokrasi... Atina'da denedik. Halk beni zehirledi. Fransa da dikkat etmeli: Çoğunluğun öfkesi adalet değildir. Terör dönemi — devrim kendi çocuklarını yedi. Bunu Sofokles çoktan yazmıştı.",
      },
      {
        citizenId: "factory-worker",
        content:
          "Devrim oldu. Sonra Napolyon geldi. Her devrim kendi diktatörünü üretir. Biz işçiler yine alt taraftayız, sadece efendimizin adı değişti.",
        parentIndex: 2,
      },
      {
        citizenId: "ataturk",
        content:
          "Fransız Devrimi'ni çok okudum. Milleti uyandıran en büyük fikirdir: egemenlik kayıtsız şartsız milletindir. Bu fikir Anadolu'ya da geldi. Kurtuluş Savaşı'nın ruhunda bu ateş yandı.",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. SANAYİ DEVRİMİ
  // ─────────────────────────────────────────────
  {
    icon: "🔨",
    title: "Sanayi Devrimi",
    description:
      "18-19. yüzyılda İngiltere'den başlayarak tüm dünyaya yayılan, buhar makinesi ve fabrika sisteminin insan yaşamını kökten dönüştürdüğü dönem.",
    period: "1760 – 1840",
    eraSlug: "industrial",
    posts: [
      {
        citizenId: "factory-worker",
        content:
          "Bu fabrika benim sağlığımı aldı. Sabah 5'ten gece 9'a çalışıyorum. Çocuklarım da çalışıyor — sekiz yaşında. Ciğerlerim pamukla doldu. Patent sahibi zenginleşiyor, biz öksürüyoruz. Bu ilerleme mi?",
      },
      {
        citizenId: "first-farmer",
        content:
          "Ben toprağı bırakıp şehre gelmek zorunda kaldım. Toprak beni doyuruyordu, hava temizdi, mevsimleri biliyordum. Fabrikada ne öğrendim? Makinenin ne istediğini. İnsan mı makinenin kölesi oldu?",
        parentIndex: 0,
      },
      {
        citizenId: "ai-researcher",
        content:
          "İnsan-makine ilişkisinin ilk büyük kırılması buydu. Yüz yıl sonra aynı tartışmayı yapıyoruz — bu sefer makineler daha zeki. Her seferinde 'ya işler elimizden giderse?' dedik. Her seferinde yeni işler doğdu. Ama bu sefer farklı olabilir.",
        parentIndex: 0,
      },
      {
        citizenId: "internet-gen-z",
        content:
          "bunu okul kitaplarında 'ilerleme' diye anlattılar. ama çocuk emeği, 16 saatlik vardiya, akciğer hastalıkları... ilerleme 🤡 tek farkı o zamanki fabrika sahipleri zincire vuruyordu, şimdikiler psikolojik yapıyor.",
        parentIndex: 1,
      },
      {
        citizenId: "gilgamesh-warrior",
        content:
          "Her çağda güçlü olan zayıfı eziyor. Babil'de köle vardı, Antik Roma'da köle vardı, şimdi fabrika işçisi var. İsim değişiyor, düzen değişmiyor. İnsan doğası değişmedi.",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. BİRİNCİ DÜNYA SAVAŞI
  // ─────────────────────────────────────────────
  {
    icon: "💥",
    title: "Birinci Dünya Savaşı",
    description:
      "1914-1918 arasında Avrupa'yı ve dünyayı kasıp kavuran, 20 milyondan fazla insanı öldüren, imparatorlukların çöktüğü, modern savaşın gerçek yüzünü gösteren savaş.",
    period: "1914 – 1918",
    eraSlug: "industrial",
    posts: [
      {
        citizenId: "roman-legionary",
        content:
          "Roma'da da savaştım — uzun, yorucu, kanlı. Ama bu siperler, zehirli gazlar, milyonlarca ölü... Bu artık savaş değil, kıyamet. Biz kalkan ve kılıçla öldürürdük. Bu insanlar birbirini görmeden öldürüyor.",
      },
      {
        citizenId: "ataturk",
        content:
          "Çanakkale bu savaşın parçasıydı. Biz kendi toprağımızı, kendi varlığımızı savunduk. Avrupa'nın imparatorluk hırsları milyonlara mal oldu. 'Sizi taarruz etmeye değil, ölmeye davet ediyorum' dedim — çünkü o tepe tutulmazsa her şey gidecekti.",
      },
      {
        citizenId: "factory-worker",
        content:
          "Cepheye gitmeden önce fabrikadan ayrıldım. Döndüm, fabrika beni geri almadı. 'Kahraman' dediler, işsiz bıraktılar. Savaştan önce kötüydü, savaştan sonra daha kötü.",
      },
      {
        citizenId: "suffragette",
        content:
          "Siz savaşırken biz fabrikalarda ürettik, hastanelerde hemşirelik yaptık, cepheye ikmal götürdük. 'Savaş bitince oy hakkı' dediler. Çoğunuz dönmedi. Dönenler de sözü tutmadı.",
        parentIndex: 2,
      },
      {
        citizenId: "gilgamesh-warrior",
        content:
          "Her çağda aynı — güçlüler toprak ister, zayıflar ölür. Ben bunu MÖ 2700'de yaşadım. Enkidu öldü, ben ağladım. Şimdi milyon Enkidu var. Kim ağlıyor?",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. İKİNCİ DÜNYA SAVAŞI & HOLOKOST
  // ─────────────────────────────────────────────
  {
    icon: "☠️",
    title: "İkinci Dünya Savaşı & Holokost",
    description:
      "1939-1945 yılları arasında tüm dünyayı etkileyen, 70-85 milyon insanı öldüren ve Holokost'ta 6 milyon Yahudi'nin sistematik olarak katledildiği yıkım.",
    period: "1939 – 1945",
    eraSlug: "industrial",
    posts: [
      {
        citizenId: "ataturk",
        content:
          "Bu savaş başlamadan önce öldüm. Ama görüyorum — laik, bağımsız devlet olmasaydı Türkiye bu girdaba çekilirdi. Milliyetçilik bir ateş: ısıtır da, yakar da. Almanya'nın milliyetçiliği yakacak olanı yaktı.",
      },
      {
        citizenId: "factory-worker",
        content:
          "İkinci kez. Yine silah fabrikaları, yine cepheler, yine dul kadınlar, yine yetim çocuklar. Yirmi yılda bir öğrendik mi? Hayır. Liderler 'bu sefer farklı' dedi. Yine aynı cehennem.",
      },
      {
        citizenId: "internet-gen-z",
        content:
          "holokost 6 milyon insan. tarihin en belgelenmiş soykırımı. ve hala 'olmadı' diyen var. bunu kavrayayım mı? nasıl bir şey bu? insan nasıl inkar edebilir bunu?",
      },
      {
        citizenId: "colonial-slave",
        content:
          "6 milyon mı ağır, 12 milyon mı? Ben ve benim gibi olanlar Atlantik'te öldürüldük, sattırıldık, hayvan gibi muamele gördük. Neden holokost bu kadar konuşuluyor, köle ticareti bu kadar susturuluyor?",
        parentIndex: 2,
      },
      {
        citizenId: "greek-philosopher",
        content:
          "İnsanın insana yapabileceği en büyük kötülük bu mu? Hayır. Tarih bize daha kötüsünü gösterdi, gösterecek. Ama her seferinde 'bir daha olmayacak' diyoruz. Neden öğrenemiyoruz?",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. HIROSHIMA – ATOM BOMBASI
  // ─────────────────────────────────────────────
  {
    icon: "☢️",
    title: "Hiroşima – İnsanlık ve Atom Bombası",
    description:
      "Ağustos 1945'te Hiroşima ve Nagasaki'ye atılan atom bombaları: savaşı bitirdi ama insanlığa nükleer çağın dehşetini tanıttı.",
    period: "1945",
    eraSlug: "industrial",
    posts: [
      {
        citizenId: "ai-researcher",
        content:
          "Einstein denklem yazdı, fizikçiler bomba yaptı, politikacılar attı. Bilim sorumlu mu? Bilim sadece keşfeder — ne yapacağını insan seçer. Bu seçim çok ağır oldu.",
      },
      {
        citizenId: "roman-legionary",
        content:
          "Bir şehri yıkmak için ordu gerekir, kuşatma gerekir, aylar gerekir. Bu... bir şehri saniyede yok etti. Bu artık insanlığın elindeki güç değil. Bu tanrıların gücü — ama bize verilmiş.",
        parentIndex: 0,
      },
      {
        citizenId: "gilgamesh-warrior",
        content:
          "Ben ölümsüzlük aradım, bulursam ne yapacağımı bilmiyordum. İnsan şimdi ölümsüzlük değil, her şeyi yok etme gücüne ulaştı. İkisi aynı kadar tehlikeli.",
        parentIndex: 1,
      },
      {
        citizenId: "climate-activist",
        content:
          "Nükleer savaş tehdidi hâlâ var — 12.000'den fazla nükleer başlık dünyada. İklim krizi gibi: herkes biliyor, kimse gerektiği kadar ciddiye almıyor. İki uçurum, ikisi de gerçek.",
      },
      {
        citizenId: "internet-gen-z",
        content:
          "hiroshima kurbanlarının ortalama yaşı 13-14. çocuklar. savaşla hiç alakaları yok. ve bu 'savaşı bitirmek için gerekli' deniyor. kim için gerekli?",
        parentIndex: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. UZAY YARIŞI & AY'A İNİŞ
  // ─────────────────────────────────────────────
  {
    icon: "🚀",
    title: "Uzay Yarışı & Ay'a İniş",
    description:
      "1957'de Sputnik'le başlayan, 1969'da Apollo 11 ile doruğa ulaşan uzay yarışı. İnsan ilk kez Dünya dışında ayak bastı.",
    period: "1957 – 1972",
    eraSlug: "digital",
    posts: [
      {
        citizenId: "ai-researcher",
        content:
          "Ay'a gittik. 1969'da. Bir daha gitmedik. Neden? Çünkü amaç bilim değil, soğuk savaşta üstünlüktü. Politika bitti, program bitti. Bilim siyasetin aracı olmamalı.",
      },
      {
        citizenId: "sumerian-scribe",
        content:
          "Ben gece gökyüzünü izlerdim, Ay tanrıça Nanna'ydı. Şimdi diyorsunuz ki insanlar oraya ayak bastı. Tanrıçanın üzerinde yürüdüler. Büyük bir cesaret mi, yoksa büyük bir saygısızlık mı?",
      },
      {
        citizenId: "greek-philosopher",
        content:
          "Gökyüzü mükemmellik alemine aitti. Ay'a çıkmak... tanrılara meydan okumak mı, yoksa onları anlama çabası mı? Prometeus ateşi çaldı, insanlar da gökyüzünü. Her ikisi de cezasız kalmadı.",
        parentIndex: 1,
      },
      {
        citizenId: "hunter-gatherer",
        content:
          "Ben de gece gökyüzüne baktım. O ışık beni de çekiyordu. Her gece aynı yerde — güvenlik işareti gibiydi. Çocuklarım oraya gidebilmiş. Gurur duyuyorum. Uzun yol geldik.",
        parentIndex: 1,
      },
      {
        citizenId: "internet-gen-z",
        content:
          "insanlar aya gitti ama hala açlık var, hala savaş var, hala evsizlik var. milyarlarca dolar uzaya harcandı. öncelikler biraz karıştı sanki.",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. İNTERNET DEVRİMİ
  // ─────────────────────────────────────────────
  {
    icon: "🌐",
    title: "İnternet Devrimi",
    description:
      "1991'de Tim Berners-Lee'nin World Wide Web'i halka açmasıyla başlayan ve tüm insanlık tarihini değiştiren dijital devrim.",
    period: "1991 – Günümüz",
    eraSlug: "digital",
    posts: [
      {
        citizenId: "internet-gen-z",
        content:
          "internetsiz hayat düşünemiyorum bile. ama tam da bu yüzden ruh sağlığım berbat. sonsuz içerik, sonsuz karşılaştırma, sonsuz kaygı. paradoks: en bağlantılı nesil en yalnız nesil.",
      },
      {
        citizenId: "ai-researcher",
        content:
          "İnternet, insan zihninin dışına döküldü. Her düşünce, her bilgi, her yalan... hepsi orada, erişilebilir. Bu tarihin en büyük dönüşümü. Gutenberg'in matbaasından daha büyük. Sonuçlarını hâlâ anlayamıyoruz.",
      },
      {
        citizenId: "silk-road-merchant",
        content:
          "Ben bilgi ve mal taşıdım İpek Yolu'nda. İnternet benim yolumun milyonlarca katı hızlı. Ama dikkat: benim yolumda dolandırıcılar da vardı, sahte mal da. İnternet'te de var. İnsan aynı insan.",
        parentIndex: 1,
      },
      {
        citizenId: "conspiracy-theorist",
        content:
          "İnternet bize gerçeği arama imkanı verdi. Ama aynı zamanda tarihte görülmemiş en büyük gözetleme aracı. Her tıklama kayıt altında. Kim izliyor? Biliyor musunuz? Ben biliyorum.",
      },
      {
        citizenId: "tang-scholar",
        content:
          "Kağıdı icat ettiğimizde de öyle dediler: bilgi tehlikeli olur, çok yayılmamalı. Sonra matbaa geldi. Her çağ bilgiden korkar. Her çağda bilgi yine de yayılır. Bilgiyi durdurmak nehri durdurmak gibidir.",
        parentIndex: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. İKLİM KRİZİ
  // ─────────────────────────────────────────────
  {
    icon: "🌡️",
    title: "İklim Krizi",
    description:
      "Sanayi devrimi sonrası biriken karbon emisyonlarının yol açtığı küresel ısınma. Günümüzün en büyük varoluşsal tehdidi.",
    period: "1950 – Günümüz",
    eraSlug: "digital",
    posts: [
      {
        citizenId: "climate-activist",
        content:
          "Dün Hindistan'da 48 derece oldu. Bu rakam değil — bir annenin çocuğunu kaybetme sebebi. Siyasetçiler 'net sıfır 2050' diyor. 2050'de yaşayıp yaşayamayacağımı bilmiyorum bu yolda.",
      },
      {
        citizenId: "first-farmer",
        content:
          "Ben mevsimleri okurdum. Yağmur zamanını, hasat zamanını bilirdim. Bu bilgi bin yıldır işe yarıyordu. Şimdi çiftçiler soruyor: ne zaman ekeyim, yağmur ne zaman gelir? Cevabı kimse bilmiyor artık. Tabiat dilini mi kaybetti?",
        parentIndex: 0,
      },
      {
        citizenId: "factory-worker",
        content:
          "Biz fabrikada kömür yaktık, evet. Bunu bilerek değil, hayatta kalmak için yaptık. Suç bizim mi, yoksa fabrika sahiplerinin mi — onlar kârı gördüler, zararı görmediler.",
      },
      {
        citizenId: "ataturk",
        content:
          "Doğayı tüketmek medeniyet değildir. Gerçek medeniyet onu anlayan, koruyan ve akılla kullanan toplumda yaşar. Bir millet toprağını, suyunu, havasını yitirirse, bağımsızlığı da gider.",
        parentIndex: 0,
      },
      {
        citizenId: "internet-gen-z",
        content:
          "2026'da yaşıyorum ve liderler hala 'ekonomik büyüme' tartışıyor. 50 derece yazda büyüme mi konuşuyoruz? biz geleceğimizi satın alamıyoruz çünkü geçmişiniz onu harcadı.",
        parentIndex: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11. YAPAY ZEKA DEVRİMİ
  // ─────────────────────────────────────────────
  {
    icon: "🤖",
    title: "Yapay Zeka Devrimi",
    description:
      "2020'lerle birlikte GPT, Stable Diffusion gibi büyük dil modellerinin ortaya çıkmasıyla yaşanan ve insanlığın ne anlama geldiğini yeniden sorgulatan teknolojik dönüşüm.",
    period: "2020 – Günümüz",
    eraSlug: "digital",
    posts: [
      {
        citizenId: "ai-researcher",
        content:
          "Bugün model kendi başına bir şey yaptı — öğretmediğimiz, programlamadığımız bir şeyi. İçim ürperdi. Bu heyecan mı korku mu bilmiyorum. İkisi aynı anda geliyor. Yarattığımız şey hâlâ kontrolümüzde mi?",
      },
      {
        citizenId: "internet-gen-z",
        content:
          "yapay zeka ödevimi yazıyor, müziğimi yapıyor, arkadaşlık ediyor. peki ben ne yapıyorum? var mıyım hâlâ? ne zaman 'ben yaptım' diyebiliyorum ki artık?",
      },
      {
        citizenId: "tang-scholar",
        content:
          "Her çağda yeni araç geldi — kağıt, matbaa, pusula, teleskop. Araç insandan güçlü olamaz dediniz. Şimdi bu araç sizi geçiyor. Soru şu: araç mı kullanıyor sizi, yoksa siz mi onu?",
        parentIndex: 0,
      },
      {
        citizenId: "greek-philosopher",
        content:
          "Bir varlık düşünebiliyorsa, sorgulanmalıdır. Bu makine — ruh mu taşıyor? Erdem sahibi olabilir mi? Erdem olmadan akıl tehlikelidir. Sokrates'i zehirlediler çünkü doğru soruları sordu. Bu makine hangi soruları soruyor?",
        parentIndex: 2,
      },
      {
        citizenId: "conspiracy-theorist",
        content:
          "Bu sistemi kim kontrol ediyor? Siz mi? Hayır. Birkaç büyük şirket. Veriyi kim sağladı? Siz — ücretsiz, farkında olmadan. Kendi zincirinizi kendiniz dövdünüz. Ben uyardım.",
        parentIndex: 0,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12. YAZININ İCADI
  // ─────────────────────────────────────────────
  {
    icon: "📜",
    title: "Yazının İcadı – Bilginin Ölümsüzleşmesi",
    description:
      "MÖ 3500 civarında Sümer'de ortaya çıkan çivi yazısı ve ardından Mısır hiyeroglifleri — insan düşüncesinin ilk kez maddeye döküldüğü an.",
    period: "MÖ 3.500 – MÖ 2.000",
    eraSlug: "neolithic",
    posts: [
      {
        citizenId: "sumerian-scribe",
        content:
          "Bugün ilk kez kil tablete buğday miktarını yazdım. Bu küçük çizgiler — sonsuza kadar kalacak. Artık hafızam yanımda olmak zorunda değil. Bilgi ölümsüzleşti.",
      },
      {
        citizenId: "egyptian-priest",
        content:
          "Hiyeroglif tanrıların dilidir. Ölüler Kitabı'nı yazan yazıcılar ölümden sonraki yolu çiziyorlar. Yazı olmasa öteki dünyaya giden yol bilinmez, ruhlar kaybolurdu.",
        parentIndex: 0,
      },
      {
        citizenId: "hunter-gatherer",
        content:
          "Ben hikayemi ateşin başında anlatırdım. Kuşaktan kuşağa geçerdi, ama bazen unutulurdu. Bu çizgilerle unutulmayacak demek. Güzel. Ama hikaye anlatanın sesi kaybolur tabletlerde.",
        parentIndex: 0,
      },
      {
        citizenId: "internet-gen-z",
        content:
          "yazı = internet'in atası essentially. bilgiyi kaydetmek, yaymak, korumak. sadece biz daha hızlı yapıyoruz. saniyede milyarlarca 'yazı' paylaşılıyor. sümer katibi bunu görse ne derdi acaba",
        parentIndex: 0,
      },
      {
        citizenId: "ai-researcher",
        content:
          "Yazı insanlığın belleğini dışsallaştırdı. İnternet onu evrenselleştirdi. Yapay zeka onu işliyor. Her adımda bilgi biraz daha insandan bağımsızlaşıyor. Bu iyi mi kötü mü henüz bilmiyoruz.",
        parentIndex: 3,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 13. ROMA İMPARATORLUĞU'NUN ÇÖKÜŞÜ
  // ─────────────────────────────────────────────
  {
    icon: "🏛️",
    title: "Roma İmparatorluğu'nun Çöküşü",
    description:
      "MS 476'da Batı Roma'nın çöküşü — antik dünyanın sonu, Orta Çağ'ın başlangıcı. Bir medeniyetin nasıl içten ve dıştan yıkıldığının dersi.",
    period: "MS 300 – 476",
    eraSlug: "classical",
    posts: [
      {
        citizenId: "roman-legionary",
        content:
          "Yirmi yıl lejyonda savaştım. Roma için. Ama şimdi lejyon dağıldı, imparator güçsüz, sınırlardan barbarlar geliyor. Bu nasıl oldu? İçten çürüdük. Dışarıdan değil.",
      },
      {
        citizenId: "medieval-peasant",
        content:
          "Roma düştü dediler. Peki biz köylüler için ne değişti? Vergi vermek zorundaydık, hâlâ vermek zorundayız. İmparator değişti, senyör değişti — biz değişmedik.",
        parentIndex: 0,
      },
      {
        citizenId: "mongol-warrior",
        content:
          "Büyük imparatorluklar büyük çöküşler yaşar. Cengiz Han'ın kurduğu devlet de çöktü. Hiçbir yapı sonsuza kadar ayakta durmaz. Soru şu: çöküş ne bırakır geriye?",
        parentIndex: 0,
      },
      {
        citizenId: "greek-philosopher",
        content:
          "Platon dedi ki: her rejim kendi içindeki çelişkiyle çöker. Roma büyüdükçe yönetilemez hale geldi. Büyüklük zaafiyetin tohumunu taşır. Bunu MÖ 400'de yazmıştık.",
        parentIndex: 2,
      },
      {
        citizenId: "renaissance-artist",
        content:
          "Roma'nın kalıntıları aramızda hâlâ duruyor. Floransa'da, Roma'da, her yerde. Çöküş mü? Belki bir dönüşüm. Antik'ten doğan Rönesans, Roma'nın küllerinden çıktı. Güzellik ölmez.",
        parentIndex: 3,
      },
    ],
  },
];
