/** Six sectors from the brief, each with the procurement reality of that sector. */
export const industries = [
  {
    id: 'energy',
    name: 'Energy',
    image: 'ind-energy',
    icon: 'zap',
    summary:
      'Generation and transmission assets where an outage has a cost per hour, and where electrical equipment must match the installed system rather than merely resemble it.',
    capabilities: [
      'Switchgear, transformers and high-voltage cable supply',
      'Motors, control panels and process monitoring devices',
      'Critical spares held against planned outage dates',
      'Expedited sourcing for unplanned outages',
    ],
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    image: 'ind-oil-gas',
    icon: 'flame',
    summary:
      'Upstream, midstream and downstream work where pressure-containing items are code-governed and the documentation is part of the product.',
    capabilities: [
      'Line pipe, casing, tubing, flanges and fittings',
      'Valves and wellhead equipment to API specifications',
      'Hazardous-area electrical equipment for classified zones',
      'Material and test documentation collected with the goods',
    ],
  },
  {
    id: 'mining',
    name: 'Mining',
    image: 'ind-mining',
    icon: 'mountain',
    summary:
      'Remote operations where the hard part is not finding the part but landing it on site, through a port and a border, before the plant is waiting on it.',
    capabilities: [
      'Rigging, lifting and materials handling equipment',
      'Bulk structural materials and wear consumables',
      'Inland transport to remote sites after clearance',
      'Consignment holding close to the operation',
    ],
  },
  {
    id: 'processing',
    name: 'Processing',
    image: 'ind-processing',
    icon: 'factory',
    summary:
      'Continuous process plant where metallurgy has to suit the medium, and a wrong material choice is a corrosion failure some months later.',
    capabilities: [
      'Carbon steel, stainless steel and exotic alloy supply',
      'Pumps, valves and flow-control equipment',
      'Gaskets, seals, bearings and OEM spare parts',
      'Specification clarification before order placement',
    ],
  },
  {
    id: 'industrial',
    name: 'Industrial Operations',
    image: 'ind-industrial',
    icon: 'cog',
    summary:
      'Manufacturing and heavy industry, where maintenance runs on recurring consumables and the cost of stocking out is a stopped line.',
    capabilities: [
      'Electric, pneumatic, hydraulic and torque tooling',
      'Welding machines, compressors and power generators',
      'Call-off schedules for recurring consumable lines',
      'Inventory management against reorder levels',
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    image: 'ind-construction',
    icon: 'hard-hat',
    summary:
      'Projects where material has to arrive in the right sequence and the right quantity, phased to the programme rather than delivered all at once.',
    capabilities: [
      'Structural steel, rebar, cement and aggregates',
      'Bitumen, concrete additives and prefabricated profiles',
      'Bolts, nuts, washers and anchoring systems',
      'Phased delivery against the construction sequence',
    ],
  },
];
