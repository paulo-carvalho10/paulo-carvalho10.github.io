// Conteúdo do portfólio: quem eu sou e a lista de projetos, em português e inglês.
// Para mudar um texto, é só editar aqui. Para acrescentar um projeto, copie um bloco { ... }.
//
// Campos de cada projeto:
//   categorias  "ia", "web" ou "jogo" (usadas nos filtros)
//   numero      um número que dá para conferir no projeto (opcional)
//   demo.tipo   "link"   abre outro site numa aba nova
//               "pagina" abre uma página deste site (por exemplo, campo-minado/)
//               "video"  abre os detalhes com a gravação em destaque
//   nota        aparece em "Como testar" nos detalhes (opcional)
//   destaque    true para o card ocupar a linha inteira, com a imagem ao lado
//   compacto    true para aparecer só na lista "Mais no GitHub", sem card
//   en          os mesmos textos em inglês. O que faltar aqui aparece em português.
//               "legendas" e "extras" seguem a mesma ordem de "galeria" e "extras".

window.SOBRE = {
  nome: "Paulo Fernando Carvalho",
  nomeCompleto: "Paulo Fernando Azevedo de Carvalho",
  curso: "Ciência da Computação · UFU",
  cidade: "Uberlândia - MG",
  email: "paulof.carvalho98@gmail.com",
  // Redes que aparecem no topo e na seção de contato, nesta ordem.
  // rede: "linkedin", "github", "instagram" ou "x" (escolhe o ícone)
  links: [
    {
      rede: "linkedin",
      rotulo: "LinkedIn",
      usuario: "Paulo Fernando Azevedo de Carvalho",
      url: "https://www.linkedin.com/in/paulo-fernando-azevedo-de-carvalho-80a3a9309/",
    },
    { rede: "github", rotulo: "GitHub", usuario: "@paulo-carvalho10", url: "https://github.com/paulo-carvalho10" },
    { rede: "instagram", rotulo: "Instagram", usuario: "@_pepecarvalho_", url: "https://www.instagram.com/_pepecarvalho_/" },
    { rede: "x", rotulo: "X", usuario: "@_PepeCarvalho4_", url: "https://x.com/_PepeCarvalho4_" },
  ],
  // Frases que aparecem sendo digitadas no topo (as mesmas do perfil do GitHub).
  frases: [
    "Estudante de Ciência da Computação na UFU",
    "Back-end em Python, front em React e Next.js",
    "Projetos no ar, com testes de verdade",
    "Medir antes de afirmar",
  ],
  en: {
    curso: "Computer Science · UFU",
    cidade: "Uberlândia - MG, Brazil",
    frases: [
      "Computer Science student at UFU",
      "Back-end in Python, front-end in React and Next.js",
      "Projects live, with real tests",
      "Measure before you claim",
    ],
  },
};

