// Conteúdo factual e cópias de interface vêm de data.js.
(() => {
  "use strict";

  const languageSelect = document.getElementById("language-select");
  const languageStorageKey = "diario-language-v2";
  const languageStores = () => {
    const stores = [];
    try { stores.push(window.sessionStorage); } catch (_) { /* Storage may be blocked. */ }
    try { stores.push(window.localStorage); } catch (_) { /* Storage may be blocked. */ }
    return stores;
  };
  const readLanguagePreference = () => {
    for (const store of languageStores()) {
      try {
        const value = store.getItem(languageStorageKey);
        if (value === "en" || value === "pt-BR") return value;
      } catch (_) { /* Storage can be unavailable for local previews or privacy settings. */ }
    }
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    return fromUrl === "en" || fromUrl === "pt-BR" ? fromUrl : "en";
  };
  const saveLanguagePreference = (value) => {
    let stored = false;
    for (const store of languageStores()) {
      try {
        store.setItem(languageStorageKey, value);
        stored = true;
      } catch (_) { /* Try the other storage mechanism, then the URL fallback. */ }
    }
    let fallbackUrl = "";
    try {
      const url = new URL(window.location.href);
      if (stored) url.searchParams.delete("lang");
      else url.searchParams.set("lang", value);
      fallbackUrl = url.href;
      window.history.replaceState(window.history.state, "", url.href);
    } catch (_) { /* The storage preference is still used when history is restricted. */ }
    return stored || Boolean(fallbackUrl);
  };
  const savedLanguage = readLanguagePreference();
  const isEnglish = savedLanguage === "en";
  const ui = (portuguese, english) => isEnglish ? english : portuguese;
  const DATA = isEnglish ? window.MISSION_DATA_EN : window.MISSION_DATA;
  if (!DATA || !Array.isArray(DATA.tabs) || !Array.isArray(DATA.missions)) return;

  document.documentElement.lang = isEnglish ? "en" : "pt-BR";
  document.title = isEnglish ? "Beyond Earth: exploring the story of space missions" : DATA.tabs[0].title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = isEnglish
    ? "Explore stories of five Moon and Mars explorers, then build a rover in an educational mini game."
    : "Explore as histórias de cinco equipamentos da Lua e de Marte e monte um robô explorador em um mini game educativo.";
  const applyShellLanguage = () => {
    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };
    const setLabel = (selector, value) => document.querySelector(selector)?.setAttribute("aria-label", value);
    setText(".skip-link", ui("Pular para o conteúdo", "Skip to content"));
    setLabel(".wordmark", ui("Diário de bordo, voltar ao início", "Mission log, return to home"));
    const wordmarkStrong = document.querySelector(".wordmark__text strong");
    const wordmarkRest = document.querySelector(".wordmark__text span");
    if (wordmarkStrong) wordmarkStrong.textContent = isEnglish ? "MISSION" : "DIÁRIO";
    if (wordmarkRest) wordmarkRest.textContent = isEnglish ? "LOG" : "DE BORDO";
    setLabel(".route-progress", ui("Progresso da rota das missões", "Mission route progress"));
    setText("#route-progress-label", DATA.progress.label);
    setLabel("#route-progress-bar", ui("Missões conhecidas", "Missions explored"));
    setLabel("#tab-list", ui("Áreas do diário", "Exhibit sections"));
    setLabel("#tab-panels", ui("Conteúdo do diário", "Exhibit content"));
    setLabel(".elaine-dock", "Elaine");
    setLabel("#elaine-toggle", ui("Alternar falas da Elaine", "Toggle Elaine’s messages"));
    setLabel("#language-select", "Language / Idioma");
    setLabel("#mobile-menu-toggle", ui("Abrir menu", "Open menu"));
    setText("#mobile-menu-toggle span", ui("Menu", "Menu"));
  };
  applyShellLanguage();
  if (languageSelect) {
    languageSelect.value = isEnglish ? "en" : "pt-BR";
    languageSelect.addEventListener("change", () => {
      const persisted = saveLanguagePreference(languageSelect.value);
      if (persisted) {
        window.location.reload();
        return;
      }
      const fallback = new URL(window.location.href);
      fallback.searchParams.set("lang", languageSelect.value);
      window.location.assign(fallback.href);
    });
  }

  const byId = (items, id) => items.find((item) => item.id === id);
  const missionsById = new Map(DATA.missions.map((mission) => [mission.id, mission]));
  const sourceGameQuestions = Array.isArray(window.MINI_GAME_QUESTIONS) ? window.MINI_GAME_QUESTIONS : [];
  const gameQuestions = isEnglish && Array.isArray(window.MINI_GAME_QUESTIONS_EN)
    ? window.MINI_GAME_QUESTIONS_EN.map((question) => {
      const source = sourceGameQuestions.find((candidate) => candidate.id === question.id);
      return { ...(source || {}), ...question };
    })
    : sourceGameQuestions;
  const gameRoundLength = 10;
  const gameAttemptLimit = 2;
  const gameHintLimit = 3;
  const gamePieces = [
    { id: "chassis", label: ui("Corpo e chassi", "Body and chassis") },
    { id: "power", label: ui("Painéis de energia", "Solar panels") },
    { id: "wheels", label: ui("Rodas", "Wheels") },
    { id: "antenna", label: ui("Antena", "Antenna") },
    { id: "instrument", label: ui("Braço científico", "Science arm") },
    { id: "camera", label: ui("Câmeras", "Cameras") }
  ];
  const bestScoreKey = "diario-mini-game-recorde";
  const sourcesById = new Map(DATA.metadata.sources.map((source) => [source.id, source]));
  const tabsById = new Map(DATA.tabs.map((tab) => [tab.id, tab]));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (label, className, action) => {
    const node = el("button", className, label);
    node.type = "button";
    if (action) node.addEventListener("click", action);
    return node;
  };
  const sourceLink = (sourceId, label) => {
    const source = sourcesById.get(sourceId);
    if (!source) return null;
    const link = el("a", "source-link", label || `${ui("Fonte", "Source")}: ${source.title}`);
    link.href = source.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  };
  const safeImageUrl = (value) => {
    if (typeof value !== "string" || !value) return "";
    if (/^assets\/[\w./-]+\.(?:gif|jpe?g|png|webp|svg)$/i.test(value)) return value;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return "";
      if (["www.nasa.gov", "apod.nasa.gov", "blogs.nasa.gov", "images-assets.nasa.gov"].includes(url.hostname)) return url.href;
    } catch (_) { /* URL inválida: a imagem receberá um espaço reservado. */ }
    return "";
  };
  const addSource = (parent, sourceId, label) => {
    const link = sourceLink(sourceId, label);
    if (link) parent.append(link);
  };
  const makeIcon = (key) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("tab-icon");
    const paths = {
      home: ["M3 10.8 12 3l9 7.8", "M5.5 9.5v10h13v-10", "M9.5 19.5v-6h5v6"],
      timeline: ["M4 6h3", "M4 12h3", "M4 18h3", "M10 6h10", "M10 12h10", "M10 18h10"],
      rover: ["M4 14h16l-2-6H8l-4 6Z", "M7 14v3", "M17 14v3", "M8 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M16 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
      map: ["M3 6.5 8 4l8 2 5-2.5v14L16 20l-8-2-5 2.5v-14Z", "M8 4v14", "M16 6v14", "M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
      scale: ["M12 4v16", "M5 7h14", "M7 7l-3 6h6L7 7Z", "M17 7l-3 6h6l-3-6Z", "M8 20h8"],
      spark: ["m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z", "m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"],
      robot: ["M8 7V4h8v3", "M5 8h14v11H5z", "M9 12h.01", "M15 12h.01", "M9 16h6", "M3 11v5", "M21 11v5"],
      book: ["M4 5.5c3-1.5 5.7-1.1 8 1v13c-2.3-2.1-5-2.5-8-1v-13Z", "M20 5.5c-3-1.5-5.7-1.1-8 1v13c2.3-2.1 5-2.5 8-1v-13Z"],
      source: ["M6 3h9l4 4v14H6z", "M15 3v5h4", "M9 12h7", "M9 16h7"],
      info: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 11v5", "M12 8h.01"]
    };
    (paths[key] || paths.spark).forEach((d) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", d.includes("Z") && d.includes("a") ? "path" : "path");
      path.setAttribute("d", d);
      svg.append(path);
    });
    return svg;
  };

  const makeNiloAvatar = () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 40 40");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.classList.add("nilo-avatar");
    const shapes = [
      ["line", { x1: "20", y1: "5", x2: "20", y2: "10" }],
      ["circle", { cx: "20", cy: "4", r: "2", class: "nilo-avatar__signal" }],
      ["rect", { x: "5", y: "10", width: "30", height: "24", rx: "8", class: "nilo-avatar__head" }],
      ["circle", { cx: "15", cy: "20", r: "2", class: "nilo-avatar__eye" }],
      ["circle", { cx: "25", cy: "20", r: "2", class: "nilo-avatar__eye" }],
      ["path", { d: "M14 26 Q20 30 26 26" }]
    ];
    shapes.forEach(([tag, attrs]) => {
      const shape = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.entries(attrs).forEach(([name, value]) => shape.setAttribute(name, value));
      svg.append(shape);
    });
    return svg;
  };

  const tabList = document.getElementById("tab-list");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const panelRoot = document.getElementById("tab-panels");
  const routeFill = document.getElementById("route-progress-fill");
  const routeBar = document.getElementById("route-progress-bar");
  const routeValue = document.getElementById("route-progress-value");
  const routeDetail = document.getElementById("route-progress-detail");
  const completionBanner = document.getElementById("completion-banner");
  const dialog = document.getElementById("app-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const elaineDock = document.querySelector(".elaine-dock");
  const elaineButton = document.getElementById("elaine-toggle");
  const elaineMessage = document.getElementById("elaine-message");
  const elaineHintCount = document.getElementById("elaine-hint-count");

  // sessionStorage is optional: privacy settings and file previews may disable it.
  const storage = {
    read(key, fallback) {
      try {
        const value = sessionStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (_) { return fallback; }
    },
    write(key, value) {
      try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* Continue in memory. */ }
    }
  };

  const priorVisits = storage.read("diario-missoes-visitadas", []);
  const visitedMissions = new Set(Array.isArray(priorVisits) ? priorVisits.filter((id) => missionsById.has(id)) : []);
  let currentTab = "inicio";
  let elaineOptions = DATA.home.elaineLines || [DATA.home.elaine];
  let elaineContext = elaineOptions[0];
  let lastElaineLine = "";
  let timelineMissionIndex = 0;
  let timelinePhaseIndex = 0;
  let gameState = { screen: "intro", questions: [], answers: [], wrongChoices: [], questionIndex: 0, piecesUnlocked: 0, hintsUsed: 0 };
  let bestScore = readBestScore();
  let miniGameAccessed = storage.read("diario-mini-game-acessado", false) === true;

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function createGameRound() {
    const byEquipment = new Map();
    gameQuestions.forEach((question) => {
      if (!byEquipment.has(question.equipmentId)) byEquipment.set(question.equipmentId, []);
      byEquipment.get(question.equipmentId).push(question);
    });
    const onePerEquipment = DATA.missions.flatMap((mission) => {
      const choices = byEquipment.get(mission.id) || [];
      return choices.length ? [choices[Math.floor(Math.random() * choices.length)]] : [];
    });
    const selectedIds = new Set(onePerEquipment.map((question) => question.id));
    const additional = shuffle(gameQuestions.filter((question) => !selectedIds.has(question.id)))
      .slice(0, Math.max(0, gameRoundLength - onePerEquipment.length));
    const selected = shuffle([...onePerEquipment, ...additional]).slice(0, gameRoundLength);
    return {
      screen: "question",
      questions: selected.map((question) => ({
        ...question,
        shuffledOptions: shuffle(question.options.map((label, originalIndex) => ({ label, originalIndex })))
      })),
      answers: [],
      wrongChoices: [],
      questionIndex: 0,
      piecesUnlocked: 0,
      hintsUsed: 0
    };
  }

  function readBestScore() {
    try {
      const score = Number(localStorage.getItem(bestScoreKey));
      return Number.isInteger(score) ? Math.max(0, Math.min(gamePieces.length, score)) : 0;
    } catch (_) { return 0; }
  }

  function saveBestScore(score) {
    bestScore = Math.max(bestScore, score);
    try { localStorage.setItem(bestScoreKey, String(bestScore)); } catch (_) { /* O jogo continua normalmente sem armazenamento. */ }
  }

  function miniGameUnlocked() {
    return visitedMissions.size >= DATA.missions.length;
  }

  function announceMiniGameLock() {
    const remaining = DATA.missions.length - visitedMissions.size;
    showElaineForMission(ui(`O mini game será liberado quando você conhecer os cinco equipamentos. Faltam ${remaining} ${remaining === 1 ? "equipamento" : "equipamentos"}.`, `The mini game unlocks after you meet all five explorers. ${remaining} ${remaining === 1 ? "explorer remains" : "explorers remain"}.`));
  }

  function pickElaineLine(lines) {
    const choices = Array.isArray(lines) && lines.length ? lines : [DATA.home.elaine];
    const freshChoices = choices.length > 1 ? choices.filter((line) => line !== lastElaineLine) : choices;
    const line = freshChoices[Math.floor(Math.random() * freshChoices.length)];
    lastElaineLine = line;
    return line;
  }

  function setElaine(content) {
    elaineOptions = Array.isArray(content) ? content : [content];
    elaineContext = pickElaineLine(elaineOptions);
    elaineMessage.textContent = elaineContext;
  }

  function showElaineForMission(text) {
    setElaine(text);
    if (currentTab === "inicio") {
      const caption = panels.get("inicio")?.body.querySelector(".hero-art-caption");
      if (caption) caption.textContent = elaineContext;
      return;
    }
    elaineMessage.hidden = false;
    elaineButton.setAttribute("aria-expanded", "true");
  }

  function updateElaineHintCounter() {
    const inMiniGame = currentTab === "mini-game";
    const inMiniGameQuestion = inMiniGame && gameState.screen === "question";
    elaineHintCount.hidden = !inMiniGameQuestion;
    if (inMiniGame) {
      const remaining = Math.max(0, gameHintLimit - gameState.hintsUsed);
      elaineHintCount.textContent = String(remaining);
      elaineButton.setAttribute("aria-label", inMiniGameQuestion
        ? ui(`Pedir uma dica à Elaine. Restam ${remaining} de ${gameHintLimit} dicas.`, `Ask Elaine for a hint. ${remaining} of ${gameHintLimit} hints left.`)
        : ui("Pedir ajuda à Elaine no mini game", "Ask Elaine for help in the mini game"));
    } else {
      elaineButton.setAttribute("aria-label", ui("Alternar falas da Elaine", "Toggle Elaine’s messages"));
    }
  }

  function giveMiniGameHint() {
    const index = gameState.questionIndex;
    const currentQuestion = gameState.questions[index];
    let message;
    if (gameState.screen !== "question" || !currentQuestion) {
      message = gameState.screen === "result"
        ? ui("Mandou bem, tripulante! Comece outra partida quando quiser novas dicas.", "Nice work, crew member! Start another round whenever you want more hints.")
        : ui("Dúvida, tripulante? Posso te ajudar! Comece uma partida e toque em mim para pedir uma dica.", "Need a hand, crew member? Start a round and tap me for a hint.");
    } else if (gameState.answers[index]) {
      message = ui("Essa pergunta já foi resolvida. Na próxima, posso ajudar com uma dica!", "This question is already answered. I can help with the next one!");
    } else if (gameState.hintsUsed >= gameHintLimit) {
      message = ui("Você já usou minhas três dicas nesta partida. Releia as alternativas e tente mais uma vez!", "You have used all three hints this round. Review the choices and try again!");
    } else {
      gameState.hintsUsed += 1;
      const context = ui(`Dica ${gameState.hintsUsed} de ${gameHintLimit}`, `Hint ${gameState.hintsUsed} of ${gameHintLimit}`);
      message = `${context}: ${currentQuestion.hint || ui("Compare o trabalho do equipamento com as pistas apresentadas na pergunta.", "Compare the equipment’s job with the clues in the question.")}`;
    }
    elaineMessage.textContent = message;
    elaineMessage.hidden = false;
    elaineButton.setAttribute("aria-expanded", "true");
    updateElaineHintCounter();
  }

  function remindElaineCanHelp({ resolved = false } = {}) {
    const remaining = Math.max(0, gameHintLimit - gameState.hintsUsed);
    const message = resolved
      ? ui("Essa pergunta já foi respondida. Na próxima, se tiver dúvida, toque em mim para pedir uma dica.", "This question is answered. If you need help with the next one, tap me for a hint.")
      : remaining > 0
        ? ui(`Quase, tripulante. Quer uma dica? Toque em mim para pedir uma. Restam ${remaining} ${remaining === 1 ? "dica" : "dicas"}.`, `Almost, crew member. Want a hint? Tap me. You have ${remaining} ${remaining === 1 ? "hint" : "hints"} left.`)
        : ui("Quase, tripulante! Você já usou as três dicas desta partida. Tente outra alternativa.", "Almost, crew member! You have used all three hints this round. Try another choice.");
    elaineMessage.textContent = message;
    elaineMessage.hidden = false;
    elaineButton.setAttribute("aria-expanded", "true");
  }

  function openElaine() {
    const open = elaineButton.getAttribute("aria-expanded") !== "true";
    elaineButton.setAttribute("aria-expanded", String(open));
    elaineMessage.hidden = !open;
    if (open) {
      if (elaineOptions.length > 1) elaineContext = pickElaineLine(elaineOptions);
      elaineMessage.textContent = elaineContext;
    }
  }

  function closeElaineMessage() {
    elaineButton.setAttribute("aria-expanded", "false");
    elaineMessage.hidden = true;
  }

  // Build the tab strip and every hidden/visible tab panel from the data model.
  const tabButtons = new Map();
  const panels = new Map();
  DATA.tabs.forEach((tab) => {
    const control = button("", "tab-button");
    control.id = `tab-${tab.id}`;
    control.setAttribute("role", "tab");
    control.setAttribute("aria-selected", "false");
    control.setAttribute("aria-controls", `panel-${tab.id}`);
    control.tabIndex = -1;
    control.append(makeIcon(tab.icon));
    const label = el("span", "tab-button__label", tab.label);
    control.append(label);
    control.addEventListener("click", () => navigate(tab.id));
    tabList.append(control);
    tabButtons.set(tab.id, control);

    const panel = el("section", "tab-panel");
    panel.id = `panel-${tab.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", control.id);
    panel.tabIndex = -1;
    panel.hidden = true;
    const tabModel = tabsById.get(tab.id);
    if (tab.id === "inicio") {
      panel.classList.add("tab-panel--home");
    } else if (tab.id !== "mapa") {
      const heading = el("header", "panel-heading");
      const titleBlock = el("div", "panel-heading__text");
      titleBlock.append(el("p", "eyebrow", tab.label));
      titleBlock.append(el("h1", "panel-title", tabModel.title));
      titleBlock.append(el("p", "panel-intro", tabModel.intro));
      heading.append(titleBlock);
      const homeLink = button(ui("Voltar ao início", "Back to home"), "button button--quiet", () => navigate("inicio"));
      homeLink.setAttribute("aria-label", ui(`Voltar ao início a partir de ${tab.label}`, `Back to home from ${tab.label}`));
      heading.append(homeLink);
      panel.append(heading);
    }
    const body = el("div", "panel-body");
    panel.append(body);
    panelRoot.append(panel);
    panels.set(tab.id, { panel, body });
  });

  function renderHome(target) {
    const hero = el("section", "home-hero");
    const copy = el("div", "home-hero__copy");
    copy.append(el("p", "eyebrow", DATA.home.eyebrow));
    const title = el("h1", "home-hero__title");
    DATA.home.titleParts.forEach((part) => {
      title.append(part.highlight ? el("span", "home-hero__title-blue", part.text) : document.createTextNode(part.text));
    });
    copy.append(title, el("p", "home-hero__lede", DATA.tabs[0].intro));
    const cta = button(DATA.home.equipmentCta, "button button--primary", () => navigate("linha-do-tempo"));
    cta.append(makeIcon("timeline"));
    copy.append(cta, el("p", "home-hero__note", DATA.home.note));
    hero.append(copy);

    const art = el("div", "home-hero__art");
    art.setAttribute("aria-label", ui("Elaine acompanha os destinos espaciais interativos", "Elaine guides you through these interactive space destinations"));
    const bot = button("", "hero-elaine", () => showElaineForMission(DATA.home.elaineLines));
    bot.setAttribute("aria-label", ui("Ouvir as boas-vindas da Elaine", "Hear Elaine’s welcome message"));
    const botImage = el("img", "hero-elaine__image");
    botImage.src = DATA.home.elainePhoto.src;
    botImage.alt = DATA.home.elainePhoto.alt;
    botImage.loading = "eager";
    botImage.decoding = "async";
    bot.append(botImage);
    const mascotIdentity = el("div", "hero-art-identity");
    mascotIdentity.append(el("div", "hero-art-caption", DATA.home.elainePhoto.caption));
    const destinationPrompt = el("p", "home-destination-prompt", DATA.home.destinationPrompt);
    const destinations = el("div", "home-destination-controls");
    DATA.home.destinations.forEach((destination) => {
      const hotspot = button("", `home-hotspot home-hotspot--${destination.id}`, () => openDestination(destination));
      hotspot.setAttribute("aria-label", ui(`${destination.label}: ${destination.note}. Abrir missões.`, `${destination.label}: ${destination.note}. Open missions.`));
      const orb = el("span", `home-hotspot__orb home-hotspot__orb--${destination.id}`);
      const words = el("span", "home-hotspot__words");
      words.append(el("strong", "", destination.label), el("small", "", destination.note));
      hotspot.append(orb, words);
      destinations.append(hotspot);
    });
    art.append(bot, mascotIdentity, destinationPrompt, destinations);
    hero.append(art);
    target.append(hero);
  }

  function makePhoto(mission, compact = false) {
    const figure = el("figure", compact ? "mission-photo mission-photo--compact" : "mission-photo");
    const frame = el("div", "mission-photo__frame");
    const url = safeImageUrl(mission.imageUrl);
    if (url) {
      const image = el("img", "mission-photo__image");
      image.src = url;
      image.alt = mission.imageAlt;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        image.remove();
        frame.append(el("span", "mission-photo__fallback", ui("Imagem indisponível · consulte a fonte", "Image unavailable · see the source")));
      }, { once: true });
      frame.append(image);
    } else {
      frame.append(el("span", "mission-photo__fallback", ui("Imagem indisponível · consulte a fonte", "Image unavailable · see the source")));
    }
    const stamp = el("span", "photo-stamp", /NSSDC/i.test(mission.credit)
      ? "NASA · NSSDC"
      : ui("NASA · ARQUIVO", "NASA · ARCHIVE"));
    frame.append(stamp);
    const caption = el("figcaption", "mission-photo__caption");
    caption.textContent = mission.caption;
    figure.append(frame, caption);
    const credit = el("div", "mission-photo__credit", mission.credit);
    addSource(credit, mission.photoSourceId, ui("Abrir crédito e imagem de origem", "Open image credit and source"));
    figure.append(credit);
    return figure;
  }

  function missionCard(mission) {
    const card = el("article", "mission-card");
    card.append(makePhoto(mission, true));
    const content = el("div", "mission-card__content");
    content.append(el("span", "mission-card__category", mission.category), el("h2", "mission-card__title", mission.name), el("p", "mission-card__label", mission.label), el("p", "mission-card__summary", mission.summary));
    const reveal = button(ui("Conhecer missão", "Explore mission"), "button button--primary mission-card__button", () => openMission(mission.id));
    content.append(reveal);
    card.append(content);
    return card;
  }

  function renderEquipment(target) {
    const grid = el("div", "mission-grid");
    DATA.missions.forEach((mission) => grid.append(missionCard(mission)));
    target.append(grid);
  }

  function renderTimeline(target) {
    const wrap = el("div", "timeline-experience");
    const orderedMissions = [...DATA.timeline.missions].sort((left, right) => Date.parse(left.date) - Date.parse(right.date));
    const visitedPhasesByMission = new Map();
    const legacyPhaseIndex = DATA.timeline.phases.findIndex((phase) => phase.id === "legado");
    const missionNav = el("div", "timeline-missions");
    missionNav.setAttribute("aria-label", ui("Missões em ordem cronológica", "Missions in chronological order"));
    const steps = el("div", "timeline-steps");
    steps.setAttribute("aria-label", ui("Etapas da missão selecionada", "Stages of the selected mission"));
    const story = el("article", "timeline-story");
    const progress = el("p", "timeline-progress", "");
    const progressText = el("span", "", "");
    progress.append(progressText);
    const storyTitle = el("h2", "section-title");
    const storyText = el("p", "timeline-story__text");
    const guide = el("aside", "timeline-guide");
    guide.setAttribute("aria-label", ui("Fato interessante desta etapa", "Interesting fact about this stage"));
    const guideLabel = el("p", "timeline-guide__label", ui("Fato interessante", "Interesting fact"));
    const guideFact = el("p", "timeline-guide__fact");
    const guidePortrait = el("span", "elaine-dock__portrait timeline-guide__portrait");
    guidePortrait.setAttribute("aria-hidden", "true");
    const guidePortraitImage = el("img");
    guidePortraitImage.src = DATA.home.elainePhoto.src;
    guidePortraitImage.alt = "";
    guidePortraitImage.loading = "eager";
    guidePortraitImage.decoding = "async";
    guidePortrait.append(guidePortraitImage);
    guideFact.setAttribute("role", "status");
    guideFact.setAttribute("aria-live", "polite");
    guide.append(guideLabel, guideFact, guidePortrait);
    const linkedMissions = el("div", "timeline-story__missions");
    const sourceArea = el("div", "timeline-source");
    const controls = el("div", "timeline-controls");
    const previous = button(ui("Anterior", "Previous"), "button button--quiet");
    const next = button(ui("Próximo", "Next"), "button button--primary");
    controls.append(previous, next);
    story.append(progress, storyTitle, storyText, guide, linkedMissions, sourceArea, controls);
    orderedMissions.forEach((mission, index) => {
      const missionButton = button("", "timeline-mission", () => showMission(index));
      missionButton.setAttribute("aria-pressed", "false");
      missionButton.setAttribute("aria-label", ui(`${mission.label}, lançada ${mission.dateLabel}`, `${mission.label}, launched ${mission.dateLabel}`));
      missionButton.append(el("small", "", mission.dateLabel), el("strong", "", mission.label));
      missionNav.append(missionButton);
    });
    DATA.timeline.phases.forEach((phase, index) => {
      const step = button(phase.label, "timeline-step", () => showPhase(index));
      step.setAttribute("aria-pressed", "false");
      steps.append(step);
    });
    const renderChapter = () => {
      const missionTimeline = orderedMissions[timelineMissionIndex];
      const mission = missionsById.get(missionTimeline.missionId);
      const phase = missionTimeline.phases[timelinePhaseIndex];
      const phaseNavigation = DATA.timeline.phases[timelinePhaseIndex];
      const visitedPhases = visitedPhasesByMission.get(missionTimeline.missionId) || new Set();
      visitedPhases.add(timelinePhaseIndex);
      visitedPhasesByMission.set(missionTimeline.missionId, visitedPhases);
      [...missionNav.children].forEach((tab, index) => tab.setAttribute("aria-pressed", String(index === timelineMissionIndex)));
      [...steps.children].forEach((step, index) => step.setAttribute("aria-pressed", String(index === timelinePhaseIndex)));
      progressText.textContent = ui(`Missão ${timelineMissionIndex + 1} de ${orderedMissions.length} · etapa ${timelinePhaseIndex + 1} de ${DATA.timeline.phases.length} · ${missionTimeline.dateLabel}`, `Mission ${timelineMissionIndex + 1} of ${orderedMissions.length} · stage ${timelinePhaseIndex + 1} of ${DATA.timeline.phases.length} · ${missionTimeline.dateLabel}`);
      storyTitle.textContent = phase.title;
      storyText.textContent = phase.text;
      guideFact.textContent = phase.curiosity || ui("Vamos descobrir um detalhe curioso desta etapa!", "Let’s discover an interesting detail about this stage!");
      linkedMissions.replaceChildren();
      if (mission && phaseNavigation?.id === "legado") {
        const visitedAllEarlierPhases = DATA.timeline.phases
          .slice(0, legacyPhaseIndex)
          .every((_, index) => visitedPhases.has(index));
        if (visitedAllEarlierPhases) {
          linkedMissions.append(button(`${ui("Conhecer equipamento", "Explore equipment")}: ${mission.name}`, "button button--outline", () => openMission(mission.id)));
        } else {
          linkedMissions.append(el("p", "timeline-unlock-note", ui("Passe por Lançamento, Viagem, Chegada, Operação e Descobertas para conhecer este equipamento.", "Visit Launch, Cruise, Arrival, Operations, and Discoveries to unlock this equipment.")));
        }
      }
      sourceArea.replaceChildren();
      addSource(sourceArea, phase.sourceId, ui("Saiba mais", "Learn more"));
      previous.disabled = timelineMissionIndex === 0 && timelinePhaseIndex === 0;
      next.disabled = timelineMissionIndex === orderedMissions.length - 1 && timelinePhaseIndex === DATA.timeline.phases.length - 1;
    };
    const showMission = (index) => {
      timelineMissionIndex = Math.max(0, Math.min(index, orderedMissions.length - 1));
      timelinePhaseIndex = 0;
      renderChapter();
    };
    const showPhase = (index) => {
      timelinePhaseIndex = Math.max(0, Math.min(index, DATA.timeline.phases.length - 1));
      renderChapter();
    };
    const moveStep = (direction) => {
      const absoluteIndex = timelineMissionIndex * DATA.timeline.phases.length + timelinePhaseIndex + direction;
      const lastIndex = orderedMissions.length * DATA.timeline.phases.length - 1;
      const nextIndex = Math.max(0, Math.min(absoluteIndex, lastIndex));
      timelineMissionIndex = Math.floor(nextIndex / DATA.timeline.phases.length);
      timelinePhaseIndex = nextIndex % DATA.timeline.phases.length;
      renderChapter();
    };
    previous.addEventListener("click", () => moveStep(-1));
    next.addEventListener("click", () => moveStep(1));
    wrap.append(missionNav, steps, story);
    target.append(wrap);
    renderChapter();
  }

  function renderMap(target) {
    target.closest(".tab-panel")?.classList.add("tab-panel--map");
    target.classList.add("panel-body--map");
    const board = el("div", "schematic-map");
    board.setAttribute("role", "group");
    board.setAttribute("aria-label", ui("Mapa esquemático das órbitas entre Marte e Lua. Os pontos coloridos destacam a órbita de cada local.", "Schematic map of the orbits between Mars and the Moon. Colored markers highlight each location’s orbit."));
    board.append(
      el("span", "map-orbit map-orbit--transfer"),
      el("span", "map-orbit map-orbit--mars map-orbit--inner"),
      el("span", "map-orbit map-orbit--mars map-orbit--outer"),
      el("span", "map-orbit map-orbit--moon map-orbit--inner"),
      el("span", "map-orbit map-orbit--moon map-orbit--outer"),
      el("span", "map-body map-body--mars", ui("MARTE", "MARS")),
      el("span", "map-body map-body--moon", ui("LUA", "MOON"))
    );
    const resolvePointMission = (point) => (Array.isArray(point.missionIds) ? point.missionIds : [])
      .map((missionId) => missionsById.get(missionId))
      .find(Boolean);
    DATA.mapPoints.forEach((point) => {
      const mission = resolvePointMission(point);
      const marker = button("", "map-point", () => {
        const isSelected = marker.getAttribute("aria-pressed") === "true";
        const shouldHighlight = !isSelected;
        const orbitName = point.world === "Lua" || point.world === "Moon" ? "moon" : "mars";
        const orbitColor = point.color || "#c8a66d";
        board.querySelectorAll(".map-point").forEach((otherMarker) => {
          otherMarker.setAttribute("aria-pressed", String(otherMarker === marker && shouldHighlight));
        });
        board.querySelectorAll(".map-orbit").forEach((orbit) => {
          const isMatchingOrbit = shouldHighlight && orbit.classList.contains(`map-orbit--${orbitName}`);
          orbit.classList.toggle("is-highlighted", isMatchingOrbit);
          if (isMatchingOrbit) orbit.style.setProperty("--orbit-highlight-color", orbitColor);
          else orbit.style.removeProperty("--orbit-highlight-color");
        });
        board.querySelectorAll(".map-body").forEach((body) => {
          const isMatchingBody = shouldHighlight && body.classList.contains(`map-body--${orbitName}`);
          body.classList.toggle("is-highlighted", isMatchingBody);
          if (isMatchingBody) body.style.setProperty("--orbit-highlight-color", orbitColor);
          else body.style.removeProperty("--orbit-highlight-color");
        });
      });
      marker.setAttribute("aria-pressed", "false");
      if (mission) marker.dataset.missionId = mission.id;
      marker.style.setProperty("--point-x", `${point.x}%`);
      marker.style.setProperty("--point-y", `${point.y}%`);
      marker.style.setProperty("--mission-color", point.color);
      marker.setAttribute("aria-label", ui(`Destacar órbita em ${point.label}, ${point.world}.`, `Highlight the orbit at ${point.label}, ${point.world}.`));
      board.append(marker);
    });
    const legend = el("ul", "map-key");
    legend.setAttribute("aria-label", ui("Cores que identificam cada missão no mapa", "Colors that identify each mission on the map"));
    DATA.mapPoints.forEach((point) => {
      const mission = resolvePointMission(point);
      const item = el("li", "map-key__item");
      const swatch = el("span", "map-key__swatch");
      swatch.style.setProperty("--mission-color", point.color);
      swatch.setAttribute("aria-hidden", "true");
      item.append(swatch, el("span", "", `${mission?.name || point.label} · ${point.colorName}`));
      legend.append(item);
    });
    target.append(board, legend);
  }

  function renderScale(target) {
    const maxSize = Math.max(...Object.values(DATA.equipment).map((item) => item.sizeM));
    const chart = el("div", "scale-chart");
    DATA.missions.forEach((mission) => {
      const spec = DATA.equipment[mission.id];
      if (!spec) return;
      const row = el("article", "scale-row");
      const top = el("div", "scale-row__top");
      top.append(el("h2", "scale-row__name", mission.name), el("span", "scale-row__size", spec.scaleLabel));
      const track = el("div", "scale-row__track");
      const bar = el("span", "scale-row__bar");
      bar.style.width = `${Math.max(8, (spec.sizeM / maxSize) * 100)}%`;
      track.append(bar);
      row.append(top, track);
      const foot = el("div", "scale-row__foot");
      addSource(foot, spec.scaleSourceId, ui("Fonte da medida", "Measurement source"));
      foot.append(button(ui("Abrir história", "Open story"), "text-button", () => openMission(mission.id)));
      row.append(foot);
      chart.append(row);
    });
    target.append(chart, el("p", "scale-footnote", ui("As barras comparam uma dimensão de referência de cada objeto (altura, largura ou comprimento), conforme indicado ao lado. A escala é comum; o formato de cada veículo é diferente.", "The bars compare one reference dimension for each object (height, width, or length), as noted beside it. They share a scale, but each vehicle has a different shape.")));
  }

  function renderGlossary(target) {
    const list = el("dl", "glossary-list");
    DATA.glossary.forEach((entry) => {
      list.append(el("dt", "glossary-list__term", entry.term), el("dd", "glossary-list__definition", entry.definition));
    });
    target.append(list);
  }

  function renderSources(target) {
    const list = el("div", "source-grid");
    DATA.metadata.sources.forEach((source) => {
      const card = el("article", "source-card");
      card.append(el("span", "source-card__type", ui("Fonte oficial", "Official source")), el("h2", "source-card__title", source.title));
      const link = sourceLink(source.id, ui("Abrir referência", "Open reference"));
      if (link) card.append(link);
      list.append(card);
    });
    target.append(list);
  }

  function renderMiniGame(target) {
    const gameRoot = el("div", "mini-game-root");
    const layout = el("div", "mini-game-layout");
    const liveStatus = el("p", "visually-hidden");
    liveStatus.setAttribute("role", "status");
    liveStatus.setAttribute("aria-live", "polite");
    liveStatus.setAttribute("aria-atomic", "true");
    gameRoot.append(layout, liveStatus);
    target.append(gameRoot);

    const buildRobot = (preview = false) => {
      const unlocked = preview ? gamePieces.length : gameState.piecesUnlocked;
      const figure = el("figure", `mini-game-robot${unlocked === gamePieces.length ? " is-complete" : ""}${preview ? " mini-game-robot--preview" : ""}`);
      const robotSuffix = preview ? "preview" : "active";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 400 300");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-labelledby", `mini-robot-title-${robotSuffix} mini-robot-description-${robotSuffix}`);
      svg.classList.add("mini-robot-svg");
      svg.innerHTML = `
        <title id="mini-robot-title-${robotSuffix}">${ui("Robô explorador original", "Original explorer robot")}</title>
        <desc id="mini-robot-description-${robotSuffix}">${ui(`Robô de seis rodas com corpo, painéis solares, antena, braço científico e câmeras. ${unlocked} de seis conjuntos de peças estão desbloqueados. É um personagem educativo, não a representação de um veículo real.`, `Six-wheeled robot with a chassis, solar panels, antenna, science arm, and cameras. ${unlocked} of six part sets are unlocked. This is an educational character, not a real spacecraft.`)}</desc>
        <defs>
          <linearGradient id="mini-robot-shell-${robotSuffix}" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#49656a"/><stop offset="1" stop-color="#1a3038"/>
          </linearGradient>
          <linearGradient id="mini-robot-panel-${robotSuffix}" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#20546a"/><stop offset="1" stop-color="#102a38"/>
          </linearGradient>
        </defs>
        <ellipse class="robot-ground-shadow" cx="200" cy="258" rx="139" ry="16"/>
        <ellipse class="robot-orbit-ring" cx="200" cy="156" rx="168" ry="91" transform="rotate(-8 200 156)"/>
        <g class="robot-piece ${unlocked > 2 ? "is-unlocked" : "is-locked"}" data-piece-id="wheels" aria-hidden="true">
          <path d="M133 191h-18m152 0h-18M133 218h-18m152 0h-18"/>
          <circle class="robot-tire" cx="103" cy="177" r="28"/><circle class="robot-tire" cx="297" cy="177" r="28"/>
          <circle class="robot-tire" cx="103" cy="222" r="25"/><circle class="robot-tire" cx="297" cy="222" r="25"/>
          <circle class="robot-wheel-rim" cx="103" cy="177" r="13"/><circle class="robot-wheel-rim" cx="297" cy="177" r="13"/>
          <circle class="robot-wheel-rim" cx="103" cy="222" r="11"/><circle class="robot-wheel-rim" cx="297" cy="222" r="11"/>
          <circle class="robot-wheel-core" cx="103" cy="177" r="4"/><circle class="robot-wheel-core" cx="297" cy="177" r="4"/>
          <circle class="robot-wheel-core" cx="103" cy="222" r="4"/><circle class="robot-wheel-core" cx="297" cy="222" r="4"/>
          <path d="M103 156v9m0 24v9m-21-21h9m24 0h9m173-21v9m0 24v9m-21-21h9m24 0h9M103 203v8m0 22v8m-19-19h8m22 0h8m175-19v8m0 22v8m-19-19h8m22 0h8"/>
        </g>
        <g class="robot-piece ${unlocked > 1 ? "is-unlocked" : "is-locked"}" data-piece-id="power" aria-hidden="true">
          <path class="robot-solar-panel" d="M22 97h92v70H22zM286 97h92v70h-92z"/>
          <path class="robot-solar-grid" d="M45 97v70m23-70v70m23-70v70M22 120h92m-92 23h92m195-46v70m23-70v70m23-70v70m-92-47h92m-92 23h92"/>
          <path d="m114 128 25 15m172-15-25 15"/>
        </g>
        <g class="robot-piece ${unlocked > 0 ? "is-unlocked" : "is-locked"}" data-piece-id="chassis" aria-hidden="true">
          <path d="M126 177h-12m160 0h12M126 209h-12m160 0h12"/>
          <path class="robot-body" d="M136 112q0-17 17-17h94q17 0 17 17v99q0 15-16 15h-96q-16 0-16-15z"/>
          <path class="robot-face-frame" d="M149 119q0-7 7-7h88q7 0 7 7v55q0 7-7 7h-88q-7 0-7-7z"/>
          <circle class="robot-eye" cx="174" cy="143" r="6"/><circle class="robot-eye" cx="226" cy="143" r="6"/>
          <path class="robot-smile" d="M181 159q19 17 38 0"/>
          <path d="M154 198h92m-64 13v14m36-14v14"/>
          <circle class="robot-bolt" cx="146" cy="103" r="3"/><circle class="robot-bolt" cx="254" cy="103" r="3"/>
        </g>
        <g class="robot-piece ${unlocked > 3 ? "is-unlocked" : "is-locked"}" data-piece-id="antenna" aria-hidden="true">
          <path d="M200 94V51m-18 0q18-23 36 0m-29-7q11-14 22 0"/><circle class="robot-beacon" cx="200" cy="44" r="7"/>
        </g>
        <g class="robot-piece ${unlocked > 4 ? "is-unlocked" : "is-locked"}" data-piece-id="instrument" aria-hidden="true">
          <path d="M260 139h19l20-19 22 3m-61 16 15 29 24-4"/><circle class="robot-joint" cx="279" cy="139" r="8"/>
          <circle class="robot-joint" cx="299" cy="120" r="6"/><path class="robot-sensor" d="m319 112 22 4v17l-22 4z"/>
          <path d="M331 113v24m8-20v16"/>
        </g>
        <g class="robot-piece ${unlocked > 5 ? "is-unlocked" : "is-locked"}" data-piece-id="camera" aria-hidden="true">
          <path d="M185 103h30l6 8h-42z"/><circle class="robot-camera-lens" cx="200" cy="107" r="4"/>
        </g>`;
      svg.innerHTML = svg.innerHTML
        .replaceAll("url(#mini-robot-shell)", `url(#mini-robot-shell-${robotSuffix})`)
        .replaceAll("url(#mini-robot-panel)", `url(#mini-robot-panel-${robotSuffix})`);

      const stage = el("div", "mini-robot-stage");
      stage.append(svg);
      const caption = el("figcaption", "mini-game-robot__caption");
      const name = el("strong", "mini-game-robot__name", gameState.robotName || ui("Seu explorador", "Your explorer"));
      const counter = el("span", "mini-game-robot__counter", `${ui("Peças", "Parts")}: ${unlocked}/${gamePieces.length}`);
      caption.append(name, counter);
      const parts = el("ul", "mini-game-parts");
      gamePieces.forEach((piece, index) => {
        const item = el("li", unlocked > index ? "is-unlocked" : "is-locked");
        item.dataset.pieceStatus = piece.id;
        item.append(el("span", "mini-game-parts__name", piece.label), el("span", "mini-game-parts__state", unlocked > index ? ui("Desbloqueada", "Unlocked") : ui("Bloqueada", "Locked")));
        parts.append(item);
      });
      figure.append(stage, caption, parts);
      return figure;
    };

    const showIntro = () => {
      const panel = el("section", "mini-game-play mini-game-intro");
      panel.append(el("p", "eyebrow", ui("OFICINA DE EXPLORAÇÃO", "EXPLORER WORKSHOP")), el("h2", "mini-game-title", ui("Monte seu robô explorador", "Build your explorer robot")));
      panel.append(el("p", "mini-game-copy", ui("Você terá até dez perguntas diferentes para encaixar as seis peças do robô. Cada resposta revela uma pista sobre como os equipamentos espaciais trabalhavam; se precisar, peça uma dica à Elaine.", "You have up to ten different questions to fit the robot’s six parts. Each answer reveals a clue about how space equipment worked; ask Elaine for a hint whenever you need one.")));
      panel.append(el("p", "mini-game-record", ui(`Seu recorde: ${bestScore} de ${gamePieces.length} peças`, `Your best: ${bestScore} of ${gamePieces.length} parts`)));
      panel.append(button(ui("Começar", "Start"), "button button--primary", () => {
        gameState = createGameRound();
        updateElaineHintCounter();
        liveStatus.textContent = ui("Partida iniciada. Você tem até dez perguntas diferentes. Elaine pode ajudar com dicas.", "Game started. You have up to ten different questions. Elaine can help with hints.");
        paint(true);
      }));
      const preview = buildRobot(true).querySelector(".mini-robot-stage").cloneNode(true);
      preview.classList.add("mini-game-intro__robot-preview");
      preview.setAttribute("aria-hidden", "true");
      preview.querySelector("svg")?.removeAttribute("role");
      panel.append(preview);
      return panel;
    };

    const advanceGameQuestion = () => {
      const roundComplete = gameState.questionIndex >= gameState.questions.length - 1 || gameState.piecesUnlocked === gamePieces.length;
      if (roundComplete) {
        gameState.screen = "result";
        saveBestScore(gameState.piecesUnlocked);
        liveStatus.textContent = ui(`Partida concluída. Você desbloqueou ${gameState.piecesUnlocked} de ${gamePieces.length} peças.`, `Game complete. You unlocked ${gameState.piecesUnlocked} of ${gamePieces.length} parts.`);
        updateElaineHintCounter();
        paint(false);
        window.requestAnimationFrame(() => gameRoot.querySelector(".mini-game-result .mini-game-title")?.focus({ preventScroll: true }));
        return;
      }
      gameState.questionIndex += 1;
      liveStatus.textContent = ui(`Pergunta ${gameState.questionIndex + 1} de ${gameState.questions.length}.`, `Question ${gameState.questionIndex + 1} of ${gameState.questions.length}.`);
      paint(true);
    };

    const showQuestion = () => {
      const index = gameState.questionIndex;
      const question = gameState.questions[index];
      const questionCount = gameState.questions.length;
      const attemptLimit = gameAttemptLimit;
      const mission = missionsById.get(question.equipmentId);
      const panel = el("section", "mini-game-play mini-game-question-panel");
      const progress = el("div", "mini-game-progress");
      progress.append(el("span", "mini-game-progress__label", ui(`Pergunta ${index + 1} de ${questionCount}`, `Question ${index + 1} of ${questionCount}`)), el("span", "mini-game-progress__count", `${ui("Peças", "Parts")}: ${gameState.piecesUnlocked}/${gamePieces.length}`));
      const progressBar = el("div", "mini-game-progress__track");
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-label", ui("Progresso da partida", "Game progress"));
      progressBar.setAttribute("aria-valuemin", "0");
      progressBar.setAttribute("aria-valuemax", String(questionCount));
      progressBar.setAttribute("aria-valuenow", String(index + 1));
      const progressFill = el("span", "mini-game-progress__fill");
      progressFill.style.width = `${((index + 1) / questionCount) * 100}%`;
      progressBar.append(progressFill);
      panel.append(progress, progressBar);
      if (mission) panel.append(el("p", "mini-game-equipment", mission.name));
      const heading = el("h2", "mini-game-title mini-game-question");
      heading.tabIndex = -1;
      heading.textContent = question.prompt;
      panel.append(heading);

      const answers = el("div", "mini-game-answers");
      const selected = gameState.answers[index];
      const missedChoices = gameState.wrongChoices[index] || [];
      const correctChoice = question.shuffledOptions.findIndex((option) => option.originalIndex === question.correctIndex);
      question.shuffledOptions.forEach((option, optionIndex) => {
        const answer = button("", "mini-game-answer", () => chooseAnswer(optionIndex));
        answer.setAttribute("aria-label", ui(`Alternativa ${optionIndex + 1}: ${option.label}`, `Option ${optionIndex + 1}: ${option.label}`));
        answer.append(el("span", "mini-game-answer__key", String(optionIndex + 1)), el("span", "mini-game-answer__text", option.label));
        answer.disabled = Boolean(selected) || missedChoices.includes(optionIndex);
        if (selected && optionIndex === correctChoice) answer.classList.add("is-correct");
        if (missedChoices.includes(optionIndex)) answer.classList.add("is-wrong");
        answers.append(answer);
      });
      panel.append(answers);

      if (selected || missedChoices.length) {
        const feedback = el("article", `mini-game-feedback ${selected?.correct ? "is-correct" : "is-encouraging"}`);
        feedback.setAttribute("aria-live", "off");
        const feedbackTitle = selected?.correct
          ? ui("Muito bem! Uma peça encontrou seu lugar.", "Great job! A part clicked into place.")
          : selected
            ? ui(`Quase! A resposta era “${question.shuffledOptions[correctChoice].label}”.`, `Almost! The answer was “${question.shuffledOptions[correctChoice].label}”.`)
            : ui("Quase! Tente mais uma vez!", "Almost! Try again!");
        feedback.append(el("p", "mini-game-feedback__title", feedbackTitle));
        const feedbackText = selected?.correct
          ? question.explanation
          : selected
            ? question.explanation
            : ui(`Essa alternativa já foi eliminada. Você ainda tem ${attemptLimit - missedChoices.length} ${attemptLimit - missedChoices.length === 1 ? "tentativa" : "tentativas"} nesta pergunta.`, `That option is eliminated. You have ${attemptLimit - missedChoices.length} ${attemptLimit - missedChoices.length === 1 ? "try" : "tries"} left for this question.`);
        feedback.append(el("p", "mini-game-feedback__fact", feedbackText));
        if (selected?.correct) {
          const reward = el("span", "mini-game-reward", `✦ ${gamePieces[selected.pieceIndex].label}`);
          reward.dataset.rewardPiece = gamePieces[selected.pieceIndex].id;
          feedback.append(reward);
        }
        panel.append(feedback);
        if (selected?.correct) {
          const robotComplete = gameState.piecesUnlocked === gamePieces.length;
          const roundComplete = index === questionCount - 1 || robotComplete;
          panel.append(button(robotComplete ? ui("Ver robô completo", "View completed robot") : roundComplete ? ui("Ver resultado", "View results") : ui("Próxima pergunta", "Next question"), "button button--primary mini-game-next", advanceGameQuestion));
        }
      }
      return panel;
    };

    const showResult = () => {
      const complete = gameState.piecesUnlocked === gamePieces.length;
      const missing = gamePieces.length - gameState.piecesUnlocked;
      const panel = el("section", `mini-game-play mini-game-result ${complete ? "is-complete" : "is-partial"}`);
      if (complete) {
        const celebration = el("div", "mini-game-stars");
        celebration.setAttribute("aria-hidden", "true");
        [8, 17, 26, 34, 43, 55, 64, 73, 82, 91, 21, 76].forEach((position, index) => {
          const star = el("span", "mini-game-star", "✦");
          star.style.setProperty("--star-x", `${position}%`);
          star.style.setProperty("--star-delay", `${index * 45}ms`);
          celebration.append(star);
        });
        panel.append(celebration);
      }
      panel.append(el("p", "eyebrow", complete ? ui("MISSÃO CUMPRIDA", "MISSION COMPLETE") : ui("RODADA ENCERRADA", "ROUND OVER")));
      const resultTitle = el("h2", "mini-game-title", complete ? ui("Seu robô está pronto!", "Your robot is ready!") : ui("Não foi dessa vez!", "Not this time!"));
      resultTitle.tabIndex = -1;
      panel.append(resultTitle);
      panel.append(el("p", "mini-game-copy", complete
        ? ui("Seu robô está completo! Os exploradores reais também combinaram energia, movimento, comunicação e instrumentos para transformar lugares distantes em novos conhecimentos.", "Your robot is complete! Real explorers also combined power, movement, communication, and instruments to turn distant places into new knowledge.")
        : ui(`Você montou ${gameState.piecesUnlocked} de ${gamePieces.length} peças em até dez perguntas diferentes. Tente novamente: uma nova rodada traz outras perguntas e uma nova chance de completar o explorador.`, `You assembled ${gameState.piecesUnlocked} of ${gamePieces.length} parts in up to ten different questions. Try again: a new round brings new questions and another chance to complete your explorer.`)));
      panel.append(el("p", "mini-game-record", ui(`Recorde: ${bestScore} de ${gamePieces.length} peças · ${missing} ${missing === 1 ? "peça" : "peças"} faltando`, `Best: ${bestScore} of ${gamePieces.length} parts · ${missing} ${missing === 1 ? "part" : "parts"} left`)));
      if (complete) {
        const naming = el("label", "mini-game-naming", ui("Seu robô está completo! Que nome ele vai levar para a próxima missão?", "Your robot is complete! What name will it take on its next mission?"));
        const nameInput = el("input", "mini-game-name-input");
        nameInput.type = "text";
        nameInput.maxLength = 20;
        nameInput.autocomplete = "off";
        nameInput.placeholder = ui("Ex.: Faísca", "e.g. Spark");
        nameInput.value = gameState.robotName || "";
        nameInput.setAttribute("aria-label", ui("Nome do robô completo, guardado apenas nesta tela", "Name for the completed robot, stored only on this screen"));
        nameInput.addEventListener("input", () => {
          gameState.robotName = nameInput.value.slice(0, 20);
          const robotName = gameRoot.querySelector(".mini-game-robot__name");
          if (robotName) robotName.textContent = gameState.robotName || ui("Seu explorador", "Your explorer");
        });
        naming.append(nameInput);
        panel.append(naming);
      }
      const actions = el("div", "mini-game-result__actions");
      actions.append(button(complete ? ui("Jogar de novo", "Play again") : ui("Tentar novamente", "Try again"), "button button--primary", () => {
        gameState = createGameRound();
        gameState.robotName = "";
        liveStatus.textContent = ui(`Nova partida iniciada. Você verá até ${gameRoundLength} perguntas diferentes para montar o robô.`, `New game started. You will see up to ${gameRoundLength} different questions to build the robot.`);
        paint(true);
      }));
      actions.append(button(ui("Voltar ao início", "Back to home"), "button button--quiet", () => navigate("inicio")));
      panel.append(actions);
      return panel;
    };

    const paint = (focusQuestion = false) => {
      const robot = buildRobot();
      const play = gameState.screen === "intro" ? showIntro() : gameState.screen === "result" ? showResult() : showQuestion();
      layout.replaceChildren(robot, play);
      updateElaineHintCounter();
      gameRoot.classList.remove("is-question-entering");
      if (gameState.screen === "question") {
        void gameRoot.offsetWidth;
        gameRoot.classList.add("is-question-entering");
      }
      if (focusQuestion) window.requestAnimationFrame(() => gameRoot.querySelector(".mini-game-question")?.focus({ preventScroll: true }));
    };

    const animatePieceArrival = (pieceId) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const reward = gameRoot.querySelector(`[data-reward-piece="${pieceId}"]`);
      const piece = gameRoot.querySelector(`[data-piece-id="${pieceId}"]`);
      if (!reward || !piece || typeof piece.animate !== "function") return;
      const source = reward.getBoundingClientRect();
      const destination = piece.getBoundingClientRect();
      const dx = source.left + source.width / 2 - (destination.left + destination.width / 2);
      const dy = source.top + source.height / 2 - (destination.top + destination.height / 2);
      try {
        const motion = piece.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: .25 },
          { transform: "translate(0, 0) scale(1)", opacity: 1 }
        ], { duration: 460, easing: "cubic-bezier(.77, 0, .175, 1)" });
        motion.onfinish = () => piece.classList.add("has-arrived");
      } catch (_) { piece.classList.add("has-arrived"); }
    };

    const chooseAnswer = (choiceIndex) => {
      const index = gameState.questionIndex;
      const question = gameState.questions[index];
      if (!question || gameState.answers[index]) return;
      const correctIndex = question.shuffledOptions.findIndex((option) => option.originalIndex === question.correctIndex);
      const correct = choiceIndex === correctIndex;
      const pieceIndex = gameState.piecesUnlocked;
      const pieceId = correct ? gamePieces[pieceIndex].id : "";
      if (correct) {
        gameState.answers[index] = { choiceIndex, correct, pieceIndex };
        gameState.piecesUnlocked += 1;
        saveBestScore(gameState.piecesUnlocked);
        liveStatus.textContent = ui(`Resposta certa. ${gamePieces[pieceIndex].label} desbloqueada. Peças: ${gameState.piecesUnlocked} de ${gamePieces.length}. ${question.explanation}`, `Correct. ${gamePieces[pieceIndex].label} unlocked. Parts: ${gameState.piecesUnlocked} of ${gamePieces.length}. ${question.explanation}`);
      } else {
        if (!gameState.wrongChoices[index]) gameState.wrongChoices[index] = [];
        if (gameState.wrongChoices[index].includes(choiceIndex)) return;
        gameState.wrongChoices[index].push(choiceIndex);
        const attemptLimit = gameAttemptLimit;
        const attemptsLeft = attemptLimit - gameState.wrongChoices[index].length;
        if (attemptsLeft <= 0) {
          gameState.answers[index] = { choiceIndex, correct: false, pieceIndex: null, revealed: true };
          liveStatus.textContent = ui(`Fim das tentativas para esta pergunta. A resposta era ${question.shuffledOptions[correctIndex].label}.`, `No tries left for this question. The answer was ${question.shuffledOptions[correctIndex].label}.`);
        } else {
          liveStatus.textContent = ui(`Quase! Tente mais uma vez. Você ainda tem ${attemptsLeft} ${attemptsLeft === 1 ? "tentativa" : "tentativas"} nesta pergunta.`, `Almost! Try again. You have ${attemptsLeft} ${attemptsLeft === 1 ? "try" : "tries"} left for this question.`);
        }
      }
      paint(false);
      if (correct) window.requestAnimationFrame(() => animatePieceArrival(pieceId));
      if (!correct) remindElaineCanHelp({ resolved: Boolean(gameState.answers[index]) });
      if (!correct && gameState.answers[index]?.revealed) {
        window.setTimeout(() => {
          if (gameState.screen === "question" && gameState.questionIndex === index && gameState.answers[index]?.revealed) advanceGameQuestion();
        }, 2200);
        return;
      }
      window.requestAnimationFrame(() => {
        const target = gameState.answers[index]
          ? gameRoot.querySelector(".mini-game-next")
          : gameRoot.querySelector(".mini-game-answer:not(:disabled)");
        target?.focus({ preventScroll: true });
      });
    };

    gameRoot.addEventListener("keydown", (event) => {
      if (gameState.screen !== "question" || gameState.answers[gameState.questionIndex]) return;
      if (!/^[1-4]$/.test(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target?.isContentEditable) return;
      event.preventDefault();
      chooseAnswer(Number(event.key) - 1);
    });

    paint(false);
  }

  const renderers = {
    inicio: renderHome,
    "linha-do-tempo": renderTimeline,
    equipamentos: renderEquipment,
    mapa: renderMap,
    escala: renderScale,
    "mini-game": renderMiniGame,
    glossario: renderGlossary,
    fontes: renderSources
  };
  const renderedTabs = new Set();

  // Tab navigation, URL routing, and focus management.
  function activateTab(id, options = {}) {
    let tab = tabsById.has(id) ? id : "inicio";
    if (tab === "mini-game" && !miniGameUnlocked()) {
      announceMiniGameLock();
      tab = "inicio";
      replaceHash("inicio");
    }
    if (!renderedTabs.has(tab)) {
      renderers[tab]?.(panels.get(tab).body);
      renderedTabs.add(tab);
    }
    currentTab = tab;
    if (tab === "mini-game" && !miniGameAccessed) {
      miniGameAccessed = true;
      storage.write("diario-mini-game-acessado", true);
    }
    closeMobileMenu();
    DATA.tabs.forEach((item) => {
      const selected = item.id === tab;
      const control = tabButtons.get(item.id);
      const panel = panels.get(item.id).panel;
      control.setAttribute("aria-selected", String(selected));
      control.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
      panel.classList.remove("is-entering");
    });
    storage.write("diario-ultima-aba", tab);
    const tabData = tabsById.get(tab);
    setElaine(tab === "inicio" ? DATA.home.elaineLines : (tabData.elaineLines || tabData.intro));
    elaineDock.hidden = tab === "inicio" || tab === "linha-do-tempo";
    updateElaineHintCounter();
    if (tab === "inicio") {
      const caption = panels.get("inicio").body.querySelector(".hero-art-caption");
      if (caption) caption.textContent = DATA.home.elainePhoto.caption;
    }
    closeElaineMessage();
    const activePanel = panels.get(tab).panel;
    if (!activePanel.hidden) {
      window.requestAnimationFrame(() => activePanel.classList.add("is-entering"));
    }
    if (options.focus) activePanel.focus({ preventScroll: true });
    updateRouteProgress();
  }

  function navigate(id) {
    if (!tabsById.has(id)) id = "inicio";
    if (id === "mini-game" && !miniGameUnlocked()) {
      announceMiniGameLock();
      tabButtons.get("mini-game").focus();
      return;
    }
    if (location.hash !== `#${id}`) {
      try { history.pushState({ tab: id }, "", `#${id}`); }
      catch (_) { location.hash = id; }
    }
    activateTab(id, { focus: true });
  }

  function replaceHash(id) {
    try { history.replaceState({ tab: id }, "", `#${id}`); }
    catch (_) { location.replace(`#${id}`); }
  }

  function routeFromHash() {
    let hash = "";
    try { hash = decodeURIComponent(location.hash.replace(/^#/, "")); } catch (_) { hash = "__invalido__"; }
    if (hash && tabsById.has(hash)) {
      activateTab(hash);
      return;
    }
    if (hash) {
      replaceHash("inicio");
      activateTab("inicio");
      return;
    }
    const saved = storage.read("diario-ultima-aba", "inicio");
    const tab = tabsById.has(saved) ? saved : "inicio";
    replaceHash(tab);
    activateTab(tab);
  }

  tabList.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu({ restoreFocus: true });
      return;
    }
    const ids = DATA.tabs.map((tab) => tab.id);
    const focused = ids.indexOf(document.activeElement?.id?.replace(/^tab-/, ""));
    if (focused < 0) return;
    let next = null;
    if (event.key === "ArrowRight") next = (focused + 1) % ids.length;
    if (event.key === "ArrowLeft") next = (focused - 1 + ids.length) % ids.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ids.length - 1;
    if (next !== null) {
      event.preventDefault();
      tabButtons.get(ids[next]).focus();
    }
  });
  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!mobileMenuToggle) return;
    tabList.classList.remove("is-open");
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    mobileMenuToggle.setAttribute("aria-label", ui("Abrir menu", "Open menu"));
    mobileMenuToggle.querySelector("span").textContent = ui("Menu", "Menu");
    mobileMenuToggle.querySelector("path").setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    if (restoreFocus) mobileMenuToggle.focus();
  }

  mobileMenuToggle?.addEventListener("click", () => {
    const open = mobileMenuToggle.getAttribute("aria-expanded") !== "true";
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
    tabList.classList.toggle("is-open", open);
    mobileMenuToggle.setAttribute("aria-label", open ? ui("Fechar menu", "Close menu") : ui("Abrir menu", "Open menu"));
    mobileMenuToggle.querySelector("span").textContent = open ? ui("Fechar", "Close") : ui("Menu", "Menu");
    mobileMenuToggle.querySelector("path").setAttribute("d", open ? "M5 5l14 14M19 5 5 19" : "M4 6h16M4 12h16M4 18h16");
    if (open) window.requestAnimationFrame(() => tabButtons.get(currentTab)?.focus({ preventScroll: true }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenuToggle?.getAttribute("aria-expanded") === "true") {
      closeMobileMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (currentTab !== "mini-game" && !elaineMessage.hidden && !elaineDock.contains(event.target)) closeElaineMessage();
    if (mobileMenuToggle?.getAttribute("aria-expanded") !== "true") return;
    if (!tabList.contains(event.target) && !mobileMenuToggle.contains(event.target)) closeMobileMenu();
  });
  window.addEventListener("popstate", routeFromHash);
  window.addEventListener("hashchange", routeFromHash);

  // The route meter counts unique mission stories opened during this browser session.
  function updateRouteProgress() {
    const total = DATA.missions.length;
    const count = Math.min(total, visitedMissions.size);
    const percent = Math.round((count / total) * 100);
    routeFill.style.width = `${percent}%`;
    routeValue.textContent = `${percent}%`;
    routeDetail.textContent = isEnglish
      ? `${count} of ${total} missions explored`
      : `${count} de ${total} missões conhecidas`;
    routeBar.setAttribute("aria-valuenow", String(count));
    routeBar.setAttribute("aria-valuemax", String(total));
    routeBar.setAttribute("aria-valuetext", isEnglish
      ? `${percent} percent, ${count} of ${total} missions explored`
      : `${percent} por cento, ${count} de ${total} missões conhecidas`);
    const complete = count === total;
    const miniGameTab = tabButtons.get("mini-game");
    miniGameTab?.setAttribute("aria-disabled", String(!complete));
    if (miniGameTab) miniGameTab.title = complete
      ? ui("Mini game liberado", "Mini game unlocked")
      : isEnglish
        ? `Explore all ${total} spacecraft to unlock the mini game`
        : `Conheça os ${total} equipamentos para liberar o Mini game`;
    completionBanner.hidden = !complete || miniGameAccessed;
    if (complete) {
      document.getElementById("completion-title").textContent = DATA.progress.completedTitle;
      document.getElementById("completion-copy").textContent = DATA.progress.completedCopy;
      document.getElementById("completion-mini-game").textContent = DATA.progress.miniGameButton;
    }
  }

  function markMissionVisited(id) {
    if (!missionsById.has(id)) return;
    visitedMissions.add(id);
    storage.write("diario-missoes-visitadas", [...visitedMissions]);
    updateRouteProgress();
  }


  // Mission detail dialog. Technical sheets open on a separate action.
  function dialogCloseButton() {
    const close = button(ui("Fechar", "Close"), "button button--quiet dialog-close-bottom", () => dialog.close());
    close.setAttribute("aria-label", ui("Fechar detalhes", "Close details"));
    return close;
  }

  function openDestination(destination) {
    const validMissions = destination.missionIds.map((id) => missionsById.get(id)).filter(Boolean);
    if (!validMissions.length) return;
    setElaine(ui(`Destino escolhido: ${destination.label}. Qual explorador vamos conhecer?`, `Destination selected: ${destination.label}. Which explorer shall we meet?`));
    dialogContent.replaceChildren();
    const header = el("header", "dialog-heading");
    const titleBlock = el("div", "");
    const title = el("h2", "dialog-title", ui(`Rota para ${destination.label}`, `Route to ${destination.label}`));
    title.id = "dialog-title";
    titleBlock.append(el("p", "eyebrow", destination.note), title, el("p", "panel-intro", destination.description));
    header.append(titleBlock);
    dialogContent.append(header);
    const choices = el("div", "destination-missions");
    validMissions.forEach((mission) => {
      const choice = button("", "destination-mission", () => {
        dialog.close();
        window.setTimeout(() => openMission(mission.id), 0);
      });
      choice.append(el("strong", "", mission.name), el("span", "", mission.label), el("small", "", mission.summary));
      choices.append(choice);
    });
    dialogContent.append(choices);
    dialogContent.append(dialogCloseButton());
    dialog.showModal();
  }

  function openMission(id) {
    const mission = missionsById.get(id);
    if (!mission) return;
    if (dialog.open) dialog.close();
    markMissionVisited(id);
    setElaine(ui(`Bela escolha! ${mission.name} foi enviada para ${mission.category.toLowerCase()}. Vamos ver como ela trabalhou.`, `Great choice! ${mission.name} traveled to ${mission.category}. Let’s see how it worked.`));
    dialogContent.replaceChildren();
    const header = el("header", "dialog-heading");
    const titleBlock = el("div", "");
    const title = el("h2", "dialog-title", mission.name);
    title.id = "dialog-title";
    titleBlock.append(el("p", "eyebrow", `${mission.category} · ${mission.label}`), title);
    header.append(titleBlock);
    dialogContent.append(header, makePhoto(mission));
    const missionLede = el("p", "dialog-lede");
    missionLede.textContent = mission.summary;
    dialogContent.append(missionLede);
    dialogContent.append(el("p", "mission-story__narrator-note", ui("Nilo é o guia narrador desta exposição. Sua voz é imaginada; os acontecimentos e dados vêm das fontes citadas.", "Nilo is the narrator guiding this exhibit. His voice is imagined; the events and data come from the cited sources.")));
    const storyList = el("div", "mission-story");
    mission.story.forEach((chapter, index) => {
      const chapterCard = el("article", "mission-story__chapter");
      chapterCard.append(el("p", "eyebrow", ui(`CAPÍTULO ${index + 1}`, `CHAPTER ${index + 1}`)), el("h3", "", chapter.title));
      const narration = el("div", "mission-story__voice");
      const speaker = el("div", "mission-story__speaker");
      speaker.append(makeNiloAvatar(), el("span", "content-label content-label--narrative", ui("Nilo conta", "Nilo tells the story")));
      narration.append(speaker, el("p", "", chapter.text));
      chapterCard.append(narration);
      addSource(chapterCard, chapter.sourceId, ui("Fonte do capítulo", "Chapter source"));
      storyList.append(chapterCard);
    });
    dialogContent.append(storyList);
    const legacy = el("article", "artifact-card");
    legacy.append(el("p", "eyebrow", mission.artifact.tag), el("h3", "", mission.artifact.title), el("p", "", mission.artifact.text));
    addSource(legacy, mission.artifact.sourceId, ui("Fonte sobre o destino do equipamento", "Source on the equipment’s fate"));
    dialogContent.append(legacy);
    const techToggle = button(ui("Ver ficha técnica", "View technical details"), "button button--outline");
    const tech = el("section", "technical-sheet");
    tech.hidden = true;
    tech.append(el("h3", "", ui(`Ficha técnica · ${mission.name}`, `Technical details · ${mission.name}`)));
    const specs = DATA.equipment[mission.id]?.specs || [];
    const list = el("dl", "spec-list");
    specs.forEach((spec) => list.append(el("dt", "", spec.label), el("dd", "", spec.value)));
    tech.append(list);
    addSource(tech, DATA.equipment[mission.id]?.scaleSourceId || mission.sourceId, ui("Fonte das especificações", "Specifications source"));
    techToggle.addEventListener("click", () => {
      tech.hidden = !tech.hidden;
      techToggle.textContent = tech.hidden ? ui("Ver ficha técnica", "View technical details") : ui("Ocultar ficha técnica", "Hide technical details");
      if (!tech.hidden) tech.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    const footer = el("div", "dialog-actions");
    footer.append(techToggle);
    dialogContent.append(tech, footer);
    if (visitedMissions.size === DATA.missions.length) {
      const ready = el("p", "completion-inline", `${DATA.progress.completedTitle} ${DATA.progress.completedCopy}`);
      dialogContent.append(ready, button(DATA.progress.miniGameButton, "button button--bright", () => { dialog.close(); navigate("mini-game"); }));
    }
    dialogContent.append(dialogCloseButton());
    dialog.showModal();
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  elaineButton.addEventListener("click", () => {
    if (currentTab === "mini-game") giveMiniGameHint();
    else openElaine();
  });
  completionBanner.querySelector("button").addEventListener("click", () => navigate("mini-game"));

  // Render a tab on first access, then reuse its DOM on later visits.
  routeFromHash();
  updateRouteProgress();
})();
