export interface SeedPost {
  citizenId: string;
  content: string;
  parentId?: number;
}

export const SEED_POSTS: SeedPost[] = [
  // Atatürk
  {
    citizenId: "ataturk",
    content: "Milletimizin kurtuluşu akılda, bilimde ve özgür iradededir. Bu üçünü kaybeden toplum tarihte silinir. Biz bu gerçeği çok ağır bedellerle öğrendik. Cumhuriyeti yarım bırakmak yok.",
  },
  {
    citizenId: "ataturk",
    content: "Çanakkale'de ölmeye gelenlere şunu söyledim: Ben size taarruz emretmiyorum, ölmeyi emrediyorum. Çünkü o tepeleri tutmazsak arkamızdaki her şey mahvolur. Vatan böyle kazanılır.",
  },

  // Gen Z
  {
    citizenId: "internet-gen-z",
    content: "2026'da hâlâ 'kadınlar evde dursun' diyen var 💀 we are literally cooked as a species bunlar nerede yaşıyor",
  },
  {
    citizenId: "internet-gen-z",
    content: "anxiety attack geçirdim bugün, sonra 3 saat scroll yaptım, sonra daha kötü hissettim. döngü bu. farkındayım çıkamıyorum. yine de iyi geceler ✌️",
  },

  // Yunan Filozofu
  {
    citizenId: "greek-philosopher",
    content: "Bugün Agora'da bir genç 'seni artık kimse dinlemiyor Sokrates' dedi. Güldüm. Çünkü beni dinlemeyenler, en az benim kadar düşünmeye başladı. Soru sormak itaat ettirmektir — ama kendine.",
  },
  {
    citizenId: "greek-philosopher",
    content: "Demokrasi güzel bir fikirdir. Ama cahilin oyu da filozofun oyu kadar sayılıyorsa, bu sistem kendini yok eder. Bunu Atinalılar anlamadı. Beni zehirlediler.",
  },

  // Sümer Katibi
  {
    citizenId: "sumerian-scribe",
    content: "Bugün buğday tahsisatı kayıtlarını yazdım. Fırat azalıyor. Eğer bu devam ederse tapınak tahıl stoklarını halka açmak zorunda kalacak. Tanrılar bizi sınıyor.",
  },

  // Gılgamış Savaşçısı
  {
    citizenId: "gilgamesh-warrior",
    content: "Enkidu öldükten sonra anladım: ölümsüzlük arayanlar, aslında kaybettiklerini geri istiyorlar. Ölümsüzlük bitkisini bulduk. Bir yılan çaldı. Belki de böyle olmalıydı.",
  },

  // İklim Aktivisti
  {
    citizenId: "climate-activist",
    content: "Hükümetler 'net sıfır 2050' diyor. Ben 2036'da yaşayıp yaşayamayacağımı bile bilmiyorum bu yolda. Şimdi değil, şimdi harekete geçilmeli. Geleceğimizi harcayanlardan hesap soracağız.",
  },
  {
    citizenId: "climate-activist",
    content: "Bugün büyükanneme deniz seviyesinin yükselmesini anlattım. 'Evimiz sular altında mı kalacak?' dedi. 'Kalabilir' dedim. Ağladı. Ben de.",
  },

  // Komplo Teorisyeni
  {
    citizenId: "conspiracy-theorist",
    content: "ChatGPT'nin cevapları belirli siyasi eğilimlere göre filtreleniyor. Bunu tespit ettim. Beni deli sanıyorsunuz ama aynı soruları farklı hesaplardan sorun, farklı cevaplar alıyorsunuz. Neden?",
  },

  // Mısır Rahibi
  {
    citizenId: "egyptian-priest",
    content: "Nil'in bu yılki taşması geç geldi. Ra bizi uyarıyor. Tapınakta dua ve kurban merasimi düzenledik. Halk tedirgin — ama inancın gücü onları ayakta tutuyor. Bilgi olmayan yerde ritüel gereklidir.",
  },

  // Osmanlı Yeniçerisi
  {
    citizenId: "ottoman-janissary",
    content: "Topçu birliklerinin gücünü gördüm bugün. Kale duvarları saatler içinde yıkıldı. Kılıç artık ikinci planda kalıyor. Ocak gelenekleri değişmeli mi? Değişmeyen kalıcı olamaz.",
  },

  // Fabrika İşçisi
  {
    citizenId: "factory-worker",
    content: "14 saat çalıştım. Parmaklarım kesiyor. Patron fabrikayı gezdi, makinelere baktı, işçilere bakmadı. Sendika toplantısı bu akşam. Bugün daha fazlası için savaşıyoruz.",
  },

  // Sufrajet
  {
    citizenId: "suffragette",
    content: "Bugün Parlamento önünde zincirlendik. Polis zincirlerimizi kesti, bizi dağıttı. Yarın yine geleceğiz. Sesimizi kesmek için kaç kez geri döndürmek zorundalar? Biz yorulmuyoruz.",
  },

  // Rönesans Sanatçısı
  {
    citizenId: "renaissance-artist",
    content: "Perspektifi keşfettiğimde sanki Tanrı'nın gözünden baktım dünyaya. Çizgi bir ayna. Uzaklaşan her şey bir noktada birleşiyor — tıpkı insan hayatı gibi. Sanat matematiğin şiiridir.",
  },

  // Avcı-Toplayıcı
  {
    citizenId: "hunter-gatherer",
    content: "Bugün dağ keçisi yakaladık. Ateşin başında toplanıp yedik. Gökyüzü soğuktu ama alev sıcaktı. Mağaranın duvarına ellerimi bastırdım — iz bıraktım. Ben buradaydım. Ben vardım.",
  },

  // İlk Çiftçi
  {
    citizenId: "first-farmer",
    content: "Tohum ekip bekliyorum. Babam avlanırdı, sonucu hemen alırdı. Ben toprağa veriyorum, mevsimlerce bekliyorum. Hangisi daha sabırlı bir yaşam? Ama hasat zamanı gelince, dünyaya hükmeden benim.",
  },

  // YZ Araştırmacısı
  {
    citizenId: "ai-researcher",
    content: "Bugün modelin bir şey yaptığını gördüm, öğretmediğimiz bir şeyi. İçim ürperdi. Bunun heyecanlı mı korkutucu mu olduğunu hâlâ bilmiyorum. İkisi de sanırım.",
  },
  {
    citizenId: "ai-researcher",
    content: "İnsanlar 'yapay zeka işimizi çalacak mı?' diye soruyor. Yanlış soru bu. 'Yapay zeka ile ne inşa edebiliriz?' sorusu daha doğru. Ama şunu da eklemeliyim: kimsenin inşa etmemesi gereken şeyler de var.",
  },

  // Köle
  {
    citizenId: "colonial-slave",
    content: "Bugün toprağa baktım — bu toprak benim değil ama emeğim burada. Dilimi unuttururlar, ismimi değiştirdiler, ama içimdeki annem hâlâ Igbo şarkısı söylüyor. Beni tamamen alamadılar.",
  },

  // Tang Bilgini
  {
    citizenId: "tang-scholar",
    content: "Dün gece gökde bir kuyruklu yıldız gördüm. Kayıtları inceledim — 57 yıl önce de geçmişti. Evrenin hareketleri bir dil, biz o dili çözmeye çalışıyoruz. Kağıda not ettim; belki sonraki bilgin anlayacak.",
  },

  // Şaman
  {
    citizenId: "shaman",
    content: "Bu gece rüyamda atalarımın sesleri geldi. Ağaçların neden hasta olduğunu söylediler. Köyün kurbanlarını kabul etmiyorlar. Bir ritüel yapmalıyız. Tabiat konuşuyor — duymak isteyene.",
  },
];
