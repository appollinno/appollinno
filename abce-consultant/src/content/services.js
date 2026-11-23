/** Ten services and the six-step procurement workflow, as given in the brief. */
export const services = [
  {
    id: 'end-to-end-procurement',
    ref: '01',
    name: 'End-to-End Procurement',
    icon: 'clipboard-list',
    summary:
      'We take a requisition from specification through to delivered goods: clarifying the technical requirement, sourcing it, controlling its quality and moving it to site as one accountable scope.',
    points: [
      'Technical and commercial clarification of the requisition',
      'Supplier identification, enquiry and bid comparison',
      'Purchase order placement and expediting',
      'Single point of accountability through to delivery',
    ],
  },
  {
    id: 'certified-product-sourcing',
    ref: '02',
    name: 'Certified Product Sourcing',
    icon: 'badge-check',
    summary:
      'Equipment and materials sourced against the standard your application requires, with the material and conformity documentation that makes the item usable in a regulated system.',
    points: [
      'Sourcing against API, ASME, ISO, ASTM and EN specifications',
      'Material certificates and test documentation collected with the goods',
      'Traceability from supplier to delivered item',
      'Clarification of grade, rating and service conditions before order',
    ],
  },
  {
    id: 'quality-inspection',
    ref: '03',
    name: 'Quality Inspection',
    icon: 'search-check',
    summary:
      'Goods are checked against the purchase order and the specification before they are accepted — not after they have arrived at a remote site and stopped your work.',
    points: [
      'Verification against purchase order and datasheet',
      'Dimensional, marking and documentation checks',
      'Non-conformance raised and resolved with the supplier',
      'Inspection records issued with the consignment',
    ],
  },
  {
    id: 'global-freight-forwarding',
    ref: '04',
    name: 'Global Freight Forwarding',
    icon: 'ship',
    summary:
      'Sea, air and road movements arranged for the cargo you actually have, including oversized and heavy-lift items that will not travel in a standard container.',
    points: [
      'Sea, air and road freight arrangement',
      'Break-bulk, out-of-gauge, oversized and heavy-lift cargo',
      'Hot-shot deliveries when the timeline is critical',
      'Consolidation of multi-supplier orders into single shipments',
      'Routing and mode chosen against your required-on-site date',
      'Reliable access to remote and high-security destinations',
    ],
  },
  {
    id: 'customs-clearance',
    ref: '05',
    name: 'Customs Clearance',
    icon: 'stamp',
    summary:
      'Clearance handled as part of the delivery, so a consignment does not sit at the border while a classification question is resolved by someone who has never seen the goods.',
    points: [
      'Tariff classification and duty assessment',
      'Submission and follow-through of clearance entries',
      'Port, terminal and inspection coordination',
      'Release and onward transport to site',
    ],
  },
  {
    id: 'documentation',
    ref: '06',
    name: 'Import/Export Documentation',
    icon: 'file-text',
    summary:
      'The document set that moves with the cargo, prepared and checked for consistency — because a mismatch between an invoice and a packing list is a delay, not a clerical detail.',
    points: [
      'Commercial invoices, packing lists and certificates of origin',
      'Bills of lading and airway bills',
      'Document consistency checks before despatch',
      'Complete document pack issued to the consignee',
    ],
  },
  {
    id: 'warehousing',
    ref: '07',
    name: 'Warehousing',
    icon: 'warehouse',
    summary:
      'Storage and handling between arrival and the moment the material is needed, with goods received, recorded and protected to suit what they are.',
    points: [
      'Receipt, inspection and put-away',
      'Condition-appropriate storage and preservation',
      'Order picking and staging for site despatch',
      'Stock records reconciled to physical holdings',
    ],
  },
  {
    id: 'inventory-management',
    ref: '08',
    name: 'Inventory Management',
    icon: 'boxes',
    summary:
      'Visibility and control of what you hold, so critical spares are available when a machine stops and capital is not tied up in material nobody will call off.',
    points: [
      'Stock holding against agreed minimum and reorder levels',
      'Call-off schedules for recurring consumables',
      'Reporting on holdings, movements and consumption',
      'Critical spares identified and held ahead of demand',
    ],
  },
  {
    id: 'critical-delivery',
    ref: '09',
    name: 'Critical Delivery Coordination',
    icon: 'route',
    summary:
      'When a date cannot move, the movement is planned backwards from it and actively driven — supplier readiness, transport, clearance and the final leg to site, managed together.',
    points: [
      'Delivery planned backwards from the required-on-site date',
      'Supplier readiness and despatch expediting',
      'Active tracking with exception escalation',
      'Final-leg coordination to remote and restricted sites',
    ],
  },
  {
    id: 'emergency-support',
    ref: '10',
    name: '24/7 Emergency Support',
    icon: 'phone-call',
    summary:
      'Breakdowns do not wait for office hours. Urgent requirements are taken, sourced and moved outside normal working time when production or safety depends on it.',
    points: [
      'Dedicated account manager available around the clock',
      'Out-of-hours contact for urgent requirements',
      'Emergency sourcing and expedited despatch for breakdowns and shutdowns',
      'Fastest viable routing to site',
      'Escalation path through to resolution',
    ],
  },
];

/** The six-step procurement workflow — a genuine sequence. */
export const workflow = [
  {
    title: 'Define requirements and compliance needs',
    body:
      'We establish exactly what the item must do and which standard governs it — grade, rating, service conditions, area classification and the documentation the receiving system requires.',
  },
  {
    title: 'Source through vetted suppliers',
    body:
      'Enquiries go to suppliers assessed for the product in question, and bids are compared on specification compliance and lead time as well as price.',
  },
  {
    title: 'Perform quality assurance',
    body:
      'Material and conformity documentation is collected and checked against the specification before the goods are accepted, so non-conformances surface at the supplier, not on site.',
  },
  {
    title: 'Conduct pre-dispatch inspection',
    body:
      'The consignment is verified against the purchase order and datasheet, with dimensional, marking, quantity and packing checks recorded before it leaves.',
  },
  {
    title: 'Coordinate logistics and customs',
    body:
      'Freight, documentation and clearance are arranged as one chain, with routing chosen against your required-on-site date rather than default transit times.',
  },
  {
    title: 'Support fulfillment and inventory management',
    body:
      'Goods are received, recorded and held or issued to site, with stock records reconciled and recurring lines held against an agreed call-off schedule.',
  },
];
