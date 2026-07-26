Plano: bloco de guia detalhado por card no Japan Trip Planner

Objetivo
--------
Criar um novo bloco de "Guia de atividade" no planner, exibido como uma aba/seção abaixo do calendário. O primeiro card a receber o guia será o passeio de Tóquio **"Shibuya + Harajuku + Omotesando"**, servindo de modelo para os demais cards da viagem.

Escopo do exemplo
-------------------
Card escolhido: **Shibuya + Harajuku + Omotesando** (`shibuya-harajuku` no planner.html).

Esse card já tem um roteiro sugerido e 5 destaques. O guia detalhado expandirá cada destaque com:

- Fotos da atração (usando URLs públicas de bancos de imagens ou imagens geradas por AI).
- Vídeos de TikTok e Instagram (embeds/linlks de exemplo, pois ainda não há conectores de redes sociais configurados).
- Hidden gems no roteiro (pequenos achados pouco turísticos entre os pontos principais).
- Atrações imperdíveis (o que realmente vale a pena).
- Atrações que costumam lotar e fazer turistas perderem tempo (com alertas).
- Alternativas legais para cada atração lotada.

Fonte de conteúdo
------------------
- A descrição detalhada, hidden gems, imperdíveis e atrações a evitar serão sugeridos por AI (Lovable AI Gateway) e revisados no planejamento.
- Fotos: iniciar com imagens de placeholder de bancos gratuitos (ex: Unsplash source URLs) ou gerar imagens de marcação com AI para 3-4 pontos-chave. Aplicar lazy loading.
- Vídeos: usar links/embeds de exemplo de TikTok e Instagram para 2-3 atrações (ex: "Shibuya crossing de noite", "Harajuku takeshita street"). Se o usuário quiser buscar vídeos reais depois, ligamos os conectores TikTok/Instagram em uma fase seguinte.

Formato de visualização
------------------------
Uma nova aba/seção abaixo do calendário, intitulada **"Guia do card selecionado"**. O conteúdo só aparece quando o usuário clica em um dia que tenha um card com guia disponível, ou quando clica diretamente no card no painel lateral.

Estrutura da seção (top-down):

1. Cabeçalho: emoji + nome do card + tempo estimado + tag da cidade.
2. Galeria horizontal: 3-4 fotos dos pontos principais (Shibuya Crossing, Meiji Jingu, Harajuku/Takeshita, Omotesando/Parco).
3. Vídeos curtos: 2-3 miniaturas com link/embed para TikTok/Instagram.
4. Seção "Imperdíveis": 3-4 itens com porquê vale a pena e melhor horário.
5. Seção "Hidden gems": 3-4 lugares alternativos entre os pontos principais.
6. Seção "Atrações lotadas — evite ou tenha estratégia": 2-3 itens com alternativa sugerida.
7. Seção "Roteiro inteligente": sugestão de ordem com horários, usando o roteiro já existente do card como base.

Estrutura de dados
------------------
Adicionar um novo campo `guide` nos objetos `TOUR_DEFS` do planner.html para os cards que terão guia. No exemplo, o card `shibuya-harajuku` ganhará:

- `guide.images[]`: array com `{url, alt, caption}`.
- `guide.videos[]`: array com `{platform, title, embedUrl, sourceUrl}`.
- `guide.mustSee[]`: `{name, why, bestTime}`.
- `guide.hiddenGems[]`: `{name, tip}`.
- `guide.overrated[]`: `{name, whyAvoid, alternative}`.
- `guide.smartRoute[]`: passo a passo com horários.

A seção de guia será renderizada por uma nova função JavaScript no planner.html, consumindo essa estrutura.

Passos de implementação
-------------------------
1. Gerar/validar o conteúdo do guia para Shibuya + Harajuku + Omotesando com AI.
2. Atualizar o objeto `TOUR_DEFS` em `public/planner.html` adicionando o campo `guide` no card `shibuya-harajuku`.
3. Criar o HTML e CSS da nova aba/seção no planner.html.
4. Adicionar a função JavaScript que renderiza o guia quando um card/dia é selecionado.
5. Fazer com que cliques no card abram/focus a seção de guia.
6. Testar localmente no preview.
7. Publicar a nova versão em `https://plannerjapa.lovable.app`.

Próxima decisão
---------------
Antes de começar a implementação, vou apresentar o conteúdo gerado por AI para aprovação (imagens, vídeos, hidden gems, imperdíveis e atrações a evitar). Assim você valida o tom e as escolhas antes de eu mexer no código.

Quer que eu gere esse conteúdo de exemplo agora?