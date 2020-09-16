'use strict';

const axios = require('axios').default;
const fs = require('fs');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

var packageJson = require('./package.json');

// Uso para alternar algumas configurações no programa.
const development = false;
//Em modo de desenvolvimento, o bot só irá responder mensagens do admin.
const adminNumber = '5511998223344'; // manter o formato
// Se quiser rodar no modo headless, troca para true.
const headlessON = false;

//Texto padrão do BOT
const welcomeString = `*🤖 COVID-19* - versão ${packageJson.version};

Olá, para receber os dados, envie o nome de uma cidade.

🏙️ Exemplos:
> Itabuna BA
> Curitiba
> Rio de Janeiro
> Manaus AM

ou envie o número da opção desejada:
1️⃣ - Sintomas
2️⃣ - Prevenção
3️⃣ - Transmissão
4️⃣ - Sobre o bot.`;

// Se estiver em versão de desenvolvimento, utiliza uma sessão diferente.
// Uso isso para poder testar em outro número de whatsapp em modo dev.
const SESSION_FILE_PATH = development ? './session-dev.json' : './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: { headless: headlessON },
  session: sessionCfg,
});

client.initialize();

client.on('qr', (qr) => {
  console.log('LEIA O QR CODE:', qr);
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Cliente autenticado!', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação! Motivo:', msg);
});

client.on('ready', () => {
  console.log('Cliente pronto!');
});

