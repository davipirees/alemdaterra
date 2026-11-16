const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const appContext = { window: {}, console, Math, URL, URLSearchParams };
vm.createContext(appContext);

for (const file of ["js/data.js", "js/mini-game-data.js", "js/locales.js"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInContext(source, appContext, { filename: file });
}

const { window } = appContext;
const portuguese = window.MISSION_DATA;
const english = window.MISSION_DATA_EN;
const missionIds = new Set(portuguese.missions.map((mission) => mission.id));
const sourceIds = new Set(portuguese.metadata.sources.map((source) => source.id));

test("both languages preserve the five mission tabs and imagery", () => {
  assert.equal(portuguese.missions.length, 5);
  assert.deepEqual(english.tabs.map((tab) => tab.id), portuguese.tabs.map((tab) => tab.id));

  for (const mission of portuguese.missions) {
    const translated = english.missions.find((item) => item.id === mission.id);
    assert.ok(translated, `English mission exists: ${mission.id}`);
    assert.equal(translated.imageUrl, mission.imageUrl, `image is retained: ${mission.id}`);
    assert.equal(translated.photoSourceId, mission.photoSourceId, `image credit is retained: ${mission.id}`);
    if (mission.imageUrl.startsWith("assets/")) {
      assert.ok(fs.existsSync(path.join(root, mission.imageUrl)), `local image exists: ${mission.imageUrl}`);
    }
    assert.ok(sourceIds.has(mission.sourceId), `mission source exists: ${mission.id}`);
  }
  for (const asset of ["assets/elaine-astronaut-clean-v2.png", "assets/space-hero-cinematic.png"]) {
    assert.ok(fs.existsSync(path.join(root, asset)), `interface image exists: ${asset}`);
  }
});

test("all narrative source references resolve in both languages", () => {
  for (const [label, data] of [["Portuguese", portuguese], ["English", english]]) {
    const unresolved = [];
    const inspect = (value, location = "data") => {
      if (!value || typeof value !== "object") return;
      for (const [key, item] of Object.entries(value)) {
        const itemLocation = `${location}.${key}`;
        if (["sourceId", "scaleSourceId"].includes(key) && typeof item === "string" && !sourceIds.has(item)) {
          unresolved.push(`${itemLocation}: ${item}`);
        }
        if (key === "sourceIds" && Array.isArray(item)) {
          for (const id of item) if (!sourceIds.has(id)) unresolved.push(`${itemLocation}: ${id}`);
        }
        inspect(item, itemLocation);
      }
    };
    inspect(data);
    assert.deepEqual(unresolved, [], `${label} source references resolve`);
  }
});

test("map points and both question banks reference valid missions and sources", () => {
  assert.equal(portuguese.mapPoints.length, 5);
  for (const point of portuguese.mapPoints) {
    assert.ok(point.missionIds.length > 0, `map point is linked to a mission: ${point.label}`);
    assert.ok(point.missionIds.every((id) => missionIds.has(id)), `map mission IDs are valid: ${point.label}`);
  }

  for (const [label, bank] of [["Portuguese", window.MINI_GAME_QUESTIONS], ["English", window.MINI_GAME_QUESTIONS_EN]]) {
    assert.equal(bank.length, 15, `${label} question bank size`);
    assert.equal(new Set(bank.map((question) => question.id)).size, bank.length, `${label} question IDs are unique`);
    for (const question of bank) {
      assert.ok(missionIds.has(question.equipmentId), `${label} mission exists: ${question.id}`);
      assert.equal(question.options.length, 4, `${label} has four answers: ${question.id}`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4, `${label} answer key is valid: ${question.id}`);
      assert.ok(question.prompt && question.hint && question.explanation, `${label} copy is complete: ${question.id}`);
      assert.ok(question.sourceIds.length > 0, `${label} sources exist: ${question.id}`);
      assert.ok(question.sourceIds.every((id) => sourceIds.has(id)), `${label} source IDs are valid: ${question.id}`);
    }
  }
});

test("home art and map show localized AI credits", () => {
  const source = fs.readFileSync(path.join(root, "js/script.js"), "utf8");
  assert.match(source, /Imagem gerada por IA.*AI-generated image/);
  assert.match(source, /Mapa gerado por IA.*AI-generated map/);
  const styles = fs.readFileSync(path.join(root, "css/experience.css"), "utf8");
  assert.match(styles, /\.ai-image-credit/);
  assert.match(styles, /\.ai-map-credit/);
});

test("game creates ten unique questions in both languages", () => {
  const source = fs.readFileSync(path.join(root, "js/script.js"), "utf8");
  const start = source.indexOf("function createGameRound() {");
  const end = source.indexOf("\n  function readBestScore()", start);
  assert.ok(start >= 0 && end > start, "round builder is present");
  assert.match(source, /const gameRoundLength = 10;/);
  assert.match(source, /const gameAttemptLimit = 2;/);
  assert.match(source, /const gameHintLimit = 3;/);
  assert.doesNotMatch(source, /mini-game-skip/);
  assert.match(source, /if \(attemptsLeft <= 0\)/);
  assert.match(source, /advanceGameQuestion\(\);[\s\S]*?2200/);
  assert.match(source, /if \(complete\) \{\s*const naming = el\([\s\S]*?mini-game-naming/);

  const piecesMatch = source.match(/const gamePieces = (\[[\s\S]*?\n  \]);/);
  assert.ok(piecesMatch, "robot pieces are defined");
  const pieceContext = { ui: (_portuguese, english) => english };
  vm.createContext(pieceContext);
  vm.runInContext(`this.gamePieces = ${piecesMatch[1]}`, pieceContext);
  assert.equal(pieceContext.gamePieces.length, 6, "robot has six pieces");

  const mapStart = source.indexOf("function renderMap(target) {");
  const mapEnd = source.indexOf("\n  function renderScale(target)", mapStart);
  const mapRenderer = source.slice(mapStart, mapEnd);
  assert.ok(mapStart >= 0 && mapEnd > mapStart, "map renderer is present");
  assert.match(mapRenderer, /is-highlighted/);
  assert.doesNotMatch(mapRenderer, /openMission\(|navigate\(/);

  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<option value="en" selected>English<\/option>/);

  for (const [label, bank] of [["Portuguese", window.MINI_GAME_QUESTIONS], ["English", window.MINI_GAME_QUESTIONS_EN]]) {
    const context = {
      DATA: portuguese,
      gameQuestions: bank,
      gameRoundLength: 10,
      Math,
      shuffle(items) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index -= 1) {
          const swap = Math.floor(Math.random() * (index + 1));
          [result[index], result[swap]] = [result[swap], result[index]];
        }
        return result;
      }
    };
    vm.createContext(context);
    vm.runInContext(source.slice(start, end) + "\nthis.createGameRound = createGameRound;", context);

    for (let index = 0; index < 25; index += 1) {
      const round = context.createGameRound();
      assert.equal(round.questions.length, 10, `${label} round length`);
      assert.equal(new Set(round.questions.map((question) => question.id)).size, 10, `${label} questions do not repeat`);
      assert.equal(new Set(round.questions.map((question) => question.equipmentId)).size, 5, `${label} includes every mission`);
      for (const question of round.questions) {
        assert.equal(question.shuffledOptions.length, 4, `${label} answer options are shuffled`);
        assert.equal(question.shuffledOptions.filter((option) => option.originalIndex === question.correctIndex).length, 1, `${label} correct answer is retained`);
      }
    }
  }
});
