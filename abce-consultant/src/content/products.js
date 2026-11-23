/**
 * Five product streams. Every subcategory item below is taken verbatim from
 * the company brief; the grouping headings are organisational only.
 * No grades, certificates, stock levels or supplier names are invented.
 */
export const categories = [
  {
    id: 'civil-structural',
    ref: '01',
    name: 'Civil & Structural Bulk Materials',
    short: 'Civil & Structural',
    image: 'cat-civil-structural',
    details: [
      { img: 'sub-steel-beams', cap: 'Structural steel sections' },
      { img: 'sub-rebar', cap: 'Reinforcing bar' },
    ],
    summary:
      'Bulk construction and structural inputs for site works, foundations, steelwork and road building — supplied to the volumes and delivery phasing a construction programme actually runs on.',
    note:
      'Bulk materials are quoted against your specification, grade and quantity schedule, with delivery phased to the construction sequence.',
    groups: [
      {
        heading: 'Structural steel',
        items: [
          'Structural steel beams',
          'Prefabricated steel profiles',
          'Pre-engineered steel frames',
          'Sandwich panels',
          'Custom-fabricated built-up sections',
        ],
      },
      {
        heading: 'Concrete & reinforcement',
        items: ['Rebar', 'Cement', 'Aggregates', 'Specialized concrete additives'],
      },
      {
        heading: 'Road & surfacing',
        items: ['Bitumen'],
      },
      {
        heading: 'Fasteners & anchoring',
        items: [
          'Bolts, nuts, washers and anchors',
          'High-tensile bolts',
          'Threaded rods',
          'Heavy-duty industrial fasteners',
        ],
      },
    ],
  },
  {
    id: 'mechanical-piping',
    ref: '02',
    name: 'Mechanical, Piping & Flow Control',
    short: 'Mechanical & Piping',
    image: 'cat-mechanical-piping',
    details: [
      { img: 'sub-valves', cap: 'Industrial valves' },
      { img: 'sub-flanges-fittings', cap: 'Flanges and fittings' },
      { img: 'sub-pumps', cap: 'Centrifugal pumps' },
    ],
    summary:
      'Pressure-containing and flow-control equipment for process, pipeline and utility systems, across carbon steel, stainless steel and exotic alloy metallurgies.',
    note:
      'Pressure-containing items are sourced against the applicable API and ASME specifications for the service, with material and test documentation supplied.',
    groups: [
      {
        heading: 'Pipe, casing & tubing',
        items: ['Line pipes', 'Casing and tubing'],
      },
      {
        heading: 'Flanges & fittings',
        items: ['Flanges and fittings'],
      },
      {
        heading: 'Materials of construction',
        items: ['Carbon steel', 'Stainless steel', 'Exotic alloys'],
      },
      {
        heading: 'Flow control',
        items: ['Industrial valves'],
      },
      {
        heading: 'Rotating equipment',
        items: ['Centrifugal and positive displacement pumps'],
      },
      {
        heading: 'Sealing & spares',
        items: ['Bearings, gaskets, seals and OEM spare parts'],
      },
    ],
  },
  {
    id: 'rigging-lifting',
    ref: '03',
    name: 'Rigging & Lifting Equipment',
    short: 'Rigging & Lifting',
    image: 'cat-rigging-lifting',
    details: [
      { img: 'sub-wire-rope', cap: 'Wire rope' },
      { img: 'sub-chain-hoist', cap: 'Chain and lever hoists' },
    ],
    summary:
      'Load-bearing rigging hardware and lifting gear for heavy lifts, shutdowns and routine materials handling — where the working load limit and its certification are the whole point.',
    note:
      'Lifting equipment is load-rated hardware. Items are sourced with the manufacturer certification applicable to the product, and we will confirm what documentation accompanies a given item before you order.',
    groups: [
      {
        heading: 'Slings',
        items: ['Wire rope slings', 'Synthetic webbing slings', 'Alloy chain slings'],
      },
      {
        heading: 'Connecting hardware',
        items: [
          'Heavy-duty shackles',
          'Turnbuckles',
          'Lifting hooks',
          'Swivels',
          'Eye bolts',
          'Sockets',
          'Master links',
        ],
      },
      {
        heading: 'Hoisting',
        items: ['Chain hoists', 'Lever hoists'],
      },
      {
        heading: 'Below-the-hook',
        items: ['Beam clamps', 'Spreader beams', 'Snatch blocks'],
      },
    ],
  },
  {
    id: 'electrical',
    ref: '04',
    name: 'Electrical Systems & Components',
    short: 'Electrical Systems',
    image: 'sub-transformer',
    details: [
      { img: 'cat-electrical', cap: 'Distribution facility' },
      { img: 'sub-hv-cable', cap: 'High-voltage transmission' },
    ],
    summary:
      'Power distribution, control and instrumentation equipment for plant and site electrical systems, including hazardous-area enclosures for classified zones.',
    note:
      'Equipment for classified areas is specified against your area classification, ingress protection and temperature class. Confirm these with us before ordering.',
    groups: [
      {
        heading: 'Power distribution',
        items: ['High-voltage cables', 'Switchgears', 'Transformers'],
      },
      {
        heading: 'Motors & lighting',
        items: ['Motors', 'Industrial lighting'],
      },
      {
        heading: 'Hazardous area',
        items: ['Explosion-proof enclosures'],
      },
      {
        heading: 'Control & instrumentation',
        items: ['Control panels', 'Process monitoring devices'],
      },
    ],
  },
  {
    id: 'tools-consumables',
    ref: '05',
    name: 'Tools, Operational Equipment & Consumables',
    short: 'Tools & Consumables',
    image: 'cat-tools-consumables',
    details: [
      { img: 'sub-welding', cap: 'Welding equipment' },
      { img: 'sub-generator', cap: 'Power generation sets' },
    ],
    summary:
      'The tooling, site equipment and recurring consumables that keep maintenance, fabrication and turnaround work moving — including HSE supplies for the crews doing it.',
    note:
      'Consumables are the items most often needed at short notice. We hold recurring consumable lines against an agreed call-off schedule where that suits your operation.',
    groups: [
      {
        heading: 'Hand & power tooling',
        items: [
          'Electric tools',
          'Pneumatic tools',
          'Hydraulic tools',
          'Torque tools',
          'Heavy-duty hand tools',
        ],
      },
      {
        heading: 'Site equipment',
        items: ['Welding machines', 'Air compressors', 'Power generators'],
      },
      {
        heading: 'Welding & abrasives',
        items: ['Welding electrodes', 'Abrasives'],
      },
      {
        heading: 'Fluids & chemicals',
        items: ['Lubricants', 'Industrial chemicals', 'Adhesives'],
      },
      {
        heading: 'Safety',
        items: ['HSE safety supplies'],
      },
    ],
  },
];

/** Options for the contact form's service-category select. */
export const categoryOptions = categories.map((c) => c.name);
