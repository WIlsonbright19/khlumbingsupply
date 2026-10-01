import heroImg from "../assets/images/hero_supply_counter_1790876770625.jpg";
import hardToFindImg from "../assets/images/hard_to_find_fittings_1790876783216.jpg";
import fittingsImg from "../assets/images/strip_pipe_fittings_1790876794663.jpg";
import fixturesImg from "../assets/images/strip_commercial_fixtures_1790876804662.jpg";
import repairPartsImg from "../assets/images/strip_repair_parts_1790876815014.jpg";
import shelvingAisleImg from "../assets/images/counter_shelving_aisle_1790879759153.jpg";
import brassValvesImg from "../assets/images/brass_valves_detail_1790879772273.jpg";
import copperPressImg from "../assets/images/copper_press_fittings_1790879787810.jpg";
import castIronImg from "../assets/images/cast_iron_couplings_1790879799471.jpg";
import galleryCounterInteractionImg from "../assets/images/gallery_counter_interaction_1790881524864.jpg";
import galleryShelfBinsVerticalImg from "../assets/images/gallery_shelf_bins_vertical_1790881536545.jpg";
import galleryCounterConsultationImg from "../assets/images/gallery_counter_consultation_portrait_1790881547245.jpg";
import galleryPipeRacksSquareImg from "../assets/images/gallery_pipe_racks_square_1790881557289.jpg";

export const BUSINESS_INFO = {
  name: "K H Plumbing Supply Inc.",
  shortName: "K H Plumbing Supply",
  category: "Plumbing Supply Store",
  addressLine1: "2272 Shafter Ave",
  addressLine2: "San Francisco, CA 94124",
  fullAddress: "2272 Shafter Ave, San Francisco, CA 94124",
  neighborhood: "Bayview Industrial Corridor · San Francisco",
  phoneDisplay: "(415) 970-9718",
  phoneHref: "tel:4159709718",
  emailDisplay: "info@khplumbingsupply.com",
  emailHref: "mailto:info@khplumbingsupply.com?subject=Plumbing%20Part%20Inquiry%20-%20K%20H%20Plumbing%20Supply",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=K+H+Plumbing+Supply+Inc+2272+Shafter+Ave+San+Francisco+CA+94124",
  directionsHref:
    "https://www.google.com/maps/dir/?api=1&destination=2272+Shafter+Ave,+San+Francisco,+CA+94124",
  foundedYear: "2006",
};

export const IMAGES = {
  hero: heroImg,
  hardToFind: hardToFindImg,
  fittings: fittingsImg,
  fixtures: fixturesImg,
  repairParts: repairPartsImg,
  shelvingAisle: shelvingAisleImg,
  brassValves: brassValvesImg,
  copperPress: copperPressImg,
  castIron: castIronImg,
  galleryCounterInteraction: galleryCounterInteractionImg,
  galleryShelfBinsVertical: galleryShelfBinsVerticalImg,
  galleryCounterConsultation: galleryCounterConsultationImg,
  galleryPipeRacksSquare: galleryPipeRacksSquareImg,
};

export interface GalleryItem {
  id: string;
  index: string;
  title: string;
  caption: string;
  category: "Counter" | "Interior" | "Parts";
  aspectClass: string;
  image: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-counter-match",
    index: "01",
    title: "Counter Part Matching",
    caption: "Comparing old valve assemblies side-by-side at the counter.",
    category: "Counter",
    aspectClass: "aspect-4/3",
    image: IMAGES.galleryCounterInteraction,
  },
  {
    id: "gal-shelf-bins",
    index: "02",
    title: "Sorted Fitting Bins",
    caption: "Steel compartments stocked with brass bushings, elbows, and stops.",
    category: "Parts",
    aspectClass: "aspect-3/4",
    image: IMAGES.galleryShelfBinsVertical,
  },
  {
    id: "gal-caliper-check",
    index: "03",
    title: "Precision Stem Verification",
    caption: "Measuring thread pitch and stem length for exact replacement.",
    category: "Counter",
    aspectClass: "aspect-3/4",
    image: IMAGES.galleryCounterConsultation,
  },
  {
    id: "gal-warehouse-aisle",
    index: "04",
    title: "Supply House Aisle",
    caption: "Floor-to-ceiling shelving organized for fast trade pickup.",
    category: "Interior",
    aspectClass: "aspect-16/9",
    image: IMAGES.shelvingAisle,
  },
  {
    id: "gal-pipe-racks",
    index: "05",
    title: "Pipe & Conduit Racks",
    caption: "Copper tubing, cast iron soil pipe, and commercial valve stock.",
    category: "Interior",
    aspectClass: "aspect-square",
    image: IMAGES.galleryPipeRacksSquare,
  },
  {
    id: "gal-copper-bins",
    index: "06",
    title: "Copper & Brass Compartments",
    caption: "Sweat, press, and threaded connections sorted by nominal size.",
    category: "Parts",
    aspectClass: "aspect-4/3",
    image: IMAGES.fittings,
  },
];

