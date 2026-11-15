// English copy for the same sourced mission data. Factual links stay unchanged.
(() => {
  const merge = (base, patch) => {
    if (Array.isArray(patch)) {
      if (!patch.some((item) => item && typeof item === "object")) return patch;
      return patch.map((item, index) => {
        if (!item || typeof item !== "object") return item;
        const key = item.id ? "id" : item.missionId ? "missionId" : item.term ? "term" : null;
        const source = key ? base?.find?.((candidate) => candidate?.[key] === item[key]) : base?.[index];
        return merge(source || {}, item);
      });
    }
    if (!patch || typeof patch !== "object") return patch;
    const result = { ...base };
    Object.entries(patch).forEach(([key, value]) => {
      result[key] = value && typeof value === "object"
        ? merge(base?.[key] || {}, value)
        : value;
    });
    return result;
  };

  const phases = (items) => items.map(([title, text, curiosity]) => ({ title, text, curiosity }));
  const english = {
    tabs: [
      { id: "inicio", label: "Home", title: "Beyond Earth: exploring the story of space missions", intro: "Meet five missions to the Moon and Mars. Discover what the “forgotten” equipment revealed and how it helped advance space exploration.", elaineLines: ["Moon or Mars? Choose a destination and let’s begin exploring.", "Every spacecraft has a story. Which one will you uncover first?", "Ready to launch? Choose a destination to meet its explorers."] },
      { id: "linha-do-tempo", label: "Timeline", title: "A mission unfolds in stages", intro: "Choose a chapter to begin the journey.", elaineLines: ["Choose a chapter and let’s begin our journey.", "Each stage reveals another part of the mission. Where shall we start?", "Launch, cruise, or discoveries? You choose the next chapter."] },
      { id: "equipamentos", label: "Spacecraft", title: "Meet the explorers", intro: "Each spacecraft was built for a task. Open a card to explore its mission, story, and technical details.", elaineLines: ["Look at the images and names: each explorer had a different job.", "Open a card to see how each spacecraft worked.", "Some were built to travel; others to land and measure their surroundings."] },
      { id: "mapa", label: "Map", title: "Where did these stories happen?", intro: "Each color marks a mission. The paths are schematic and not to scale.", elaineLines: ["The points show where each mission explored or traveled.", "Select a colored point to highlight that location’s orbit.", "The Apollo 15 LRV traveled across the Hadley–Apennine region with the astronauts."] },
      { id: "escala", label: "Scale", title: "Real sizes, side by side", intro: "Compare how much space each explorer occupied. The bars use the same scale; values are approximate and sourced.", elaineLines: ["Compare the bars to see how the spacecraft differed in size.", "A small tool can still make a big discovery.", "Use the same scale to compare the explorers in this exhibit."] },
      { id: "mini-game", label: "Mini game", title: "Put what you learned into practice!", intro: "Answer the questions to build your own explorer robot.", elaineLines: ["Every part helps an explorer do science.", "Let’s build a robot using clues from the missions.", "Take your time: each answer reveals how exploration works."] },
      { id: "glossario", label: "Glossary", title: "Words from a space mission", intro: "Science and engineering terms explained in plain language.", elaineLines: ["Found a new word? We explain it here.", "Explore the terms, then return to the missions to spot them.", "Science has special words. Let’s find out what they mean."] },
      { id: "fontes", label: "Sources", title: "Enjoyed the missions? Keep exploring!", intro: "The stories and data in this exhibit draw on NASA, NSSDC, and NSSDCA pages and archives.", elaineLines: ["Here are the sources for your next investigation.", "Scientists compare archive records with observations.", "Want to check a detail? Open a source and explore the mission record."] }
    ],
    home: {
      eyebrow: "INTERACTIVE EXHIBIT · SPACECRAFT AT THE MOON AND MARS",
      titleParts: [{ text: "Beyond Earth: exploring the " }, { text: "story", highlight: true }, { text: " of " }, { text: "space missions", highlight: true }, { text: "." }],
      destinationPrompt: "Choose a destination to open its missions",
      equipmentCta: "Timeline",
      note: "Real missions, credited images, and official sources.",
      destinations: [
        { id: "marte", label: "Mars", note: "3 journeys", description: "The Red Planet holds clues to ancient water. Choose an explorer to meet.", missionIds: ["sojourner", "viking", "opportunity"] },
        { id: "lua", label: "Moon", note: "2 journeys", description: "On the Moon, the LRV expanded surface exploration, while Apollo 11 instruments still support science.", missionIds: ["lrv-apollo-15", "apollo-11"] }
      ],
      elaineLines: ["Moon or Mars? Choose a destination to discover what each mission investigated.", "Ready to explore? Every spacecraft has a story to tell.", "Let’s choose a destination and uncover the clues each mission found."],
      elaine: "Welcome aboard! I’m Elaine, and I’ll join you on this mission. Choose a destination and let’s investigate together!",
      elainePhoto: { src: "assets/elaine-astronaut-clean-v2.png", alt: "Illustration of Elaine, a smiling astronaut waving", caption: "Welcome aboard! I’m Elaine, and I’ll join you on this mission." }
    },
    progress: { label: "Mission route", completedTitle: "Route complete! You met all five explorers!", completedCopy: "Great curiosity and careful attention to the clues. Now you can build an explorer robot!", miniGameButton: "Go to the mini game" },
    timeline: {
      phases: [{ id: "lancamento", label: "Launch" }, { id: "viagem", label: "Cruise" }, { id: "chegada", label: "Arrival" }, { id: "operacao", label: "Operations" }, { id: "descobertas", label: "Discoveries" }, { id: "legado", label: "Legacy" }],
      missions: [
        { missionId: "apollo-11", date: "1969-07-16", dateLabel: "Jul 16, 1969", label: "Apollo 11", phases: phases([
          ["Three people bound for the Moon", "On July 16, 1969, the Saturn V lifted off with Neil Armstrong, Buzz Aldrin, and Michael Collins. Apollo 11 carried two spacecraft: Columbia, which would stay in orbit, and Eagle, prepared to land.", "Did you know the Saturn V was about 111 meters tall—higher than a 30-story building?"],
          ["A three-day journey", "After leaving Earth orbit, the crew headed for the Moon. Along the way, they checked the systems and prepared Eagle to separate from the command module.", "Two hours and 44 minutes after launch, the rocket’s third stage fired again to send the spacecraft toward the Moon."],
          ["July 20: Eagle lands", "Armstrong and Aldrin landed in the Sea of Tranquility. Michael Collins stayed in lunar orbit aboard Columbia, waiting to reunite with his crewmates.", "During descent, Armstrong took manual control to steer away from a boulder-filled area."],
          ["Work on the lunar surface", "Armstrong and Aldrin spent about 21 hours on the surface, collected rocks and soil, and deployed instruments. A seismometer recorded vibrations; a reflector returned laser pulses sent from Earth.", "The first Moonwalk lasted 2 hours and 31 minutes. They traveled about 1 kilometer."],
          ["The Moon became a laboratory", "Samples and instruments gave scientists material to study lunar geology. The seismometer recorded vibrations, and the rocks brought to Earth are still being studied.", "The crew brought 21.55 kilograms of lunar rocks and soil back to Earth."],
          ["A mirror still answers", "Apollo 11’s instruments were an early step toward a lunar science station. Starting with Apollo 12, the EASEP package paved the way for more complete ALSEP stations, powered by radioisotope generators, also deployed on Apollo 14, 15, 16, and 17. Together, they sent data for almost five years and expanded what we know about the Moon’s interior and history.", "A plaque left on the Moon ends with this message: “We came in peace for all mankind.”"]
        ]) },
        { missionId: "viking", date: "1975-08-20", dateLabel: "Aug 20, 1975", label: "Viking 1 and Viking 2", phases: phases([
          ["Two explorer teams", "Viking 1 launched on August 20, 1975; Viking 2 followed in September. Each mission carried an orbiter and a lander to observe Mars from space and measure the surface environment.", "Each Titan–Centaur rocket carried two spacecraft: one to orbit Mars and one to land."],
          ["Months crossing space", "The spacecraft traveled for many months to reach Mars. On arrival, each orbiter began photographing the planet and helped the team choose a safe landing site.", "Viking 1 took about ten months to travel from Earth to Mars."],
          ["Two landings in different places", "Viking 1 landed in Chryse Planitia in July 1976; Viking 2 reached Utopia Planitia in September. Both orbiters continued observing the planet.", "Just five minutes after landing, Viking 1 sent its first picture from Mars."],
          ["Robotic laboratories on the ground", "Mechanical arms collected small amounts of soil and delivered them to instruments aboard. Cameras and sensors also tracked weather, terrain, and the Martian atmosphere.", "The two landers sent back more than 4,500 surface images."],
          ["The search for life called for caution", "The experiments produced intriguing results, but did not prove that life existed in the soil studied. The measurements showed why a scientific answer must compare clues with different explanations.", "Each lander performed three biological experiments to search for signs of life in the soil."],
          ["A detailed first portrait", "Viking turned landing on Mars into a process that later spacecraft could build on. Phoenix and InSight are among its closest successors: they reused and adapted ideas for atmospheric entry, parachutes, and descent control. Orbiter images also helped make safe-site selection part of preparing later missions.", "The Viking 1 lander worked for 2,307 Earth days—more than six years on Mars."]
        ]) },
        { missionId: "sojourner", date: "1996-12-04", dateLabel: "Dec 4, 1996", label: "Pathfinder · Sojourner", phases: phases([
          ["A new way to land", "Mars Pathfinder launched in December 1996 with a lander and the small Sojourner rover. The team wanted to test a simpler, lower-cost way to reach Mars.", "Sojourner weighed just 10.5 kilograms: a small six-wheeled robotic explorer."],
          ["Seven months to the Red Planet", "During the trip, the spacecraft stayed in radio contact with Earth and corrected its course. Pathfinder carried cameras and instruments; Sojourner rode folded inside the lander.", "Folded to fit inside, Sojourner was only 18 centimeters tall during the trip."],
          ["Airbags soften the landing", "On July 4, 1997, a parachute, retrorockets, and airbags helped Pathfinder reach Ares Vallis. Two days later, Sojourner rolled down a ramp and placed its six wheels on Martian soil.", "The airbags bounced about 15 times before Pathfinder stopped on Mars."],
          ["The rover examines rocks", "Sojourner moved slowly among rocks near the lander. Its APXS analyzed chemical elements in rocks and soil, while cameras helped the team on Earth choose the next route.", "Sojourner moved slowly: its top speed was about 1 centimeter per second."],
          ["Clues to a watery past", "Rounded rocks and other terrain features helped scientists investigate the possibility of an ancient flood at Ares Vallis. They were geological clues, not signs of life.", "The rover took 550 pictures and examined rocks and soil at 16 locations."],
          ["The first rover on another planet", "With six wheels, solar power, and commands from Earth, Sojourner showed that a small rover could explore Mars. The experience carried forward to Spirit and Opportunity; lessons from those twins later reached Curiosity and Perseverance. Each generation could move ahead without starting from scratch.", "The Pathfinder lander was named Carl Sagan Memorial Station, honoring the scientist and science communicator."]
        ]) },
        { missionId: "opportunity", date: "2003-07-07", dateLabel: "Jul 7, 2003", label: "Opportunity", phases: phases([
          ["A rover looking for ancient water", "Opportunity launched in July 2003. The mission planned two rovers for opposite regions of Mars, where rocks might preserve signs of ancient water.", "Its twin rover Spirit launched first; Opportunity launched on July 7, 2003."],
          ["Six months in cruise", "The spacecraft crossed space inside an entry capsule protected by a heat shield. During the trip, the team monitored the systems and prepared the automated arrival sequence.", "Spirit arrived first; Opportunity reached the Martian surface 20 days later."],
          ["Arrival at Meridiani Planum", "In January 2004, the spacecraft landed inside airbags and bounced several times before stopping. Once the airbags deflated, the rover prepared to roll out and explore the plain.", "Opportunity’s airbags bounced at least 26 times before the rover stopped."],
          ["Brushing the rock surface", "Opportunity used the RAT tool to wear away a thin layer and expose less-altered rock. Cameras and instruments studied the marks, minerals, and textures revealed.", "The RAT ground a circle about 4.5 centimeters wide and half a centimeter deep."],
          ["Minerals told a story about water", "Hematite and other rock features showed that liquid water existed on Mars long ago. The rover did not find rivers flowing today; it read the changes water had recorded in the rocks.", "Opportunity found tiny hematite spheres nicknamed “blueberries” because they looked like the fruit."],
          ["Nearly fifteen years of exploration", "Together with Spirit, Opportunity showed how a rover could communicate with Earth, use 3D vision to navigate, and make scientific observations with autonomy. These lessons helped guide Curiosity and Perseverance, which carried even more capable instruments to Mars. Opportunity’s long trail became experience for the explorers that followed.", "Opportunity traveled 45.16 kilometers—farther than a marathon—on another planet."]
        ]) },
        { missionId: "lrv-apollo-15", date: "1971-07-26", dateLabel: "Jul 26, 1971", label: "Apollo 15 · LRV", phases: phases([
          ["A folded vehicle headed for the Moon", "Apollo 15 launched on July 26, 1971, carrying the first Lunar Roving Vehicle. The electric car traveled folded and secured in a compartment of the lunar module Falcon.", "The LRV was designed to fit folded inside a lunar-module compartment."],
          ["Four days inside Falcon", "During the trip from Earth to the Moon, the rover stayed stowed inside the lunar module. Scott and Irwin arrived with it in the Hadley–Apennine region, while Worden waited in orbit.", "The rover had no rocket of its own: it traveled to the Moon with the Apollo 15 crew."],
          ["Unfolded on the lunar ground", "After landing near Hadley Rille, the astronauts pulled the LRV from Falcon using tapes, pulleys, and winches. On July 31, it was ready for the first drive on the Moon.", "Much of the vehicle unfolded as the astronauts lowered it to the ground."],
          ["An electric car for two explorers", "Scott and Irwin steered the rover with a hand controller between their seats. Two batteries supplied power, and each of the four wheels had its own electric motor.", "Each wheel had its own electric motor, and either astronaut could steer the rover."],
          ["More terrain, more scientific clues", "On three drives, the crew traveled about 27.9 kilometers, studied the geology of Hadley–Apennine, and collected more than 170 pounds of lunar samples. The vehicle helped the team reach places farther from the module.", "Apollo 15 covered about 17.5 miles in the LRV and returned more than 170 pounds of samples."],
          ["An explorer left on the Moon", "The Apollo 15 LRV showed that a foldable electric vehicle could extend the astronauts’ range and help them collect more samples. The same type of vehicle flew on Apollo 16 and 17: their LRVs took crews farther from the lunar module and expanded the terrain they could investigate. All three vehicles remain on the Moon, but the idea of bringing mobility to the surface shaped lunar exploration.", "The first lunar car remains in Hadley–Apennine as part of the record of human exploration."]
        ]) }
      ]
    },
    equipment: {
      sojourner: { lead: "A six-wheeled rover tested how a small vehicle could investigate rocks on Mars.", specs: [{ label: "Type", value: "Solar-powered robotic rover" }, { label: "Size", value: "65 × 48 × 30 cm" }, { label: "Mass", value: "10.5 kg" }, { label: "Key instrument", value: "APXS: analyzed chemical elements in rocks" }], scaleLabel: "65 cm long" },
      viking: { lead: "Two orbiter-lander pairs split the work between global views and ground analysis.", specs: [{ label: "Type", value: "Two orbiters and two landers" }, { label: "Lander", value: "About 3 m wide" }, { label: "Power", value: "Radioisotope thermoelectric generators on the landers" }, { label: "Instruments", value: "Sampling arm, cameras, and soil experiments" }], scaleLabel: "about 3 m wide (lander)" },
      opportunity: { lead: "A solar-powered rover crossed craters and compared rock layers across Mars.", specs: [{ label: "Type", value: "Six-wheeled science rover" }, { label: "Size", value: "About 1.6 m tall" }, { label: "Power", value: "Solar panels and batteries" }, { label: "Key tool", value: "RAT: an abrasion tool that exposed fresh rock" }], scaleLabel: "about 1.6 m tall" },
      "lrv-apollo-15": { lead: "The first electric lunar vehicle gave Scott and Irwin mobility to explore Hadley–Apennine.", specs: [{ label: "Type", value: "Four-wheeled electric lunar vehicle" }, { label: "Dimensions", value: "3.1 m long; 1.14 m tall" }, { label: "Mass", value: "About 210 kg on Earth" }, { label: "Power", value: "Two 36 V batteries; one motor per wheel" }], scaleLabel: "3.1 m long" },
      "apollo-11": { lead: "The Eagle lunar module carried two astronauts and science instruments to the Sea of Tranquility.", specs: [{ label: "Type", value: "Lunar descent and ascent module" }, { label: "Height", value: "About 7 m" }, { label: "Width with landing legs", value: "About 9.4 m" }, { label: "Left behind", value: "Descent stage, seismometer, and laser reflector" }], scaleLabel: "about 9.4 m across the legs" }
    },
    mapPoints: [
      { id: "ares-vallis", label: "Ares Vallis", world: "Mars", colorName: "blue" },
      { id: "chryse", label: "Chryse Planitia", world: "Mars", colorName: "violet" },
      { id: "meridiani", label: "Meridiani Planum", world: "Mars", colorName: "green" },
      { id: "tranquility", label: "Sea of Tranquility", world: "Moon", colorName: "gold" },
      { id: "hadley-apennine", label: "Hadley–Apennine", world: "Moon", colorName: "coral" }
    ],
    glossary: [
      { term: "Space artifact", definition: "A human-made object sent into space and left somewhere else, or returned to Earth." },
      { term: "LRV", definition: "Short for Lunar Roving Vehicle. The Apollo 15 electric car carried astronauts, tools, and samples across the Moon." },
      { term: "Rover", definition: "A wheeled robotic vehicle that moves across the surface of a world." },
      { term: "Orbiter", definition: "A spacecraft that circles a planet or moon to observe its surface and environment." },
      { term: "Lander", definition: "A spacecraft designed to descend and work on a surface." },
      { term: "Spectrometer", definition: "An instrument that studies light or other forms of energy to help identify materials." },
      { term: "Reentry", definition: "A spacecraft’s return through an atmosphere, with intense heating and deceleration." },
      { term: "Laser reflector", definition: "A set of mirrors that returns laser pulses sent from Earth." }
    ],
    missions: [
      { id: "sojourner", label: "Mars Pathfinder rover", category: "Mars", summary: "The first wheeled rover on another planet: small, solar-powered, and sent to test a new way to land and study Mars.", imageAlt: "The Sojourner rover near the Wedge rock on Mars.", caption: "Sojourner beside the Wedge rock.", curiosity: "What clues in the rocks might tell you whether water once flowed here?", artifact: { tag: "Still on Mars · Ares Vallis", title: "A lander and rover that never returned", text: "Carl Sagan Memorial Station (the Pathfinder lander) and Sojourner remained at the landing site in Ares Vallis. The last transmission arrived in September 1997; no spacecraft was sent to bring them home. Today, both are quiet parts of the Martian landscape." }, story: [
        { title: "A small mission with a huge question", text: "Let’s begin with Mars Pathfinder. In 1996, it set out to test a simpler, lower-cost arrival at Mars, carrying a lander and a small rover. The team chose Ares Vallis because the terrain seemed safe and held rocks that an ancient flood might have carried from far away. The landing site itself became part of the investigation." },
        { title: "Six wheels and a pocket-sized lab", text: "During descent, Pathfinder used a parachute, retrorockets, and large airbags to soften impact. After bouncing to a stop, it opened ramps for Sojourner. Powered by the Sun and weighing 10.5 kilograms, the rover carried cameras and the APXS spectrometer. The instrument helped identify elements in rocks—like reading a recipe’s ingredients without tasting the dish." },
        { title: "Stones that tell a water story", text: "The plan was one week; Sojourner worked for 83 days and examined rocks and soil at 16 locations. Some rounded stones resembled pebbles shaped by water on Earth. Along with other clues, they helped investigate an ancient flood at Ares Vallis—a geological hypothesis, not proof of life. The mission showed how a small solar rover could explore Mars and left new questions for those who would continue the search." }
      ] },
      { id: "viking", label: "Two orbiters and two landers", category: "Mars", summary: "Four spacecraft shared the work: two mapped Mars from space and two landed to photograph, monitor weather, and study the soil.", imageAlt: "Rocks and silt in Chryse Planitia, seen by Viking 1.", caption: "Rocks and silt in Chryse Planitia, seen by the Viking 1 lander.", curiosity: "If an experiment gives a surprising result, what other measurement would you make before concluding that you found life?", artifact: { tag: "Silent landers on Mars", title: "Two laboratories stayed at their landing sites", text: "The Viking 1 and Viking 2 landers remained at Chryse Planitia and Utopia Planitia after their transmissions stopped, in 1982 and 1980. The orbiters also ended operations. There was no return trip: the spacecraft were built to study Mars right where they were." }, story: [
        { title: "Four spacecraft, two questions", text: "Our next stop is the Viking program. Each mission paired an orbiter, which watched Mars from above, with a lander built to work on the ground. The team wanted to study weather and rocks and search for signs of life. Orbital images also helped identify safer landing sites." },
        { title: "A robotic scoop brings Mars to the lab", text: "In 1976, the landers reached Chryse Planitia and Utopia Planitia. Robotic arms collected small portions of soil and delivered them to experiments inside the spacecraft; cameras photographed the horizon and sensors monitored weather. Meanwhile, the orbiters recorded more than 52,000 images and mapped nearly the entire planet. It was like combining a panoramic view with a laboratory on the ground." },
        { title: "An answer that called for caution", text: "The landers’ biology experiments produced intriguing reactions, but no definitive evidence of life at the sites studied. Each lander performed three such experiments. Comparing results showed why one clue is not enough: scientists must test different explanations. The answer was not a simple yes or no; Viking’s data helped shape better questions about Mars." }
      ] },
      { id: "opportunity", label: "Mars exploration rover", category: "Mars", summary: "Powered by sunlight, Opportunity ground rocks, crossed craters, and found clues that salty water once existed on Mars.", imageAlt: "A panorama of Endurance Crater recorded by the Opportunity rover.", caption: "A panorama of Endurance Crater photographed during Opportunity’s exploration.", curiosity: "How can a tool like a small brush help reveal a rock’s past?", artifact: { tag: "On Mars · Perseverance Valley", title: "Opportunity’s final trail", text: "A global dust storm darkened the sky and covered the solar panels. Planned for 90 Martian days, Opportunity worked for nearly 15 years and traveled 45.16 kilometers. Its last signal arrived on June 10, 2018; after more than a thousand attempts to contact it, NASA ended the mission. The rover remains in Perseverance Valley, far beyond its planned distance." }, story: [
        { title: "A robot powered by the Sun", text: "Now we travel to Mars with Opportunity, which arrived in 2004 to look for signs of water and environments that may once have supported life. Solar panels charged its batteries, so available energy shaped the plan. Exposed rocks, craters, and minerals could hold an ancient story, like pages in a book covered by dust." },
        { title: "Scrape the rock to see more clearly", text: "The robotic arm brought cameras and instruments close to the rocks. A spinning tool called RAT wore away the dusty outer layer to expose fresher rock; other instruments examined its texture and chemical elements. At Endurance Crater, Opportunity photographed layered walls from 81 positions. Engineering opened a window onto the history preserved in stone." },
        { title: "Tiny spheres, a major clue", text: "Small hematite-rich spheres and rocks bearing signs of salty, wet environments showed that liquid water once existed on Mars. They were not drops of water today; they were chemical clues preserved in stone. Planned for 90 Martian days, Opportunity worked for nearly 15 years and traveled 45.16 kilometers. A global storm covered its solar panels; its last signal arrived on June 10, 2018. After more than a thousand attempts to contact it, NASA ended the mission. The trail ended, but the clues continue to inspire new exploration." }
      ] },
      { id: "lrv-apollo-15", label: "First electric vehicle driven on the Moon", category: "Moon", summary: "Scott and Irwin used the first Lunar Roving Vehicle to explore Hadley–Apennine, reach distant points, and collect more lunar samples.", imageAlt: "Astronaut James Irwin working beside the lunar vehicle during Apollo 15 in Hadley–Apennine.", caption: "James Irwin beside the LRV during Apollo 15’s first moonwalk. Photo AS15-86-11603.", curiosity: "How would you explore a distant place if you could take only what fit inside a folded vehicle?", artifact: { tag: "Vehicle left on the Moon · Apollo 15", title: "An electric explorer left in Hadley–Apennine", text: "The LRV was parked near the landing site before Scott and Irwin left the Moon. It remains in Hadley–Apennine. Its mobility let the crew visit more places and collect samples that would have been difficult to reach on foot." }, story: [
        { title: "The first drive on the Moon", text: "Our next journey is to the Moon with Apollo 15 and the first Lunar Roving Vehicle. The LRV was electric, had four wheels, and extended Scott and Irwin’s range. They could visit geological sites farther from the lunar module and carry tools and samples—like a wheeled backpack for crossing a huge landscape." },
        { title: "Folded to fit in the lunar module", text: "To fit inside Falcon, the rover traveled folded in a compartment. On the Moon, Scott and Irwin lowered it with tapes and pulleys; its chassis and wheels unfolded into a vehicle. Two 36-volt batteries powered four electric motors, one at each wheel, and a hand controller between the seats helped steer. Foldable parts and stored energy turned a small space into an exploration vehicle." },
        { title: "More distance to investigate rocks", text: "On three excursions, the LRV traveled about 27.8 kilometers in a little over three hours of driving. The crew explored Hadley–Apennine for 18 hours and 37 minutes and brought back more than 170 pounds of samples. Mobility let the astronauts compare distant geological sites; when they departed, the vehicle stayed on the Moon. The LRV showed how wheels and electric power can expand the terrain science can investigate." }
      ] },
      { id: "apollo-11", label: "First human Moon landing", category: "Moon", summary: "Two astronauts explored the Sea of Tranquility while a third waited in orbit; Eagle carried instruments left on the Moon and a crew that returned to Earth.", imageAlt: "The Eagle lunar module above the Moon, with Earth in the background during Apollo 11.", caption: "Eagle returns from the lunar surface to meet Columbia, with the Moon and Earth in the background.", curiosity: "Why do you think it is useful to leave a mirror on the Moon for decades?", artifact: { tag: "Instruments on the Moon · samples on Earth", title: "Eagle left a science station at Tranquility Base", text: "Eagle’s descent stage, the seismometer, and the laser reflector remained in the Sea of Tranquility. The ascent stage was left in lunar orbit, not on the surface. The foil that collected solar-wind particles and the rock samples returned to Earth; the reflector still helps measure the distance between Earth and the Moon." }, story: [
        { title: "A team split between two spacecraft", text: "Here is the story of Apollo 11, launched in July 1969 with three astronauts and two spacecraft. Columbia remained in lunar orbit with Michael Collins; Eagle descended with Neil Armstrong and Buzz Aldrin. Splitting the spacecraft allowed the ascent stage to meet Columbia again for the trip home. An engineering plan made descent and rendezvous possible, one step at a time." },
        { title: "Turning a few steps into science", text: "At the Sea of Tranquility, Armstrong and Aldrin collected 58 rock and soil samples. They also deployed a seismometer to record vibrations and a reflector to return laser pulses sent from Earth. The solar-wind experiment’s foil was collected and brought home. Some instruments stayed behind as a small science station, while samples went to laboratories on Earth." },
        { title: "A mirror that still answers", text: "The seismometer recorded vibrations and impacts for about three weeks, offering an early view of the lunar interior. The passive reflector needed no battery: observatories on Earth still send lasers and measure how long the light takes to return, calculating the distance between the two worlds. The samples are still studied, too. Eagle’s descent stage and these instruments stayed on the Moon; its ascent stage was left in orbit. The mission ended, but part of its science still answers today’s questions." }
      ] }
    ]
  };

  const englishMissionNames = {
    sojourner: "Sojourner",
    viking: "Viking",
    opportunity: "Opportunity",
    "lrv-apollo-15": "Apollo 15 LRV",
    "apollo-11": "Apollo 11"
  };
  english.missions.forEach((mission) => {
    mission.name = englishMissionNames[mission.id] || mission.name;
    mission.credit = /NSSDCA/i.test(mission.credit || "") ? "NASA · NSSDCA archive" : mission.credit;
  });
  const englishSourceTitles = {
    "lrv-apollo-15": "Lunar Exploration Vehicles (LRVs) — NSSDCA",
    "sojourner-specs": "Mars Pathfinder — Sojourner rover specifications (NASA/JPL)",
    "viking-specs": "Viking — spacecraft and science (NASA Science)",
    "opportunity-specs": "Mars Exploration Rover — dimensions and instruments (NASA)",
    "apollo-specs": "Apollo 17 Press Kit — lunar module dimensions (NASA)",
    "apollo-11-photo": "Apollo 11 — Eagle, Moon, and Earth (AS11-44-6642)",
    "pathfinder-story": "Mars Pathfinder and Sojourner: mission and legacy",
    "sojourner-apxs": "Sojourner analyzes Barnacle Bill rock with APXS",
    "viking-story": "Viking: landers, orbiters, and the search for life",
    "opportunity-story": "Opportunity: mission, route, and conclusion",
    "opportunity-tools": "Spirit and Opportunity rover instruments",
    "apollo-easep": "Apollo 11: experiments left on the Moon",
    "apollo-laser": "Apollo 11 laser reflector: lunar measurements today",
    "apollo-hardware": "NASA: human-made artifacts left on the Moon",
    "apollo-alsep-evolution": "EASEP and ALSEP: Apollo science stations",
    "viking-landing-heritage": "How NASA lands on Mars — NASA Science"
  };
  english.metadata = {
    factualPolicy: "Facts in this exhibit link to records from NSSDCA/NSSDC or NASA.",
    sources: window.MISSION_DATA.metadata.sources.map((source) => ({
      ...source,
      title: englishSourceTitles[source.id] || source.title
    }))
  };

  window.MISSION_DATA_EN = merge(window.MISSION_DATA, english);
  window.MINI_GAME_QUESTIONS_EN = [
    { id: "sojourner-landing", prompt: "What did Pathfinder use to soften its landing on Mars?", options: ["A parachute, retrorockets, and airbags", "Solar panels and wheels", "A robotic arm and a ramp", "A laser reflector and a seismometer"], hint: "Think about the braking sequence: first the descent slows, then the impact is cushioned.", explanation: "A parachute, retrorockets, and airbags helped Pathfinder land. The ramp then let Sojourner reach the Martian ground." },
    { id: "sojourner-apxs", prompt: "What did Sojourner’s APXS help investigate in rocks?", options: ["Chemical composition", "The distance between Earth and Mars", "The temperature of stars", "The exact age of each grain"], hint: "APXS helped identify which elements the rocks were made of.", explanation: "APXS analyzed chemical elements in rocks and soil. The small rover turned each close encounter with a stone into data about its composition." },
    { id: "sojourner-flood", prompt: "What clue at Ares Vallis helped scientists investigate an ancient flood?", options: ["Rounded rocks in the terrain", "A forest beside the lander", "Rivers flowing during the mission", "Astronaut footprints"], hint: "Think of something water can round as it rolls across the ground.", explanation: "Rounded rocks and other terrain features were geological clues to a possible ancient flood; they were not proof of life on Mars." },
    { id: "viking-team", prompt: "How did each Viking mission divide its observations of Mars?", options: ["An orbiter watched from above while a lander worked on the ground", "Two rovers traveled together", "One spacecraft carried astronauts and another returned to Earth", "Every vehicle landed at the same site"], hint: "One part of the team observed Mars from space; the other studied the planet on the ground.", explanation: "Each Viking pair combined an orbiter and a lander. Images from above helped observe the planet and prepare surface work." },
    { id: "viking-soil", prompt: "How did Viking landers study small samples of soil?", options: ["An arm carried them to instruments inside the spacecraft", "They saved everything for a return capsule", "They dissolved the soil to make water", "They sent the samples to Earth by cable"], hint: "The samples did not need to return to Earth: scientific instruments were already aboard the lander.", explanation: "Robotic arms collected soil and placed it in onboard experiments. Engineering brought the laboratory to Mars instead of bringing the soil back." },
    { id: "viking-life", prompt: "What did Viking experiments conclude about life in Martian soil?", options: ["The results were intriguing but did not prove life", "They found animals near the landers", "They did not test for life", "They confirmed an underground forest"], hint: "The tests offered interesting clues, but scientists did not treat one reaction as definitive proof.", explanation: "The experiments investigated biological signs and produced interesting results, but no definitive evidence of life at the studied sites." },
    { id: "opportunity-energy", prompt: "How did Opportunity get energy to keep exploring?", options: ["Solar panels charged its batteries", "A cable connected it to Earth", "A gasoline engine moved its wheels", "The lunar module powered the rover"], hint: "Look for the part of the rover that received sunlight and helped charge its batteries.", explanation: "Solar panels charged the rover’s batteries. Available energy guided the planning of its movements and observations." },
    { id: "opportunity-rat", prompt: "What did Opportunity use the RAT tool for?", options: ["To wear away the outer layer and expose fresher rock", "To store stones in a return capsule", "To wash the panels with water", "To drill tunnels to Mars’s center"], hint: "RAT removed some dusty surface so other instruments could examine the rock.", explanation: "RAT removed a thin, weathered layer. Other instruments could then examine the exposed texture and materials." },
    { id: "opportunity-water", prompt: "What story did the rocks studied by Opportunity help tell?", options: ["Liquid water existed on Mars in the past", "Rivers flowed during the mission", "A forest was still growing on Mars", "Fish lived in open craters"], hint: "The rocks held signs of ancient water, not rivers flowing during the mission.", explanation: "Minerals and rock textures showed that liquid water changed some rocks long ago. Opportunity found clues preserved in stone, not present-day rivers." },
    { id: "lrv-power", prompt: "How did the Apollo 15 LRV move its four wheels?", options: ["Two batteries powered electric motors in the wheels", "A gasoline engine pulled a central axle", "A cable connected it to the lunar module", "Solar panels turned the wheels directly"], hint: "The LRV did not burn fuel: its batteries supplied electricity to the wheel motors.", explanation: "Two batteries supplied power, and each wheel had its own electric motor. This let the crew explore without a cable to the module." },
    { id: "lrv-deploy", prompt: "How was the LRV transported and put to work on the Moon?", options: ["It traveled folded in the lunar module and unfolded after landing", "It was assembled in orbit and launched as a satellite", "It descended on a cable from Earth", "The astronauts carried it assembled from launch"], hint: "To fit inside Falcon, the vehicle traveled folded and was unfolded on the Moon.", explanation: "The rover traveled folded in a compartment of Falcon. On the Moon, Scott and Irwin lowered it with tapes and pulleys and opened its moving parts." },
    { id: "lrv-science", prompt: "How did the LRV expand Apollo 15’s science work?", options: ["It carried astronauts farther and transported tools and samples", "It replaced the lunar module on the return trip", "It dug tunnels to search for water beneath the Moon", "It analyzed chemicals without instruments"], hint: "Think about what a wheeled vehicle makes possible compared with walking while carrying everything.", explanation: "The vehicle took Scott and Irwin to distant geological sites and carried tools and samples. Greater mobility expanded the terrain they could investigate." },
    { id: "apollo-roles", prompt: "What was the difference between Eagle and Columbia during Apollo 11?", options: ["Eagle descended to the surface; Columbia stayed in lunar orbit", "Columbia landed and Eagle stayed on Earth", "Both spacecraft landed together in the Sea of Tranquility", "Eagle was a rover and Columbia was a Mars orbiter"], hint: "One module carried Armstrong and Aldrin to the ground; the other stayed with Michael Collins around the Moon.", explanation: "Eagle carried Armstrong and Aldrin to the surface. Michael Collins remained in lunar orbit inside Columbia, waiting to reunite." },
    { id: "apollo-instruments", prompt: "What did Apollo 11’s seismometer and reflector do?", options: ["The seismometer recorded vibrations; the reflector returned laser pulses", "The seismometer photographed rocks; the reflector measured wind", "Both were engines that moved Eagle", "Both collected samples to send to Mars"], hint: "One instrument listened for ground vibrations; the other reflected light sent from Earth.", explanation: "The seismometer recorded lunar vibrations; the reflector returns laser pulses from Earth and helps measure the distance between the two worlds." },
    { id: "apollo-stages", prompt: "What stayed on the Moon after Apollo 11, and what returned to Earth?", options: ["The descent stage and instruments stayed; samples and solar-wind foil returned", "The ascent stage stayed on the surface and the rocks were left in orbit", "Everything returned to Earth inside the lunar rover", "The crew left every instrument in Columbia"], hint: "Separate the equipment that served as a base on the surface from the materials the crew brought home.", explanation: "The descent stage, seismometer, and reflector remained on the Moon. Samples and the solar-wind experiment foil returned for study on Earth." }
  ];
  const englishQuestionStructure = {
    "sojourner-landing": ["sojourner", ["pathfinder", "pathfinder-story"]],
    "sojourner-apxs": ["sojourner", ["sojourner-apxs", "sojourner-specs"]],
    "sojourner-flood": ["sojourner", ["pathfinder-story", "sojourner-apxs"]],
    "viking-team": ["viking", ["viking-story", "viking-specs"]],
    "viking-soil": ["viking", ["viking-story"]],
    "viking-life": ["viking", ["viking-story", "viking"]],
    "opportunity-energy": ["opportunity", ["opportunity-story", "opportunity-specs"]],
    "opportunity-rat": ["opportunity", ["opportunity-tools", "opportunity"]],
    "opportunity-water": ["opportunity", ["opportunity-story", "opportunity"]],
    "lrv-power": ["lrv-apollo-15", ["lunar-roving-vehicle", "apollo-15-technical"]],
    "lrv-deploy": ["lrv-apollo-15", ["lunar-roving-vehicle", "apollo-15-technical"]],
    "lrv-science": ["lrv-apollo-15", ["apollo-15-mission", "lunar-roving-vehicle"]],
    "apollo-roles": ["apollo-11", ["apollo-11", "apollo-hardware"]],
    "apollo-instruments": ["apollo-11", ["apollo-easep", "apollo-laser"]],
    "apollo-stages": ["apollo-11", ["apollo-hardware", "apollo-easep"]]
  };
  window.MINI_GAME_QUESTIONS_EN.forEach((question) => {
    const [equipmentId, sourceIds] = englishQuestionStructure[question.id] || [];
    if (equipmentId) Object.assign(question, { equipmentId, correctIndex: 0, sourceIds });
  });
})();
