// Conteúdo factual e cópias de interface vêm de data.js.
(() => {
  "use strict";

  const DATA = window.MISSION_DATA;
  if (!DATA || !Array.isArray(DATA.tabs) || !Array.isArray(DATA.missions)) return;

  const byId = (items, id) => items.find((item) => item.id === id);
  const missionsById = new Map(DATA.missions.map((mission) => [mission.id, mission]));
  const quizById = new Map(DATA.quiz.map((question) => [question.id, question]));
  const quizRoundLength = Math.min(8, DATA.quiz.length);
  const quizHintsPerRound = 3;
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
  const sourceSiteName = (sourceUrl) => {
    try {
      const host = new URL(sourceUrl).hostname.toLowerCase();
      if (host.includes("nssdc")) return "NSSDC/NASA";
      if (host.startsWith("science.nasa.gov")) return "NASA Science";
      if (host.includes("jpl.nasa.gov")) return "NASA/JPL";
      if (host.endsWith("nasa.gov")) return "NASA";
      return host;
    } catch (_) { return "site oficial"; }
  };
  const quizAttribution = (sourceIds) => {
    const validSources = sourceIds.map((id) => sourcesById.get(id)).filter(Boolean);
    if (!validSources.length) return null;
    const line = el("p", "quiz-attribution");
    line.append(document.createTextNode("De acordo com "));
    validSources.forEach((source, index) => {
      if (index > 0) line.append(document.createTextNode(index === validSources.length - 1 ? " e " : ", "));
      const link = sourceLink(source.id, `${sourceSiteName(source.url)} — ${source.title}`);
      if (link) line.append(link);
    });
    return line;
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
      quiz: ["M9.5 9a2.7 2.7 0 1 1 4.5 2c-1.2 1-2 1.2-2 3", "M12 18h.01", "M4 4h16v16H4z"],
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
  let quizInviteShown = false;
  let quizElaineShowingInvite = false;
  let timelineMissionIndex = 0;
  let timelinePhaseIndex = 0;
  let quizState = normalizeQuizState(storage.read("diario-quiz-progresso", null));
  let quizAccessed = storage.read("diario-quiz-acessado", false) === true;

  function normalizeQuizState(value) {
    const questionIds = Array.isArray(value?.questionIds)
      ? [...new Set(value.questionIds.filter((id) => quizById.has(id)))].slice(0, quizRoundLength)
      : [];
    const rawAnswers = value && Array.isArray(value.answers) ? value.answers.slice(0, questionIds.length) : [];
    const answers = rawAnswers.map((answer, index) => {
      const choice = Number.isInteger(answer) ? answer : -1;
      const question = quizById.get(questionIds[index]);
      return Number.isInteger(choice) && choice >= 0 && choice < (question?.options.length || 0) ? choice : undefined;
    });
    const firstGap = answers.findIndex((answer) => answer === undefined);
    if (firstGap >= 0) answers.length = firstGap;
    while (answers.length && answers[answers.length - 1] === undefined) answers.pop();
    const savedIndex = Number(value?.questionIndex);
    const questionIndex = Number.isInteger(savedIndex) ? Math.max(0, Math.min(savedIndex, answers.length, questionIds.length)) : answers.length;
    const savedHints = Number(value?.hintsRemaining);
    const hintsRemaining = Number.isInteger(savedHints)
      ? Math.max(0, Math.min(savedHints, quizHintsPerRound))
      : quizHintsPerRound;
    return { questionIds, answers, questionIndex, hintsRemaining };
  }

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function createQuizRound() {
    const onePerMission = DATA.missions.flatMap((mission) => {
      const questions = DATA.quiz.filter((question) => question.missionId === mission.id);
      return questions.length ? [questions[Math.floor(Math.random() * questions.length)]] : [];
    });
    const selectedIds = new Set(onePerMission.map((question) => question.id));
    const bonusQuestions = shuffle(DATA.quiz.filter((question) => !selectedIds.has(question.id)));
    const selected = [...onePerMission, ...bonusQuestions.slice(0, Math.max(0, quizRoundLength - onePerMission.length))];
    return { questionIds: shuffle(selected).slice(0, quizRoundLength).map((question) => question.id), answers: [], questionIndex: 0, hintsRemaining: quizHintsPerRound };
  }

  function quizUnlocked() {
    return visitedMissions.size >= DATA.missions.length;
  }

  function announceQuizLock() {
    const remaining = DATA.missions.length - visitedMissions.size;
    showElaineForMission(`O desafio ainda está fechado. Conheça ${remaining} ${remaining === 1 ? "equipamento" : "equipamentos"} para completar a rota e liberar o quiz!`);
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

  function openElaine() {
    const open = elaineButton.getAttribute("aria-expanded") !== "true";
    elaineButton.setAttribute("aria-expanded", String(open));
    elaineMessage.hidden = !open;
    if (open) {
      if (elaineOptions.length > 1) elaineContext = pickElaineLine(elaineOptions);
      elaineMessage.textContent = elaineContext;
    }
  }

  function updateElaineHintControl() {
    const isQuiz = currentTab === "quiz";
    const quizComplete = quizState.questionIndex >= quizState.questionIds.length;
    const questionAnswered = !quizComplete && quizState.answers[quizState.questionIndex] !== undefined;
    const hintOpen = elaineButton.getAttribute("aria-expanded") === "true";
    elaineHintCount.hidden = !isQuiz;
    elaineButton.disabled = isQuiz && (quizComplete || questionAnswered);
    if (isQuiz) {
      elaineHintCount.textContent = String(quizState.hintsRemaining);
      elaineButton.setAttribute("aria-label", quizComplete
        ? "Quiz concluído. Elaine não tem mais dicas para esta rodada."
        : questionAnswered
          ? "Responda à pergunta atual antes de pedir outra dica."
          : hintOpen
            ? quizElaineShowingInvite
              ? `Pedir uma dica à Elaine. Restam ${quizState.hintsRemaining} de ${quizHintsPerRound} dicas.`
              : `Pedir outra dica à Elaine. Restam ${quizState.hintsRemaining} de ${quizHintsPerRound} dicas.`
            : `Pedir dica à Elaine. Restam ${quizState.hintsRemaining} de ${quizHintsPerRound} dicas.`);
    } else {
      elaineButton.setAttribute("aria-label", "Alternar falas da Elaine");
    }
  }

  function closeElaineMessage() {
    quizElaineShowingInvite = false;
    elaineButton.setAttribute("aria-expanded", "false");
    elaineMessage.hidden = true;
    if (currentTab === "quiz") updateElaineHintControl();
  }

  function useQuizHint() {
    const questionId = quizState.questionIds[quizState.questionIndex];
    const question = quizById.get(questionId);
    if (!question || quizState.answers[quizState.questionIndex] !== undefined) return;
    quizElaineShowingInvite = false;
    if (quizState.hintsRemaining <= 0) {
      setElaine("Você já usou as três dicas desta rodada. Continue comparando as opções com as pistas da pergunta!");
    } else {
      quizState.hintsRemaining -= 1;
      storage.write("diario-quiz-progresso", quizState);
      setElaine(`Dica: ${question.hint} Restam ${quizState.hintsRemaining} ${quizState.hintsRemaining === 1 ? "dica" : "dicas"} nesta rodada.`);
    }
    updateElaineHintControl();
    elaineMessage.hidden = false;
    elaineButton.setAttribute("aria-expanded", "true");
    updateElaineHintControl();
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
    const cta = button(DATA.home.equipmentCta, "button button--primary", () => navigate("equipamentos"));
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
      [...missionNav.children].forEach((tab, index) => tab.setAttribute("aria-pressed", String(index === timelineMissionIndex)));
      [...steps.children].forEach((step, index) => step.setAttribute("aria-pressed", String(index === timelinePhaseIndex)));
      progressText.textContent = `Missão ${timelineMissionIndex + 1} de ${orderedMissions.length} · etapa ${timelinePhaseIndex + 1} de ${DATA.timeline.phases.length} · ${missionTimeline.dateLabel}`;
      storyTitle.textContent = phase.title;
      storyText.textContent = phase.text;
      guideFact.textContent = phase.curiosity || "Vamos descobrir um detalhe curioso desta etapa!";
      linkedMissions.replaceChildren();
      if (mission) linkedMissions.append(button(`Conhecer ${mission.name}`, "button button--outline", () => openMission(mission.id)));
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

  function renderQuiz(target) {
    const quizRoot = el("div", "quiz-root");
    target.append(quizRoot);
    if (quizState.questionIds.length !== quizRoundLength) {
      quizState = createQuizRound();
      storage.write("diario-quiz-progresso", quizState);
    }
    const renderQuestion = () => {
      quizRoot.replaceChildren();
      updateElaineHintControl();
      const index = quizState.questionIndex;
      if (index >= quizState.questionIds.length) {
        const correct = quizState.answers.reduce((sum, answer, i) => {
          const question = quizById.get(quizState.questionIds[i]);
          return sum + (question && answer === question.answerIndex ? 1 : 0);
        }, 0);
        const result = el("article", "quiz-result");
        result.append(el("p", "eyebrow", DATA.quizResult.eyebrow), el("h2", "quiz-result__score", `${correct} de ${quizState.questionIds.length} respostas certas`));
        result.append(el("p", "panel-intro", DATA.quizResult.message));
        const again = button("Jogar de novo", "button button--primary", () => {
          closeElaineMessage();
          quizState = createQuizRound();
          storage.write("diario-quiz-progresso", quizState);
          renderQuestion();
        });
        result.append(again, button("Voltar ao início", "button button--quiet", () => navigate("inicio")));
        quizRoot.append(result);
        updateElaineHintControl();
        return;
      }
      const question = quizById.get(quizState.questionIds[index]);
      if (!question) {
        quizState = createQuizRound();
        storage.write("diario-quiz-progresso", quizState);
        renderQuestion();
        return;
      }
      quizRoot.append(el("p", "quiz-progress", `Pergunta ${index + 1} de ${quizState.questionIds.length}`), el("h2", "quiz-question", question.question));
      const answers = el("div", "quiz-answers");
      const selected = quizState.answers[index];
      question.options.forEach((option, optionIndex) => {
        const answer = button(option, "quiz-answer", () => {
          if (selected !== undefined) return;
          quizState.answers[index] = optionIndex;
          storage.write("diario-quiz-progresso", quizState);
          closeElaineMessage();
          renderQuestion();
        });
        answer.disabled = selected !== undefined;
        if (selected !== undefined && optionIndex === question.answerIndex) answer.classList.add("is-correct");
        if (selected === optionIndex && selected !== question.answerIndex) answer.classList.add("is-wrong");
        answers.append(answer);
      });
      quizRoot.append(answers);
      if (selected !== undefined) {
        const feedback = el("div", `quiz-feedback ${selected === question.answerIndex ? "quiz-feedback--correct" : "quiz-feedback--wrong"}`);
        feedback.textContent = question.explanations[selected];
        feedback.setAttribute("role", "status");
        quizRoot.append(feedback);
        const next = button(index === quizState.questionIds.length - 1 ? "Ver resultado" : "Próxima pergunta", "button button--primary", () => {
          quizState.questionIndex = index + 1;
          storage.write("diario-quiz-progresso", quizState);
          closeElaineMessage();
          renderQuestion();
        });
        quizRoot.append(next);
        const attribution = quizAttribution(question.sourceIds);
        if (attribution) quizRoot.append(attribution);
      }
    };
    renderQuestion();
  }

  const renderers = {
    inicio: renderHome,
    "linha-do-tempo": renderTimeline,
    equipamentos: renderEquipment,
    mapa: renderMap,
    escala: renderScale,
    quiz: renderQuiz,
    glossario: renderGlossary,
    fontes: renderSources
  };
  const renderedTabs = new Set();

  // Tab navigation, URL routing, and focus management.
  function activateTab(id, options = {}) {
    let tab = tabsById.has(id) ? id : "inicio";
    if (tab === "quiz" && !quizUnlocked()) {
      announceQuizLock();
      tab = "inicio";
      replaceHash("inicio");
    }
    if (!renderedTabs.has(tab)) {
      renderers[tab]?.(panels.get(tab).body);
      renderedTabs.add(tab);
    }
    currentTab = tab;
    if (tab === "quiz" && !quizAccessed) {
      quizAccessed = true;
      storage.write("diario-quiz-acessado", true);
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
    if (tab === "inicio") {
      const caption = panels.get("inicio").body.querySelector(".hero-art-caption");
      if (caption) caption.textContent = DATA.home.elainePhoto.caption;
    }
    closeElaineMessage();
    if (tab === "quiz" && !quizInviteShown) {
      quizInviteShown = true;
      const canOfferHint = quizState.questionIndex < quizState.questionIds.length
        && quizState.answers[quizState.questionIndex] === undefined;
      if (canOfferHint) {
        quizElaineShowingInvite = true;
        elaineMessage.textContent = "Dúvida, tripulante? Posso te ajudar!";
        elaineMessage.hidden = false;
        elaineButton.setAttribute("aria-expanded", "true");
      }
    }
    updateElaineHintControl();
    const activePanel = panels.get(tab).panel;
    if (!activePanel.hidden) {
      window.requestAnimationFrame(() => activePanel.classList.add("is-entering"));
    }
    if (options.focus) activePanel.focus({ preventScroll: true });
    updateRouteProgress();
  }

  function navigate(id) {
    if (!tabsById.has(id)) id = "inicio";
    if (id === "quiz" && !quizUnlocked()) {
      announceQuizLock();
      tabButtons.get("quiz").focus();
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
    if (event.key === "Escape" && currentTab === "quiz" && elaineButton.getAttribute("aria-expanded") === "true") {
      closeElaineMessage();
      return;
    }
    if (event.key === "Escape" && mobileMenuToggle?.getAttribute("aria-expanded") === "true") {
      closeMobileMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (currentTab === "quiz" && !elaineMessage.hidden && !elaineDock.contains(event.target)) closeElaineMessage();
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
    const quizTab = tabButtons.get("quiz");
    quizTab?.setAttribute("aria-disabled", String(!complete));
    if (quizTab) quizTab.title = complete ? "Quiz liberado" : `Conheça as ${total} missões para liberar o quiz`;
    completionBanner.hidden = !complete || quizAccessed;
    if (complete) {
      document.getElementById("completion-title").textContent = DATA.progress.completedTitle;
      document.getElementById("completion-copy").textContent = DATA.progress.completedCopy;
      document.getElementById("completion-quiz").textContent = DATA.progress.quizButton;
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
    const storyList = el("div", "mission-story");
    mission.story.forEach((chapter, index) => {
      const chapterCard = el("article", "mission-story__chapter");
      chapterCard.append(el("p", "eyebrow", `CAPÍTULO ${index + 1}`), el("h3", "", chapter.title), el("p", "mission-story__fact", chapter.text));
      const voice = el("div", "mission-story__voice");
      voice.append(el("span", "content-label content-label--narrative", "Licença narrativa"), el("p", "", `“${chapter.voice}”`));
      chapterCard.append(voice);
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
    if (quizUnlocked()) footer.append(button("Ir para o quiz", "button button--primary", () => { dialog.close(); navigate("quiz"); }));
    dialogContent.append(tech, footer);
    if (visitedMissions.size === DATA.missions.length) {
      const ready = el("p", "completion-inline", `${DATA.progress.completedTitle} ${DATA.progress.completedCopy}`);
      dialogContent.append(ready, button(DATA.progress.quizButton, "button button--bright", () => { dialog.close(); navigate("quiz"); }));
    }
    dialog.showModal();
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  elaineButton.addEventListener("click", () => {
    if (currentTab !== "quiz") {
      openElaine();
      return;
    }
    quizElaineShowingInvite = false;
    useQuizHint();
  });
  completionBanner.querySelector("button").addEventListener("click", () => navigate("quiz"));

  // Render a tab on first access, then reuse its DOM on later visits.
  routeFromHash();
  updateRouteProgress();
})();