export interface MaterialShowcaseItem {
  index: string;
  title: string;
  shortSpec: string;
  image: string;
}

export const MATERIALS_SHOWCASE: MaterialShowcaseItem[] = [
  {
    index: "01",
    title: "Copper",
    shortSpec: "Type L/M · Sweat & Press",
    image: IMAGES.copperPress,
  },
  {
    index: "02",
    title: "Cast Iron & Steel",
    shortSpec: "No-Hub · Shielded · Galvanized",
    image: IMAGES.castIron,
  },
  {
    index: "03",
    title: "Solid Brass",
    shortSpec: "Full-Port Valves · Unions",
    image: IMAGES.brassValves,
  },
  {
    index: "04",
    title: "Chrome & Stainless",
    shortSpec: "Commercial Trim · Flushometers",
    image: IMAGES.fixtures,
  },
];

export interface QuickCategory {
  id: string;
  label: string;
  targetCategoryNumber: string;
  summary: string;
}

export const QUICK_CATEGORIES: QuickCategory[] = [
  {
    id: "pipe-fittings",
    label: "Pipe & Fittings",
    targetCategoryNumber: "01",
    summary: "Copper, brass, cast iron, galvanized, and press connections",
  },
  {
    id: "fixtures",
    label: "Fixtures",
    targetCategoryNumber: "03",
    summary: "Commercial and residential kitchen and bath fixtures",
  },
  {
    id: "repair-parts",
    label: "Repair Parts",
    targetCategoryNumber: "02",
    summary: "Cartridges, stems, diverters, and hard-to-find replacements",
  },
  {
    id: "plumbing-supplies",
    label: "Plumbing Supplies",
    targetCategoryNumber: "06",
    summary: "Valves, supply lines, sealants, hangers, and counter essentials",
  },
];

export interface ProductCategoryItem {
  number: string;
  id: string;
  title: string;
  description: string;
  stockedItems: string[];
  counterTip: string;
  materialsAndSpecs: string;
  image: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  {
    number: "01",
    id: "pipe-fittings",
    title: "Pipe & Fittings",
    description: "Pipe, fittings, connections.",
    stockedItems: [
      "Copper sweat & press fittings (elbows, tees, couplings, adapters)",
      "Solid brass threaded nipples, bushings, unions, and flare fittings",
      "Cast iron no-hub couplings, soil pipe fittings, and galvanized malleable iron",
      "DWV ABS, Schedule 40/80 PVC, and transition couplings",
    ],
    counterTip:
      "Measure outside diameter (OD) or bring a sample fitting to verify NPT thread pitch vs. compression or sweat sizing.",
    materialsAndSpecs: "1/4\" to 4\" nominal sizes · Copper · Brass · Cast Iron · Galvanized · ABS/PVC",
    image: IMAGES.fittings,
  },
  {
    number: "02",
    id: "repair-parts",
    title: "Repair Parts",
    description: "Hard-to-find replacement parts.",
    stockedItems: [
      "Ceramic disc cartridges and compression stems (hot/cold/diverter)",
      "Thermostatic and pressure-balancing shower valve internals",
      "Commercial flushometer diaphragms, vacuum breakers, and rebuild kits",
      "Seats, washers, packing nuts, O-ring assortments, and trim screws",
    ],
    counterTip:
      "Shut off the water, pull the old cartridge or stem, and bring it directly to the counter so we can match spline count and length.",
    materialsAndSpecs: "OEM & precision aftermarket replacement components · Spline & stem matching",
    image: IMAGES.repairParts,
  },
  {
    number: "03",
    id: "fixtures",
    title: "Fixtures",
    description: "Kitchen and bath fixtures.",
    stockedItems: [
      "Kitchen faucets, prep faucets, and pre-rinse commercial assemblies",
      "Bathroom lavatory faucets, widespread sets, and wall-mount trims",
      "High-efficiency toilets, commercial bowls, urinals, and flush valves",
      "Undermount, drop-in, and utility sinks with matching drain assemblies",
    ],
    counterTip:
      "Note your sink hole count (single-hole, 4\" centerset, or 8\" widespread) and rough-in depth before selecting a replacement fixture.",
    materialsAndSpecs: "Commercial & Residential · Chrome · Brushed Nickel · Stainless · Vitreous China",
    image: IMAGES.fixtures,
  },
  {
    number: "04",
    id: "valves",
    title: "Valves",
    description: "Valves and plumbing components.",
    stockedItems: [
      "Quarter-turn full-port ball valves (sweat, threaded IPS, and press)",
      "Quarter-turn angle stops and straight supply stops (compression & sweat)",
      "Pressure reducing valves (PRVs), check valves, and relief valves",
      "Gate valves, hose bibbs, sillcocks, and backflow prevention assemblies",
    ],
    counterTip:
      "Check the directional flow arrow and connection type (IPS threaded vs. CXC sweat vs. compression) on your existing valve body.",
    materialsAndSpecs: "Lead-free brass · Bronze · Stainless Steel · 1/2\" to 2\" line sizing",
    image: IMAGES.fittings,
  },
  {
    number: "05",
    id: "bath-shower",
    title: "Bath & Shower",
    description: "Showers, faucets, and parts.",
    stockedItems: [
      "In-wall rough-in mixing valves and pressure-balance bodies",
      "Showerheads, hand showers, slide bars, shower arms, and flanges",
      "Tub spouts (slip-fit and threaded IPS), trip-lever and toe-tap drains",
      "Escutcheon plates, handle kits, and deep rough-in extension kits",
    ],
    counterTip:
      "Shower trims are valve-specific—bring a photo of the rough-in valve behind the trim plate so we can match the exact series.",
    materialsAndSpecs: "Rough-in & finish trim · Diverter assemblies · Drain & overflow brass",
    image: IMAGES.fixtures,
  },
  {
    number: "06",
    id: "supplies",
    title: "Supplies",
    description: "Everyday plumbing essentials.",
    stockedItems: [
      "Braided stainless steel faucet, toilet, and appliance supply lines",
      "Wax rings, reinforced flange spacers, closet bolts, and tank-to-bowl kits",
      "PTFE thread tape, pipe joint compound, lead-free solder, flux, and primers",
      "Copper tube straps, clevis hangers, escutcheons, and tubular P-traps",
    ],
    counterTip:
      "Stock up on supply lines, angle stops, and wax rings in one stop at the counter before heading to the jobsite.",
    materialsAndSpecs: "Braided Stainless · Brass Tubular · Sealants · Hangers & Fasteners",
    image: IMAGES.repairParts,
  },
];

