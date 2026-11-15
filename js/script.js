// Conteúdo factual e cópias de interface vêm de data.js.
(() => {
  "use strict";

  const DATA = window.MISSION_DATA;
  if (!DATA || !Array.isArray(DATA.tabs) || !Array.isArray(DATA.missions)) return;

  const byId = (items, id) => items.find((item) => item.id === id);
  const missionsById = new Map(DATA.missions.map((mission) => [mission.id, mission]));
  const gameQuestions = Array.isArray(window.MINI_GAME_QUESTIONS) ? window.MINI_GAME_QUESTIONS : [];
  const gameRoundLength = 8;
  const gameHintLimit = 3;
  const gameAttemptLimit = 3;
  const gamePieces = [
    { id: "chassis", label: "Corpo e chassi" },
    { id: "power", label: "Painéis de energia" },
    { id: "wheels", label: "Rodas" },
    { id: "antenna", label: "Antena" },
    { id: "instrument", label: "Braço científico" }
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
    const link = el("a", "source-link", label || `Fonte: ${source.title}`);
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
  let gameState = { screen: "intro", questions: [], answers: [], wrongChoices: [], questionIndex: 0, piecesUnlocked: 0, hintsUsed: 0, pendingElaineHint: null };
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
        retryCount: 0,
        shuffledOptions: shuffle(question.options.map((label, originalIndex) => ({ label, originalIndex })))
      })),
      answers: [],
      wrongChoices: [],
      questionIndex: 0,
      piecesUnlocked: 0,
      hintsUsed: 0,
      pendingElaineHint: null
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
    showElaineForMission(`O mini game será liberado quando você conhecer os cinco equipamentos. Faltam ${remaining} ${remaining === 1 ? "equipamento" : "equipamentos"}.`);
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
        ? `Pedir uma dica à Elaine. Restam ${remaining} de ${gameHintLimit} dicas.`
        : "Pedir ajuda à Elaine no mini game");
    } else {
      elaineButton.setAttribute("aria-label", "Alternar falas da Elaine");
    }
  }

  function giveMiniGameHint() {
    const index = gameState.questionIndex;
    const currentQuestion = gameState.questions[index];
    const question = gameState.pendingElaineHint || currentQuestion;
    const hintForDeferredQuestion = question && question !== currentQuestion;
    let message;
    if (gameState.screen !== "question" || !currentQuestion) {
      message = gameState.screen === "result"
        ? "Mandou bem, tripulante! Comece outra partida quando quiser novas dicas."
        : "Dúvida, tripulante? Posso te ajudar! Comece uma partida e toque em mim para pedir uma dica.";
    } else if (!hintForDeferredQuestion && gameState.answers[index]) {
      message = "Essa pergunta já foi resolvida. Na próxima, posso ajudar com uma dica!";
    } else if (gameState.hintsUsed >= gameHintLimit) {
      message = "Você já usou minhas três dicas nesta partida. Releia as alternativas e tente mais uma vez!";
    } else {
      gameState.hintsUsed += 1;
      const context = hintForDeferredQuestion ? "Dica para a pergunta que volta no final" : `Dica ${gameState.hintsUsed} de ${gameHintLimit}`;
      message = `${context}: ${question.hint || "Compare o trabalho do equipamento com as pistas apresentadas na pergunta."}`;
      gameState.pendingElaineHint = null;
    }
    elaineMessage.textContent = message;
    elaineMessage.hidden = false;
    elaineButton.setAttribute("aria-expanded", "true");
    updateElaineHintCounter();
  }

  function remindElaineCanHelp({ deferred = false, resolved = false } = {}) {
    const remaining = Math.max(0, gameHintLimit - gameState.hintsUsed);
    const message = resolved
      ? "Essa pergunta já foi respondida. Na próxima, se tiver dúvida, toque em mim para pedir uma dica."
      : remaining > 0
        ? `${deferred ? "Essa pergunta volta no final" : "Quase, tripulante"}. Quer uma dica? Toque em mim para pedir uma. Restam ${remaining} ${remaining === 1 ? "dica" : "dicas"}.`
        : "Quase, tripulante! Você já usou as três dicas desta partida. Tente outra alternativa ou guarde a pergunta para o final.";
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
      const homeLink = button("Voltar ao início", "button button--quiet", () => navigate("inicio"));
      homeLink.setAttribute("aria-label", `Voltar ao início a partir de ${tab.label}`);
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
    cta.append(makeIcon("rover"));
    copy.append(cta, el("p", "home-hero__note", DATA.home.note));
    hero.append(copy);

    const art = el("div", "home-hero__art");
    art.setAttribute("aria-label", "Elaine acompanha os destinos espaciais interativos");
    const bot = button("", "hero-elaine", () => showElaineForMission(DATA.home.elaineLines));
    bot.setAttribute("aria-label", "Ouvir as boas-vindas da Elaine");
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
      hotspot.setAttribute("aria-label", `${destination.label}: ${destination.note}. Abrir missões.`);
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
        frame.append(el("span", "mission-photo__fallback", "Imagem indisponível · consulte a fonte"));
      }, { once: true });
      frame.append(image);
    } else {
      frame.append(el("span", "mission-photo__fallback", "Imagem indisponível · consulte a fonte"));
    }
    const stamp = el("span", "photo-stamp", /NSSDC/i.test(mission.credit) ? "NASA · NSSDC" : "NASA · ARQUIVO");
    frame.append(stamp);
    const caption = el("figcaption", "mission-photo__caption");
    caption.textContent = mission.caption;
    figure.append(frame, caption);
    const credit = el("div", "mission-photo__credit", mission.credit);
    addSource(credit, mission.photoSourceId, "Abrir crédito e imagem de origem");
    figure.append(credit);
    return figure;
  }

  function missionCard(mission) {
    const card = el("article", "mission-card");
    card.append(makePhoto(mission, true));
    const content = el("div", "mission-card__content");
    content.append(el("span", "mission-card__category", mission.category), el("h2", "mission-card__title", mission.name), el("p", "mission-card__label", mission.label), el("p", "mission-card__summary", mission.summary));
    const reveal = button("Conhecer missão", "button button--primary mission-card__button", () => openMission(mission.id));
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
    missionNav.setAttribute("aria-label", "Missões em ordem cronológica");
    const steps = el("div", "timeline-steps");
    steps.setAttribute("aria-label", "Etapas da missão selecionada");
    const story = el("article", "timeline-story");
    const progress = el("p", "timeline-progress", "");
    const progressText = el("span", "", "");
    progress.append(progressText);
    const storyTitle = el("h2", "section-title");
    const storyText = el("p", "timeline-story__text");
    const guide = el("aside", "timeline-guide");
    guide.setAttribute("aria-label", "Fato interessante desta etapa");
    const guideLabel = el("p", "timeline-guide__label", "Fato interessante");
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
    const previous = button("Anterior", "button button--quiet");
    const next = button("Próximo", "button button--primary");
    controls.append(previous, next);
    story.append(progress, storyTitle, storyText, guide, linkedMissions, sourceArea, controls);
    orderedMissions.forEach((mission, index) => {
      const missionButton = button("", "timeline-mission", () => showMission(index));
      missionButton.setAttribute("aria-pressed", "false");
      missionButton.setAttribute("aria-label", `${mission.label}, lançada ${mission.dateLabel}`);
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
      progressText.textContent = `Missão ${timelineMissionIndex + 1} de ${orderedMissions.length} · etapa ${timelinePhaseIndex + 1} de ${DATA.timeline.phases.length} · ${missionTimeline.dateLabel}`;
      storyTitle.textContent = phase.title;
      storyText.textContent = phase.text;
      guideFact.textContent = phase.curiosity || "Vamos descobrir um detalhe curioso desta etapa!";
      linkedMissions.replaceChildren();
      if (mission && phaseNavigation?.id === "legado") {
        const visitedAllEarlierPhases = DATA.timeline.phases
          .slice(0, legacyPhaseIndex)
          .every((_, index) => visitedPhases.has(index));
        if (visitedAllEarlierPhases) {
          linkedMissions.append(button(`Conhecer equipamento: ${mission.name}`, "button button--outline", () => openMission(mission.id)));
        } else {
          linkedMissions.append(el("p", "timeline-unlock-note", "Passe por Lançamento, Viagem, Chegada, Operação e Descobertas para conhecer este equipamento."));
        }
      }
      sourceArea.replaceChildren();
      addSource(sourceArea, phase.sourceId, "Saiba mais");
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
    board.setAttribute("aria-label", "Mapa esquemático das órbitas entre Marte e Lua. Os cinco pontos coloridos abrem as missões correspondentes.");
    board.append(
      el("span", "map-orbit map-orbit--transfer"),
      el("span", "map-orbit map-orbit--mars map-orbit--inner"),
      el("span", "map-orbit map-orbit--mars map-orbit--outer"),
      el("span", "map-orbit map-orbit--moon map-orbit--inner"),
      el("span", "map-orbit map-orbit--moon map-orbit--outer"),
      el("span", "map-body map-body--mars", "MARTE"),
      el("span", "map-body map-body--moon", "LUA")
    );
    DATA.mapPoints.forEach((point) => {
      const mission = missionsById.get(point.missionIds[0]);
      const marker = button("", "map-point", () => {
        if (mission) {
          navigate("equipamentos");
          window.setTimeout(() => openMission(mission.id), 80);
        }
      });
      marker.style.setProperty("--point-x", `${point.x}%`);
      marker.style.setProperty("--point-y", `${point.y}%`);
      marker.style.setProperty("--mission-color", point.color);
      marker.setAttribute("aria-label", `Abrir ${mission?.name || "missão"} em ${point.label}, ${point.world}.`);
      board.append(marker);
    });
    const legend = el("ul", "map-key");
    legend.setAttribute("aria-label", "Cores que identificam cada missão no mapa");
    DATA.mapPoints.forEach((point) => {
      const mission = missionsById.get(point.missionIds[0]);
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
      addSource(foot, spec.scaleSourceId, "Fonte da medida");
      foot.append(button("Abrir história", "text-button", () => openMission(mission.id)));
      row.append(foot);
      chart.append(row);
    });
    target.append(chart, el("p", "scale-footnote", "As barras comparam uma dimensão de referência de cada objeto (altura, largura ou comprimento), conforme indicado ao lado. A escala é comum; o formato de cada veículo é diferente."));
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
      card.append(el("span", "source-card__type", "Fonte oficial"), el("h2", "source-card__title", source.title));
      const link = sourceLink(source.id, "Abrir referência");
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

    const buildRobot = () => {
      const figure = el("figure", `mini-game-robot${gameState.piecesUnlocked === 5 ? " is-complete" : ""}`);
      const unlocked = gameState.piecesUnlocked;
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 400 300");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-labelledby", "mini-robot-title mini-robot-description");
      svg.classList.add("mini-robot-svg");
      svg.innerHTML = `
        <title id="mini-robot-title">Robô explorador original</title>
        <desc id="mini-robot-description">Robô de seis rodas com corpo, painéis solares, antena e braço científico. ${unlocked} de cinco conjuntos de peças estão desbloqueados. É um personagem educativo, não a representação de um veículo real.</desc>
        <defs>
          <linearGradient id="mini-robot-shell" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#49656a"/><stop offset="1" stop-color="#1a3038"/>
          </linearGradient>
          <linearGradient id="mini-robot-panel" x1="0" x2="1" y1="0" y2="1">
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
        </g>`;

      const stage = el("div", "mini-robot-stage");
      stage.append(svg);
      const caption = el("figcaption", "mini-game-robot__caption");
      const name = el("strong", "mini-game-robot__name", gameState.robotName || "Seu explorador");
      const counter = el("span", "mini-game-robot__counter", `Peças: ${unlocked}/5`);
      caption.append(name, counter);
      const parts = el("ul", "mini-game-parts");
      gamePieces.forEach((piece, index) => {
        const item = el("li", unlocked > index ? "is-unlocked" : "is-locked");
        item.dataset.pieceStatus = piece.id;
        item.append(el("span", "mini-game-parts__name", piece.label), el("span", "mini-game-parts__state", unlocked > index ? "Desbloqueada" : "Bloqueada"));
        parts.append(item);
      });
      figure.append(stage, caption, parts);
      return figure;
    };

    const showIntro = () => {
      const panel = el("section", "mini-game-play mini-game-intro");
      panel.append(el("p", "eyebrow", "OFICINA DE EXPLORAÇÃO"), el("h2", "mini-game-title", "Monte seu robô explorador"));
      panel.append(el("p", "mini-game-copy", "Você tem até oito perguntas para encaixar as cinco peças do robô. Se errar duas vezes, a pergunta volta no fim da rodada. Cada resposta revela uma pista sobre como os equipamentos espaciais trabalhavam."));
      panel.append(el("p", "mini-game-record", `Seu recorde: ${bestScore} de 5 peças`));
      panel.append(button("Começar", "button button--primary", () => {
        gameState = createGameRound();
        updateElaineHintCounter();
        liveStatus.textContent = "Partida iniciada. Você tem até oito perguntas para montar as cinco peças do robô.";
        paint(true);
      }));
      return panel;
    };

    const showQuestion = () => {
      const index = gameState.questionIndex;
      const question = gameState.questions[index];
      const questionCount = gameState.questions.length;
      const attemptLimit = question.retryCount ? gameAttemptLimit : 2;
      const mission = missionsById.get(question.equipmentId);
      const panel = el("section", "mini-game-play mini-game-question-panel");
      const progress = el("div", "mini-game-progress");
      progress.append(el("span", "mini-game-progress__label", `Pergunta ${index + 1} de ${questionCount}`), el("span", "mini-game-progress__count", `Peças: ${gameState.piecesUnlocked}/5`));
      const progressBar = el("div", "mini-game-progress__track");
      progressBar.setAttribute("role", "progressbar");
      progressBar.setAttribute("aria-label", "Progresso da partida");
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
        answer.setAttribute("aria-label", `Alternativa ${optionIndex + 1}: ${option.label}`);
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
          ? "Muito bem! Uma peça encontrou seu lugar."
          : selected?.deferred
            ? "Quase! Esta pergunta volta no fim da rodada."
          : selected
            ? `Quase! A resposta era “${question.shuffledOptions[correctChoice].label}”.`
            : "Quase! Tente mais uma vez!";
        feedback.append(el("p", "mini-game-feedback__title", feedbackTitle));
        const feedbackText = selected?.correct
          ? question.explanation
          : selected?.deferred
            ? "Vamos seguir para outra missão. Você terá outra oportunidade de responder esta pergunta antes de terminar."
          : selected
            ? question.explanation
            : `Essa alternativa já foi eliminada. Você ainda tem ${attemptLimit - missedChoices.length} ${attemptLimit - missedChoices.length === 1 ? "tentativa" : "tentativas"} nesta pergunta.`;
        feedback.append(el("p", "mini-game-feedback__fact", feedbackText));
        if (selected?.correct) {
          const reward = el("span", "mini-game-reward", `✦ ${gamePieces[selected.pieceIndex].label}`);
          reward.dataset.rewardPiece = gamePieces[selected.pieceIndex].id;
          feedback.append(reward);
        }
        panel.append(feedback);
        if (selected) {
          const robotComplete = gameState.piecesUnlocked === gamePieces.length;
          const roundComplete = index === gameRoundLength - 1 || robotComplete;
          panel.append(button(robotComplete ? "Ver robô completo" : roundComplete ? "Ver resultado" : "Próxima pergunta", "button button--primary mini-game-next", () => {
            if (roundComplete) {
              gameState.screen = "result";
              saveBestScore(gameState.piecesUnlocked);
              liveStatus.textContent = `Partida concluída. Você desbloqueou ${gameState.piecesUnlocked} de 5 peças.`;
              updateElaineHintCounter();
              paint(false);
              window.requestAnimationFrame(() => gameRoot.querySelector(".mini-game-result .mini-game-title")?.focus({ preventScroll: true }));
              return;
            }
            gameState.questionIndex += 1;
            liveStatus.textContent = `Pergunta ${gameState.questionIndex + 1} de ${gameRoundLength}.`;
            paint(true);
          }));
        }
      }
      return panel;
    };

    const showResult = () => {
      const complete = gameState.piecesUnlocked === 5;
      const missing = 5 - gameState.piecesUnlocked;
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
      panel.append(el("p", "eyebrow", complete ? "MISSÃO CUMPRIDA" : "RODADA ENCERRADA"));
      const resultTitle = el("h2", "mini-game-title", complete ? "Seu robô está pronto!" : "Não foi dessa vez!");
      resultTitle.tabIndex = -1;
      panel.append(resultTitle);
      panel.append(el("p", "mini-game-copy", complete
        ? "Seu robô está completo! Os exploradores reais também combinaram energia, movimento, comunicação e instrumentos para transformar lugares distantes em novos conhecimentos."
        : `Você montou ${gameState.piecesUnlocked} de 5 peças em até oito perguntas. Tente novamente: uma nova rodada traz outras perguntas e uma nova chance de completar o explorador.`));
      panel.append(el("p", "mini-game-record", `Recorde: ${bestScore} de 5 peças · ${missing} ${missing === 1 ? "peça" : "peças"} faltando`));
      if (complete) {
        const naming = el("label", "mini-game-naming", "Seu robô está completo! Que nome ele vai levar para a próxima missão?");
        const nameInput = el("input", "mini-game-name-input");
        nameInput.type = "text";
        nameInput.maxLength = 20;
        nameInput.autocomplete = "off";
        nameInput.placeholder = "Ex.: Faísca";
        nameInput.value = gameState.robotName || "";
        nameInput.setAttribute("aria-label", "Nome do robô completo, guardado apenas nesta tela");
        nameInput.addEventListener("input", () => {
          gameState.robotName = nameInput.value.slice(0, 20);
          const robotName = gameRoot.querySelector(".mini-game-robot__name");
          if (robotName) robotName.textContent = gameState.robotName || "Seu explorador";
        });
        naming.append(nameInput);
        panel.append(naming);
      }
      const actions = el("div", "mini-game-result__actions");
      actions.append(button(complete ? "Jogar de novo" : "Tentar novamente", "button button--primary", () => {
        gameState = createGameRound();
        gameState.robotName = "";
        liveStatus.textContent = `Nova partida iniciada. Você tem até ${gameRoundLength} perguntas para montar o robô.`;
        paint(true);
      }));
      actions.append(button("Voltar ao início", "button button--quiet", () => navigate("inicio")));
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
      let deferred = false;
      if (correct) {
        gameState.answers[index] = { choiceIndex, correct, pieceIndex };
        gameState.piecesUnlocked += 1;
        saveBestScore(gameState.piecesUnlocked);
        if (gameState.pendingElaineHint?.id === question.id) gameState.pendingElaineHint = null;
        liveStatus.textContent = `Resposta certa. ${gamePieces[pieceIndex].label} desbloqueada. Peças: ${gameState.piecesUnlocked} de 5. ${question.explanation}`;
      } else {
        if (!gameState.wrongChoices[index]) gameState.wrongChoices[index] = [];
        if (gameState.wrongChoices[index].includes(choiceIndex)) return;
        gameState.wrongChoices[index].push(choiceIndex);
        const attemptLimit = question.retryCount ? gameAttemptLimit : 2;
        const attemptsLeft = attemptLimit - gameState.wrongChoices[index].length;
        if (attemptsLeft <= 0) {
          let retrySlot = -1;
          if (!question.retryCount) {
            for (let queuedIndex = gameState.questions.length - 1; queuedIndex > index; queuedIndex -= 1) {
              if (!gameState.questions[queuedIndex].retryCount && !gameState.answers[queuedIndex]) {
                retrySlot = queuedIndex;
                break;
              }
            }
          }
          if (retrySlot > index) {
            gameState.questions[retrySlot] = {
              ...question,
              retryCount: 1,
              shuffledOptions: shuffle(question.options.map((label, originalIndex) => ({ label, originalIndex })))
            };
            gameState.answers[index] = { choiceIndex, correct: false, pieceIndex: null, deferred: true };
            gameState.pendingElaineHint = question;
            gameState.questionIndex += 1;
            deferred = true;
            liveStatus.textContent = `Quase! Esta pergunta volta no fim da rodada. Pergunta ${gameState.questionIndex + 1} de ${gameRoundLength}.`;
          } else {
            gameState.answers[index] = { choiceIndex, correct: false, pieceIndex: null, revealed: true };
            if (gameState.pendingElaineHint?.id === question.id) gameState.pendingElaineHint = null;
            liveStatus.textContent = `Fim das tentativas para esta pergunta. A resposta era ${question.shuffledOptions[correctIndex].label}.`;
          }
        } else {
          gameState.pendingElaineHint = question;
          liveStatus.textContent = `Quase! Tente mais uma vez. Você ainda tem ${attemptsLeft} ${attemptsLeft === 1 ? "tentativa" : "tentativas"} nesta pergunta.`;
        }
      }
      paint(deferred);
      if (correct) window.requestAnimationFrame(() => animatePieceArrival(pieceId));
      if (!correct) remindElaineCanHelp({ deferred, resolved: Boolean(gameState.answers[index]) });
      if (deferred) return;
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
    mobileMenuToggle.setAttribute("aria-label", "Abrir menu");
    mobileMenuToggle.querySelector("span").textContent = "Menu";
    mobileMenuToggle.querySelector("path").setAttribute("d", "M4 6h16M4 12h16M4 18h16");
    if (restoreFocus) mobileMenuToggle.focus();
  }

  mobileMenuToggle?.addEventListener("click", () => {
    const open = mobileMenuToggle.getAttribute("aria-expanded") !== "true";
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
    tabList.classList.toggle("is-open", open);
    mobileMenuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    mobileMenuToggle.querySelector("span").textContent = open ? "Fechar" : "Menu";
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
    routeDetail.textContent = `${count} de ${total} missões conhecidas`;
    routeBar.setAttribute("aria-valuenow", String(count));
    routeBar.setAttribute("aria-valuemax", String(total));
    routeBar.setAttribute("aria-valuetext", `${percent} por cento, ${count} de ${total} missões conhecidas`);
    const complete = count === total;
    const miniGameTab = tabButtons.get("mini-game");
    miniGameTab?.setAttribute("aria-disabled", String(!complete));
    if (miniGameTab) miniGameTab.title = complete ? "Mini game liberado" : `Conheça os ${total} equipamentos para liberar o Mini game`;
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
    const close = button("Fechar", "button button--quiet", () => dialog.close());
    close.setAttribute("aria-label", "Fechar detalhes");
    return close;
  }

  function openDestination(destination) {
    const validMissions = destination.missionIds.map((id) => missionsById.get(id)).filter(Boolean);
    if (!validMissions.length) return;
    setElaine(`Destino escolhido: ${destination.label}. Qual explorador vamos conhecer?`);
    dialogContent.replaceChildren();
    const header = el("header", "dialog-heading");
    const titleBlock = el("div", "");
    const title = el("h2", "dialog-title", `Rota para ${destination.label}`);
    title.id = "dialog-title";
    titleBlock.append(el("p", "eyebrow", destination.note), title, el("p", "panel-intro", destination.description));
    header.append(titleBlock, dialogCloseButton());
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
    dialog.showModal();
  }

  function openMission(id) {
    const mission = missionsById.get(id);
    if (!mission) return;
    markMissionVisited(id);
    setElaine(`Bela escolha! ${mission.name} foi enviada para ${mission.category.toLowerCase()}. Vamos ver como ela trabalhou.`);
    dialogContent.replaceChildren();
    const header = el("header", "dialog-heading");
    const titleBlock = el("div", "");
    const title = el("h2", "dialog-title", mission.name);
    title.id = "dialog-title";
    titleBlock.append(el("p", "eyebrow", `${mission.category} · ${mission.label}`), title);
    header.append(titleBlock, dialogCloseButton());
    dialogContent.append(header, makePhoto(mission));
    const missionLede = el("p", "dialog-lede");
    missionLede.textContent = mission.summary;
    dialogContent.append(missionLede);
    dialogContent.append(el("p", "mission-story__narrator-note", "Nilo é o guia narrador desta exposição. Sua voz é imaginada; os acontecimentos e dados vêm das fontes citadas."));
    const storyList = el("div", "mission-story");
    mission.story.forEach((chapter, index) => {
      const chapterCard = el("article", "mission-story__chapter");
      chapterCard.append(el("p", "eyebrow", `CAPÍTULO ${index + 1}`), el("h3", "", chapter.title));
      const narration = el("div", "mission-story__voice");
      const speaker = el("div", "mission-story__speaker");
      speaker.append(makeNiloAvatar(), el("span", "content-label content-label--narrative", "Nilo conta"));
      narration.append(speaker, el("p", "", chapter.text));
      chapterCard.append(narration);
      addSource(chapterCard, chapter.sourceId, "Fonte do capítulo");
      storyList.append(chapterCard);
    });
    dialogContent.append(storyList);
    const legacy = el("article", "artifact-card");
    legacy.append(el("p", "eyebrow", mission.artifact.tag), el("h3", "", mission.artifact.title), el("p", "", mission.artifact.text));
    addSource(legacy, mission.artifact.sourceId, "Fonte sobre o destino do equipamento");
    dialogContent.append(legacy);
    const techToggle = button("Ver ficha técnica", "button button--outline");
    const tech = el("section", "technical-sheet");
    tech.hidden = true;
    tech.append(el("h3", "", `Ficha técnica · ${mission.name}`));
    const specs = DATA.equipment[mission.id]?.specs || [];
    const list = el("dl", "spec-list");
    specs.forEach((spec) => list.append(el("dt", "", spec.label), el("dd", "", spec.value)));
    tech.append(list);
    addSource(tech, DATA.equipment[mission.id]?.scaleSourceId || mission.sourceId, "Fonte das especificações");
    techToggle.addEventListener("click", () => {
      tech.hidden = !tech.hidden;
      techToggle.textContent = tech.hidden ? "Ver ficha técnica" : "Ocultar ficha técnica";
      if (!tech.hidden) tech.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    const footer = el("div", "dialog-actions");
    footer.append(techToggle);
    if (miniGameUnlocked()) footer.append(button("Ir para o Mini game", "button button--primary", () => { dialog.close(); navigate("mini-game"); }));
    dialogContent.append(tech, footer);
    if (visitedMissions.size === DATA.missions.length) {
      const ready = el("p", "completion-inline", `${DATA.progress.completedTitle} ${DATA.progress.completedCopy}`);
      dialogContent.append(ready, button(DATA.progress.miniGameButton, "button button--bright", () => { dialog.close(); navigate("mini-game"); }));
    }
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
