# Diário de bordo

Exposição educativa interativa sobre cinco equipamentos e missões da Lua e de Marte: Sojourner, Viking, Opportunity, o LRV da Apollo 15 e Apollo 11. Em vez de uma página longa, a interface abre uma área por vez. O conteúdo usa HTML, CSS e JavaScript puros, sem bibliotecas ou etapa de build. A primeira visita abre em inglês; Português (Brasil) pode ser escolhido no seletor do cabeçalho. Abra `index.html` em um navegador moderno.

## Navegação

O menu segue o padrão de abas WAI-ARIA. Cada painel é criado a partir de `js/data.js`, recebe um hash compartilhável e pode ser navegado por teclado. Em desktops e tablets, as abas ficam visíveis em uma linha no cabeçalho; em telas de celular de até 680 px, um botão abre o menu acessível. O menu indica quando está aberto, recebe foco no painel ativo e fecha com Esc, clique externo ou seleção de uma aba. Setas esquerda/direita, Home e End movem o foco; Enter/Espaço ativam a aba. O conteúdo rola dentro do painel, o diálogo tem rolagem própria e as animações respeitam `prefers-reduced-motion`.

## Responsividade

O layout é pensado primeiro para celular, usa grades fluidas e evita rolagem horizontal no conteúdo. Há ajustes em 360 px e 480 px para telas compactas, 680 px para o menu móvel, 1024 px para tablets, 1280 px e 1440 px para telas maiores, e 1920 px para monitores ultrawide. Em tablets, as abas permanecem em uma linha e podem rolar horizontalmente quando o espaço é estreito. A grade de equipamentos mostra os cinco cartões em uma linha a partir de 1280 px e reduz o número de colunas em telas menores. Há ajustes para paisagem com pouca altura, áreas seguras do aparelho, alvos de toque de pelo menos 44 px e impressão da aba aberta.

Para ajustar um ponto de quebra, edite os blocos `@media` no fim de `css/style.css` e `css/experience.css`; mantenha a ordem mobile-first e confira o menu, o hero, as grades, o mapa e o diálogo em retrato e paisagem. A escala base aumenta em telas a partir de 1920 px, enquanto os painéis continuam limitados a uma largura de leitura confortável.

Na linha do tempo, as missões aparecem pela data de lançamento — Apollo 11, Apollo 15/LRV, Viking, Pathfinder/Sojourner e Opportunity. Dentro de cada missão, seis etapas mantêm lançamento, viagem, chegada, operação, descobertas e legado juntos. Cada etapa traz um fato interessante ao lado do texto e do retrato redondo de Elaine, além de um link para a fonte relacionada. Os controles anterior e próximo percorrem essa sequência cronológica.

Os capítulos completos de cada missão são narrados por Nilo, um guia robótico fictício. O texto avisa que a voz é imaginada; datas, ações e descobertas vêm dos registros oficiais linkados em cada capítulo. As falas não são apresentadas como transmissões reais dos equipamentos.

A barra de rota acompanha quantas histórias de missão diferentes foram abertas na sessão atual. Ao conhecer os cinco equipamentos, o Mini game é liberado; a faixa de conclusão some quando a pessoa acessa essa aba. Até lá, a navegação mostra quantos equipamentos faltam; abrir `#mini-game` diretamente leva ao início se o jogo ainda estiver bloqueado. O banco em `js/mini-game-data.js` tem 15 perguntas, três por equipamento, com quatro alternativas e explicações. Cada partida escolhe dez perguntas sem repetição, incluindo ao menos uma de cada missão, e entrega uma das seis peças do robô por resposta certa. Uma segunda resposta errada encerra aquela pergunta e avança após mostrar a explicação; não há botão para pular perguntas. Elaine oferece três dicas por partida. O campo para dar nome ao robô só aparece quando as seis peças estão completas. O recorde é guardado apenas em `localStorage`; o andamento da partida e o nome do robô ficam na tela e não são enviados a nenhum servidor.

O Mini game é jogável com toque, mouse e teclado. Tab e Enter/Espaço percorrem e ativam os botões; as teclas 1 a 4 escolhem uma alternativa quando o foco está no jogo. A região de status anuncia resposta, explicação e peça desbloqueada. O robô é um desenho vetorial original em SVG com título, descrição e seis conjuntos de peças identificadas: chassi, painéis solares, rodas, antena, braço científico e câmeras. O nome digitado não persiste. A animação de encaixe e a comemoração respeitam `prefers-reduced-motion`.