export interface StripItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categoryNumber: string;
  specs: string[];
  bringInNote: string;
}

export const PRODUCT_STRIP_ITEMS: StripItem[] = [
  {
    id: "strip-fittings",
    title: "Fittings",
    subtitle: "Copper, brass, cast iron, and threaded connections.",
    image: IMAGES.fittings,
    categoryNumber: "01",
    specs: [
      "Sweat, press, flare, compression, and NPT threaded fittings",
      "Reducing couplings, unions, tees, 45° & 90° elbows, and flanges",
      "Transition couplings for older San Francisco cast iron and galvanized lines",
    ],
    bringInNote: "Bring the old fitting or pipe measurement to match thread and wall spec.",
  },
  {
    id: "strip-fixtures",
    title: "Fixtures",
    subtitle: "Commercial and residential kitchen, bath, and utility fixtures.",
    image: IMAGES.fixtures,
    categoryNumber: "03",
    specs: [
      "Faucets, flushometers, bowls, lavatories, and shower trim sets",
      "Replacement components for major residential and commercial brands",
      "Complete trim-out packages with matching stops, traps, and supply lines",
    ],
    bringInNote: "Bring your rough-in dimensions or existing fixture model number.",
  },
  {
    id: "strip-repair-parts",
    title: "Repair Parts",
    subtitle: "Stems, cartridges, valves, and hard-to-find components.",
    image: IMAGES.repairParts,
    categoryNumber: "02",
    specs: [
      "Hot/cold compression stems, ceramic cartridges, and balancing spools",
      "Flush valve rebuild kits, vacuum breakers, and spud assemblies",
      "Obsolete and older San Francisco building valve replacement parts",
    ],
    bringInNote: "Bring the old cartridge, stem, or valve part directly to the counter.",
  },
];

export const WHY_KH_POINTS = [
  {
    index: "01",
    title: "Knowledge",
    description: "People who know plumbing.",
    detail: "Practical counter help to identify stems, threads, and older San Francisco plumbing parts.",
  },
  {
    index: "02",
    title: "Selection",
    description: "Plumbing-specific supplies.",
    detail: "Focused inventory of fittings, valves, repair parts, and fixtures beyond hardware store aisles.",
  },
  {
    index: "03",
    title: "Speed",
    description: "Find the part and keep moving.",
    detail: "Walk right up to the counter at 2272 Shafter Ave without wandering big-box warehouse rows.",
  },
  {
    index: "04",
    title: "Local",
    description: "San Francisco supply, close by.",
    detail: "Located in the Bayview industrial district with quick access from US-101, I-280, and 3rd Street.",
  },
];

export const CONFIRMED_BRANDS = [
  {
    name: "Kohler",
    focus: "Fixtures, cartridges, flush valve components, and replacement parts",
  },
  {
    name: "Grohe",
    focus: "Thermostatic cartridges, mixing valves, kitchen and bath trim components",
  },
  {
    name: "Hansgrohe",
    focus: "Rough-in valves, shower cartridges, and architectural fixture parts",
  },
  {
    name: "Toto",
    focus: "High-efficiency toilets, fill/flush valves, and commercial washroom parts",
  },
  {
    name: "Robern",
    focus: "Architectural bath cabinetry, mirrors, and companion hardware",
  },
];

export const COUNTER_HOURS = [
  {
    days: "Monday – Friday",
    hours: "7:00 AM – 4:00 PM",
  },
  {
    days: "Saturday",
    hours: "8:00 AM – 2:00 PM",
  },
  {
    days: "Sunday",
    hours: "Closed",
  },
];
