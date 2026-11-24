/**
 * ABCE Consultant LDA - single source of truth for company facts.
 *
 * Every value here is taken from the company brief / corporate presentation.
 * Nothing in this file may be invented: no certifications, awards, partnerships,
 * facilities, headcounts or statistics that were not supplied by the company.
 */
export const site = {
  name: 'ABCE Consultant LDA',
  shortName: 'ABCE Consultant',
  legalName: 'ABCE Consultant LDA',
  positioning:
    'Comprehensive Procurement and Logistics Solutions for High-Criticality Industries',
  tagline:
    'Delivering Certified Quality, Operational Excellence, and Reliable Supply Chain Support Across Energy, Mining, and Industrial Sectors',
  // Change this to the production origin before deploying.
  url: 'https://www.abceconsu.com',
  locale: 'en',
  address: {
    street: 'Rua Alberto Cassimo, N.º 60, COOP',
    city: 'Maputo City',
    country: 'Mozambique',
    full: 'Rua Alberto Cassimo, N.º 60, COOP, Maputo City, Mozambique',
  },
  email: 'General@abceconsu.com',
  phones: [
    { display: '+258 84 239 5576', href: '+258842395576' },
    { display: '+258 85 699 2494', href: '+258856992494' },
  ],
  vision:
    'Become the most trusted logistics and procurement partner locally and globally for energy and mining industries.',
  mission:
    'Deliver precision-engineered components, bulk materials, and expert logistics through rigorous quality control and on-time delivery.',
  values: [
    'Excellence in Execution',
    'Uncompromising Quality Assurance',
    'Safety',
    'Operational Excellence',
  ],
};

/**
 * Locales. English is served at the root, Portuguese under /pt/ — separate
 * URLs per language rather than a client-side swap, so each version can be
 * crawled, linked and shared independently.
 */
export const locales = {
  en: { code: 'en', htmlLang: 'en', base: '', label: 'English', other: 'pt' },
  pt: { code: 'pt', htmlLang: 'pt-MZ', base: '/pt', label: 'Português', other: 'en' },
};

/** Company facts that differ by language. Contact details never do. */
export const localised = {
  en: {
    address: { city: 'Maputo City', country: 'Mozambique', full: 'Rua Alberto Cassimo, N.º 60, COOP, Maputo City, Mozambique' },
    positioning: 'Comprehensive Procurement and Logistics Solutions for High-Criticality Industries',
    tagline:
      'Delivering Certified Quality, Operational Excellence, and Reliable Supply Chain Support Across Energy, Mining, and Industrial Sectors',
    vision:
      'Become the most trusted logistics and procurement partner locally and globally for energy and mining industries.',
    mission:
      'Deliver precision-engineered components, bulk materials, and expert logistics through rigorous quality control and on-time delivery.',
    values: [
      'Excellence in Execution',
      'Uncompromising Quality Assurance',
      'Safety',
      'Operational Excellence',
    ],
  },
  pt: {
    // The street line is a physical address and stays verbatim; the city and
    // country are read as words and belong in the reader's language.
    address: { city: 'Maputo', country: 'Moçambique', full: 'Rua Alberto Cassimo, N.º 60, COOP, Maputo, Moçambique' },
    positioning: 'Soluções Integradas de Aprovisionamento e Logística para Indústrias de Alta Criticidade',
    tagline:
      'Qualidade Certificada, Excelência Operacional e Apoio Fiável à Cadeia de Abastecimento nos Sectores de Energia, Mineração e Indústria',
    vision:
      'Tornar-nos o parceiro de logística e aprovisionamento mais fiável, local e globalmente, para as indústrias de energia e mineração.',
    mission:
      'Fornecer componentes de engenharia de precisão, materiais a granel e logística especializada, através de um controlo de qualidade rigoroso e entregas dentro do prazo.',
    values: [
      'Excelência na Execução',
      'Garantia de Qualidade Inflexível',
      'Segurança',
      'Excelência Operacional',
    ],
  },
};

/** Navigation. `href` is locale-relative; the build prefixes it. */
export const nav = [
  { key: 'home', href: '/index.html', match: ['/', '/index.html'], label: { en: 'Home', pt: 'Início' } },
  { key: 'about', href: '/about.html', label: { en: 'About', pt: 'Empresa' } },
  { key: 'products', href: '/products.html', label: { en: 'Products', pt: 'Produtos' } },
  { key: 'services', href: '/services.html', label: { en: 'Services', pt: 'Serviços' } },
  { key: 'quality', href: '/quality.html', label: { en: 'Quality', pt: 'Qualidade' } },
  { key: 'industries', href: '/industries.html', label: { en: 'Industries', pt: 'Sectores' } },
  { key: 'clients', href: '/clients.html', label: { en: 'Clients', pt: 'Clientes' } },
  { key: 'contact', href: '/contact.html', label: { en: 'Contact', pt: 'Contacto' } },
];