window.PROJETOS = [
  {
    id: "prancheta-11",
    nome: "PRANCHETA 11",
    destaque: true, // card largo, ocupando a linha inteira
    resumo: "Jogo de técnico de futebol com um motor de simulação calibrado contra o futebol real.",
    descricao:
      "Você assume um clube, escala, contrata e vende, e assiste à partida minuto a minuto, mexendo no time durante o jogo. São 32 países, 40 divisões, 706 clubes e quase 21 mil jogadores reais. A pergunta que guia o projeto é se a tabela no fim do ano é crível.",
    categorias: ["jogo"],
    numero: { valor: "400+", rotulo: "testes automatizados" },
    tecnologias: ["Python", "NumPy", "JavaScript", "HTML e CSS"],
    capa: "img/football-manager-escalacao.webp",
    galeria: [
      { src: "img/football-manager-escalacao.webp", legenda: "Escalação: o campo, as reservas e a tática" },
      { src: "img/football-manager-aovivo.webp", legenda: "Partida ao vivo: estatísticas, lance a lance e os outros jogos da rodada" },
      { src: "img/football-manager-classificacao.webp", legenda: "Tabela: classificação, artilharia, defesas e copas" },
      { src: "img/football-manager-transferencias.webp", legenda: "Mercado: quase 21 mil jogadores, valor em euro e salário na moeda do clube" },
    ],
    destaques: [
      "Partida ao vivo: o relógio para a cada 5 minutos para substituições, mudança de tática e escolha de quem bate o pênalti.",
      "Competições no formato real: Série A e B, Copa do Brasil, Libertadores, Sul-Americana, Champions e as copas nacionais da Europa.",
      "Seleções montadas pela nacionalidade real de cada jogador, com eliminatórias e Copa do Mundo de 48 seleções.",
      "Multijogador: até 8 técnicos na mesma carreira, cada um no seu aparelho.",
      "Determinístico: a mesma semente gera exatamente o mesmo mundo, em qualquer máquina.",
    ],
    demo: { tipo: "link", url: "https://paulo-carvalho10.github.io/football-manager/", rotulo: "Abrir demo" },
    nota:
      "A demonstração no navegador roda o motor: simula temporadas inteiras e a calibração contra o futebol real, sem instalar nada. O jogo completo roda no computador, com Python 3.12 e NumPy.",
    codigo: "https://github.com/paulo-carvalho10/football-manager",
    en: {
      resumo: "A football manager game with a match engine calibrated against real football.",
      descricao:
        "You take over a club, pick the lineup, buy and sell players, and watch the match minute by minute, changing the team as it plays. The world has 32 countries, 40 divisions, 706 clubs and almost 21,000 real players. The question driving the project is whether the final league table is believable.",
      numero: { valor: "400+", rotulo: "automated tests" },
      tecnologias: ["Python", "NumPy", "JavaScript", "HTML & CSS"],
      legendas: [
        "Lineup: the pitch, the bench and the tactics",
        "Live match: stats, play-by-play and the other games of the round",
        "Table: standings, top scorers, defences and cups",
        "Transfer market: almost 21,000 players, value in euros and wages in the club's currency",
      ],
      destaques: [
        "Live match: the clock stops every 5 minutes for substitutions, tactical changes and choosing the penalty taker.",
        "Competitions in their real formats: Brazil's Série A and B, Copa do Brasil, Libertadores, Sudamericana, the Champions League and Europe's domestic cups.",
        "National teams built from each player's real nationality, with qualifiers and a 48-team World Cup.",
        "Multiplayer: up to 8 managers in the same career, each on their own device.",
        "Deterministic: the same seed generates exactly the same world, on any machine.",
      ],
      demo: "Open demo",
      nota:
        "The browser demo runs the engine: it simulates whole seasons and the calibration against real football, with nothing to install. The full game runs on your computer with Python 3.12 and NumPy.",
    },
  },
  {
    id: "resolveai",
    nome: "ResolveAI",
    resumo: "Service desk com IA: classifica, prioriza e encaminha chamados e sugere a solução.",
    descricao:
      "Cada chamado recebe categoria, prioridade e equipe automaticamente, e a IA sugere a solução com base na base de conhecimento, citando as fontes. A busca é semântica, com embeddings no pgvector (RAG). Tem as visões de administrador, atendente e solicitante.",
    categorias: ["ia", "web"],
    numero: { valor: "5.000", rotulo: "chamados na demonstração" },
    tecnologias: ["Python", "FastAPI", "PostgreSQL", "pgvector", "React", "TypeScript", "Claude"],
    capa: "img/resolveai-dashboard.webp",
    galeria: [
      { src: "img/resolveai-dashboard.webp", legenda: "Dashboard: fila atual, SLA e chamados por dia, categoria, prioridade e equipe" },
      { src: "img/resolveai-chamado-detalhe.webp", legenda: "Chamado: a sugestão da base de conhecimento, com a fonte citada, e a análise da IA" },
      { src: "img/resolveai-base-de-conhecimento.webp", legenda: "Base de conhecimento usada pelo RAG" },
    ],
    destaques: [
      "Classificação, prioridade e encaminhamento automáticos de cada chamado.",
      "Sugestão de solução com RAG: busca artigos e casos parecidos por embeddings e cita as fontes.",
      "Triagem completa, comentários e notas internas que o solicitante não vê.",
      "Sobe inteiro com docker compose up.",
    ],
    demo: { tipo: "link", url: "https://resolveai-silk.vercel.app", rotulo: "Abrir demo" },
    extras: [{ rotulo: "API e documentação", url: "https://resolveai-api-wb7q.onrender.com/docs" }],
    nota:
      "Entre com admin@resolveai.dev e a senha resolveai123 (troque admin por agent ou user para ver as outras visões). A API fica no plano gratuito do Render e hiberna sem uso: a primeira resposta pode levar até um minuto.",
    codigo: "https://github.com/paulo-carvalho10/resolveai",
    en: {
      resumo: "AI service desk: classifies, prioritizes and routes tickets, and suggests the fix.",
      descricao:
        "Every ticket automatically gets a category, a priority and a team, and the AI suggests a solution from the knowledge base, citing its sources. Search is semantic, with embeddings in pgvector (RAG). It has admin, agent and requester views.",
      numero: { valor: "5,000", rotulo: "tickets in the demo" },
      legendas: [
        "Dashboard: current queue, SLA, and tickets per day, category, priority and team",
        "Ticket: the knowledge-base suggestion with its cited source, and the AI analysis",
        "Knowledge base used by the RAG",
      ],
      destaques: [
        "Automatic category, priority and routing for every ticket.",
        "Solution suggestions with RAG: finds similar articles and cases through embeddings and cites the sources.",
        "Full triage, comments and internal notes the requester can't see.",
        "Runs end to end with docker compose up.",
      ],
      demo: "Open demo",
      extras: ["API and docs"],
      nota:
        "Log in with admin@resolveai.dev and the password resolveai123 (swap admin for agent or user to see the other views). The API runs on Render's free tier and sleeps when idle: the first response can take up to a minute.",
    },
  },
  {
    id: "campo-minado-rl",
    nome: "Campo Minado com RL",
    resumo: "Uma DQN que aprendeu a jogar Campo Minado e joga ao vivo aqui no navegador.",
    descricao:
      "Agente de aprendizado por reforço treinado em PyTorch: a cada jogada, a rede estima o valor de abrir cada casa e escolhe a mais segura. No 9×9 com 10 minas, vence 87,3% dos tabuleiros de teste, acima do resolvedor lógico (79,2%) e perto do cálculo exato de probabilidade (90,2%).",
    categorias: ["ia", "jogo"],
    numero: { valor: "87,3%", rotulo: "de vitórias no 9×9" },
    tecnologias: ["Python", "PyTorch", "Double DQN", "JavaScript"],
    capa: "img/campo-minado-capa.webp",
    galeria: [
      { src: "img/campo-minado-capa.webp", legenda: "A DQN jogando no navegador: quanto mais escura a casa, maior a chance de mina que ela estima" },
      { src: "img/campo-minado-curva.webp", legenda: "Curva de aprendizado: vitórias em 1.000 tabuleiros de teste ao longo do treino" },
    ],
    destaques: [
      "Rede só de convoluções (5 camadas de 32 filtros): o mesmo filtro avalia cada casa olhando a região em volta.",
      "Double DQN com replay de 200 mil jogadas e 32 partidas em paralelo.",
      "Trocar a perda de Huber pelo erro quadrático levou o 9×9 de 71,6% para 82,3%; a média nas 8 simetrias do tabuleiro, a 87,3%.",
      "Comparada nos mesmos 10.000 tabuleiros com o acaso, um resolvedor lógico e o cálculo exato de probabilidade.",
    ],
    demo: { tipo: "pagina", url: "campo-minado/index.html", rotulo: "Jogar aqui" },
    nota:
      "A demonstração roda a rede treinada direto no seu navegador: os pesos do PyTorch foram levados para JavaScript, sem bibliotecas, e conferidos contra o original.",
    autoria: "Trabalho da disciplina de Inteligência Artificial, em dupla com Cauê Abreu.",
    codigo: "https://github.com/CaueFAbreu/campo-minado-rl",
    en: {
      nome: "Minesweeper with RL",
      resumo: "A DQN that learned to play Minesweeper and plays live right here in your browser.",
      descricao:
        "A reinforcement learning agent trained in PyTorch: on each move, the network estimates the value of opening each cell and picks the safest one. On 9×9 with 10 mines, it wins 87.3% of the test boards, above the logic solver (79.2%) and close to exact probability (90.2%).",
      numero: { valor: "87.3%", rotulo: "win rate on 9×9" },
      legendas: [
        "The DQN playing in the browser: the darker the cell, the higher the mine chance it estimates",
        "Learning curve: wins on 1,000 test boards over training",
      ],
      destaques: [
        "Fully convolutional network (5 layers of 32 filters): the same filter evaluates every cell by looking at its neighborhood.",
        "Double DQN with a 200,000-move replay buffer and 32 games in parallel.",
        "Switching from Huber loss to squared error took 9×9 from 71.6% to 82.3%; averaging over the board's 8 symmetries took it to 87.3%.",
        "Compared on the same 10,000 boards against random play, a logic solver and exact probability.",
      ],
      demo: "Play here",
      nota:
        "The demo runs the trained network right in your browser: the PyTorch weights were ported to JavaScript with no libraries, and checked against the original.",
      autoria: "Artificial Intelligence course project, built in a pair with Cauê Abreu.",
    },
  },
  {
    id: "traceflow",
    nome: "TraceFlow",
    status: "Em construção",
    resumo: "Plataforma de observabilidade em tempo real, com pipeline próprio e um playground de caos.",
    descricao:
      "Recebe traces no padrão OpenTelemetry e mostra ao vivo as métricas de cada serviço, o mapa de dependências e os incidentes, com a causa provável e o que foi afetado. No Incident Playground, você injeta falhas numa loja de cinco microsserviços e acompanha a falha se espalhar, ser detectada e se resolver.",
    categorias: ["web"],
    numero: { valor: "7 a 9 s", rotulo: "para abrir o incidente, com a causa certa" },
    tecnologias: ["Python", "FastAPI", "OpenTelemetry", "Redis Streams", "TimescaleDB", "Next.js", "Docker"],
    capa: "img/traceflow-dashboard.webp",
    galeria: [
      {
        video: "img/traceflow-playground.mp4",
        poster: "img/traceflow-playground-poster.webp",
        legenda: "O ciclo inteiro, acelerado cerca de 4,5 vezes: a falha entra, o incidente abre com a causa certa, a falha é encerrada e o incidente se resolve sozinho",
      },
      { src: "img/traceflow-dashboard.webp", legenda: "Visão geral: tráfego, latência e erros ao vivo, por WebSocket" },
      { src: "img/traceflow-mapa.webp", legenda: "Mapa de serviços montado a partir dos próprios traces" },
      { src: "img/traceflow-waterfall.webp", legenda: "Waterfall de um trace: o caminho de uma requisição pelos serviços" },
      { src: "img/traceflow-incidente.webp", legenda: "Incidente com a causa provável, quem sente e a evidência nos traces" },
    ],
    destaques: [
      "Pipeline próprio, sem Prometheus nem Grafana: ingestão em FastAPI, Redis Streams, processador asyncio, TimescaleDB e WebSocket.",
      "O mapa de dependências se monta sozinho, pelo pareamento dos spans de cliente e servidor.",
      "No teste de carga, gravou cerca de 14,7 mil spans por segundo numa máquina só, com contrapressão quando a fila enche.",
      "CI com o TimescaleDB de verdade e Playwright contra o sistema inteiro no Docker.",
    ],
    demo: { tipo: "video", rotulo: "Ver em ação" },
    nota:
      "Ainda não há uma versão pública no ar: o TraceFlow sobe com Docker Compose. A gravação mostra o ciclo completo de um incidente no playground.",
    codigo: "https://github.com/paulo-carvalho10/traceflow",
    en: {
      status: "In progress",
      resumo: "Real-time observability platform, with its own pipeline and a chaos playground.",
      descricao:
        "It ingests OpenTelemetry traces and shows each service's metrics live, the dependency map and incidents, with the probable cause and what was affected. In the Incident Playground, you inject failures into a five-microservice store and watch the failure spread, get detected and resolve.",
      numero: { valor: "7–9 s", rotulo: "to open the incident, with the right cause" },
      legendas: [
        "The full cycle, sped up about 4.5×: the failure hits, the incident opens with the right cause, the failure ends and the incident resolves itself",
        "Overview: traffic, latency and errors live over WebSocket",
        "Service map built from the traces themselves",
        "Trace waterfall: a request's path through the services",
        "Incident with the probable cause, who is affected and the evidence in the traces",
      ],
      destaques: [
        "Its own pipeline, no Prometheus or Grafana: FastAPI ingestion, Redis Streams, an asyncio processor, TimescaleDB and WebSocket.",
        "The dependency map builds itself by pairing client and server spans.",
        "In the load test it recorded about 14,700 spans per second on a single machine, with backpressure when the queue fills up.",
        "CI with a real TimescaleDB and Playwright against the whole system running in Docker.",
      ],
      demo: "See it in action",
      nota:
        "There's no public deployment yet: TraceFlow runs with Docker Compose. The recording shows the full lifecycle of an incident in the playground.",
    },
  },
  {
    id: "agendaki",
    nome: "AgendaKi",
    resumo: "Agendamento online para barbearias e salões: o cliente marca pelo celular e o dono acompanha num painel.",
    descricao:
      "A página do cliente mostra só os horários realmente livres, respeitando expediente, almoço, folgas e quem já está marcado. O dono vê a agenda do dia, recebe aviso no celular quando alguém marca ou cancela e manda lembretes pelo WhatsApp com um toque.",
    categorias: ["web"],
    numero: { valor: "137", rotulo: "testes, 81 contra um PostgreSQL real" },
    tecnologias: ["Next.js", "React", "TypeScript", "PostgreSQL", "Drizzle ORM", "Web Push"],
    capa: "img/agendaki-cliente.webp",
    galeria: [
      { src: "img/agendaki-cliente.webp", legenda: "Página de agendamento: serviço, profissional, dia e horário" },
      { src: "img/agendaki-painel.webp", legenda: "Painel do dono: agenda do dia, lembretes e agendamento manual" },
      { src: "img/agendaki-cliente-celular.webp", legenda: "A página do cliente no celular" },
    ],
    destaques: [
      "Nunca dois clientes no mesmo horário: a garantia está no PostgreSQL, com uma restrição de exclusão (GiST) e um trigger.",
      "Motor de disponibilidade puro e testado, com fusos, expedientes que viram a noite e horário de verão.",
      "Privacidade: a página pública nunca recebe dados de outros clientes, e os tokens ficam guardados só como SHA-256.",
      "Avisos em tempo real com Web Push, sem custo de mensagem.",
    ],
    demo: { tipo: "link", url: "https://paulo-carvalho10.github.io/agendaki/", rotulo: "Abrir demo" },
    extras: [
      { rotulo: "Painel do dono", url: "https://paulo-carvalho10.github.io/agendaki/painel/" },
      { rotulo: "Versão com banco de dados", url: "https://agendaki-ten.vercel.app/barbearia-demo" },
    ],
    nota:
      "As demonstrações usam uma barbearia fictícia. Na página do cliente e no painel, nada é gravado; na versão com banco, as reservas são de verdade e tudo volta ao início todo dia.",
    codigo: "https://github.com/paulo-carvalho10/agendaki",
    en: {
      resumo: "Online booking for barbershops and salons: customers book from their phone and the owner follows everything on a dashboard.",
      descricao:
        "The customer page only shows truly free slots, respecting opening hours, lunch, days off and existing bookings. The owner sees the day's schedule, gets a phone notification when someone books or cancels, and sends WhatsApp reminders with one tap.",
      numero: { valor: "137", rotulo: "tests, 81 against a real PostgreSQL" },
      legendas: [
        "Booking page: service, professional, day and time",
        "Owner dashboard: the day's schedule, reminders and manual booking",
        "The customer page on a phone",
      ],
      destaques: [
        "Never two customers in the same slot: the guarantee lives in PostgreSQL, with an exclusion constraint (GiST) and a trigger.",
        "A pure, tested availability engine that handles time zones, shifts past midnight and daylight saving time.",
        "Privacy: the public page never receives other customers' data, and tokens are stored only as SHA-256.",
        "Real-time notifications with Web Push, at no messaging cost.",
      ],
      demo: "Open demo",
      extras: ["Owner dashboard", "Version with a database"],
      nota:
        "The demos use a fictional barbershop. On the customer page and the dashboard nothing is saved; in the database version, bookings are real and everything resets daily.",
    },
  },
  {
    id: "os-facil",
    nome: "OS Fácil",
    resumo: "Ordens de serviço para assistências técnicas que continuam funcionando quando a internet cai.",
    descricao:
      "O técnico abre a OS, fotografa o aparelho e colhe a assinatura do cliente sem conexão; as alterações seguem para o servidor quando a rede volta. O cliente acompanha o reparo por um link, sem login.",
    categorias: ["web"],
    tecnologias: ["React", "TypeScript", "IndexedDB", "Supabase", "PWA"],
    capa: "img/os-facil-painel-desktop.webp",
    galeria: [
      { src: "img/os-facil-painel-desktop.webp", legenda: "Painel da oficina: ordens de serviço, busca e filtro por etapa" },
      { src: "img/os-facil-celular.webp", legenda: "No celular: painel, histórico de uma OS e o portal do cliente" },
      { src: "img/os-facil-detalhe-os.webp", legenda: "Detalhe da OS: fotos de entrada, assinatura na entrega e linha do tempo" },
    ],
    destaques: [
      "Local-first: toda gravação vai primeiro para o IndexedDB, e nenhuma tela espera a rede.",
      "Sincronização que aguenta queda de conexão: cada operação tem um UUID, e um reenvio é reconhecido como repetição.",
      "Conflito sem perda de dado: uma assinatura colhida offline não é apagada por uma mudança feita depois em outro aparelho.",
      "Segurança no banco: nenhuma tabela aceita escrita direta do navegador, e o RLS limita a leitura.",
    ],
    demo: { tipo: "link", url: "https://paulo-carvalho10.github.io/os-facil/", rotulo: "Abrir demo" },
    nota:
      "Sem cadastro e com dados fictícios, guardados só no seu navegador. Depois da primeira visita, desligue a internet e recarregue a página: tudo continua funcionando.",
    codigo: "https://github.com/paulo-carvalho10/os-facil",
    en: {
      resumo: "Work orders for repair shops that keep working when the internet goes down.",
      descricao:
        "The technician opens the work order, photographs the device and collects the customer's signature offline; changes go to the server when the connection comes back. The customer tracks the repair through a link, no login needed.",
      legendas: [
        "Shop dashboard: work orders, search and filter by stage",
        "On a phone: dashboard, a work order's history and the customer portal",
        "Work order details: intake photos, signature at delivery and timeline",
      ],
      destaques: [
        "Local-first: every write goes to IndexedDB first, and no screen waits for the network.",
        "Sync that survives dropped connections: each operation has a UUID, and a resend is recognized as a repeat.",
        "Conflicts without data loss: a signature collected offline isn't wiped by a later change made on another device.",
        "Security in the database: no table accepts direct writes from the browser, and RLS restricts reads.",
      ],
      demo: "Open demo",
      nota:
        "No sign-up, with fictional data stored only in your browser. After the first visit, turn off the internet and reload the page: everything keeps working.",
    },
  },
  {
    id: "pixcerto",
    nome: "PixCerto",
    resumo: "Gera e confere cobranças Pix (BR Code) inteiramente no navegador.",
    descricao:
      "Implementa o BR Code do zero (padrão EMV MPM, perfil Pix do Banco Central): monta os campos, calcula o CRC16 e lê o código de volta. Não há back-end nem requisição de rede, então a chave Pix nunca sai do aparelho.",
    categorias: ["web"],
    numero: { valor: "131", rotulo: "testes, com typecheck estrito" },
    tecnologias: ["TypeScript", "Vite"],
    capa: "img/pixcerto-gerar.webp",
    galeria: [
      { src: "img/pixcerto-gerar.webp", legenda: "Geração: o formulário, o QR Code e o Pix copia e cola" },
      { src: "img/pixcerto-conferir.webp", legenda: "Conferidor: a árvore de campos de um código recebido" },
      { src: "img/pixcerto-lote.webp", legenda: "Geração em lote, um código para cada valor" },
    ],
    destaques: [
      "Gera o Pix copia e cola e o QR Code enquanto você digita, com validação de CPF e CNPJ.",
      "Exporta PNG, SVG e um cartaz A4 pronto para imprimir.",
      "Geração em lote: um código para cada valor de uma lista.",
      "Conferidor: explica cada campo de um código recebido e diz se o CRC16 fecha.",
    ],
    demo: { tipo: "link", url: "https://paulo-carvalho10.github.io/pixcerto/", rotulo: "Abrir demo" },
    codigo: "https://github.com/paulo-carvalho10/pixcerto",
    en: {
      resumo: "Generates and checks Pix payment codes (BR Code) entirely in the browser.",
      descricao:
        "It implements Brazil's Pix BR Code from scratch (EMV MPM standard, Central Bank Pix profile): builds the fields, computes the CRC16 and parses codes back. There's no back-end and no network request, so the Pix key never leaves the device.",
      numero: { valor: "131", rotulo: "tests, with strict typechecking" },
      legendas: [
        "Generate: the form, the QR code and the copy-paste Pix code",
        "Checker: the field tree of a received code",
        "Batch generation, one code per amount",
      ],
      destaques: [
        "Generates the copy-paste Pix code and the QR code as you type, with CPF and CNPJ validation.",
        "Exports PNG, SVG and a print-ready A4 poster.",
        "Batch generation: one code for each amount in a list.",
        "Checker: explains every field of a received code and tells you whether the CRC16 matches.",
      ],
      demo: "Open demo",
    },
  },
  {
    id: "analise-futebol",
    nome: "Análise de jogadas",
    resumo: "Visão computacional no futebol: detecção e rastreamento de jogadores em vídeo, com YOLO e OpenCV.",
    categorias: ["ia"],
    tecnologias: ["Python", "OpenCV", "YOLO", "Jupyter"],
    codigo: "https://github.com/paulo-carvalho10/an-lise-futebol",
    compacto: true,
    en: {
      nome: "Football play analysis",
      resumo: "Computer vision for football: player detection and tracking in video, with YOLO and OpenCV.",
    },
  },
];