O mapa mostra Marte, a Lua, suas órbitas e cinco pontos coloridos, com uma legenda curta logo abaixo para identificar cada missão. As linhas orbitais giram devagar como demonstração; os pontos não se movem. Tocar, clicar ou focar um ponto e pressionar Enter destaca a órbita e o corpo celeste correspondente; o mapa não abre a missão. Com movimento reduzido, as órbitas apenas variam suavemente de opacidade. Na linha do tempo, cada etapa mostra o fato interessante com o retrato redondo de Elaine e um link “Saiba mais” para a fonte relacionada. A bolinha flutuante fica oculta nessa aba. As 30 curiosidades ficam separadas da explicação principal. A home mantém apenas o hero, sem cartões extras abaixo dele, e a personagem não aparece como retrato flutuante nessa aba. O hero ocupa melhor a altura disponível em telas médias e grandes. Elaine usa falas diferentes conforme a aba e a interação; no Mini game, ela funciona como assistente e fornece três dicas contextuais por partida.

## O que foi enxugado

- A exposição agora cobre apenas Lua e Marte; a missão Deep Impact, o destino Cometas e seus dados, pergunta e imagem foram retirados.
- A aba Descobertas e seus cartões redundantes foram removidos; as descobertas principais continuam dentro das histórias das missões e da linha do tempo.
- O mapa mostra as órbitas de Marte e da Lua; os pontos coloridos destacam o destino e uma legenda identifica cada missão.
- A pista de bordo foi retirada da home para manter a primeira tela mais compacta.
- A navegação compacta foi ajustada para celulares; tablets e telas maiores exibem as abas diretamente no cabeçalho.

## Como adicionar uma aba

1. Em `js/data.js`, acrescente um objeto a `tabs` com `id`, `label`, `icon`, `title` e `intro`. Use um `id` curto e sem espaços; ele também será o hash da aba.
2. Em `js/script.js`, crie uma função de renderização que receba o contêiner do painel e acrescente os elementos a partir dos dados. Use `textContent`/os auxiliares de criação de nós para inserir conteúdo.
3. Registre a função no objeto `renderers` usando o mesmo `id`.
4. Escolha uma chave de ícone já disponível em `makeIcon` ou acrescente um desenho SVG original nessa função.
5. Atualize os portais da página inicial se a nova área precisar de uma descrição própria. Eles são montados automaticamente a partir de `tabs`.

## Conteúdo, fotos e fontes

As cinco histórias detalhadas, os capítulos, a ficha técnica, o mapa, o glossário e as referências ficam em `js/data.js`. O banco separado do Mini game fica em `js/mini-game-data.js`. Para adicionar uma pergunta, copie um objeto e preencha `id`, `equipmentId` (um dos cinco IDs de missão), `prompt`, quatro `options`, `correctIndex` (posição de zero a três), `explanation` e `sourceIds` existentes em `js/data.js`. Mantenha três perguntas por equipamento para que o sorteio continue variado e use somente fatos já descritos nas histórias ou fichas. Os dados do LRV da Apollo 15 usam a ficha NSSDCA indicada no projeto e registros complementares da NASA. As fotos do arquivo estão em `assets/`; a foto do LRV é servida pela coleção oficial NASA Images e precisa de conexão à internet. A astronauta-guia Elaine está em `assets/elaine-astronaut-clean-v2.png`; o fundo cinematográfico da página inicial está em `assets/space-hero-cinematic.png`. As fotos de arquivo recebem crédito e link para a origem.

Ao cadastrar uma foto, informe `imageUrl`, `imageAlt`, `caption`, `credit` e `photoSourceId`. O carregador aceita arquivos locais em `assets/` e imagens HTTPS nos domínios oficiais incluídos na lista segura de `js/script.js`. Se a imagem falhar, aparece uma indicação e o link de origem continua disponível. As fotografias de arquivo mantêm seus créditos. A ilustração de Elaine não usa logotipos; o projeto não tem afiliação com a NASA.

## Verificações

Execute `node --test tests/site-smoke.test.js` para conferir a estrutura dos dados nos dois idiomas, as referências das fontes e do mapa, a presença das imagens e a geração de rodadas sem perguntas repetidas.

## Arquivos

- `index.html`: estrutura do aplicativo, cabeçalho fixo, barra de rota, menu, guia Elaine e diálogo acessível.
- `css/style.css` e `css/experience.css`: tokens, navegação responsiva, abas, cartões, mapa, Mini game, movimento da Elaine e preferências de movimento.
- `js/data.js`: texto, fatos, dados técnicos, imagens, fontes e abas.
- `js/locales.js`: conteúdo traduzido para inglês, combinado aos dados e às imagens compartilhadas.
- `js/mini-game-data.js`: banco de perguntas e explicações do Mini game.
- `js/script.js`: renderização dos painéis, navegação, foco, diálogo, armazenamento de sessão, progresso e Mini game.
- `tests/site-smoke.test.js`: verificações de integridade dos dados e das rodadas do Mini game, usando o test runner nativo do Node.js.
- `assets/`: fotografias do arquivo NASA/NSSDC, a ilustração transparente de Elaine e o fundo espacial ilustrativo.
