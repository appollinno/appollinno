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

export const nav = [
  { label: 'Home', href: '/index.html', match: ['/', '/index.html'] },
  { label: 'About', href: '/about.html' },
  { label: 'Products', href: '/products.html' },
  { label: 'Services', href: '/services.html' },
  { label: 'Quality', href: '/quality.html' },
  { label: 'Industries', href: '/industries.html' },
  { label: 'Clients', href: '/clients.html' },
  { label: 'Contact', href: '/contact.html' },
];
