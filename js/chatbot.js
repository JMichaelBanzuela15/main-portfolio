// Portfolio-specific assistant. Visitor messages stay in the browser.
const portfolioData = {
  name: 'John Michael Banzuela',
  location: 'Pasig, Philippines',
  email: 'johnmichaelbanzuela15@gmail.com',
  phone: '0981 663 0397',
  experience: '1+ years',
  role: 'IT Technical Support Specialist',
  background: [
    'banking API operations',
    'REST API integration and troubleshooting',
    'production and UAT support',
    'Linux and Bash',
    'SQL, MySQL, and database management',
    'logs and transaction investigation',
    'Postman, callbacks, credentials, mTLS, and partner connectivity'
  ],
  skills: {
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    backend: ['Node.js', 'Python', 'PHP/Laravel'],
    database: ['SQL', 'MySQL', 'MongoDB'],
    tools: ['Git/GitHub', 'Postman', 'SQLyog', 'Figma', 'Vercel', 'InfinityFree']
  },
  projects: [
    {
      title: 'Workout Simulation for Nelstar and Adam Fitness Gym',
      description: 'A web-based fitness platform for simulating workout routines, viewing exercise techniques, and tracking virtual progress.',
      technologies: ['HTML5', 'CSS', 'JavaScript', 'PHP', 'MySQL']
    },
    {
      title: 'Sampayan Weather Checker',
      description: 'A mini project providing real-time weather updates and forecasts for a location.',
      technologies: ['HTML5', 'CSS', 'JavaScript', 'Weather API']
    },
    {
      title: 'Logs Parser',
      description: 'A personal tool for reviewing SQL logs, filtering entries, and exporting results.',
      technologies: ['HTML5', 'CSS', 'JavaScript', 'PHP', 'MySQL']
    },
    {
      title: 'Kinsenas App',
      description: 'The portfolio lists this project, but does not yet include a project description.',
      technologies: ['HTML5', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB']
    }
  ]
};

const chatToggle = document.getElementById('chatToggle');
const chatWidget = document.getElementById('chatWidget');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const typingIndicator = document.getElementById('typingIndicator');

let conversationHistory = [];
let lastAssistantIntent = null;

if (chatToggle && chatWidget && chatInput) {
  chatToggle.addEventListener('click', toggleChat);
}
if (chatClose) chatClose.addEventListener('click', closeChat);
if (chatInput) {
  chatInput.addEventListener('input', autoResizeInput);
  chatInput.addEventListener('keydown', handleEnterKey);
}
if (chatForm) chatForm.addEventListener('submit', handleSubmit);

function toggleChat() {
  chatWidget.classList.add('active');
  chatInput.focus();
}

function closeChat() {
  if (chatWidget) chatWidget.classList.remove('active');
}

function autoResizeInput() {
  chatInput.style.height = '36px';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 100)}px`;
}

function handleEnterKey(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  chatInput.value = '';
  chatInput.style.height = '36px';
  chatSend.disabled = true;
  showTyping();

  window.setTimeout(() => {
    const response = getAssistantResponse(message);
    hideTyping();
    addMessage(response.text, 'ai');
    chatSend.disabled = false;
    chatInput.focus();
  }, 180);
}

function normalizeMessage(message) {
  const replacements = {
    anu: 'ano',
    anung: 'anong',
    ung: 'yung',
    exp: 'experience',
    skillz: 'skills',
    kaba: 'ka ba',
    techstack: 'tech stack',
    'nag hahandle': 'handle',
    naghandle: 'handle',
    nagwowork: 'work',
    nagwork: 'work',
    'nag wo work': 'work',
    'nag wo-work': 'work',
    'naghahandle': 'handle',
    hndle: 'handle',
    hhandle: 'handle',
    'chinecheck': 'check',
    'chine-check': 'check',
    'san': 'where',
    'saan': 'where',
    'pano': 'how',
    'paano': 'how',
    'ginagawa': 'work',
    'ginagamit': 'use',
    'gamit': 'use',
    'mo': 'you',
    'nya': 'his',
    'ka': 'you',
    'ba': ' '
  };

  let normalized = ` ${message.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .trim()} `;

  for (const [variant, canonical] of Object.entries(replacements)) {
    const escapedVariant = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    normalized = normalized.replace(
      new RegExp(`\\b${escapedVariant}\\b`, 'g'),
      ` ${canonical} `
    );
  }

  normalized = normalized.replace(/([a-z])\1{2,}/g, '$1$1');
  const words = normalized.trim().split(/\s+/).map(correctTypo);
  return ` ${words.join(' ')} `;
}

const fuzzyTerms = [
  'about', 'experience', 'skills', 'technology', 'project', 'education',
  'contact', 'backend', 'database', 'linux', 'support', 'resume', 'career',
  'work', 'api', 'production', 'transaction', 'logs', 'troubleshoot',
  'network', 'bash', 'mysql', 'php', 'javascript', 'react', 'github',
  'company', 'bank', 'capstone', 'where', 'long', 'role', 'responsibility',
  'portfolio', 'integration'
];

function correctTypo(word) {
  const knownTypos = {
    apis: 'api',
    apii: 'api',
    backendd: 'backend',
    databse: 'database',
    experince: 'experience',
    experiance: 'experience',
    expeience: 'experience',
    tehcnology: 'technology',
    tecnology: 'technology',
    techologies: 'technology',
    skil: 'skills',
    skils: 'skills',
    porject: 'project',
    proejct: 'project',
    suport: 'support',
    suppport: 'support',
    linuxx: 'linux',
    educaton: 'education',
    contat: 'contact',
    resumee: 'resume',
    tranction: 'transaction',
    transction: 'transaction',
    troublshoot: 'troubleshoot',
    integartion: 'integration'
  };
  if (knownTypos[word]) return knownTypos[word];

  let closest = word;
  let shortestDistance = Infinity;
  for (const term of fuzzyTerms) {
    if (Math.abs(term.length - word.length) > 2) continue;
    const distance = editDistance(word, term);
    const threshold = term.length >= 8 ? 2 : term.length >= 5 ? 1 : 0;
    if (distance <= threshold && distance < shortestDistance) {
      closest = term;
      shortestDistance = distance;
    }
  }
  return closest;
}

function editDistance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1)
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function hasAny(text, terms) {
  return terms.some(term => text.includes(` ${term} `));
}

function isFilipino(text) {
  return hasAny(text, [
    'ano', 'anong', 'yung', 'ikaw', 'mo', 'sya', 'kanya', 'may', 'ba',
    'paano', 'ginagawa', 'gamit', 'saan', 'san', 'nag', 'ka', 'kaba',
    'ako', 'siya', 'nino', 'pwede', 'pwedeng', 'meron', 'wala', 'mga',
    'ung', 'experience', 'exp'
  ]);
}

function classifyIntent(message) {
  const text = normalizeMessage(message);
  const filipino = isFilipino(text);
  const has = terms => hasAny(text, terms);

  if (has(['hello', 'hi', 'hey', 'kumusta', 'kamusta']) &&
      text.trim().split(/\s+/).length <= 4) {
    return { intent: 'GREETING', text, filipino };
  }

  if (has(['weather', 'poem', 'poetry', 'love letter', 'recipe', 'joke', 'translate'])) {
    return { intent: 'OFF_TOPIC', text, filipino };
  }
  if (/^(experience|work experience|exp)$/.test(text.trim())) {
    return { intent: 'AMBIGUOUS', text, filipino };
  }

  const shortFollowUp = text.trim().split(/\s+/).length <= 8;
  if (shortFollowUp && lastAssistantIntent && has(['long', 'tagal', 'gano', 'gaano'])) {
    return { intent: 'EXPERIENCE_DURATION', text, filipino };
  }
  if (shortFollowUp && has(['which', 'one', 'alin']) &&
      has(['api', 'rest', 'postman']) && lastAssistantIntent === 'SKILLS') {
    return { intent: 'API_SKILLS_FOLLOWUP', text, filipino };
  }
  if (shortFollowUp && lastAssistantIntent &&
      has(['that', 'those', 'them', 'it', 'one', 'ones', 'alin']) &&
      ['SKILLS', 'API_EXPERIENCE', 'EXPERIENCE', 'PROJECTS'].includes(lastAssistantIntent) &&
      !has(['api', 'rest', 'postman', 'skill', 'project', 'experience', 'work', 'support', 'linux', 'database'])) {
    return { intent: `${lastAssistantIntent}_FOLLOWUP`, text, filipino };
  }

  if (has(['email', 'contact', 'phone', 'number', 'reach', 'message', 'linkedin', 'github'])) {
    return { intent: 'CONTACT', text, filipino };
  }
  if (has(['resume', 'cv', 'curriculum'])) {
    return { intent: 'RESUME', text, filipino };
  }
  if (has(['college', 'capstone']) && has(['project', 'projects', 'capstone'])) {
    return { intent: 'COLLEGE_PROJECT', text, filipino };
  }
  if (has(['project', 'projects', 'portfolio', 'sample', 'samples', 'logs parser', 'kinsenas', 'sampayan', 'workout'])) {
    return { intent: 'PROJECTS', text, filipino };
  }
  if (has(['education', 'school', 'college', 'degree', 'course', 'graduate', 'capstone'])) {
    return { intent: 'EDUCATION', text, filipino };
  }
  if (has(['salary', 'rate', 'compensation'])) {
    return { intent: 'CAREER_DETAILS_UNAVAILABLE', text, filipino };
  }
  if (has(['freelance', 'available', 'hire', 'hiring'])) {
    return { intent: 'CAREER', text, filipino };
  }
  if (has(['navigate', 'section', 'page', 'find', 'see']) &&
      has(['about', 'skills', 'projects', 'contact', 'resume'])) {
    return { intent: 'PORTFOLIO_NAVIGATION', text, filipino };
  }
  if (has(['where', 'location', 'based', 'live', 'saan']) &&
      !has(['work', 'company', 'bank', 'worked', 'nagwork'])) {
    return { intent: 'LOCATION', text, filipino };
  }
  if (has(['mtls', 'callback', 'credential', 'partner connectivity', 'api', 'rest', 'integration', 'postman'])) {
    if (has(['skill', 'skills', 'stack', 'technology', 'language']) &&
        has(['which', 'one', 'alin']) && lastAssistantIntent === 'SKILLS') {
      return { intent: 'API_SKILLS_FOLLOWUP', text, filipino };
    }
    return { intent: 'API_EXPERIENCE', text, filipino };
  }
  if (has(['vpn', 'network', 'networking'])) {
    return { intent: 'NETWORKING', text, filipino };
  }
  if (has(['mariadb'])) {
    return { intent: 'DATABASE_DETAIL_UNCONFIRMED', text, filipino };
  }
  if (has(['linux', 'bash', 'shell'])) {
    return { intent: 'LINUX', text, filipino };
  }
  if (has(['database', 'mysql', 'mongodb', 'sql', 'transaction'])) {
    return { intent: 'DATABASE', text, filipino };
  }
  if (has(['backend', 'server', 'node.js', 'nodejs', 'php', 'laravel'])) {
    return { intent: 'BACKEND', text, filipino };
  }
  if (has(['support', 'troubleshoot', 'troubleshooting', 'logs', 'uat', 'production', 'issue', 'incident'])) {
    return { intent: 'TECHNICAL_SUPPORT', text, filipino };
  }
  if (has(['company', 'employer', 'worked', 'workplace', 'nagwork', 'work'])) {
    if (has(['where', 'company', 'employer', 'saan', 'san'])) {
      return { intent: 'WORK_HISTORY', text, filipino };
    }
    if (has(['bank', 'role', 'responsibility', ' ginagawa', 'handle', 'job', 'work'])) {
      return { intent: 'EXPERIENCE', text, filipino };
    }
  }
  if (has(['skill', 'skills', 'technology', 'technologies', 'tech', 'stack', 'language', 'programming'])) {
    return { intent: 'SKILLS', text, filipino };
  }
  if (has(['experience', 'job', 'role', 'career', 'responsibility', 'responsibilities'])) {
    return { intent: 'EXPERIENCE', text, filipino };
  }
  if (has(['who', 'about', 'sino', 'pakilala', 'yourself', 'him'])) {
    return { intent: 'ABOUT', text, filipino };
  }
  if (has(['home', 'navigate', 'section', 'page', 'find'])) {
    return { intent: 'PORTFOLIO_NAVIGATION', text, filipino };
  }

  if (text.trim().split(/\s+/).length <= 3) {
    return { intent: 'AMBIGUOUS', text, filipino };
  }
  return { intent: 'OFF_TOPIC', text, filipino };
}

function getAssistantResponse(message) {
  const classification = classifyIntent(message);
  const { intent, filipino } = classification;
  const language = filipino ? 'tl' : 'en';
  const responses = {
    GREETING: {
      en: `Hi! I can help with ${portfolioData.name}'s work, technical experience, skills, projects, resume, or contact details.`,
      tl: `Hi! Matutulungan kitang alamin ang work experience, technical skills, projects, resume, o contact ni ${portfolioData.name}.`
    },
    ABOUT: {
      en: `${portfolioData.name} is an IT professional from ${portfolioData.location}, focused on technical support, banking API operations, system troubleshooting, databases, and backend development.`,
      tl: `Si ${portfolioData.name} ay IT professional mula sa ${portfolioData.location}. Nakatuon ang experience niya sa technical support, banking API operations, troubleshooting, databases, at backend development.`
    },
    EXPERIENCE: {
      en: `John works as an ${portfolioData.role}, supporting banking systems and API-related issues across UAT and production environments. His portfolio also describes work with Linux, SQL, logs, and database management.`,
      tl: `Nagtatrabaho si John bilang ${portfolioData.role}. Nagbibigay siya ng support sa banking systems at API issues sa UAT at production. Kasama rin sa portfolio ang Linux, SQL, logs, at database management.`
    },
    EXPERIENCE_DURATION: {
      en: `The portfolio lists ${portfolioData.experience} of experience. It doesn't provide exact employment dates.`,
      tl: `Nakalagay sa portfolio ang ${portfolioData.experience} na experience. Walang eksaktong employment dates na nakalista.`
    },
    WORK_HISTORY: {
      en: `The portfolio describes John's role as an ${portfolioData.role} supporting banking systems. It doesn't publish an employer or client name.`,
      tl: `Inilalarawan ng portfolio ang role ni John bilang ${portfolioData.role} na sumusuporta sa banking systems. Walang nakalistang pangalan ng employer o client.`
    },
    API_EXPERIENCE: {
      en: `John's portfolio describes banking API operations, REST API integration and troubleshooting, and API testing. It also lists work involving callbacks, credentials, mTLS, and partner connectivity; employer or client specifics aren't published.`,
      tl: `Nakasulat sa portfolio ang banking API operations, REST API integration at troubleshooting, at API testing. Nabanggit din ang callbacks, credentials, mTLS, at partner connectivity; walang inilathalang detalye ng employer o client.`
    },
    API_SKILLS_FOLLOWUP: {
      en: `For API work, the portfolio mentions REST APIs and Postman, alongside JavaScript, PHP/Laravel, and SQL. It doesn't specify which language is used for each integration.`,
      tl: `Para sa API work, binabanggit sa portfolio ang REST APIs at Postman, kasama ang JavaScript, PHP/Laravel, at SQL. Hindi tinutukoy kung aling language ang gamit sa bawat integration.`
    },
    TECHNICAL_SUPPORT: {
      en: `John's technical support background includes troubleshooting banking API and system issues, checking logs and transaction data, and supporting UAT and production environments.`,
      tl: `Kasama sa technical support ni John ang pag-troubleshoot ng banking API at system issues, pag-check ng logs at transaction data, at support sa UAT at production environments.`
    },
    SKILLS: {
      en: `The portfolio lists HTML5, CSS3, JavaScript, React, Node.js, Python, PHP/Laravel, SQL, MySQL, MongoDB, Git/GitHub, Postman, and SQLyog. It also describes experience with Linux, Bash, and API troubleshooting.`,
      tl: `Nakalista sa portfolio ang HTML5, CSS3, JavaScript, React, Node.js, Python, PHP/Laravel, SQL, MySQL, MongoDB, Git/GitHub, Postman, at SQLyog. Nabanggit din ang experience sa Linux, Bash, at API troubleshooting.`
    },
    LINUX: {
      en: `The portfolio lists Linux as part of John's technical background and also mentions Bash, logs, and system troubleshooting. It doesn't describe a specific Linux administration project.`,
      tl: `Nakalista sa portfolio ang Linux sa technical background ni John, pati Bash, logs, at system troubleshooting. Wala itong inilalarawang partikular na Linux administration project.`
    },
    DATABASE: {
      en: `The portfolio lists SQL, MySQL, and MongoDB, and describes database management and transaction investigation as part of John's IT background.`,
      tl: `Nakalista sa portfolio ang SQL, MySQL, at MongoDB. Binabanggit din ang database management at transaction investigation sa IT background ni John.`
    },
    BACKEND: {
      en: `John lists Node.js, Python, and PHP/Laravel among his backend technologies. His portfolio also describes backend troubleshooting, API operations, and database work.`,
      tl: `Nakalista kay John ang Node.js, Python, at PHP/Laravel para sa backend. Nabanggit din sa portfolio ang backend troubleshooting, API operations, at database work.`
    },
    PROJECTS: {
      en: `Featured projects are the Workout Simulation for Nelstar and Adam Fitness Gym, Sampayan Weather Checker, Logs Parser, and Kinsenas App. The portfolio shows each project's technologies; Kinsenas doesn't have a description yet.`,
      tl: `Featured projects ang Workout Simulation for Nelstar and Adam Fitness Gym, Sampayan Weather Checker, Logs Parser, at Kinsenas App. Nakalista sa portfolio ang technologies ng mga ito; wala pang description ang Kinsenas.`
    },
    EDUCATION: {
      en: `The portfolio text available here doesn't include education details or identify a capstone project. You can open the resume using the Preview Resume button for more information.`,
      tl: `Walang education details o kumpirmasyon kung alin ang capstone sa portfolio text na available dito. Puwedeng buksan ang resume gamit ang Preview Resume button.`
    },
    CAREER: {
      en: `The Contact section says John is available for freelance work. The portfolio doesn't list specific availability dates or engagement terms.`,
      tl: `Nakalagay sa Contact section na available si John para sa freelance work. Walang nakalistang petsa ng availability o engagement terms.`
    },
    CAREER_DETAILS_UNAVAILABLE: {
      en: `The portfolio doesn't list salary expectations or rates. You can contact John directly using the details in the Contact section.`,
      tl: `Walang nakalistang salary expectations o rates sa portfolio. Puwede mong direktang kontakin si John gamit ang details sa Contact section.`
    },
    COLLEGE_PROJECT: {
      en: `The portfolio lists the Workout Simulation for Nelstar and Adam Fitness Gym, built with HTML5, CSS, JavaScript, PHP, and MySQL. It doesn't identify this as a college capstone, so I can't confirm whether that's the project you mean.`,
      tl: `Nakalista sa portfolio ang Workout Simulation for Nelstar and Adam Fitness Gym, gamit ang HTML5, CSS, JavaScript, PHP, at MySQL. Hindi ito minarkahang college capstone, kaya hindi ko makukumpirma kung ito ang tinutukoy mo.`
    },
    NETWORKING: {
      en: `The portfolio mentions partner connectivity in the context of API operations, but doesn't give specific VPN or network administration details.`,
      tl: `Binabanggit sa portfolio ang partner connectivity kaugnay ng API operations, pero walang partikular na detalye tungkol sa VPN o network administration.`
    },
    DATABASE_DETAIL_UNCONFIRMED: {
      en: `The portfolio lists SQL and MySQL, but doesn't specifically mention MariaDB, so I can't confirm experience with it.`,
      tl: `Nakalista sa portfolio ang SQL at MySQL, pero hindi partikular na binabanggit ang MariaDB, kaya hindi ko makukumpirma ang experience dito.`
    },
    RESUME: {
      en: `You can preview or download John's resume using the Preview Resume button near the top of the page.`,
      tl: `Puwede mong i-preview o i-download ang resume ni John gamit ang Preview Resume button sa itaas ng page.`
    },
    CONTACT: {
      en: `You can contact John at ${portfolioData.email} or ${portfolioData.phone}. He's based in ${portfolioData.location}; his LinkedIn and GitHub links are in the Contact section.`,
      tl: `Makokontak si John sa ${portfolioData.email} o ${portfolioData.phone}. Nasa ${portfolioData.location} siya; nasa Contact section ang LinkedIn at GitHub niya.`
    },
    LOCATION: {
      en: `John is based in ${portfolioData.location}.`,
      tl: `Nasa ${portfolioData.location} si John.`
    },
    PORTFOLIO_NAVIGATION: {
      en: `Use the navigation at the top to explore About, Skills, Projects, and Contact. The resume preview is available from the button near the top of the page.`,
      tl: `Gamitin ang navigation sa itaas para makita ang About, Skills, Projects, at Contact. Nasa button malapit sa itaas ang resume preview.`
    },
    OFF_TOPIC: {
      en: `I'm focused on John's portfolio, experience, skills, and projects. You can ask me about his API work, technical support, or technologies.`,
      tl: `Nakatuon ako sa portfolio, experience, skills, at projects ni John. Puwede mong itanong ang tungkol sa API work, technical support, o technologies niya.`
    }
  };

  let responseIntent = intent;
  if (intent.endsWith('_FOLLOWUP') && intent !== 'API_SKILLS_FOLLOWUP') {
    responseIntent = intent.replace('_FOLLOWUP', '');
  }

  if (intent === 'AMBIGUOUS') {
    return {
      intent,
      text: filipino
        ? 'Aling topic ang ibig mong sabihin—work experience, API experience, o development skills?'
        : 'Which topic do you mean: work experience, API experience, or development skills?'
    };
  }

  if (responses[responseIntent]) {
    if (!['GREETING', 'OFF_TOPIC'].includes(responseIntent)) {
      lastAssistantIntent = responseIntent;
    }
    return { intent, text: responses[responseIntent][language] };
  }

  return { intent: 'OFF_TOPIC', text: responses.OFF_TOPIC[language] };
}

function addMessage(text, type) {
  if (!chatMessages) return;
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type === 'user' ? 'user-message' : type === 'error' ? 'error-message' : 'ai-message'}`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  conversationHistory.push({ type, text, timestamp: Date.now() });
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-20);
  }
}

function showTyping() {
  if (typingIndicator) typingIndicator.style.display = 'block';
  if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  if (typingIndicator) typingIndicator.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  window.setTimeout(() => {
    if (chatMessages && chatMessages.children.length <= 1) {
      addMessage(
        "Ask me about John's API and technical support experience, skills, projects, or resume.",
        'ai'
      );
    }
  }, 1000);
});
