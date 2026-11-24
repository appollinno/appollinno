/**
 * Standards referenced in the company brief.
 *
 * IMPORTANT — accuracy constraint for this file:
 * These are the standards ABCE Consultant LDA works to and sources products
 * against. Nothing here asserts that ABCE itself holds a certification to any
 * of them. That distinction is stated explicitly on the Quality page and must
 * not be softened or removed.
 */
export const families = [
  {
    id: 'api',
    body: 'API',
    name: 'American Petroleum Institute',
    image: 'qual-standards',
    coverage: 'Oilfield equipment standards',
    outputs: 'Line pipes, casing, tubing, drilling equipment',
    intro:
      'Applied to oilfield and pipeline equipment, where the specification governs manufacture, pressure rating and testing of the item itself.',
    entries: [
      {
        code: 'API Spec 5L',
        scope: 'Line pipe for pipeline transportation systems in the petroleum and natural gas industries.',
      },
      {
        code: 'API Spec 6A',
        scope: 'Wellhead and christmas tree equipment for drilling and production service.',
      },
      {
        code: 'API Spec 6D',
        scope: 'Pipeline and piping valves, including their design, manufacture and testing.',
      },
      {
        code: 'Drilling equipment',
        scope: 'Drilling equipment sourced under the applicable API specifications.',
      },
    ],
  },
  {
    id: 'asme',
    body: 'ASME',
    name: 'American Society of Mechanical Engineers',
    image: 'qual-inspection',
    coverage: 'Pressure equipment and piping codes',
    outputs: 'Pressure vessels, boilers, piping components, flanges',
    intro:
      'Applied to pressure-containing equipment and the piping systems around it, where design, materials and inspection are code-governed.',
    entries: [
      { code: 'Pressure equipment', scope: 'Pressure vessels and pressure-containing equipment supplied to ASME requirements.' },
      { code: 'Boilers', scope: 'Boiler equipment and its associated pressure parts.' },
      { code: 'Piping components', scope: 'Piping components for process and utility systems.' },
      { code: 'Flanges', scope: 'Flanges, dimensional standards and pressure classes.' },
    ],
  },
  {
    id: 'iso',
    body: 'ISO',
    name: 'International Organization for Standardization',
    image: 'about-facility',
    coverage: 'Management systems',
    outputs: 'ISO 9001, ISO 14001, ISO 45001 alignment',
    intro:
      'Management system standards that shape how the procurement, quality, environmental and safety sides of the operation are run. The company describes its position here as alignment.',
    entries: [
      { code: 'ISO 9001', scope: 'Quality management systems.' },
      { code: 'ISO 14001', scope: 'Environmental management systems.' },
      { code: 'ISO 45001', scope: 'Occupational health and safety management systems.' },
    ],
  },
  {
    id: 'astm-en',
    body: 'ASTM & EN',
    name: 'ASTM International & European Standards',
    image: 'cat-civil-structural',
    coverage: 'Civil and structural materials',
    outputs: 'Rebar, structural steel shapes, fasteners',
    intro:
      'Material standards for the civil, structural and fastener supply, where grade and mechanical properties determine whether the material is fit for the structure.',
    entries: [
      { code: 'Civil and structural materials', scope: 'Material standards for civil and structural supply.' },
      { code: 'Rebar', scope: 'Reinforcing bar grades and mechanical properties.' },
      { code: 'Structural steel', scope: 'Structural steel grades and standard shapes.' },
      { code: 'Industrial fasteners', scope: 'Bolting, nuts, washers and anchor specifications.' },
    ],
  },
];
