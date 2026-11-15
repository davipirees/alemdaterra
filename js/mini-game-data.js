// Perguntas factuais do mini game. Cada grupo usa dados já apresentados nas histórias.
window.MINI_GAME_QUESTIONS = [
  {
    id: "sojourner-landing",
    equipmentId: "sojourner",
    prompt: "Que recursos Pathfinder usou para reduzir o impacto ao pousar em Marte?",
    options: ["Paraquedas, retrofoguetes e airbags", "Painéis solares e rodas", "Um braço mecânico e uma rampa", "Um refletor a laser e um sismômetro"],
    correctIndex: 0,
    hint: "Lembre da sequência de frenagem: primeiro a descida desacelera, depois o impacto é amortecido.",
    explanation: "Paraquedas, retrofoguetes e airbags ajudaram Pathfinder a pousar. Depois, a rampa permitiu que Sojourner chegasse ao solo marciano.",
    sourceIds: ["pathfinder", "pathfinder-story"]
  },
  {
    id: "sojourner-apxs",
    equipmentId: "sojourner",
    prompt: "O que o APXS de Sojourner ajudava a investigar nas rochas?",
    options: ["A composição química", "A distância entre Terra e Marte", "A temperatura das estrelas", "A idade exata de cada grão"],
    correctIndex: 0,
    hint: "O APXS ajudava a descobrir de quais elementos as rochas eram feitas.",
    explanation: "O APXS analisava elementos químicos em rochas e solo. Assim, o pequeno rover transformava cada contato com uma pedra em dados sobre sua composição.",
    sourceIds: ["sojourner-apxs", "sojourner-specs"]
  },
  {
    id: "sojourner-flood",
    equipmentId: "sojourner",
    prompt: "Que pista em Ares Vallis ajudou a investigar uma antiga inundação?",
    options: ["Pedras arredondadas no terreno", "Uma floresta junto ao pousador", "Rios de água correndo durante a missão", "Pegadas de astronautas"],
    correctIndex: 0,
    hint: "Pense em algo que a água pode deixar arredondado ao rolar pelo terreno.",
    explanation: "Pedras arredondadas e outras formas do terreno foram pistas geológicas de uma possível inundação antiga; elas não eram prova de vida em Marte.",
    sourceIds: ["pathfinder-story", "sojourner-apxs"]
  },
  {
    id: "viking-team",
    equipmentId: "viking",
    prompt: "Como cada missão Viking dividia a observação de Marte?",
    options: ["Um orbitador observava de cima e um pousador trabalhava no solo", "Dois rovers viajavam juntos pela superfície", "Uma nave levava astronautas e outra voltava à Terra", "Todos os veículos pousavam no mesmo local"],
    correctIndex: 0,
    hint: "Uma parte da dupla observava Marte do espaço; a outra estudava o planeta no chão.",
    explanation: "Cada dupla Viking combinava um orbitador e um pousador. As imagens de cima ajudavam a observar o planeta e a preparar o trabalho na superfície.",
    sourceIds: ["viking-story", "viking-specs"]
  },
  {
    id: "viking-soil",
    equipmentId: "viking",
    prompt: "Como os pousadores Viking estudavam pequenas porções do solo?",
    options: ["Um braço as levava a instrumentos dentro da própria nave", "Guardavam tudo para uma cápsula de retorno", "Dissolviam o solo para fabricar água", "Enviavam as amostras por um cabo até a Terra"],
    correctIndex: 0,
    hint: "As amostras não precisavam voltar à Terra: havia instrumentos científicos no próprio pousador.",
    explanation: "Os braços robóticos recolhiam porções de solo e as colocavam em experimentos a bordo. A engenharia levou o laboratório até Marte, sem trazer o solo de volta.",
    sourceIds: ["viking-story"]
  },
  {
    id: "viking-life",
    equipmentId: "viking",
    prompt: "O que os experimentos Viking concluíram sobre vida no solo marciano?",
    options: ["Os resultados foram intrigantes, mas não provaram vida", "Encontraram animais perto dos pousadores", "Não fizeram nenhum teste relacionado à vida", "Confirmaram uma floresta subterrânea"],
    correctIndex: 0,
    hint: "Os testes deram pistas interessantes, mas os cientistas não trataram uma reação como prova definitiva.",
    explanation: "Os experimentos investigaram sinais biológicos e produziram resultados interessantes, mas não deram evidência definitiva de vida nos locais estudados.",
    sourceIds: ["viking-story", "viking"]
  },
  {
    id: "opportunity-energy",
    equipmentId: "opportunity",
    prompt: "Como Opportunity obtinha energia para continuar explorando?",
    options: ["Painéis solares carregavam suas baterias", "Um cabo o ligava à Terra", "Um motor a gasolina movia suas rodas", "O rover recebia energia do módulo lunar"],
    correctIndex: 0,
    hint: "Procure no próprio rover a estrutura que recebia luz do Sol e ajudava a carregar as baterias.",
    explanation: "Os painéis solares carregavam as baterias do rover. A energia disponível orientava o planejamento dos movimentos e das observações.",
    sourceIds: ["opportunity-story", "opportunity-specs"]
  },
  {
    id: "opportunity-rat",
    equipmentId: "opportunity",
    prompt: "Para que Opportunity usava a ferramenta RAT?",
    options: ["Para desgastar a camada externa e revelar rocha mais fresca", "Para guardar pedras numa cápsula de retorno", "Para lavar os painéis com água", "Para perfurar túneis até o centro de Marte"],
    correctIndex: 0,
    hint: "A RAT retirava um pouco da superfície empoeirada para que outros instrumentos pudessem examinar a rocha.",
    explanation: "A RAT removia uma camada fina e desgastada. Outros instrumentos podiam então examinar a textura e os materiais expostos na rocha.",
    sourceIds: ["opportunity-tools", "opportunity"]
  },
  {
    id: "opportunity-water",
    equipmentId: "opportunity",
    prompt: "Que história as rochas estudadas por Opportunity ajudaram a contar?",
    options: ["Água líquida esteve presente em Marte no passado", "Havia rios correndo durante a missão", "Marte tinha uma floresta ainda crescendo", "Peixes viveram em crateras abertas"],
    correctIndex: 0,
    hint: "As rochas guardavam sinais de água antiga, não de rios correndo durante a missão.",
    explanation: "Minerais e texturas nas rochas indicaram que água líquida alterou algumas delas há muito tempo. O rover encontrou pistas preservadas na pedra, não rios atuais.",
    sourceIds: ["opportunity-story", "opportunity"]
  },
  {
    id: "lrv-power",
    equipmentId: "lrv-apollo-15",
    prompt: "Como o LRV da Apollo 15 fazia suas quatro rodas se moverem?",
    options: ["Duas baterias alimentavam motores elétricos nas rodas", "Um motor a gasolina puxava um eixo central", "Um cabo o ligava ao módulo lunar", "Painéis solares giravam as rodas diretamente"],
    correctIndex: 0,
    hint: "O LRV não usava combustível: suas baterias forneciam eletricidade aos motores das rodas.",
    explanation: "Duas baterias forneciam energia e cada roda tinha seu próprio motor elétrico. Essa combinação permitiu explorar a superfície sem um cabo até o módulo.",
    sourceIds: ["lunar-roving-vehicle", "apollo-15-technical"]
  },
  {
    id: "lrv-deploy",
    equipmentId: "lrv-apollo-15",
    prompt: "Como o LRV foi transportado e colocado em uso na Lua?",
    options: ["Viajava dobrado no módulo lunar e foi aberto após o pouso", "Foi montado em órbita e lançado como satélite", "Desceu preso a um cabo vindo da Terra", "Foi carregado pronto pelos astronautas desde o lançamento"],
    correctIndex: 0,
    hint: "Para caber no compartimento do Falcon, o veículo viajou recolhido e só foi desdobrado na Lua.",
    explanation: "O rover viajou dobrado em um compartimento do Falcon. Na Lua, Scott e Irwin o baixaram com fitas e roldanas e abriram suas partes móveis.",
    sourceIds: ["lunar-roving-vehicle", "apollo-15-technical"]
  },
  {
    id: "lrv-science",
    equipmentId: "lrv-apollo-15",
    prompt: "Como o LRV ampliou o trabalho científico da Apollo 15?",
    options: ["Levou os astronautas a locais mais distantes e transportou ferramentas e amostras", "Substituiu o módulo lunar na viagem de volta", "Escavou túneis para procurar água sob a Lua", "Fez análises químicas sem instrumentos"],
    correctIndex: 0,
    hint: "Pense no que um veículo com rodas permite fazer em comparação com caminhar carregando tudo.",
    explanation: "Com o veículo, Scott e Irwin alcançaram pontos geológicos mais distantes e carregaram ferramentas e amostras. Mais mobilidade ampliou o terreno que puderam investigar.",
    sourceIds: ["apollo-15-mission", "lunar-roving-vehicle"]
  },
  {
    id: "apollo-roles",
    equipmentId: "apollo-11",
    prompt: "Qual era a diferença entre Eagle e Columbia durante a Apollo 11?",
    options: ["Eagle desceu à superfície; Columbia permaneceu em órbita lunar", "Columbia pousou e Eagle ficou na Terra", "As duas naves pousaram juntas no Mar da Tranquilidade", "Eagle era um rover e Columbia, um orbitador de Marte"],
    correctIndex: 0,
    hint: "Um módulo levou Armstrong e Aldrin ao solo; o outro ficou com Michael Collins ao redor da Lua.",
    explanation: "Eagle levou Armstrong e Aldrin até a superfície. Michael Collins permaneceu em órbita lunar dentro de Columbia, aguardando o reencontro.",
    sourceIds: ["apollo-11", "apollo-hardware"]
  },
  {
    id: "apollo-instruments",
    equipmentId: "apollo-11",
    prompt: "Que trabalho científico o sismômetro e o refletor da Apollo 11 faziam?",
    options: ["O sismômetro registrava vibrações e o refletor devolvia pulsos de laser", "O sismômetro fotografava rochas e o refletor media o vento", "Ambos eram motores que moviam Eagle", "Os dois recolhiam amostras para enviar a Marte"],
    correctIndex: 0,
    hint: "Um instrumento escutava vibrações do solo; o outro refletia luz enviada da Terra.",
    explanation: "O sismômetro registrou vibrações lunares; o refletor devolve pulsos de laser enviados da Terra, ajudando a medir a distância entre os dois mundos.",
    sourceIds: ["apollo-easep", "apollo-laser"]
  },
  {
    id: "apollo-stages",
    equipmentId: "apollo-11",
    prompt: "O que ficou na Lua depois da Apollo 11 e o que voltou à Terra?",
    options: ["O estágio de descida e instrumentos ficaram; amostras e a folha de vento solar voltaram", "O estágio de subida ficou no solo e as rochas foram deixadas em órbita", "Tudo voltou à Terra dentro do rover lunar", "A tripulação deixou todos os instrumentos em Columbia"],
    correctIndex: 0,
    hint: "Separe o equipamento que serviu de base no solo dos materiais que a tripulação trouxe para casa.",
    explanation: "O estágio de descida, o sismômetro e o refletor permaneceram na Lua. As amostras e a folha do experimento de vento solar foram trazidas para estudo na Terra.",
    sourceIds: ["apollo-hardware", "apollo-easep"]
  }
];
