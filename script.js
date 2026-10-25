// Textos em português e inglês. A chave de cada texto fica no data-i18n do elemento.
const TRANSLATIONS = {
  pt: {
    doc_title: 'Isa | Artista 3D',
    doc_desc: 'Portfólio de modelagem 3D da Isa: UGC de todo tipo para Roblox.',
    aria_sections: 'Seções',
    aria_backpack: 'Mochila de ursinho girando',
    aria_tiara: 'Tiara de corações girando',
    aria_cat: 'Porta-photocard de gatinho girando',
    aria_heart: 'Porta-photocard de coração girando',
    nav_work: 'Trabalhos',
    nav_about: 'Sobre',
    nav_contact: 'Contato',
    side_left: 'Todo tipo<br>de UGC<br>pronto para<br>o catálogo',
    side_right: 'Aberta a<br>encomendas',
    hero_script: 'artista 3D',
    hero_line: 'UGC para Roblox',
    sec_work: 'Trabalhos',
    item_backpack: 'Mochila de Ursinho',
    item_tiara: 'Tiara de Corações',
    item_cat: 'Porta-Photocard Gatinho',
    item_heart: 'Porta-Photocard Coração',
    type_back: 'Acessório de costas',
    type_head: 'Acessório de cabeça',
    type_waist: 'Acessório de cintura',
    sec_about: 'Sobre',
    about_1: 'Oi, eu sou a Isa. Faço qualquer tipo de UGC para Roblox: acessórios, roupas, cabelos e o que mais o avatar precisar.',
    about_2: 'Cada peça sai com textura pronta e no tamanho certo para usar no jogo.',
    sec_contact: 'Vamos criar juntos?',
    contact_text: 'Me chama para encomendas ou para conversar sobre uma ideia.',
  },
  en: {
    doc_title: 'Isa | 3D Artist',
    doc_desc: "Isa's 3D modeling portfolio: every kind of UGC for Roblox.",
    aria_sections: 'Sections',
    aria_backpack: 'Teddy bear backpack spinning',
    aria_tiara: 'Heart tiara spinning',
    aria_cat: 'Kitty photocard holder spinning',
    aria_heart: 'Heart photocard holder spinning',
    nav_work: 'Work',
    nav_about: 'About',
    nav_contact: 'Contact',
    side_left: 'Every kind<br>of UGC<br>ready for<br>the catalog',
    side_right: 'Open for<br>commissions',
    hero_script: '3D artist',
    hero_line: 'UGC for Roblox',
    sec_work: 'Work',
    item_backpack: 'Teddy Bear Backpack',
    item_tiara: 'Heart Tiara',
    item_cat: 'Kitty Photocard Holder',
    item_heart: 'Heart Photocard Holder',
    type_back: 'Back accessory',
    type_head: 'Head accessory',
    type_waist: 'Waist accessory',
    sec_about: 'About',
    about_1: "Hi, I'm Isa. I make any kind of UGC for Roblox: accessories, clothing, hair and whatever else the avatar needs.",
    about_2: 'Every piece comes textured and sized right for use in game.',
    sec_contact: "Let's create together?",
    contact_text: 'Reach out for commissions or to talk about an idea.',
  },
};

// Idioma padrão pelo navegador: português só para quem fala português, inglês para o resto.
// Escolha manual (localStorage) sempre tem prioridade.
function detectLanguage() {
  const saved = localStorage.getItem('lang');
  if (saved === 'pt' || saved === 'en') return saved;

  const tags = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || 'en'];

  return tags.some(tag => String(tag).toLowerCase().startsWith('pt')) ? 'pt' : 'en';
}

let currentLang = detectLanguage();

function applyLanguage(lang, persist = true) {
  currentLang = lang;
  if (persist) localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  const dict = TRANSLATIONS[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // Textos com quebra de linha própria (as notas laterais da abertura). São strings fixas deste arquivo.
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  if (dict.doc_title) document.title = dict.doc_title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.doc_desc) metaDesc.setAttribute('content', dict.doc_desc);

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key]) el.setAttribute('aria-label', dict[key]);
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Céu: pontinhos de estrela que piscam devagar, desenhados num canvas fixo atrás de tudo.
function ceuEstrelado() {
  const canvas = document.querySelector('.ceu');
  const ctx = canvas.getContext('2d');
  const parado = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let estrelas = [];

  function montar() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const quantas = Math.round(innerWidth * innerHeight / 7000);
    estrelas = Array.from({ length: quantas }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() < 0.08 ? 1.1 + Math.random() * 0.6 : 0.35 + Math.random() * 0.6,
      a: 0.25 + Math.random() * 0.6,
      fase: Math.random() * Math.PI * 2,
      ritmo: 0.4 + Math.random() * 1.2,
    }));
  }

  // Nenhuma estrela pisca em cima das notas laterais da abertura.
  const notas = document.querySelectorAll('.lateral');
  const MARGEM = 10;

  function emCimaDeNota(e, caixas) {
    return caixas.some(c => e.x > c.left - MARGEM && e.x < c.right + MARGEM && e.y > c.top - MARGEM && e.y < c.bottom + MARGEM);
  }

  function desenhar(tempo) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const s = tempo / 1000;
    const caixas = [...notas].map(n => n.getBoundingClientRect()).filter(c => c.width);
    for (const e of estrelas) {
      if (emCimaDeNota(e, caixas)) continue;
      const brilho = parado ? e.a : e.a * (0.65 + 0.35 * Math.sin(s * e.ritmo + e.fase));
      ctx.globalAlpha = brilho;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!parado) requestAnimationFrame(desenhar);
  }

  montar();
  addEventListener('resize', montar);
  requestAnimationFrame(desenhar);
}

// Os vídeos só tocam enquanto aparecem na tela.
function videosNaTela() {
  const observador = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      const video = entrada.target;
      if (entrada.isIntersecting) {
        video.play().catch(() => { /* navegador bloqueou: fica o pôster */ });
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.25 });
  document.querySelectorAll('.peca video').forEach(v => observador.observe(v));
}

function revelarAoRolar() {
  const alvos = document.querySelectorAll('.cabeca, .peca, .medalha, .sobre-texto, .contato-texto, .contato-links');
  alvos.forEach(el => el.classList.add('revelar'));
  const observador = new IntersectionObserver(entradas => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  }, { threshold: 0.15 });
  alvos.forEach(el => observador.observe(el));
}

function topoAoRolar() {
  const topo = document.querySelector('.topo');
  const atualizar = () => topo.classList.toggle('solido', scrollY > 24);
  addEventListener('scroll', atualizar, { passive: true });
  atualizar();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  // Na primeira visita não grava nada: o idioma segue o navegador até o visitante escolher.
  applyLanguage(currentLang, localStorage.getItem('lang') !== null);
  ceuEstrelado();
  videosNaTela();
  revelarAoRolar();
  topoAoRolar();
});
