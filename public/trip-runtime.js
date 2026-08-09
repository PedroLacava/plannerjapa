(function () {
  "use strict";
  var api = null;
  var todayISO = null;
  var maps = [];
  var deferredInstall = null;
  var PROGRESS_KEY = "japan-trip-planner-progress-v1";

  var BASE_COORDS = {
    "henn-haneda": { name: "Henn na Hotel Tokyo Haneda", lat: 35.5523, lng: 139.7397 },
    tokyo: { name: "Hotel Sunroute Asakusa", lat: 35.71075, lng: 139.79178 },
    "hotel-sunroute-asakusa": { name: "Hotel Sunroute Asakusa", lat: 35.71075, lng: 139.79178 },
    hakone: { name: "Gekkoen Yugetsusanso", lat: 34.7974, lng: 135.2489 },
    "gekkoen-arima": { name: "Gekkoen Yugetsusanso", lat: 34.7974, lng: 135.2489 },
    osaka: { name: "Comfort Hotel Shin-Osaka", lat: 34.7303, lng: 135.4992 },
    "comfort-shin-osaka": { name: "Comfort Hotel Shin-Osaka", lat: 34.7303, lng: 135.4992 },
    kyoto: { name: "Kyoto", lat: 35.0116, lng: 135.7681 },
    koyasan: { name: "Koyasan", lat: 34.2142, lng: 135.5841 },
  };
  var DATE_ROUTES = {
    "2026-11-08": [
      ["Aeroporto de Haneda", 35.5494, 139.7798],
      ["Henn na Hotel Tokyo Haneda", 35.5523, 139.7397],
    ],
    "2026-11-09": [
      ["Henn na Hotel Tokyo Haneda", 35.5523, 139.7397],
      ["Estação Otorii", 35.5528, 139.7405],
      ["Estação Shinagawa", 35.6285, 139.7387],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Dotonbori", 34.6687, 135.5013],
      ["Estação Namba", 34.6663, 135.5004],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-10": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Namba", 34.6663, 135.5004],
      ["Mercado Kuromon Ichiba", 34.6654, 135.5065],
      ["Denden Town", 34.6597, 135.5061],
      ["Shinsekai", 34.6525, 135.5063],
      ["Castelo de Osaka", 34.6873, 135.5262],
      ["Umeda Sky Building", 34.7053, 135.49],
      ["Pokémon Center Osaka", 34.7026, 135.4965],
      ["Estação Osaka", 34.7025, 135.4959],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-11": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Kyoto", 34.9858, 135.7588],
      ["Fushimi Inari Taisha", 34.9671, 135.7727],
      ["Estação Kyoto", 34.9858, 135.7588],
      ["Estação Saga-Arashiyama", 35.0188, 135.6813],
      ["Bosque de Bambu de Arashiyama", 35.017, 135.6713],
      ["Estação Saga-Arashiyama", 35.0188, 135.6813],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-12": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Kyoto", 34.9858, 135.7588],
      ["Gion", 35.0037, 135.7785],
      ["Mercado Nishiki", 35.005, 135.7649],
      ["Estação Karasuma", 35.0048, 135.7594],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-13": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação JR Nara", 34.6809, 135.8189],
      ["Parque de Nara", 34.6851, 135.843],
      ["Estação JR Nara", 34.6809, 135.8189],
      ["Estação Uji", 34.8904, 135.8],
      ["Templo Byodoin", 34.8893, 135.8077],
      ["Estação Uji", 34.8904, 135.8],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-14": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Himeji", 34.8276, 134.6908],
      ["Castelo de Himeji", 34.8394, 134.6939],
      ["Estação Himeji", 34.8276, 134.6908],
      ["Estação Sannomiya", 34.6947, 135.1955],
      ["Kobe Harborland", 34.6796, 135.183],
      ["Estação Kobe", 34.6795, 135.178],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-15": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-16": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Hiroshima", 34.3978, 132.4753],
      ["Museu Memorial da Paz de Hiroshima", 34.3915, 132.4523],
      ["Cúpula da Bomba Atômica", 34.3955, 132.4536],
      ["Okonomimura", 34.3927, 132.4637],
      ["Estação Hiroshima", 34.3978, 132.4753],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "2026-11-17": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Estação Shin-Osaka", 34.7335, 135.5002],
      ["Estação Shin-Kobe", 34.7067, 135.1958],
      ["Estação Arima Onsen", 34.7994, 135.245],
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
    ],
    "2026-11-18": [
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
      ["Estação Arima Onsen", 34.7994, 135.245],
      ["Estação Shin-Kobe", 34.7067, 135.1958],
      ["Estação Odawara", 35.2564, 139.155],
      ["Estação Gora", 35.2509, 139.0484],
      ["Owakudani", 35.2442, 139.0207],
      ["Lago Ashi", 35.2048, 139.0253],
      ["Estação Odawara", 35.2564, 139.155],
      ["Estação de Tóquio", 35.6812, 139.7671],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-19": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Otemachi", 35.6846, 139.7668],
      ["Jardins Leste do Palácio Imperial", 35.6852, 139.7568],
      ["Ponte Nijubashi", 35.6801, 139.7521],
      ["Estação de Tóquio", 35.6812, 139.7671],
      ["Gentle Monster Tokyo Ginza", 35.6728543, 139.7649767],
      ["Ginza Six", 35.6697, 139.764],
      ["Nihonbashi", 35.6839, 139.7744],
      ["Estação Nihombashi", 35.6827, 139.7744],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-20": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Shimbashi", 35.6663, 139.7586],
      ["Estação Shin-Toyosu", 35.6488, 139.7901],
      ["teamLab Planets", 35.6491, 139.7898],
      ["Mercado Externo de Tsukiji", 35.6655, 139.7707],
      ["Jardins Hamarikyu", 35.6597, 139.7635],
      ["Estação Shimbashi", 35.6663, 139.7586],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-21": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Omotesando", 35.6652, 139.7124],
      ["Meiji Jingu", 35.6764, 139.6993],
      ["Takeshita Street", 35.6716, 139.703],
      ["Omotesando", 35.6652, 139.7124],
      ["Shibuya Crossing", 35.6595, 139.7005],
      ["Estação Shibuya", 35.658, 139.7016],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-22": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Asakusa", 35.7107, 139.7976],
      ["Templo Senso-ji", 35.7148, 139.7967],
      ["Estação Asakusa", 35.7107, 139.7976],
      ["Estação Ueno", 35.7138, 139.7773],
      ["Parque Ueno", 35.7148, 139.7732],
      ["Museu Nacional de Tóquio", 35.7188, 139.7765],
      ["Kanda Myojin", 35.702, 139.7679],
      ["Akihabara", 35.6984, 139.7731],
      ["Estação Akihabara", 35.6984, 139.7731],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-23": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Shinjuku-gyoemmae", 35.6886, 139.7107],
      ["Shinjuku Gyoen", 35.6852, 139.71],
      ["Omoide Yokocho", 35.693, 139.6995],
      ["Golden Gai", 35.6941, 139.7047],
      ["Estação Shinjuku-sanchome", 35.6906, 139.7046],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-24": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação de Tóquio · Saída Yaesu", 35.6812, 139.7671],
      ["Mitsui Outlet Park Kisarazu", 35.4379, 139.9295],
      ["Terminal de ônibus Kisarazu Outlet", 35.4377, 139.9291],
      ["Estação de Tóquio · Saída Yaesu", 35.6812, 139.7671],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-25": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Ueno", 35.7138, 139.7773],
      ["Estação de Tóquio", 35.6812, 139.7671],
      ["Estação Maihama", 35.6361, 139.8837],
      ["Tokyo DisneySea", 35.6267, 139.8851],
      ["Estação Maihama", 35.6361, 139.8837],
      ["Estação de Tóquio", 35.6812, 139.7671],
      ["Estação Ueno", 35.7138, 139.7773],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-26": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Shibuya", 35.658, 139.7016],
      ["Estação Nakameguro", 35.6443, 139.6987],
      ["Daikanyama T-Site", 35.6488, 139.6998],
      ["Yebisu Garden Place", 35.6421, 139.7135],
      ["Estação Ebisu", 35.6467, 139.7101],
      ["Estação Ueno", 35.7138, 139.7773],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "2026-11-27": [
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
      ["Estação Tawaramachi", 35.7099, 139.7908],
      ["Estação Ueno", 35.7138, 139.7773],
      ["Estação Keisei Ueno", 35.7114, 139.7732],
      ["Aeroporto Internacional de Narita", 35.772, 140.3929],
    ],
  };
  var LOCATIONS = {
    "transport-haneda-tokyo": [
      ["Haneda Airport", 35.5494, 139.7798],
      ["Henn na Hotel Tokyo Haneda", 35.5523, 139.7397],
    ],
    "transport-haneda-hotel-osaka": [
      ["Henn na Hotel Tokyo Haneda", 35.5523, 139.7397],
      ["Otorii Station", 35.5528, 139.7405],
      ["Shinagawa Station", 35.6285, 139.7387],
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
    ],
    "transport-tokyo-hakone": [
      ["Tokyo Station", 35.6812, 139.7671],
      ["Hakone-Yumoto Station", 35.2333, 139.1037],
    ],
    "transport-hakone-osaka": [
      ["Hakone-Yumoto Station", 35.2333, 139.1037],
      ["Shin-Osaka Station", 34.7335, 135.5002],
    ],
    "transport-osaka-kyoto": [
      ["Osaka Station", 34.7025, 135.4959],
      ["Kyoto Station", 34.9858, 135.7588],
    ],
    "transport-osaka-nara-uji": [
      ["Osaka Station", 34.7025, 135.4959],
      ["Nara Station", 34.6809, 135.8189],
      ["Uji Station", 34.8904, 135.8],
    ],
    "transport-osaka-himeji-kobe": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Himeji Station", 34.8276, 134.6908],
      ["Sannomiya Station", 34.6947, 135.1955],
    ],
    "transport-osaka-hiroshima": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Hiroshima Station", 34.3978, 132.4753],
    ],
    "transport-osaka-usj": [
      ["Osaka Station", 34.7025, 135.4959],
      ["Universal City Station", 34.6678, 135.4386],
    ],
    "transport-osaka-tokyo": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Tokyo Station", 35.6812, 139.7671],
    ],
    "transport-tokyo-osaka": [
      ["Tokyo Station", 35.6812, 139.7671],
      ["Shin-Osaka Station", 34.7335, 135.5002],
    ],
    "transport-osaka-kyoto-out": [
      ["Osaka Station", 34.7025, 135.4959],
      ["Kyoto Station", 34.9858, 135.7588],
    ],
    "transport-kyoto-osaka-return": [
      ["Kyoto Station", 34.9858, 135.7588],
      ["Osaka Station", 34.7025, 135.4959],
    ],
    "transport-osaka-nara-out": [
      ["Osaka Station", 34.7025, 135.4959],
      ["JR Nara Station", 34.6809, 135.8189],
    ],
    "transport-nara-uji": [
      ["JR Nara Station", 34.6809, 135.8189],
      ["Uji Station", 34.8904, 135.8],
    ],
    "transport-uji-osaka-return": [
      ["Uji Station", 34.8904, 135.8],
      ["Osaka Station", 34.7025, 135.4959],
    ],
    "transport-osaka-himeji-out": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Himeji Station", 34.8276, 134.6908],
    ],
    "transport-himeji-kobe": [
      ["Himeji Station", 34.8276, 134.6908],
      ["Sannomiya Station", 34.6947, 135.1955],
    ],
    "transport-kobe-osaka-return": [
      ["Sannomiya Station", 34.6947, 135.1955],
      ["Osaka Station", 34.7025, 135.4959],
    ],
    "transport-osaka-hiroshima-out": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Hiroshima Station", 34.3978, 132.4753],
    ],
    "transport-hiroshima-osaka-return": [
      ["Hiroshima Station", 34.3978, 132.4753],
      ["Shin-Osaka Station", 34.7335, 135.5002],
    ],
    "transport-osaka-hakone": [
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Hakone-Yumoto Station", 35.2333, 139.1037],
    ],
    "transport-hakone-tokyo": [
      ["Hakone-Yumoto Station", 35.2333, 139.1037],
      ["Tokyo Station", 35.6812, 139.7671],
    ],
    "transport-osaka-arima": [
      ["Comfort Hotel Shin-Osaka", 34.7303, 135.4992],
      ["Shin-Osaka Station", 34.7335, 135.5002],
      ["Shin-Kobe Station", 34.7067, 135.1958],
      ["Arima Onsen Station", 34.7994, 135.245],
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
    ],
    "transport-arima-tokyo": [
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
      ["Shin-Kobe Station", 34.7067, 135.1958],
      ["Tokyo Station", 35.6812, 139.7671],
      ["Hotel Sunroute Asakusa", 35.71075, 139.79178],
    ],
    "transport-arima-hakone": [
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
      ["Shin-Kobe Station", 34.7067, 135.1958],
      ["Odawara Station", 35.2564, 139.155],
      ["Hakone-Yumoto Station", 35.2333, 139.1037],
    ],
    "arima-onsen-stay": [
      ["Arima Onsen Station", 34.7994, 135.245],
      ["Yumotozaka", 34.7978, 135.247],
      ["Gekkoen Yugetsusanso", 34.7974, 135.2489],
    ],
    "transport-tokyo-narita": [
      ["Tokyo Station", 35.6812, 139.7671],
      ["Narita International Airport", 35.772, 140.3929],
    ],
    "shibuya-harajuku": [
      ["Meiji Jingu", 35.6764, 139.6993],
      ["Takeshita Street", 35.6716, 139.703],
      ["Omotesando", 35.6652, 139.7124],
      ["Shibuya Crossing", 35.6595, 139.7005],
    ],
    "nakameguro-daikanyama": [
      ["Nakameguro Station", 35.6443, 139.6987],
      ["Daikanyama T-Site", 35.6488, 139.6998],
      ["Yebisu Garden Place", 35.6421, 139.7135],
    ],
    "ueno-yanaka": [
      ["Yanaka Ginza", 35.7278, 139.7656],
      ["Ueno Park", 35.7148, 139.7732],
      ["Ameyoko", 35.7101, 139.7745],
    ],
    "akihabara-kanda": [
      ["Kanda Myojin", 35.702, 139.7679],
      ["Akihabara Station", 35.6984, 139.7731],
      ["Jimbocho", 35.6955, 139.7577],
    ],
    "asakusa-ryogoku": [
      ["Senso-ji", 35.7148, 139.7967],
      ["Kappabashi", 35.7141, 139.7896],
      ["Ryogoku Station", 35.6962, 139.7933],
    ],
    "shimokitazawa-koenji": [
      ["Shimokitazawa Station", 35.6615, 139.6666],
      ["Koenji Station", 35.7053, 139.6497],
    ],
    shinjuku: [
      ["Shinjuku Gyoen", 35.6852, 139.71],
      ["Omoide Yokocho", 35.693, 139.6995],
      ["Golden Gai", 35.6941, 139.7047],
    ],
    "ginza-nihonbashi": [
      ["Tokyo Station", 35.6812, 139.7671],
      ["Gentle Monster Tokyo Ginza", 35.6728543, 139.7649767],
      ["Ginza Six", 35.6697, 139.764],
      ["Nihonbashi", 35.6839, 139.7744],
    ],
    "imperial-palace": [
      ["Jardins Leste do Palácio Imperial", 35.6852, 139.7568],
      ["Ponte Nijubashi", 35.6801, 139.7521],
    ],
    "hamarikyu-tsukiji": [
      ["Mercado Externo de Tsukiji", 35.6655, 139.7707],
      ["Jardins Hamarikyu", 35.6597, 139.7635],
    ],
    "asakusa-ueno": [
      ["Templo Senso-ji", 35.7148, 139.7967],
      ["Parque Ueno", 35.7148, 139.7732],
      ["Museu Nacional de Tóquio", 35.7188, 139.7765],
    ],
    "teamlab-planets": [["teamLab Planets", 35.6491, 139.7898]],
    disney: [["Tokyo DisneySea", 35.6267, 139.8851]],
    "hakone-museum-onsen": [
      ["Hakone Open-Air Museum", 35.2448, 139.0514],
      ["Hakone-Yumoto", 35.2333, 139.1037],
    ],
    "hakone-ropeway": [
      ["Gora Station", 35.2509, 139.0484],
      ["Owakudani", 35.2442, 139.0207],
      ["Lake Ashi", 35.2048, 139.0253],
    ],
    dotonbori: [["Dotonbori Glico Sign", 34.6687, 135.5013]],
    kuromon: [["Kuromon Ichiba Market", 34.6654, 135.5065]],
    "fushimi-inari": [["Fushimi Inari Taisha", 34.9671, 135.7727]],
    arashiyama: [["Arashiyama Bamboo Forest", 35.017, 135.6713]],
    "gion-tea": [["Gion", 35.0037, 135.7785]],
    "nishiki-market": [["Nishiki Market", 35.005, 135.7649]],
    "denim-shopping": [["Kojima Jeans Street", 34.4625, 133.8026]],
    "pokemon-osaka": [["Pokémon Center Osaka", 34.7026, 135.4965]],
    "osaka-central-highlights": [
      ["Denden Town", 34.6597, 135.5061],
      ["Shinsekai", 34.6525, 135.5063],
      ["Osaka Castle", 34.6873, 135.5262],
      ["Umeda Sky Building", 34.7053, 135.49],
    ],
    okonomimura: [["Okonomimura Hiroshima", 34.3927, 132.4637]],
    "nara-uji": [
      ["Nara Park", 34.6851, 135.843],
      ["Byodoin Uji", 34.8893, 135.8077],
    ],
    usj: [["Universal Studios Japan", 34.6654, 135.4323]],
    "kobe-himeji": [
      ["Himeji Castle", 34.8394, 134.6939],
      ["Kobe Harborland", 34.6796, 135.183],
    ],
    "kyoto-cooking": [["Kyoto Station", 34.9858, 135.7588]],
    "sake-tasting": [["Fushimi Sake District", 34.9328, 135.7647]],
    "peace-memorial": [
      ["Hiroshima Peace Memorial Museum", 34.3915, 132.4523],
      ["Atomic Bomb Dome", 34.3955, 132.4536],
    ],
  };
  var INDOOR = new Set([
    "teamlab-planets",
    "pokemon-osaka",
    "kyoto-cooking",
    "sake-tasting",
    "gion-tea",
    "nishiki-market",
    "kuromon",
    "aoyama-roppongi",
    "akihabara-kanda",
  ]);
  var MIXED = new Set([
    "shibuya-harajuku",
    "nakameguro-daikanyama",
    "asakusa-ryogoku",
    "ueno-yanaka",
    "ginza-nihonbashi",
    "imperial-palace",
    "hamarikyu-tsukiji",
    "asakusa-ueno",
    "shinjuku",
    "dotonbori",
    "denim-shopping",
    "okonomimura",
    "usj",
    "hakone-museum-onsen",
  ]);

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>'"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[ch];
    });
  }
  function tokyoNow() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    var out = {};
    parts.forEach(function (p) {
      out[p.type] = p.value;
    });
    return {
      iso: out.year + "-" + out.month + "-" + out.day,
      minutes: Number(out.hour) * 60 + Number(out.minute),
    };
  }
  function clampDay(iso) {
    return iso < api.tripStart ? api.tripStart : iso > api.tripEnd ? api.tripEnd : iso;
  }
  function addDays(iso, n) {
    var d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function daysBetween(a, b) {
    return Math.round((new Date(b + "T12:00:00Z") - new Date(a + "T12:00:00Z")) / 86400000);
  }
  function formatDay(iso) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).format(new Date(iso + "T12:00:00Z"));
  }
  function plan() {
    return api.getPlan();
  }
  function progress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function setProgress(key, done) {
    var p = progress();
    if (done) p[key] = true;
    else delete p[key];
    if (window.sharedSet) window.sharedSet(PROGRESS_KEY, JSON.stringify(p));
    else localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    renderToday();
  }
  function baseFor(entry) {
    return entry && entry.base && api.baseDefs[entry.base] ? api.baseDefs[entry.base] : null;
  }
  function stepsFor(iso) {
    if (iso === "2026-11-10") {
      return [
        {
          key: iso + "|fixed|0",
          time: "09:00",
          place: "Kuromon Ichiba Market",
          note: "Café da manhã e comidas do mercado.",
        },
        {
          key: iso + "|fixed|1",
          time: "11:00",
          place: "Denden Town",
          note: "Caminhada por eletrônicos, games e cultura pop.",
        },
        {
          key: iso + "|fixed|2",
          time: "12:30",
          place: "Shinsekai + almoço",
          note: "Tsutenkaku e almoço de kushikatsu.",
        },
        {
          key: iso + "|fixed|3",
          time: "14:30",
          place: "Castelo de Osaka",
          note: "Parque e área externa; entrar apenas se houver interesse.",
        },
        {
          key: iso + "|fixed|4",
          time: "17:00",
          place: "Umeda Sky Building",
          note: "Mirante próximo ao pôr do sol.",
        },
        {
          key: iso + "|fixed|5",
          time: "18:30",
          place: "Pokémon Center Osaka",
          note: "Compras no Daimaru Umeda antes do jantar.",
        },
        {
          key: iso + "|fixed|6",
          time: "19:30",
          place: "Jantar em Umeda",
          note: "Depois, retorno ao Comfort Hotel Shin-Osaka.",
        },
      ];
    }
    var entry = plan()[iso] || { tours: [] },
      steps = [];
    (entry.tours || []).forEach(function (id, ti) {
      var def = api.tourDefs[id];
      if (!def) return;
      var smart = def.guide && def.guide.smartRoute;
      if (smart && smart.length)
        smart.forEach(function (s, si) {
          steps.push({
            key: iso + "|" + id + "|" + si,
            time: s.time || "",
            place: s.place || def.label,
            note: s.note || "",
            tourId: id,
          });
        });
      else if (def.suggested && def.suggested.length)
        def.suggested.forEach(function (s, si) {
          steps.push({ key: iso + "|" + id + "|" + si, time: "", place: s, note: "", tourId: id });
        });
      else
        steps.push({
          key: iso + "|" + id + "|0",
          time: "",
          place: def.label,
          note: def.travel || "",
          tourId: id,
        });
    });
    return steps;
  }
  function nextStep(steps) {
    var p = progress(),
      now = tokyoNow().minutes,
      upcoming = null;
    steps.forEach(function (s) {
      if (p[s.key]) return;
      var m = /^(\d{1,2}):(\d{2})$/.exec(s.time);
      if (m && Number(m[1]) * 60 + Number(m[2]) >= now && !upcoming) upcoming = s;
    });
    return (
      upcoming ||
      steps.find(function (s) {
        return !p[s.key];
      }) ||
      null
    );
  }
  function pointsFor(iso) {
    if (DATE_ROUTES[iso]) {
      return DATE_ROUTES[iso].map(function (p) {
        return { name: p[0], lat: p[1], lng: p[2], tourId: "route-" + iso };
      });
    }
    if (iso === "2026-11-10") {
      return [
        { name: "Comfort Hotel Shin-Osaka", lat: 34.7303, lng: 135.4992, tourId: "fixed-day10" },
        { name: "Kuromon Ichiba Market", lat: 34.6654, lng: 135.5065, tourId: "fixed-day10" },
        { name: "Denden Town", lat: 34.6597, lng: 135.5061, tourId: "fixed-day10" },
        { name: "Shinsekai", lat: 34.6525, lng: 135.5063, tourId: "fixed-day10" },
        { name: "Osaka Castle", lat: 34.6873, lng: 135.5262, tourId: "fixed-day10" },
        { name: "Umeda Sky Building", lat: 34.7053, lng: 135.49, tourId: "fixed-day10" },
        { name: "Pokémon Center Osaka", lat: 34.7026, lng: 135.4965, tourId: "fixed-day10" },
        { name: "Comfort Hotel Shin-Osaka", lat: 34.7303, lng: 135.4992, tourId: "fixed-day10" },
      ];
    }
    var entry = plan()[iso] || { tours: [] },
      seen = {},
      points = [];
    var currentBase = entry.base && BASE_COORDS[entry.base] ? BASE_COORDS[entry.base] : null;
    var previous = new Date(iso + "T12:00:00Z");
    previous.setUTCDate(previous.getUTCDate() - 1);
    var previousEntry = plan()[previous.toISOString().slice(0, 10)] || {};
    var startBase =
      previousEntry.base && BASE_COORDS[previousEntry.base]
        ? BASE_COORDS[previousEntry.base]
        : currentBase;
    if (startBase) {
      seen[startBase.lat + "," + startBase.lng] = 1;
      points.push({
        name: startBase.name,
        lat: startBase.lat,
        lng: startBase.lng,
        tourId: "hotel-start",
      });
    }
    (entry.tours || []).forEach(function (id) {
      if (id.indexOf("transport-") === 0) return;
      (LOCATIONS[id] || []).forEach(function (p) {
        var k = p[1] + "," + p[2];
        if (!seen[k]) {
          seen[k] = 1;
          points.push({ name: p[0], lat: p[1], lng: p[2], tourId: id });
        }
      });
    });
    if (currentBase) {
      points.push({
        name: currentBase.name,
        lat: currentBase.lat,
        lng: currentBase.lng,
        tourId: "hotel-return",
      });
    }
    return points;
  }
  function mapsSearch(name) {
    return "https://www.google.com/maps/search/?api=1&hl=pt-BR&query=" + encodeURIComponent(name);
  }
  function directionsLink(a, b, mode) {
    return (
      "https://www.google.com/maps/dir/?api=1&hl=pt-BR&travelmode=" +
      mode +
      "&origin=" +
      a.lat +
      "," +
      a.lng +
      "&destination=" +
      b.lat +
      "," +
      b.lng
    );
  }
  function fullRoute(points, mode) {
    if (points.length < 2) return points[0] ? mapsSearch(points[0].name) : "#";
    var mid = points
      .slice(1, -1)
      .slice(0, 8)
      .map(function (p) {
        return p.lat + "," + p.lng;
      })
      .join("|");
    return (
      "https://www.google.com/maps/dir/?api=1&hl=pt-BR&travelmode=" +
      mode +
      "&origin=" +
      points[0].lat +
      "," +
      points[0].lng +
      "&destination=" +
      points[points.length - 1].lat +
      "," +
      points[points.length - 1].lng +
      (mid ? "&waypoints=" + encodeURIComponent(mid) : "")
    );
  }
  function mapBlock(id, iso) {
    var points = pointsFor(iso);
    var entry = plan()[iso] || { tours: [] };
    var isTransportDay = (entry.tours || []).some(function (tourId) {
      return tourId.indexOf("transport-") === 0;
    });
    if (!isTransportDay) {
      isTransportDay = points.slice(0, -1).some(function (point, index) {
        var next = points[index + 1];
        return Math.hypot(point.lat - next.lat, point.lng - next.lng) > 0.045;
      });
    }
    var mode = isTransportDay ? "transit" : "walking";
    if (!points.length)
      return '<div class="map-empty">Ainda não há coordenadas confiáveis para este dia.<br>Use a busca de cada card no Google Maps.</div>';
    var links = points
      .map(function (p) {
        return (
          '<a target="_blank" rel="noopener" href="' +
          mapsSearch(p.name) +
          '">' +
          esc(p.name) +
          "</a>"
        );
      })
      .join("");
    var walks = points
      .slice(0, -1)
      .map(function (p, i) {
        return (
          '<a target="_blank" rel="noopener noreferrer" href="' +
          directionsLink(p, points[i + 1], mode) +
          '">' +
          (isTransportDay ? "Ir " : "Caminhar ") +
          (i + 1) +
          " → " +
          (i + 2) +
          "</a>"
        );
      })
      .join("");
    return (
      '<div id="' +
      id +
      '" class="daily-map" data-map-date="' +
      iso +
      '"></div><div class="map-actions">' +
      links +
      walks +
      '<a class="google-maps-primary" target="_blank" rel="noopener noreferrer" href="' +
      fullRoute(points, mode) +
      '"><span>Abrir este dia no Google Maps</span><small>Abre no app quando instalado</small></a></div>'
    );
  }
  function mountMap(id, iso) {
    var el = document.getElementById(id),
      points = pointsFor(iso);
    if (!el || !points.length || !window.L) return;
    var map = L.map(el, { scrollWheelZoom: false });
    maps.push(map);
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution: "Tiles &copy; Esri",
      },
    ).addTo(map);
    var bounds = [];
    var coordinateGroups = {};
    points.forEach(function (p, i) {
      var coordinateKey = p.lat + "," + p.lng;
      if (!coordinateGroups[coordinateKey]) coordinateGroups[coordinateKey] = [];
      coordinateGroups[coordinateKey].push({ point: p, number: i + 1 });
      bounds.push([p.lat, p.lng]);
    });
    L.polyline(bounds, {
      color: "#3b5dc9",
      weight: 3,
      opacity: 0.75,
      dashArray: "7 6",
    }).addTo(map);
    Object.keys(coordinateGroups).forEach(function (coordinateKey) {
      var group = coordinateGroups[coordinateKey];
      var p = group[0].point;
      var labels = group.map(function (item) {
        return item.number;
      });
      var markerLabel = labels.join("/");
      var icon = L.divIcon({
        className: "numbered-marker" + (labels.length > 1 ? " repeated-marker" : ""),
        html: markerLabel,
        iconSize: labels.length > 1 ? [44, 28] : [28, 28],
        iconAnchor: labels.length > 1 ? [22, 14] : [14, 14],
      });
      L.marker([p.lat, p.lng], { icon: icon })
        .addTo(map)
        .bindPopup(
          "<b>Pin " +
            markerLabel +
            " · " +
            esc(p.name) +
            '</b><br><a target="_blank" rel="noopener" href="' +
            mapsSearch(p.name) +
            '">Abrir no Google Maps</a>',
        );
    });
    function frameCompleteRoute() {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(bounds), {
        paddingTopLeft: [42, 42],
        paddingBottomRight: [42, 42],
        maxZoom: 15,
        animate: false,
      });
    }
    requestAnimationFrame(frameCompleteRoute);
    setTimeout(frameCompleteRoute, 250);
  }
  function clearMaps() {
    maps.forEach(function (m) {
      try {
        m.remove();
      } catch (e) {}
    });
    maps = [];
  }
  function weatherCode(code) {
    var x = Number(code);
    if (x === 0) return "céu limpo";
    if (x <= 3) return "parcialmente nublado";
    if (x <= 48) return "névoa";
    if (x <= 67) return "chuva";
    if (x <= 77) return "neve";
    if (x <= 82) return "pancadas de chuva";
    return "tempestade";
  }
  function weatherCacheKey(iso, baseId) {
    return "plannerjapa-weather-" + iso + "-" + baseId;
  }
  function fetchWeather(iso, baseId) {
    var coord = BASE_COORDS[baseId];
    if (!coord) return Promise.resolve({ state: "missing" });
    var delta = daysBetween(tokyoNow().iso, iso);
    if (delta < 0 || delta > 16) return Promise.resolve({ state: "far" });
    var key = weatherCacheKey(iso, baseId);
    try {
      var cached = JSON.parse(localStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.savedAt < 10800000) return Promise.resolve(cached.data);
    } catch (e) {}
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      coord.lat +
      "&longitude=" +
      coord.lng +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=Asia%2FTokyo&start_date=" +
      iso +
      "&end_date=" +
      iso;
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("weather");
        return r.json();
      })
      .then(function (d) {
        var out = {
          state: "ok",
          code: d.daily.weather_code[0],
          max: d.daily.temperature_2m_max[0],
          min: d.daily.temperature_2m_min[0],
          prob: d.daily.precipitation_probability_max[0],
          rain: d.daily.precipitation_sum[0],
        };
        localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data: out }));
        return out;
      })
      .catch(function () {
        try {
          var old = JSON.parse(localStorage.getItem(key) || "null");
          if (old) return Object.assign({}, old.data, { stale: true });
        } catch (e) {}
        return { state: "error" };
      });
  }
  function indoorSuggestions(iso, entry) {
    var used = {};
    Object.keys(plan()).forEach(function (d) {
      (plan()[d].tours || []).forEach(function (id) {
        used[id] = true;
      });
    });
    var region =
      (entry.tours || [])
        .map(function (id) {
          return api.tourDefs[id] && api.tourDefs[id].region;
        })
        .find(Boolean) ||
      (entry.base === "tokyo" ? "tokyo" : entry.base === "osaka" ? "osaka" : entry.base);
    return Object.keys(api.tourDefs)
      .filter(function (id) {
        var d = api.tourDefs[id];
        return !used[id] && d.environment === "indoor" && d.region !== "transport";
      })
      .sort(function (a, b) {
        return (
          (api.tourDefs[a].region === region ? -1 : 1) -
          (api.tourDefs[b].region === region ? -1 : 1)
        );
      })
      .slice(0, 3);
  }
  function weatherHtml(data, iso, entry) {
    if (data.state === "far")
      return '<div class="weather-muted">Previsão disponível mais perto da viagem.</div>';
    if (data.state === "missing")
      return '<div class="weather-muted">Defina uma cidade-base para consultar o clima.</div>';
    if (data.state === "error")
      return '<div class="weather-muted">Não foi possível carregar a previsão agora.</div>';
    var rain = Number(data.prob) >= 50 || Number(data.rain) >= 2;
    var html =
      '<div class="weather-main"><div class="weather-temp">' +
      Math.round(data.min) +
      "°–" +
      Math.round(data.max) +
      "°</div><div><b>" +
      esc(weatherCode(data.code)) +
      '</b><div class="weather-muted">Chuva: ' +
      Math.round(data.prob || 0) +
      "% · " +
      Number(data.rain || 0).toFixed(1) +
      " mm" +
      (data.stale ? " · último dado salvo" : "") +
      "</div></div></div>";
    if (rain) {
      var suggestions = indoorSuggestions(iso, entry);
      html +=
        '<div class="rain-alert"><b>Alerta de chuva</b><div>Considere trocar uma atividade ao ar livre.</div>' +
        (suggestions.length
          ? "<ul>" +
            suggestions
              .map(function (id) {
                return (
                  "<li>" +
                  esc(api.tourDefs[id].label) +
                  " · ~" +
                  esc(api.tourDefs[id].hours) +
                  "h</li>"
                );
              })
              .join("") +
            '</ul><div class="weather-muted">A troca não é automática. Abra Cards para ajustar o roteiro.</div>'
          : '<div class="weather-muted">Não há opção indoor não utilizada no pool para sugerir.</div>') +
        "</div>";
    }
    return html;
  }
  function loadWeatherInto(target, iso, entry) {
    var el = document.getElementById(target);
    if (!el) return;
    el.innerHTML = '<div class="weather-muted">Carregando previsão…</div>';
    fetchWeather(iso, entry.base).then(function (data) {
      if (document.getElementById(target))
        document.getElementById(target).innerHTML = weatherHtml(data, iso, entry);
    });
  }
  function renderToday() {
    if (!api) return;
    clearMaps();
    var now = tokyoNow(),
      iso = todayISO || clampDay(now.iso),
      entry = plan()[iso] || { base: null, tours: [], note: "" },
      base = baseFor(entry),
      steps = stepsFor(iso),
      next = nextStep(steps),
      p = progress();
    var notice = "";
    if (now.iso < api.tripStart)
      notice =
        '<div class="today-notice">Sua viagem começa em ' +
        daysBetween(now.iso, api.tripStart) +
        " dias. Mostrando o primeiro dia do roteiro.</div>";
    else if (now.iso > api.tripEnd)
      notice =
        '<div class="today-notice">Viagem encerrada. Mostrando o último dia do roteiro.</div>';
    var timeline = steps.length
      ? steps
          .map(function (s) {
            return (
              '<label class="timeline-step ' +
              (p[s.key] ? "done" : "") +
              '"><input type="checkbox" data-progress="' +
              esc(s.key) +
              '" ' +
              (p[s.key] ? "checked" : "") +
              '><span class="timeline-time">' +
              esc(s.time || "—") +
              '</span><span><span class="timeline-place">' +
              esc(s.place) +
              "</span>" +
              (s.note ? '<span class="timeline-note">' + esc(s.note) + "</span>" : "") +
              "</span></label>"
            );
          })
          .join("")
      : '<div class="weather-muted">Nenhuma etapa definida para este dia.</div>';
    var hero =
      '<div class="today-hero"><div class="today-eyebrow">Modo Hoje · horário do Japão</div><h2>' +
      esc(formatDay(iso)) +
      "</h2><p>" +
      (base ? esc(base.icon + " " + base.sleepCity) : "Base ainda não definida") +
      (entry.note ? " · " + esc(entry.note) : "") +
      '</p><div class="today-meta"><span class="today-pill">' +
      (entry.tours || []).length +
      ' atividades</span><span class="today-pill">' +
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()) +
      " no Japão</span></div></div>";
    var nextHtml = next
      ? '<div class="today-card next-step"><h3>Próximo passo</h3><div><span class="time">' +
        esc(next.time || "Agora") +
        "</span><b>" +
        esc(next.place) +
        "</b></div>" +
        (next.note ? '<div class="weather-muted">' + esc(next.note) + "</div>" : "") +
        "</div>"
      : '<div class="today-card next-step"><h3>Próximo passo</h3><div>Dia concluído.</div></div>';
    var prev = addDays(iso, -1),
      nxt = addDays(iso, 1);
    document.getElementById("today-view").innerHTML =
      '<div class="today-shell">' +
      notice +
      hero +
      nextHtml +
      '<div class="today-grid"><div class="today-card"><h3>Roteiro do dia</h3><div class="timeline">' +
      timeline +
      '</div></div><div class="today-card"><h3>Clima</h3><div id="today-weather"></div></div><div class="today-card"><h3>Mapa do dia</h3>' +
      mapBlock("today-map", iso) +
      '</div><div class="today-card"><h3>Navegação</h3><div class="day-nav"><button data-day="' +
      prev +
      '" ' +
      (prev < api.tripStart ? "disabled" : "") +
      '>Dia anterior</button><button data-calendar>Calendário completo</button><button data-day="' +
      nxt +
      '" ' +
      (nxt > api.tripEnd ? "disabled" : "") +
      ">Próximo dia</button></div></div></div></div>";
    document.querySelectorAll("[data-progress]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        setProgress(cb.dataset.progress, cb.checked);
      });
    });
    document.querySelectorAll("[data-day]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        todayISO = btn.dataset.day;
        renderToday();
      });
    });
    document.querySelector("[data-calendar]").addEventListener("click", showCalendar);
    mountMap("today-map", iso);
    loadWeatherInto("today-weather", iso, entry);
  }
  function renderDetailEnhancement(selected) {
    document.querySelectorAll(".detail-extension").forEach(function (x) {
      x.remove();
    });
    if (!selected) return;
    var entry = plan()[selected] || { base: null, tours: [] },
      host = document.getElementById("day-detail"),
      wrap = document.createElement("div");
    wrap.className = "detail-extension";
    wrap.innerHTML =
      '<div class="detail-box"><div class="card-head"><span class="emoji">☁️</span><span>Clima do dia</span></div><div id="detail-weather"></div></div><div class="detail-box"><div class="card-head"><span class="emoji">🗺️</span><span>Mapa do dia</span></div>' +
      mapBlock("detail-map", selected) +
      "</div>";
    host.appendChild(wrap);
    mountMap("detail-map", selected);
    loadWeatherInto("detail-weather", selected, entry);
  }
  function showToday() {
    document.body.classList.add("desktop-today");
    document.getElementById("today-view").classList.add("active");
    if (window.plannerSetMobileView) window.plannerSetMobileView("today");
    todayISO = clampDay(tokyoNow().iso);
    renderToday();
    window.scrollTo(0, 0);
  }
  function showCalendar() {
    document.body.classList.remove("desktop-today");
    document.getElementById("today-view").classList.remove("active");
    if (window.plannerSetMobileView) window.plannerSetMobileView("cal");
    window.scrollTo(0, 0);
  }
  function setupInstall() {
    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredInstall = e;
      document.getElementById("install-app-button").hidden = false;
    });
    document.getElementById("install-app-button").addEventListener("click", function () {
      if (deferredInstall) {
        deferredInstall.prompt();
        deferredInstall.userChoice.finally(function () {
          deferredInstall = null;
          document.getElementById("install-app-button").hidden = true;
        });
      }
    });
    window.addEventListener("message", function (e) {
      if (e.origin === location.origin && e.data && e.data.type === "PLANNER_INSTALL_AVAILABLE")
        document.getElementById("install-app-button").hidden = false;
    });
    document.getElementById("install-app-button").addEventListener("click", function () {
      if (!deferredInstall && window.parent !== window)
        window.parent.postMessage({ type: "PLANNER_INSTALL_REQUEST" }, location.origin);
    });
    var dialog = document.createElement("div");
    dialog.className = "install-dialog";
    dialog.hidden = true;
    dialog.innerHTML =
      '<div class="install-dialog-card"><h2>Instalar PlannerJapa</h2><p>No iPhone:</p><ol><li>Abra esta página no Safari.</li><li>Toque em <b>Compartilhar</b>.</li><li>Escolha <b>Adicionar à Tela de Início</b>.</li><li>Confirme em <b>Adicionar</b>.</li></ol><p>O aplicativo abrirá em tela cheia, sem a barra do navegador.</p><div class="install-dialog-actions"><button type="button" data-close-install>Fechar</button></div></div>';
    document.body.appendChild(dialog);
    document.getElementById("install-help-button").addEventListener("click", function () {
      dialog.hidden = false;
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close-install]")) dialog.hidden = true;
    });
  }
  window.TripRuntime = {
    init: function (config) {
      api = config;
      Object.keys(api.tourDefs).forEach(function (id) {
        api.tourDefs[id].environment = INDOOR.has(id)
          ? "indoor"
          : MIXED.has(id) || api.tourDefs[id].region === "transport"
            ? "mixed"
            : "outdoor";
      });
      todayISO = clampDay(tokyoNow().iso);
      document.getElementById("open-today-desktop").addEventListener("click", showToday);
      setupInstall();
      showCalendar();
    },
    renderEnhancements: function (selected) {
      if (!api) return;
      clearMaps();
      renderDetailEnhancement(selected);
      if (
        document.body.classList.contains("desktop-today") ||
        document.body.classList.contains("m-today")
      )
        renderToday();
    },
  };
})();