client.on('message', async (msg) => {
  // Condição para não responder mensagens de grupos
  if (typeof msg.author !== 'undefined') {
    return;
  }
  console.log('MESSAGE RECEIVED', msg);
  //se estiver em desenvolvimento, só aceita mensagem do Zap admin
  if (development) {
    console.log('Você está em modo desenvolvedor');
    if (!(msg.from == `${adminNumber}@c.us`)) {
      return;
    }
  }
  switch (msg.body) {
    case '1':
    case '1️⃣': // Sintomas
      msg.reply(`      *SINTOMAS*

A Doença pelo Coronavírus 2019 (Covid-19) é similar a uma “gripe”. Geralmente é uma doença leve ou moderada, mas alguns casos podem ficar graves. Os sintomas mais comuns são: febre, tosse e/ou dificuldade para respirar.

Alguns pacientes podem apresentar cansaço, dores no corpo, mal estar em geral, congestão nasal, corrimento nasal, dor de garganta ou dor no peito. Esses sintomas geralmente são leves e começam gradualmente.
            
Algumas pessoas são infectadas, mas não apresentam sintomas ou apresentam sintomas leves, quase que imperceptíveis.

A maioria das pessoas (cerca de 80%) se recupera da doença sem precisar de tratamento especial. Cerca de 1 em cada 6 pessoas que adoecem pelo COVID-19 podem apresentar a forma grave da doença.

Pessoas idosas e portadoras de certas condições crônicas como pressão alta, doenças cardiovasculares e diabetes, têm um maior risco de desenvolver a forma grave.

Pessoas com febre, tosse e dificuldade em respirar devem procurar atendimento médico imediato. Deve-se utilizar uma máscara como forma de prevenir a dispersão de gotículas respiratórias ao tossir, espirrar ou falar, combinando com a lavagem ou higienização das mãos. Após o atendimento, deve-se seguir as orientações médicas, evitando frequentar ambientes públicos ou mesmo de trabalho, buscando permanecer em casa até desaparecimento dos sintomas. Isso irá prevenir a propagação de vírus e a ocorrência de novas infecções.

Fonte: Ministério da Saúde.`);
      break;

    case '2':
    case '2️⃣': // Prevenções
      msg.reply(`      *PREVENÇÃO*

Devem ser adotadas medidas gerais de prevenção e etiqueta respiratória, tais como:
🤲 Lave regularmente e cuidadosamente as mãos com água e sabão, ou higienize-as com álcool-gel 70%. Dessa forma é possível eliminar os vírus que possam estar em suas mãos.

📏 Mantenha pelo menos 2 metros de distância entre você e qualquer pessoa que esteja tossindo ou espirrando. Dessa forma é possível diminuir o risco de respirar gotículas respiratórias que contenham vírus, se a pessoa estiver doente.

✊ Evite tocar nos olhos, nariz e boca com as mãos não lavadas. Dessa forma pode-se evitar que as mãos que estejam contaminadas possam transferir vírus para os olhos, nariz ou boca, deixando-o doente.

😷 Certifique-se de que você e as pessoas ao seu redor pratiquem uma boa etiqueta respiratória. Isso significa cobrir a boca e o nariz com o antebraço ou com um lenço descartável quando tossir ou espirrar. Em seguida, descarte o lenço usado imediatamente. Dessa forma você protege as pessoas ao seu redor contra vírus como resfriado, gripe e COVID-19.

🖼️ Manter ambientes bem ventilados e evitar o compartilhamento de objetos de uso pessoal, com talheres, pratos, copos ou garrafas. Com isso você contribui para evitar a disseminação de doenças respiratórias.

Fonte: Ministério da Saúde.`);
      break;

    case '3':
    case '3️⃣': // Transmisão
      msg.reply(`      *TRANSMISSÃO*
            
Expelidas do nariz e da boca quando uma pessoa infectada tosse, espirra ou fala, mesmo quando ela apresenta sintomas leves ou não se sentem doentes. Essas gotículas podem ficar depositadas em objetos ou superfícies por horas, e outras pessoas podem adquirir o vírus ao tocar nesses objetos ou superfícies contaminadas e depois tocar nos olhos, nariz ou boca. Também podem se infectar ao respirar diretamente gotículas respiratórias de uma pessoa infectada quando ela tosse ou espirra ou pelo contato direto como toque ou aperto de mão. Por isso é importante ficar a mais de 2 metros de distância de uma pessoa doente, e lavar as mãos com água e sabão ou álcool gel.
                
Fonte: Ministério da Saúde.`);
      break;

    case '4':
    case '4️⃣': //Sobre o app
      msg.reply(`🤖 *COVID-19* - versão ${packageJson.version}

Aplicação feita para disponibilizar dados atualizados sobre os casos da Covid-19 pelo Brasil, permitindo que qualquer pessoa consulte os dados através de um aplicativo familiar, o Whatsapp.

Os dados são atualizados de acordo as publicações das secretárias estaduais e compilação dos dados pela organização *Brasil.io*. Geralmente as atualizações são diárias.`);
      break;

    default:
      //Busca o nome da cidade na API. SE não encontrar, retorna a mensagem padrão.

      msg.body = msg.body.replace('-', ' '); //remove - da mensagem

      //Configura a API do brasil.io usando Axios
      axios
        .get('https://brasil.io/api/dataset/covid19/caso/data/', {
          timeout: 5000,
          params: {
            format: 'json',
            is_last: 'true',
            search: msg.body,
          },
          responseType: 'json',
        })
        .then((response) => {
          let city = response.data.results[0];

          //formata a data
          let updateDate = new Date(city.date);
          let updateString =
            ('0' + updateDate.getDate()).slice(-2) +
            '/' +
            ('0' + (updateDate.getMonth() + 1)).slice(-2) +
            '/' +
            updateDate.getFullYear();

          msg.reply(`*📊 Casos Covid-19*
🏙️ ${city.city}-${city.state}
🔄 Atualização: ${updateString}

👥 População: ${city.estimated_population_2019
            .toLocaleString('pt-BR')
            .replace(/,/g, '.')}
☣️ Confirmados: *${city.confirmed.toLocaleString('pt-BR').replace(/,/g, '.')}*
⚫ Óbitos: ${city.deaths.toLocaleString('pt-BR').replace(/,/g, '.')}
🔘 Taxa de óbito: ${city.death_rate
            .toLocaleString('pt-BR', {
              style: 'percent',
              maximumFractionDigits: 1,
            })
            .replace('.', ',')} 

Fonte: secretárias estaduais de saúde. Dados compilados por Brasil.io.`);
        })
        .catch((error) => {
          console.log(error);
          msg.reply(welcomeString);
        });
  }
});

client.on('change_battery', (batteryInfo) => {
  // Porcentagem da carga da bateria do dispositivo mudou.
  const { battery, plugged } = batteryInfo;
  console.log(`Batéria: ${battery}% - Carregando? ${plugged}`);
});

client.on('disconnected', (reason) => {
  console.log('Cliente foi deslogado. Motivo:', reason);
});
