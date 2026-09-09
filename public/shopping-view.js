(function () {
  "use strict";

  var KEY = "japan-trip-planner-shopping-v1";
  var STATUSES = ["Desejado", "Pesquisando", "Encontrado", "Comprado", "Desistiu"];
  var PRIORITIES = ["Quero muito", "Quero", "Se estiver barato"];
  var IMPORTED = [
    [2,"7 eleven","água que emagrece"],[3,"","Kit kat de sabores"],[4,"","sanduiche de ovo"],[5,"","Shoyu trufado"],
    [7,"ReFa","Escova de cabelo"],[8,"","pente"],[9,"","shampoo honey queen"],[10,"","condicionador honey queen"],
    [12,"THE ANSWER","Shampoo e condicionador"],[13,"FINO","Shampoo, condicionador, mascara e oleo"],
    [14,"Honey","Shampoo e condicionador"],[15,"Tsubaki","Shampoo, condicionador, mascara e oleo"],
    [16,"Orbis","Orbis Essence in hair milk"],[21,"DHC","Capsula para soltar pum cheiroso"],
    [22,"","lipcream MEGA hidratante"],[26,"","Escova de dente de 16 mil cerdas"],
    [27,"","Enxaguante bucal que sai preto"],[28,"","Balinha para halito bom"],
    [32,"TIR TIR","Tirtir mask fit red cushion"],[33,"Laneige","Pó ultrafino"],
    [35,"CHPT 9","Pore clear serum"],[36,"Senka","Senka Perfect Whip (saboniete de rosto) e cleasing oil"],
    [37,"Suisai","sabonete facial em po individual"],[38,"Allershut","spray antipoluição"],
    [43,"Medicube","Zero pore pad milk ou zero por pad"],[44,"","Collagen Jelly Cream"],[45,"","mascaras"],
    [46,"Aqalaber","creme"],[50,"","Kyusoku Jikan (salompas gela pé)"],
    [51,"","Salompas de pé de panturrilha"],[52,"","Roihi Tsuboko (adesivo para dor)"],
    [57,"Biore","Bioré UV Watery Essence"],[58,"","Bioré UV Aqua Protect Mist"],
    [59,"","Toalha refrescante e spray para diminuir calor"],[62,"Cicibella","Mascara Exome VC200"],
    [63,"menina koreana","Keana Nadeshiko Rice Mask"],[65,"Rimel Kissme","Rimel Kissme"],
    [71,"onitsuka tiger","Tenis"],[72,"Secound hand","Bolsa"],[73,"Muji","Papelaria"],
    [74,"Uniqlo","Uniqlo"],[75,"Adidas","Adidas"]
  ];

  var STORE_GUIDE = {
    "Beleza e cabelo": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Cuidados com a pele": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Saúde e cuidados": { store:"Matsumoto Kiyoshi", area:"Ginza", day:"19/11", query:"Matsumoto Kiyoshi Ginza Tokyo", source:"https://www.matsukiyococokara-online.com/" },
    "Alimentos": { store:"Don Quijote Ginza", area:"Ginza", day:"19/11", query:"Don Quijote Ginza Honkan", source:"https://www.donki.com/en/store/shop_detail.php?shop_id=421" },
    "Moda e calçados": { store:"Kisarazu Outlet", area:"Kisarazu", day:"24/11", query:"Mitsui Outlet Park Kisarazu", source:"https://mitsui-shopping-park.com/mop/kisarazu/english/" },
    "Segunda mão": { store:"2nd STREET", area:"Shinjuku", day:"23/11", query:"2nd Street Shinjuku Tokyo", source:"https://www.2ndstreet.jp/shop/search" },
    "Papelaria": { store:"MUJI Ginza", area:"Ginza", day:"19/11", query:"MUJI Ginza", source:"https://www.muji.com/jp/ja/shop/detail/046604" },
    "Esporte e outdoor": { store:"", area:"", day:"", query:"", source:"" },
    "Outros": { store:"", area:"", day:"", query:"", source:"" }
  };

  var RESEARCH_PROFILES = [
    {
      match:function(t){ return /agua que emagrece/.test(t); },category:"Alimentos",canonical:"7 Premium Hajime Green Tea / Aquarius Triple / Strong Sparkling Water Plus Triple",
      confidence:"Três produtos possíveis",tone:"partial",checked:"09/09/2026",price:"Preço varia por bebida e unidade",
      summary:"A descrição não identifica um único produto. O chá Hajime e o Aquarius Triple alegam ajudar a reduzir gordura corporal; a água gaseificada Plus Triple alega reduzir a absorção de gordura e açúcar. Escolha pela embalagem e finalidade.",
      sources:[{label:"Chá Hajime",url:"https://www.sej.co.jp/products/a/item/460169/",kind:"7-Eleven oficial"},{label:"Água gaseificada Plus Triple",url:"https://www.sej.co.jp/products/a/item/460211/",kind:"7-Eleven oficial"}],
      candidates:[{store:"7-Eleven",area:"Diversas cidades",day:"Qualquer dia",query:"7 Eleven Japan functional drink",reason:"Produtos da linha 7 Premium; procure pelo nome japonês e pela alegação funcional na embalagem.",stock:"Varia por unidade"}]
    },
    {
      match:function(t){ return /kit kat/.test(t); },category:"Alimentos",canonical:"KitKat Japan regional and seasonal flavors",
      confidence:"Linha confirmada",tone:"confirmed",checked:"09/09/2026",price:"Preço depende da embalagem e da edição",
      summary:"A Nestlé mantém sabores regulares como matcha, morango e laranja, além de edições regionais e sazonais. Defina se a prioridade é variedade, edição regional ou caixa para presente.",
      sources:[{label:"Linha regular KitKat",url:"https://nestle.jp/home/products/type/confectionary/kitkat/regular",kind:"Nestlé oficial"},{label:"Sabores regionais",url:"https://kitkat.nestle.jp/gotouchi-en",kind:"KitKat oficial"}],
      candidates:[{store:"Lojas de souvenir e grandes mercados",area:"Tóquio e Osaka",day:"Qualquer dia",query:"KitKat regional flavors Tokyo",reason:"Sabores regionais são mais prováveis em lojas de souvenir; os regulares aparecem em mercados e farmácias.",stock:"Sabores mudam por região e temporada"}]
    },
    {
      match:function(t){ return /sanduiche de ovo/.test(t); },category:"Alimentos",canonical:"Tamago Sando / sandwich de ovo",
      confidence:"Produto confirmado; receita muda",tone:"confirmed",checked:"09/09/2026",price:"Preço varia por rede e composição",
      summary:"Procure por たまごサンド. As receitas e embalagens são renovadas com frequência e podem variar por região. Vale comparar 7-Eleven, FamilyMart e Lawson no café da manhã.",
      sources:[{label:"Sanduíches 7-Eleven",url:"https://www.sej.co.jp/products/a/sandwich/",kind:"7-Eleven oficial"}],
      candidates:[{store:"7-Eleven, FamilyMart ou Lawson",area:"Próximo ao hotel",day:"Café da manhã",query:"tamago sando convenience store Japan",reason:"Produto refrigerado comum; comprar perto do consumo.",stock:"Varia diariamente"}]
    },
    {
      match:function(t){ return /shoyu trufado/.test(t); },category:"Alimentos",canonical:"Fundodai Clear Truffle Soy Sauce",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Alternativa premium: ¥2.700 por 55 ml",
      summary:"A opção japonesa mais clara é o shoyu transparente trufado da Fundodai. Há também uma versão premium da Fresh Truffle Japan; são propostas e preços bem diferentes.",
      sources:[{label:"Fundodai truffle soy sauce",url:"https://www.fundodai.jp/clearsoysauce2026",kind:"Fabricante oficial"},{label:"Fresh Truffle Japan",url:"https://www.fresh-truffle.com/englishshop",kind:"Marca oficial"}],
      candidates:[{store:"AKOMEYA TOKYO",area:"Tóquio",day:"Dia de Ginza",query:"AKOMEYA TOKYO truffle soy sauce",reason:"O varejista lista a versão Fundodai online; confirme a unidade antes de ir.",stock:"Estoque físico não confirmado"}]
    },
    {
      match:function(t){ return /refa/.test(t) && /escova|brush/.test(t); },category:"Beleza e cabelo",canonical:"ReFa Hair Brush series",
      confidence:"Linha confirmada; modelo pendente",tone:"partial",checked:"09/09/2026",price:"Aile Brush ¥3.800; Ion Care Brush Premium ¥8.800",
      summary:"ReFa possui várias escovas para finalidades diferentes. Heart Brush é compacta; Aile é para desembaraçar e alinhar; Ion Care Premium é voltada ao banho e couro cabeludo. Escolha o modelo antes de pesquisar estoque.",
      sources:[{label:"Linha de escovas ReFa",url:"https://www.mtgec.jp/shop/pages/refa_brush_lineup.aspx?type=ReFa",kind:"Loja oficial"},{label:"Preços Takashimaya",url:"https://www.takashimaya.co.jp/beauty/item/refa/830073/830081/item_list.html",kind:"Loja de departamento"}],
      candidates:[{store:"ReFa ou loja de departamento",area:"Ginza / Tóquio",day:"19/11",query:"ReFa hair brush Ginza",reason:"Melhor para comparar modelos pessoalmente; estoque depende da unidade.",stock:"Modelo e cor não definidos"}]
    },
    {
      match:function(t){ return /^(pente|comb)$/.test(t.trim()); },category:"Beleza e cabelo",canonical:"Pente ainda não identificado",
      confidence:"Precisa detalhar",tone:"unverified",checked:"09/09/2026",price:"Sem referência confiável",
      summary:"Informe marca, material e uso: bolso, desembaraçar, cabelo molhado ou styling. Sem isso, qualquer loja ou preço seria genérico.",sources:[],candidates:[]
    },
    {
      match:function(t){ return /honey queen|honeyque|haniku/.test(t); },category:"Beleza e cabelo",canonical:"HONEYQUE Deep Repair ou Rich Gloss",
      confidence:"Marca corrigida; linha pendente",tone:"partial",checked:"09/09/2026",price:"Preço depende da linha e do tamanho",
      summary:"O nome provável é HONEYQUE, não Honey Queen. Deep Repair Moist prioriza dano e hidratação; Rich Gloss Shiny prioriza brilho. A marca recomenda confirmar o estoque por telefone.",
      sources:[{label:"Produtos HONEYQUE",url:"https://honeyque.jp/products/",kind:"Marca oficial"},{label:"Onde comprar",url:"https://www.shop.honeyque.jp/",kind:"Localizador oficial"}],
      candidates:[{store:"Loft, Plaza ou Don Quijote",area:"Tóquio / Osaka",day:"Dia de compras",query:"HONEYQUE shampoo store Tokyo",reason:"Redes listadas pela marca; escolha primeiro a linha.",stock:"Marca pede confirmação prévia"}]
    },
    {
      match:function(t){ return /the answer/.test(t); },category:"Beleza e cabelo",canonical:"THE ANSWER Super Lamellar Shampoo + EX Treatment",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Shampoo 400 ml: ¥1.848; sachê shampoo + tratamento: ¥143",
      summary:"A linha usa tratamento, não condicionador. Existem EX Treatments diferentes para dano por calor, cor e ressecamento; vale escolher pela necessidade do cabelo.",
      sources:[{label:"THE ANSWER oficial",url:"https://www.theanswer-official.com/",kind:"Kao oficial"},{label:"Preço Matsukiyo",url:"https://www.matsukiyococokara-online.com/store/catalog/campaign/search/campaign_id/POPUP_20260516_02",kind:"Varejista"}],
      candidates:[{store:"Matsukiyo / Cocokara",area:"Ginza",day:"19/11",query:"THE ANSWER Matsukiyo Ginza",reason:"A rede lista a linha online, inclusive sachês para testar antes do frasco.",stock:"Estoque da unidade não confirmado"}]
    },
    {
      match:function(t){ return /\bfino\b/.test(t); },category:"Beleza e cabelo",canonical:"Fino Premium Touch hair mask and hair oil",
      confidence:"Lista precisa ser corrigida",tone:"partial",checked:"09/09/2026",price:"Máscara 230 g: ¥1.020; óleo 70 ml: cerca de ¥1.298",
      summary:"Os produtos confirmados com clareza no Japão são a máscara e os óleos Premium Touch. A entrada 'shampoo e condicionador' pode misturar a FINO com outra linha; não compre um kit sem conferir o fabricante.",
      sources:[{label:"Fino oficial",url:"https://brand.finetoday.com/jp/fino/",kind:"Marca oficial"},{label:"Máscara na Matsukiyo",url:"https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4550516493583",kind:"Varejista"}],
      candidates:[{store:"Matsukiyo / Cocokara",area:"Ginza",day:"19/11",query:"Fino Premium Touch Matsukiyo Ginza",reason:"Máscara e óleo aparecem no catálogo online da rede.",stock:"Estoque da unidade não confirmado"}]
    },
    {
      match:function(t){ return /&honey|\bhoney\b/.test(t) && !/honeyque|honey queen/.test(t); },category:"Beleza e cabelo",canonical:"&honey shampoo and treatment",
      confidence:"Marca confirmada; versão pendente",tone:"partial",checked:"09/09/2026",price:"Geralmente ¥1.540–¥1.650 por frasco; refil cerca de ¥1.100–¥1.210",
      summary:"A marca tem linhas diferentes. Creamy é para dano intenso; Rich Luxe prioriza hidratação e alinhamento; Deep Moist é a linha clássica. Escolha uma antes de comprar shampoo e tratamento.",
      sources:[{label:"&honey Creamy",url:"https://www.and-honey.com/creamy/product/",kind:"Marca oficial"},{label:"&honey Rich",url:"https://and-honey.com/rich/",kind:"Marca oficial"}],
      candidates:[{store:"Loft, Plaza ou farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"and honey shampoo Japan store",reason:"Linha amplamente distribuída; confirme a versão e compare kits/refis.",stock:"Versões variam por unidade"}]
    },
    {
      match:function(t){ return /tsubaki/.test(t); },category:"Beleza e cabelo",canonical:"TSUBAKI Premium Moist & Repair",
      confidence:"Linha identificada; óleo precisa confirmar",tone:"partial",checked:"09/09/2026",price:"Shampoo/condicionador 600 ml: cerca de ¥712; tratamento 160 g: cerca de ¥935",
      summary:"Shampoo, condicionador e tratamento Moist & Repair estão confirmados. 'Óleo TSUBAKI' pode se referir a outra marca, como Oshima Tsubaki; trate o óleo como um item separado.",
      sources:[{label:"TSUBAKI na Matsukiyo",url:"https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4550516486059",kind:"Varejista"},{label:"Tratamento TSUBAKI",url:"https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4550516485366",kind:"Varejista"}],
      candidates:[{store:"Matsukiyo / Cocokara",area:"Ginza",day:"19/11",query:"TSUBAKI Premium Moist Repair Matsukiyo Ginza",reason:"A rede lista os três produtos online.",stock:"Estoque da unidade não confirmado"}]
    },
    {
      match:function(t){ return /orbis/.test(t) && /hair milk|hairmilk|essence/.test(t); },category:"Beleza e cabelo",canonical:"ORBIS Essence in Hair Milk 140 g",
      confidence:"Produto e preço confirmados",tone:"confirmed",checked:"09/09/2026",price:"Frasco ¥1.320; refil ¥1.100",
      summary:"É um leave-in sem fragrância e sem álcool. Não confundir com a versão Professional Use de ¥2.860, vendida somente em salões participantes.",
      sources:[{label:"Essence in Hair Milk",url:"https://www.orbis.co.jp/small/1452050/?productnumber=9563",kind:"ORBIS oficial"},{label:"Comparação com Professional",url:"https://pr.orbis.co.jp/hairmilk_pro/product/",kind:"ORBIS oficial"}],
      candidates:[{store:"ORBIS e farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"ORBIS Essence in Hair Milk Tokyo store",reason:"A versão comum é vendida em lojas ORBIS e diversos varejistas.",stock:"Estoque da unidade não confirmado"}]
    },
    {
      match:function(t){ return /dhc/.test(t) && /pum|cheiro|odor|rose/.test(t); },category:"Saúde e cuidados",canonical:"DHC Fragrant Bulgarian Rose Capsules",
      confidence:"Produto provável identificado",tone:"partial",checked:"09/09/2026",price:"30 dias: ¥1.998",
      summary:"O item que melhor corresponde à descrição é a cápsula de rosa búlgara, vendida para cuidado de odores. Ela não é apresentada oficialmente como produto específico para flatulência.",
      sources:[{label:"DHC cuidados de odor",url:"https://www.dhc.co.jp/health/health/purpose/appearance-and-deodorization/?cCode=10208002",kind:"DHC oficial"}],
      candidates:[{store:"DHC ou grandes farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"DHC Bulgarian Rose capsule Tokyo",reason:"Use o nome oficial para não comprar outro suplemento DHC.",stock:"Estoque físico não confirmado"}]
    },
    {
      match:function(t){ return /lipcream|lip cream/.test(t); },category:"Saúde e cuidados",canonical:"Lip balm ainda não identificado",
      confidence:"Precisa escolher produto",tone:"unverified",checked:"09/09/2026",price:"Sem referência única",
      summary:"'Mega hidratante' não identifica marca ou fórmula. Defina se procura balm medicinal, com SPF, sem fragrância ou máscara labial; só depois vale comparar Mentholatum, Nivea Japan, DHC e Laneige.",sources:[],candidates:[]
    },
    {
      match:function(t){ return /16 mil cerdas|16000/.test(t); },category:"Saúde e cuidados",canonical:"Mocchiri Dense Toothbrush 16000",
      confidence:"Produto provável identificado",tone:"partial",checked:"09/09/2026",price:"Preço varia por varejista",
      summary:"O produto provável é もっちり濃密歯ブラシ16000, com 16 mil cerdas ultrafinas. Confirme se quer tamanho regular e cerdas macias; é um produto específico, não qualquer escova japonesa.",
      sources:[{label:"Escova 16000",url:"https://item.rakuten.co.jp/farma-sinsia/91150/",kind:"Varejista japonês"}],
      candidates:[{store:"Farmácias online / Rakuten",area:"Japão",day:"Antes ou durante a viagem",query:"もっちり濃密歯ブラシ 16000",reason:"A distribuição física não ficou confirmada; use o nome japonês exato.",stock:"Loja física não confirmada"}]
    },
    {
      match:function(t){ return /enxaguante|propolinse|sai preto/.test(t); },category:"Saúde e cuidados",canonical:"Propolinse mouthwash",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"¥385 por 150 ml; versões de 600 ml podem chegar a ¥1.485",
      summary:"É o enxaguante que faz resíduos visíveis ao reagir com proteínas presentes na boca. Há versões regular, sem álcool, whitening e sabores; escolha o tamanho antes.",
      sources:[{label:"Propolinse oficial",url:"https://www.propolinse.jp/",kind:"Marca oficial"},{label:"Loja oficial",url:"https://pieras.stores.jp/?category_id=5f9a114bef808560a098dc2c",kind:"Pieras oficial"}],
      candidates:[{store:"Don Quijote ou farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"Propolinse mouthwash Japan",reason:"Produto popular de higiene; procure pelo nome Propolinse e compare volume.",stock:"Versão e estoque variam"}]
    },
    {
      match:function(t){ return /balinha.*halito|breath care|hálito/.test(t); },category:"Saúde e cuidados",canonical:"Kobayashi Kamu Breath Care",
      confidence:"Produto provável identificado",tone:"confirmed",checked:"09/09/2026",price:"25 unidades; preço varia por sabor e loja",
      summary:"A 'balinha' é provavelmente a goma mastigável 噛むブレスケア. Não confundir com Breath Care em cápsulas, que é engolido com água.",
      sources:[{label:"Kamu Breath Care",url:"https://www.kobayashi.co.jp/seihin/kbc/",kind:"Kobayashi oficial"},{label:"Produto na Matsukiyo",url:"https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4987072012888",kind:"Varejista"}],
      candidates:[{store:"Matsukiyo / Cocokara",area:"Ginza",day:"19/11",query:"噛むブレスケア Matsukiyo",reason:"A rede lista a embalagem de 25 unidades.",stock:"Sabor e estoque variam"}]
    },
    {
      match:function(t){ return /tir tir|tirtir/.test(t); },category:"Cuidados com a pele",canonical:"TIRTIR Mask Fit Red Cushion",
      confidence:"Produto confirmado; cor pendente",tone:"partial",checked:"09/09/2026",price:"Referência de linha: cerca de ¥2.970",
      summary:"A etapa decisiva é escolher a tonalidade. A linha chegou a 30 cores no Japão; comprar sem testar pode gerar erro maior que qualquer economia.",
      sources:[{label:"Red Cushion oficial",url:"https://tirtir.co.jp/products/mask-fit-red-cushion",kind:"TIRTIR oficial"},{label:"Produto @cosme",url:"https://www.cosme.com/products/detail.php?product_id=250996",kind:"Varejista"}],
      candidates:[{store:"@cosme TOKYO, Loft ou Plaza",area:"Tóquio",day:"Dia de Harajuku/Ginza",query:"TIRTIR Mask Fit Red Cushion Tokyo",reason:"Prefira uma unidade com testers e variedade de tons.",stock:"Tom não definido"}]
    },
    {
      match:function(t){ return /laneige/.test(t) && /po|powder/.test(t); },category:"Cuidados com a pele",canonical:"LANEIGE Neo Essential Blurring Finish Powder",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Confira o preço vigente na página oficial",
      summary:"É um pó facial portátil para controle de oleosidade e efeito blur. A lista pode usar 'ultrafino', mas o nome oficial no Japão é Neo Essential Blurring Finish Powder.",
      sources:[{label:"Produto LANEIGE",url:"https://jp.laneige.com/products/neo-essential-blurring-finish-powder",kind:"LANEIGE Japan"}],
      candidates:[{store:"@cosme TOKYO, Loft ou Plaza",area:"Tóquio",day:"Dia de compras",query:"LANEIGE Neo Essential Powder Tokyo",reason:"Compare preço e disponibilidade com a loja oficial online.",stock:"Estoque físico não confirmado"}]
    },
    {
      match:function(t){ return /chpt.?9|pore clear serum/.test(t); },category:"Cuidados com a pele",canonical:"CHPT.9 Pore Clear Serum 30 ml",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Preço deve ser conferido no varejista",
      summary:"Apesar do nome 'serum', é um óleo de limpeza para poros e cravos. A marca informa venda em Matsukiyo/Cocokara; também aparece em @cosme e Plaza.",
      sources:[{label:"Produto @cosme",url:"https://www.cosme.com/products/detail.php?product_id=401670",kind:"Varejista"},{label:"Produto Plaza",url:"https://www.plazastyle.com/shop/g/g4595558349016/",kind:"Varejista"}],
      candidates:[{store:"Matsukiyo, @cosme ou Plaza",area:"Tóquio",day:"Dia de compras",query:"CHPT.9 Pore Clear Serum Tokyo",reason:"Há confirmação da distribuição nessas redes, mas não da unidade.",stock:"Estoque da unidade não confirmado"}]
    },
    {
      match:function(t){ return /senka/.test(t); },category:"Cuidados com a pele",canonical:"SENKA Perfect Whip + Beauty Clear Oil",
      confidence:"Um produto corrigido",tone:"partial",checked:"09/09/2026",price:"Preço varia por versão e varejista",
      summary:"Perfect Whip continua como limpador facial. Já Perfect Oil Whip e Perfect Watery Oil aparecem como descontinuados; para óleo de limpeza atual, procure Beauty Clear Oil da linha premium.",
      sources:[{label:"Óleo descontinuado",url:"https://www.hada-senka.com/products/expireproducts/perfect-oil-whip/",kind:"SENKA oficial"},{label:"Nova linha premium",url:"https://www.finetoday.com/jp/news/newsrelease/2025010801/",kind:"FineToday oficial"}],
      candidates:[{store:"Matsukiyo / @cosme",area:"Tóquio / Osaka",day:"Dia de compras",query:"SENKA Perfect Whip Beauty Clear Oil",reason:"Confira se a embalagem é da linha atual, não estoque antigo.",stock:"Versão precisa ser confirmada"}]
    },
    {
      match:function(t){ return /suisai/.test(t); },category:"Cuidados com a pele",canonical:"suisai Beauty Clear Powder Wash N, 32 capsules",
      confidence:"Produto e preço confirmados",tone:"confirmed",checked:"09/09/2026",price:"¥2.090 após reajuste de 2026",
      summary:"Sabonete enzimático em cápsulas individuais. Há versões N, Black, Gold, Green e Pink; a lista parece indicar a versão N regular.",
      sources:[{label:"Linha Powder Wash",url:"https://www.kanebo-cosmetics.jp/suisai/products/powder_wash/",kind:"Kanebo oficial"},{label:"Reajuste de preço",url:"https://www.kao-kirei.com/ja/news/information/2026/20260420-01/",kind:"Kao oficial"}],
      candidates:[{store:"Matsukiyo, @cosme ou Ainz & Tulpe",area:"Tóquio / Osaka",day:"Dia de compras",query:"suisai Powder Wash N 32 Tokyo",reason:"Produto comum em grandes redes de beleza e farmácia.",stock:"Versão e estoque variam"}]
    },
    {
      match:function(t){ return /allershut|antipoluicao|antipoluição/.test(t); },category:"Saúde e cuidados",canonical:"Fumakilla AllerShut Ion de Block spray",
      confidence:"Produto provável; finalidade corrigida",tone:"partial",checked:"09/09/2026",price:"Preço varia por versão",
      summary:"AllerShut é principalmente uma linha de barreira contra pólen e vírus, não um spray genérico antipoluição. Existem spray facial, névoa para maquiagem e produtos nasais; escolha a finalidade.",
      sources:[{label:"Linha AllerShut",url:"https://fumakilla.jp/allershut/",kind:"Fumakilla oficial"},{label:"Spray 160 usos",url:"https://fumakilla.jp/household/469/",kind:"Fumakilla oficial"}],
      candidates:[{store:"Farmácias japonesas",area:"Tóquio / Osaka",day:"Dia de compras",query:"アレルシャット イオンでブロック",reason:"Use o nome japonês e confira se é para rosto, maquiagem ou nariz.",stock:"Versão não definida"}]
    },
    {
      match:function(t){ return /medicube/.test(t) && /zero.*pore|pore.*pad|zero por/.test(t); },category:"Cuidados com a pele",canonical:"Medicube Zero Pore Pad 2.0 ou 2.0 Mild",
      confidence:"Duas versões confirmadas",tone:"partial",checked:"09/09/2026",price:"¥2.450 por versão",
      summary:"A versão 2.0 é a regular; 2.0 Mild é a opção mais suave. A expressão 'milk' na lista provavelmente é 'Mild'. Escolha de acordo com sensibilidade da pele.",
      sources:[{label:"Medicube Zero Line",url:"https://themedicube.jp/collections/%E6%AF%9B%E7%A9%B4%E5%8F%8E%E7%B8%AE-zero-line?page=1",kind:"Medicube Japan"}],
      candidates:[{store:"Medicube online / lojas de K-beauty",area:"Tóquio / Osaka",day:"Dia de compras",query:"Medicube Zero Pore Pad 2.0 Japan",reason:"Compare regular e Mild; a loja física ainda não foi confirmada.",stock:"Estoque físico não confirmado"}]
    },
    {
      match:function(t){ return /collagen jelly|collagen gel|jelly cream/.test(t); },category:"Cuidados com a pele",canonical:"Medicube Collagen Jelly Cream",
      confidence:"Produto e preço confirmados",tone:"confirmed",checked:"09/09/2026",price:"¥3.000",
      summary:"No Japão, o nome aparece como Collagen Gel Cream. Não confundir com Collagen Niacinamide Jelly Cream de outros mercados nem com Mochihada Collagen Cream 4.0.",
      sources:[{label:"Cremes Medicube",url:"https://themedicube.jp/collections/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0",kind:"Medicube Japan"}],
      candidates:[{store:"Medicube online / K-beauty",area:"Japão",day:"Antes ou durante a viagem",query:"Medicube collagen gel cream Japan",reason:"Use o nome japonês para evitar comprar outra linha de colágeno.",stock:"Estoque físico não confirmado"}]
    },
    {
      match:function(t){ return /^mascaras$|^mask$/.test(t.trim()); },category:"Cuidados com a pele",canonical:"Máscaras faciais ainda não definidas",
      confidence:"Precisa detalhar",tone:"unverified",checked:"09/09/2026",price:"Sem referência única",
      summary:"Defina objetivo e formato: hidratação, poros, clareamento, calmante; unidade, pacote de 7 ou caixa de 30. A lista já possui CICIBELLA e Keana Nadeshiko, então confirme se este item é adicional.",sources:[],candidates:[]
    },
    {
      match:function(t){ return /aqalaber|aqualabel/.test(t); },category:"Cuidados com a pele",canonical:"AQUALABEL Special Gel Cream EX",
      confidence:"Marca corrigida; versão pendente",tone:"partial",checked:"09/09/2026",price:"Brightening 90 g: referência de ¥1.782",
      summary:"A grafia correta é AQUALABEL. Há versões Brightening, Moist e Oil-in; 'creme' sozinho não define qual comprar. A brightening é a mais fácil de identificar pela embalagem azul.",
      sources:[{label:"Linha AQUALABEL",url:"https://www.shiseido.co.jp/aqua/allinone/",kind:"Shiseido oficial"}],
      candidates:[{store:"Farmácias e lojas Shiseido",area:"Tóquio / Osaka",day:"Dia de compras",query:"AQUALABEL Special Gel Cream EX",reason:"Escolha a versão antes de comparar preço.",stock:"Versão não definida"}]
    },
    {
      match:function(t){ return /kyusoku jikan/.test(t); },category:"Saúde e cuidados",canonical:"Kyusoku Jikan Ashi-Sukkiri Sheet",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Preço aberto; comparar por número de folhas",
      summary:"São folhas de gel refrescante para pés e pernas, usadas após banho ou antes de dormir. Há versões para sola, panturrilha e pontos de pressão; confira o desenho da embalagem.",
      sources:[{label:"Kyusoku Jikan oficial",url:"https://kyusokujikan.lion.co.jp/en/",kind:"Lion oficial"}],
      candidates:[{store:"Matsukiyo / farmácias",area:"Tóquio / Osaka",day:"Depois de dias longos",query:"Kyusoku Jikan Ashi Sukkiri Matsukiyo",reason:"Produto de farmácia; escolha a versão para pé ou panturrilha.",stock:"Versão e estoque variam"}]
    },
    {
      match:function(t){ return /salompas.*pe|salompas.*panturrilha/.test(t); },category:"Saúde e cuidados",canonical:"Produto possivelmente duplicado de Kyusoku Jikan",
      confidence:"Nome inconsistente",tone:"unverified",checked:"09/09/2026",price:"Não pesquisar antes de corrigir",
      summary:"'Salompas de pé e panturrilha' provavelmente descreve Kyusoku Jikan, não a marca Salonpas. Compare com os dois itens anteriores e remova a duplicidade ou informe a embalagem correta.",sources:[],candidates:[]
    },
    {
      match:function(t){ return /roihi|tsuboko/.test(t); },category:"Saúde e cuidados",canonical:"Roihi-Tsuboko / Coinpas",
      confidence:"Produto e referência de preço confirmados",tone:"confirmed",checked:"09/09/2026",price:"¥1.200 + imposto",
      summary:"Adesivos circulares para dor muscular, disponíveis em quente, cool, normal e grande. A versão quente exige cuidado com cobertores elétricos, bolsas térmicas e outras fontes de calor.",
      sources:[{label:"Roihi-Tsuboko",url:"https://www.nichiban.com/products/otc/analgesic/roihi-tsuboko_multilingual/en.html",kind:"Nichiban oficial"}],
      candidates:[{store:"Matsukiyo / farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"Roihi Tsuboko Matsukiyo",reason:"Escolha entre quente e cool antes da compra.",stock:"Versão e estoque variam"}]
    },
    {
      match:function(t){ return /biore/.test(t) && /watery essence|essence/.test(t); },category:"Cuidados com a pele",canonical:"Bioré UV Aqua Rich Watery Essence SPF50+ PA++++",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Preço varia por tamanho e varejista",
      summary:"Protetor solar em essência. Confira a embalagem atual e a quantidade, porque há versões maiores e kits; não compare apenas pelo preço do tubo.",
      sources:[{label:"Watery Essence",url:"https://www.kao-kirei.com/ja/item/khg/bioresarasarauv/4901301447647/",kind:"Kao oficial"}],
      candidates:[{store:"Matsukiyo / farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"Biore UV Aqua Rich Watery Essence Matsukiyo",reason:"Produto amplamente distribuído; compare valor por grama.",stock:"Tamanho e estoque variam"}]
    },
    {
      match:function(t){ return /biore/.test(t) && /mist|protect mist/.test(t); },category:"Cuidados com a pele",canonical:"Bioré UV Aqua Rich Aqua Protect Mist SPF50 PA++++",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Preço varia entre unidade, refil e kit",
      summary:"Mist solar não aerossol de 60 ml, também vendido em refil e kits. Compare o conjunto completo, não só o frasco inicial.",
      sources:[{label:"Aqua Protect Mist",url:"https://www.kao.co.jp/bioreuv/aquaprotectmist/",kind:"Kao oficial"},{label:"Produto My Kao",url:"https://www.kao-kirei.com/ja/item/khg/bioresarasarauv/4901301416438/",kind:"Kao oficial"}],
      candidates:[{store:"Matsukiyo / farmácias",area:"Tóquio / Osaka",day:"Dia de compras",query:"Biore Aqua Protect Mist Matsukiyo",reason:"Compare unidade, refil e kit.",stock:"Formato e estoque variam"}]
    },
    {
      match:function(t){ return /toalha refrescante|diminuir calor|cooling towel/.test(t); },category:"Saúde e cuidados",canonical:"Kobayashi cooling towel + cooling spray",
      confidence:"Duas categorias identificadas",tone:"partial",checked:"09/09/2026",price:"Toalha: preço aberto; sprays: ¥550–¥780 antes de imposto",
      summary:"São dois itens diferentes. Hiyashi Towel é uma toalha descartável que esfria por cerca de 60 minutos; Gokkan Spray é aplicado sobre a roupa. Em novembro, pode ser desnecessário levar ambos.",
      sources:[{label:"Cooling towel",url:"https://www.kobayashi.co.jp/seihin/kn_ht/index.html",kind:"Kobayashi oficial"},{label:"Cooling spray",url:"https://www.kobayashi.co.jp/seihin/kn_gs/index.html",kind:"Kobayashi oficial"}],
      candidates:[{store:"Farmácias",area:"Tóquio / Osaka",day:"Somente se necessário",query:"熱中対策 冷やしタオル",reason:"Produto sazonal; em novembro a disponibilidade tende a ser menor.",stock:"Sazonal e não confirmado"}]
    },
    {
      match:function(t){ return /cicibella/.test(t); },category:"Cuidados com a pele",canonical:"CICIBELLA EXOSOME + high-concentration VC200 sheet mask",
      confidence:"Produto identificado",tone:"confirmed",checked:"09/09/2026",price:"Escolher caixa de 7 ou 30 folhas",
      summary:"Há embalagem de 7 unidades individuais e pacote grande de 30. Defina a quantidade; a versão de 30 é melhor para comparar custo por máscara.",
      sources:[{label:"Máscara 30 unidades",url:"https://cicibella.jp/products/zhmm30d",kind:"CICIBELLA oficial"},{label:"Linha de máscaras",url:"https://cicibella.jp/shop/product_categories/sheetmask",kind:"CICIBELLA oficial"}],
      candidates:[{store:"Farmácias / lojas de beleza",area:"Tóquio / Osaka",day:"Dia de compras",query:"CICIBELLA VC200 EXOSOME mask Japan",reason:"Use o nome completo e compare custo por folha.",stock:"Quantidade e estoque variam"}]
    },
    {
      match:function(t){ return /keana nadeshiko|menina koreana|rice mask/.test(t); },category:"Cuidados com a pele",canonical:"Keana Nadeshiko Rice Mask, 10 sheets",
      confidence:"Produto e marca corrigidos",tone:"confirmed",checked:"09/09/2026",price:"Preço depende da embalagem regular ou caixa limitada",
      summary:"É uma marca japonesa, não 'menina coreana'. A máscara usa ingredientes derivados de arroz japonês e normalmente vem com 10 folhas; caixas de 28 aparecem como edições limitadas.",
      sources:[{label:"Rice Mask oficial",url:"https://www.ishizawa-lab.co.jp/keananadeshiko/en/product/keana_skincare/mask.html",kind:"Ishizawa Labs oficial"}],
      candidates:[{store:"Loft, Hands ou Don Quijote",area:"Tóquio / Osaka",day:"Dia de compras",query:"Keana Nadeshiko Rice Mask Tokyo",reason:"A marca indica lojas no Japão; compare pacote regular e edição limitada.",stock:"Edição e estoque variam"}]
    },
    {
      match:function(t){ return /kissme|kiss me|rimel/.test(t); },category:"Cuidados com a pele",canonical:"Kiss Me Heroine Make mascara",
      confidence:"Marca confirmada; fórmula pendente",tone:"partial",checked:"09/09/2026",price:"¥1.320–¥1.540 conforme a fórmula",
      summary:"Escolha entre Long Up Super Waterproof, Volume Up Super Waterproof e Real Lash Advanced Film. Waterproof segura mais, mas geralmente pede removedor específico; Advanced Film é mais fácil de remover.",
      sources:[{label:"Linha de máscaras",url:"https://onlinestore.isehangroup.jp/jv/collections/mascara",kind:"Isehan oficial"},{label:"Heroine Make",url:"https://www.isehan.co.jp/heroine/",kind:"Marca oficial"}],
      candidates:[{store:"Matsukiyo, Loft ou Plaza",area:"Tóquio / Osaka",day:"Dia de compras",query:"Kiss Me Heroine Make mascara Japan",reason:"Escolha fórmula e cor antes de comparar preço.",stock:"Fórmula e cor não definidas"}]
    },
    {
      match:function(t){ return /onitsuka/.test(t); },category:"Moda e calçados",canonical:"Onitsuka Tiger shoes, model not defined",
      confidence:"Marca confirmada; modelo e tamanho pendentes",tone:"partial",checked:"09/09/2026",price:"Consultar preço do modelo no site oficial japonês",
      summary:"Defina modelo, cor e tamanho japonês. Mexico 66, Tokuten e Serrano têm construções diferentes; provar é mais importante que escolher apenas pelo preço.",
      sources:[{label:"Onitsuka Tiger Japão",url:"https://www.onitsukatiger.com/jp/ja-jp/",kind:"Loja oficial"}],
      candidates:[{store:"Onitsuka Tiger oficial",area:"Ginza / Shibuya",day:"Dia do bairro",query:"Onitsuka Tiger Ginza Tokyo",reason:"Loja própria é melhor para testar tamanho e comparar modelos.",stock:"Modelo, cor e tamanho não definidos"}]
    },
    {
      match:function(t){ return /second hand|secound hand|segunda mao|bolsa/.test(t); },category:"Segunda mão",canonical:"Bolsa de segunda mão, marca e orçamento pendentes",
      confidence:"Precisa detalhar",tone:"unverified",checked:"09/09/2026",price:"Sem marca e modelo não há faixa útil",
      summary:"Informe marca desejada, tipo de bolsa, condição mínima e teto de preço. Para luxo, uma loja especializada é melhor; para descoberta e preço baixo, 2nd STREET comum oferece mais variedade.",
      sources:[{label:"2nd STREET lojas",url:"https://www.2ndstreet.jp/shop",kind:"Rede oficial"},{label:"Tipos de loja",url:"https://www.geonet.co.jp/english/business/reuse/",kind:"Grupo oficial"}],
      candidates:[{store:"2nd STREET",area:"Tóquio",day:"Dia de compras",query:"2nd Street luxury bags Tokyo",reason:"A rede permite pesquisar estoque online e solicitar envio para uma loja para inspeção.",stock:"Marca e modelo não definidos"}]
    },
    {
      match:function(t){ return /muji|papelaria/.test(t); },category:"Papelaria",canonical:"MUJI stationery, products not defined",
      confidence:"Loja confirmada; itens pendentes",tone:"partial",checked:"09/09/2026",price:"Monte uma lista de canetas, cadernos e refis",
      summary:"Papelaria é ampla demais para comparar preços. Defina pelo menos tipo, cor e quantidade. MUJI Ginza é a flagship e encaixa no roteiro do hotel em Ginza.",
      sources:[{label:"MUJI Ginza",url:"https://shop.muji.com/jp/ginza/en/",kind:"Loja oficial"}],
      candidates:[{store:"MUJI Ginza",area:"Ginza",day:"19/11",query:"MUJI Ginza",reason:"Loja principal com ampla linha; leve foto ou código dos itens desejados.",stock:"Itens não definidos"}]
    },
    {
      match:function(t){ return /uniqlo/.test(t); },category:"Moda e calçados",canonical:"UNIQLO, garments and sizes not defined",
      confidence:"Loja confirmada; itens pendentes",tone:"partial",checked:"09/09/2026",price:"Consultar cada peça no site japonês",
      summary:"Defina peça, cor e tamanho antes da viagem. Compra online ou retirada já paga não recebe tax-free; para isenção, compre e pague presencialmente em loja elegível.",
      sources:[{label:"Tax-free UNIQLO",url:"https://faq.uniqlo.com/articles/FAQ/100005975/",kind:"UNIQLO oficial"}],
      candidates:[{store:"UNIQLO Ginza",area:"Ginza",day:"19/11",query:"UNIQLO Ginza",reason:"Boa disponibilidade e encaixe no roteiro; compare medidas japonesas antes.",stock:"Peças e tamanhos não definidos"}]
    },
    {
      match:function(t){ return /adidas/.test(t); },category:"Moda e calçados",canonical:"Adidas, products and sizes not defined",
      confidence:"Outlet confirmado; produtos pendentes",tone:"partial",checked:"09/09/2026",price:"Preço depende do produto e desconto vigente",
      summary:"Há Adidas Factory Outlet em Kisarazu. Para aproveitar eventual benefício da Jéssica, confirmem antes se o desconto de funcionária é válido no Japão, em outlet e para acompanhantes.",
      sources:[{label:"Adidas Outlet Kisarazu",url:"https://mitsui-shopping-park.com/en/mop/kisarazu/shop/3183311.html",kind:"Mitsui oficial"},{label:"Loja Adidas",url:"https://www.adidas.jp/stores/japan/kisarazu/kanedahigashi-3-1-1/9990122408",kind:"Adidas oficial"}],
      candidates:[{store:"Adidas Factory Outlet Kisarazu",area:"Kisarazu",day:"24/11",query:"Adidas Factory Outlet Kisarazu",reason:"Loja confirmada no outlet já previsto no roteiro.",stock:"Produto e tamanho não definidos"}]
    },
    {
      match:function(t){ return /\bleki\b/.test(t) && /bastao|caminhada|trekking|pole/.test(t); },
      category:"Esporte e outdoor",
      canonical:"LEKI folding trekking or trail-running poles",
      confidence:"Produto confirmado online",
      tone:"confirmed",
      summary:"A LEKI tem uma linha ampla de bastões no Japão. O catálogo oficial da distribuidora japonesa lista modelos e preços; a Yodobashi também possui página da marca. Estoque físico ainda precisa ser confirmado para o modelo escolhido.",
      price:"¥11.000 a ¥36.850 no catálogo consultado",
      checked:"09/09/2026",
      sources:[
        {label:"Catálogo LEKI no Japão",url:"https://www.caravan-web.com/c/brand/leki",kind:"Catálogo oficial"},
        {label:"LEKI na Yodobashi",url:"https://www.yodobashi.com/maker/5000011641/",kind:"Varejista"}
      ],
      candidates:[
        {store:"Yodobashi Shinjuku / Ishii Sports",area:"Shinjuku",day:"23/11",query:"LEKI trekking pole Yodobashi Shinjuku",reason:"A rede vende LEKI online e a unidade fica no roteiro. Verifique retirada/estoque no site antes de ir.",stock:"Estoque da unidade não confirmado"},
        {store:"Caravan Sugamo",area:"Sugamo",day:"Dia livre em Tóquio",query:"Caravan Sugamo Tokyo",reason:"Loja da distribuidora japonesa; parte da linha é exclusiva do e-commerce ou desta unidade.",stock:"Modelos variam por loja"}
      ]
    }
  ];

  function plain(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }
  function productProfile(item) {
    var t=plain(item.brand+" "+item.name+" "+item.variant);
    return RESEARCH_PROFILES.find(function(x){return x.match(t);});
  }
  function categoryFor(name, brand) {
    var t = plain(name + " " + brand);
    if (/bastao|caminhada|trekking|hiking pole|trail pole|outdoor|\bleki\b/.test(t)) return "Esporte e outdoor";
    if (/kit kat|sanduiche|shoyu|\bagua\b/.test(t)) return "Alimentos";
    if (/tenis|adidas|uniqlo|onitsuka/.test(t)) return "Moda e calçados";
    if (/second|secound|bolsa/.test(t)) return "Segunda mão";
    if (/papelaria|muji/.test(t)) return "Papelaria";
    if (/shampoo|condicionador|mascara|oleo|escova|pente|hair/.test(t)) return "Beleza e cabelo";
    if (/serum|cushion|cream|creme|sabonete|cleasing|pore|collagen|biore|laneige|senka|suisai/.test(t)) return "Cuidados com a pele";
    if (/capsula|lipcream|enxaguante|halito|salompas|roihi|dor|antipoluicao|refrescante/.test(t)) return "Saúde e cuidados";
    return "Outros";
  }
  function needsDetail(name, brand) {
    var t = plain(name);
    return !brand || /^(creme|mascaras|tenis|bolsa|papelaria|uniqlo|adidas|pente)$/.test(t) || /agua que emagrece|menina koreana|ou zero/.test(plain(name + " " + brand));
  }
  function seedItem(row) {
    var category = categoryFor(row[2], row[1]);
    return {
      id:"f-" + row[0], owner:"Fernanda", brand:row[1], name:row[2], variant:"", category:category,
      quantity:1, priority:"Quero", status:"Desejado", maxPrice:"", foundPrice:"", foundStore:"",
      sourceUrl:"", checkedAt:"", note:"Importado da planilha da Fernanda, linha " + row[0] + ".",
      needsDetail:needsDetail(row[2], row[1]), createdAt:"2026-09-08"
    };
  }
  var DEFAULTS = { rate:29, items:IMPORTED.map(seedItem) };

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function load() {
    var state = null;
    try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    if (!state || !Array.isArray(state.items)) state = clone(DEFAULTS);
    if (!state.rate) state.rate = 29;
    state.items.forEach(function(item){
      var profile=productProfile(item);
      if (profile && profile.category) item.category=profile.category;
      else if (!item.category || item.category === "Outros") item.category = categoryFor(item.name,item.brand);
    });
    return state;
  }
  function save(state) {
    var value = JSON.stringify(state);
    if (window.JaplannerSharedStore) window.JaplannerSharedStore.set(KEY, value);
    else localStorage.setItem(KEY, value);
  }
  function esc(x) { return String(x == null ? "" : x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function safeUrl(x) { try { var u = new URL(x); return /^https?:$/.test(u.protocol) ? u.href : ""; } catch (e) { return ""; } }
  function yen(n) { return "¥" + Math.round(Number(n) || 0).toLocaleString("pt-BR"); }
  function brl(n) { return "R$ " + Number(n || 0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function mapUrl(query) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query); }
  function searchUrl(item, site) {
    var term = [item.brand,item.name].filter(Boolean).join(" ");
    var suffix = site ? " site:"+site : " Japan buy price stock";
    return "https://www.google.com/search?q="+encodeURIComponent(term+suffix);
  }
  function unique(list) { return list.filter(function(x,i){ return x && list.indexOf(x) === i; }); }
  function optionList(values, selected) { return values.map(function(x){ return '<option '+(x===selected?'selected':'')+'>'+esc(x)+'</option>'; }).join(""); }

  var filters = { search:"", owner:"Todos", status:"Todos", category:"Todas", detail:false };
  function visible(item) {
    var hay = plain([item.name,item.brand,item.owner,item.category,item.note].join(" "));
    return (!filters.search || hay.indexOf(plain(filters.search)) >= 0) &&
      (filters.owner === "Todos" || item.owner === filters.owner) &&
      (filters.status === "Todos" || item.status === filters.status) &&
      (filters.category === "Todas" || item.category === filters.category) &&
      (!filters.detail || item.needsDetail);
  }
  function researchFor(item) {
    var profile=productProfile(item);
    if(profile) return profile;
    var guide=STORE_GUIDE[item.category] || STORE_GUIDE.Outros;
    if (item.foundStore || safeUrl(item.sourceUrl)) return {
      confidence:item.foundStore && safeUrl(item.sourceUrl)?"Registrado com fonte":"Informação parcial",
      tone:item.foundStore && safeUrl(item.sourceUrl)?"confirmed":"partial",
      summary:"Resultado registrado pelo grupo. Confirme se o link demonstra o produto, o preço e a unidade da loja.",
      checked:item.checkedAt || "Data não informada",price:item.foundPrice?yen(item.foundPrice):"Preço não informado",
      sources:safeUrl(item.sourceUrl)?[{label:"Fonte adicionada",url:safeUrl(item.sourceUrl),kind:"Fonte do grupo"}]:[],
      candidates:item.foundStore?[{store:item.foundStore,area:guide.area||"",day:guide.day||"",query:item.foundStore+" Japan",reason:"Loja registrada pelo grupo.",stock:safeUrl(item.sourceUrl)?"Verificar evidência no link":"Estoque não confirmado"}]:[]
    };
    if (guide.store) return {
      confidence:"Loja compatível com a categoria",tone:"partial",
      summary:"A loja vende esta categoria, mas o produto e o estoque não foram encontrados. Trate-a apenas como uma possibilidade.",
      checked:"Não pesquisado",price:"Preço não pesquisado",sources:[],
      candidates:[{store:guide.store,area:guide.area,day:guide.day,query:guide.query,reason:"Compatível com "+item.category+" e próxima ao roteiro.",stock:"Produto e estoque não confirmados"}]
    };
    return {confidence:"Sem resultado confiável",tone:"unverified",summary:"Ainda não há evidência de produto, preço ou loja. Use as pesquisas direcionadas abaixo; o app não atribuirá uma loja automaticamente.",checked:"Não pesquisado",price:"Preço não pesquisado",sources:[],candidates:[]};
  }
  function evidenceHtml(item,research) {
    var sources=research.sources.map(function(s){return '<a href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer"><b>'+esc(s.label)+'</b><small>'+esc(s.kind)+'</small></a>';}).join("");
    var candidates=research.candidates.map(function(c){return '<div class="shop-candidate"><div><b>'+esc(c.store)+'</b><span>'+esc([c.area,c.day&&("roteiro de "+c.day)].filter(Boolean).join(" · "))+'</span><p>'+esc(c.reason)+'</p><small>'+esc(c.stock)+'</small></div><div class="shop-candidate-actions">'+(item.foundStore&&safeUrl(item.sourceUrl)?'<a href="'+esc(mapUrl(c.query))+'" target="_blank" rel="noopener noreferrer">Mapa</a>':'')+'</div></div>';}).join("");
    return '<section class="shop-research '+esc(research.tone)+'"><div class="shop-research-head"><div><small>Pesquisa do produto</small><b>'+esc(research.confidence)+'</b></div><span>Verificado: '+esc(research.checked)+'</span></div>'+
      (research.canonical?'<div class="shop-canonical"><small>Nome para procurar</small><b>'+esc(research.canonical)+'</b></div>':'')+'<p>'+esc(research.summary)+'</p>'+
      (research.price?'<div class="shop-research-price">'+esc(research.price)+'</div>':'')+
      (sources?'<div class="shop-sources">'+sources+'</div>':'')+(candidates?'<div class="shop-candidates">'+candidates+'</div>':'')+
      '<div class="shop-query-actions"><a href="'+esc(searchUrl(item,""))+'" target="_blank" rel="noopener noreferrer">Pesquisar produto exato</a><a href="'+esc(searchUrl(item,"yodobashi.com"))+'" target="_blank" rel="noopener noreferrer">Yodobashi</a><a href="'+esc(searchUrl(item,"amazon.co.jp"))+'" target="_blank" rel="noopener noreferrer">Amazon Japão</a><a href="'+esc(searchUrl(item,"rakuten.co.jp"))+'" target="_blank" rel="noopener noreferrer">Rakuten</a></div></section>';
  }
  function itemCard(item, rate) {
    var research = researchFor(item), price = Number(item.foundPrice)||0, max = Number(item.maxPrice)||0;
    var priceMeta = price ? yen(price)+" · "+brl(price/rate) : "Preço não pesquisado";
    var compare = price && max ? (price <= max ? "Dentro do limite" : "Acima do limite") : "";
    return '<article class="shop-item '+(item.status==="Comprado"?'bought':'')+'" data-shop-card="'+esc(item.id)+'">'+
      '<div class="shop-item-head"><div><small>'+esc(item.category)+'</small><h3>'+esc(item.name)+'</h3><p>'+esc(item.brand || "Marca não informada")+(item.variant?' · '+esc(item.variant):'')+'</p></div>'+
      (item.needsDetail?'<span class="shop-detail-flag">Precisa detalhar</span>':'')+'</div>'+
      '<div class="shop-chips"><span>'+esc(item.owner || "Sem responsável")+'</span><span>'+esc(item.priority)+'</span><span>Qtd. '+esc(item.quantity)+'</span></div>'+
      '<div class="shop-price"><div><small>Preço registrado</small><b>'+priceMeta+'</b><span>'+esc(compare)+'</span></div><div><small>Confiabilidade da busca</small><b>'+esc(research.confidence)+'</b><span>'+esc(research.tone==="confirmed"?"Há evidência; confirme o estoque da unidade.":"Nenhum estoque foi presumido.")+'</span></div></div>'+evidenceHtml(item,research)+
      '<div class="shop-actions"><select data-shop-status="'+esc(item.id)+'">'+optionList(STATUSES,item.status)+'</select><button type="button" data-shop-edit="'+esc(item.id)+'">Editar</button></div>'+
      '<div class="shop-editor" data-shop-editor="'+esc(item.id)+'" hidden>'+editorFields(item)+'</div></article>';
  }
  function editorFields(item) {
    return '<div class="shop-form-grid">'+
      '<label>Produto<input data-shop-field="name" value="'+esc(item.name)+'"></label><label>Marca<input data-shop-field="brand" value="'+esc(item.brand)+'"></label>'+
      '<label>Variante, tamanho ou cor<input data-shop-field="variant" value="'+esc(item.variant)+'"></label><label>Responsável<input data-shop-field="owner" value="'+esc(item.owner)+'"></label>'+
      '<label>Categoria<select data-shop-field="category">'+optionList(Object.keys(STORE_GUIDE),item.category)+'</select></label><label>Prioridade<select data-shop-field="priority">'+optionList(PRIORITIES,item.priority)+'</select></label>'+
      '<label>Quantidade<input type="number" min="1" step="1" data-shop-field="quantity" value="'+esc(item.quantity)+'"></label><label>Preço máximo (¥)<input type="number" min="0" step="1" data-shop-field="maxPrice" value="'+esc(item.maxPrice)+'"></label>'+
      '<label>Preço encontrado (¥)<input type="number" min="0" step="1" data-shop-field="foundPrice" value="'+esc(item.foundPrice)+'"></label><label>Loja encontrada<input data-shop-field="foundStore" value="'+esc(item.foundStore)+'"></label>'+
      '<label class="wide">Link da pesquisa ou produto<input type="url" data-shop-field="sourceUrl" value="'+esc(item.sourceUrl)+'"></label><label class="wide">Observações<textarea data-shop-field="note">'+esc(item.note)+'</textarea></label>'+
      '<label class="shop-check"><input type="checkbox" data-shop-field="needsDetail" '+(item.needsDetail?'checked':'')+'> Ainda precisa detalhar</label></div>'+
      '<div class="shop-edit-actions"><button type="button" data-shop-save="'+esc(item.id)+'">Salvar</button><button type="button" class="danger" data-shop-delete="'+esc(item.id)+'">Excluir</button></div>';
  }

  function render() {
    var host = document.getElementById("shopping-view"); if (!host) return;
    var state = load(), items = state.items.filter(visible), rate = Math.max(1,Number(state.rate)||29);
    var owners = ["Todos"].concat(unique(state.items.map(function(x){return x.owner;})).sort());
    var categories = ["Todas"].concat(Object.keys(STORE_GUIDE));
    var bought = state.items.filter(function(x){return x.status==="Comprado";}).length;
    var foundTotal = state.items.reduce(function(s,x){return s+(Number(x.foundPrice)||0)*(Number(x.quantity)||1);},0);
    var need = state.items.filter(function(x){return x.needsDetail;}).length;
    host.innerHTML = '<div class="shopping-shell"><div class="transport-hero shopping-hero"><div><div class="today-eyebrow">Lista colaborativa</div><h2>Compras no Japão</h2><p>Produtos, responsáveis, preços e pesquisa com evidências.</p></div><button type="button" data-close-shopping>Voltar ao calendário</button></div>'+
      '<section class="shop-summary"><div><small>Itens</small><b>'+state.items.length+'</b></div><div><small>Comprados</small><b>'+bought+'</b></div><div><small>Precisam detalhar</small><b>'+need+'</b></div><div><small>Preço pesquisado</small><b>'+yen(foundTotal)+'</b><span>'+brl(foundTotal/rate)+'</span></div></section>'+
      '<section class="shop-add"><div><h3>Adicionar item</h3><p>Quanto mais específico, melhor: produto, marca, modelo, tamanho ou cor. Só mostraremos loja quando houver evidência.</p></div><div class="shop-add-grid"><input data-new-shop="name" placeholder="Produto e modelo"><input data-new-shop="brand" placeholder="Marca"><input data-new-shop="owner" placeholder="Responsável"><select data-new-shop="priority">'+optionList(PRIORITIES,"Quero")+'</select><button type="button" data-shop-add>Adicionar</button></div><p class="shop-add-message" data-shop-message></p></section>'+
      '<section class="shop-filter"><input type="search" data-shop-filter="search" value="'+esc(filters.search)+'" placeholder="Buscar produto, marca ou pessoa"><select data-shop-filter="owner">'+owners.map(function(x){return '<option '+(x===filters.owner?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><select data-shop-filter="status">'+["Todos"].concat(STATUSES).map(function(x){return '<option '+(x===filters.status?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><select data-shop-filter="category">'+categories.map(function(x){return '<option '+(x===filters.category?'selected':'')+'>'+esc(x)+'</option>';}).join('')+'</select><label><input type="checkbox" data-shop-filter="detail" '+(filters.detail?'checked':'')+'> Precisa detalhar</label><label class="shop-rate">¥ por R$ 1<input type="number" min="1" step=".1" data-shop-rate value="'+esc(rate)+'"></label></section>'+
      '<div class="shop-list">'+(items.length?items.map(function(x){return itemCard(x,rate);}).join(''):'<p class="bk-empty">Nenhum item com esses filtros.</p>')+'</div></div>';
    bind(host,state);
  }
  function bind(host,state) {
    host.querySelector("[data-close-shopping]").addEventListener("click",function(){ window.plannerShowShopping(false); });
    host.addEventListener("click",function(e){
      var id, item, card;
      if (e.target.closest("[data-shop-add]")) {
        var name=host.querySelector('[data-new-shop="name"]').value.trim(), brand=host.querySelector('[data-new-shop="brand"]').value.trim(), owner=host.querySelector('[data-new-shop="owner"]').value.trim();
        var msg=host.querySelector('[data-shop-message]');
        if (!name || !owner) { msg.textContent="Informe o produto e o responsável."; return; }
        var duplicate=state.items.find(function(x){return plain(x.name)===plain(name)&&plain(x.owner)===plain(owner);});
        if (duplicate) { msg.textContent="Este item já está na lista de "+owner+"."; return; }
        var cat=categoryFor(name,brand);
        state.items.unshift({id:"s-"+Date.now(),owner:owner,brand:brand,name:name,variant:"",category:cat,quantity:1,priority:host.querySelector('[data-new-shop="priority"]').value,status:"Desejado",maxPrice:"",foundPrice:"",foundStore:"",sourceUrl:"",checkedAt:"",note:"",needsDetail:needsDetail(name,brand),createdAt:new Date().toISOString().slice(0,10)});
        save(state); render(); return;
      }
      var edit=e.target.closest("[data-shop-edit]");
      if(edit){id=edit.dataset.shopEdit;card=host.querySelector('[data-shop-card="'+id+'"]');var panel=card.querySelector('[data-shop-editor]');panel.hidden=!panel.hidden;edit.textContent=panel.hidden?"Editar":"Fechar";return;}
      var saveBtn=e.target.closest("[data-shop-save]");
      if(saveBtn){id=saveBtn.dataset.shopSave;item=state.items.find(function(x){return x.id===id;});card=host.querySelector('[data-shop-card="'+id+'"]');if(item&&card){card.querySelectorAll('[data-shop-field]').forEach(function(f){var v=f.type==="checkbox"?f.checked:f.value;item[f.dataset.shopField]=f.type==="number"?(v===""?"":Number(v)):v;});item.checkedAt=item.foundPrice?new Date().toISOString().slice(0,10):item.checkedAt;save(state);render();}return;}
      var del=e.target.closest("[data-shop-delete]");
      if(del&&confirm("Excluir este item da lista compartilhada?")){state.items=state.items.filter(function(x){return x.id!==del.dataset.shopDelete;});save(state);render();}
    });
    host.addEventListener("change",function(e){
      if(e.target.dataset.shopStatus){var item=state.items.find(function(x){return x.id===e.target.dataset.shopStatus;});if(item){item.status=e.target.value;save(state);render();}return;}
      if(e.target.dataset.shopFilter){filters[e.target.dataset.shopFilter]=e.target.type==="checkbox"?e.target.checked:e.target.value;render();return;}
      if(e.target.dataset.shopRate!==undefined){state.rate=Math.max(1,Number(e.target.value)||29);save(state);render();}
    });
    var search=host.querySelector('[data-shop-filter="search"]');
    search.addEventListener("input",function(){filters.search=search.value;clearTimeout(search._t);search._t=setTimeout(render,180);});
  }

  window.plannerShowShopping=function(show){document.body.classList.toggle("shopping-open",show!==false);if(show!==false)render();window.scrollTo(0,0);};
  document.addEventListener("DOMContentLoaded",function(){var b=document.getElementById("open-shopping-view");if(b)b.addEventListener("click",function(){window.plannerShowShopping(true);});});
})();
