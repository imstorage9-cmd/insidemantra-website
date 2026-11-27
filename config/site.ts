// Central, editable configuration for the whole site.
// Change text here to update copy across every page without touching components.
// Image slots follow the convention documented in CONTENT-GUIDE.md:
// drop a file at public/images/<path>.(jpg|jpeg|png|webp) and it appears automatically.

export type Offering = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string; // path (without extension) under public/images/offerings/
  highlights: string[];
};

export type Location = {
  city: string;
  address: string;
  mapQuery: string; // what to search for on Google Maps
  phone?: string;
};

export type JourneyEntry = {
  year: string;
  items: string[];
};

export const siteConfig = {
  name: "Inside Mantra",
  shortName: "Inside Mantra",
  tagline: "No design is so arrogantly grand as that which is simple.",
  philosophy: "Design is not for philosophy, it's for life.",
  mission:
    "At Inside Mantra we deliver design that's affordable, from modest to straight-line design, in innovative and unorthodox ways. From residential spaces to commercial projects, we do it all in the world of interior design. We offer our clients the best-in-class services to cater to their interior needs at affordable prices.",
  foundedYear: "2018",

  contact: {
    phone: "+91 83 67477788",
    phoneDialable: "+918367477788",
    whatsappNumber: "918367477788",
    email: "enquiries@insidemantra.com",
    hours: "Monday - Saturday, 08:00 - 17:00",
  },

  social: {
    facebook: "https://www.facebook.com/InsideMantraInteriors/",
    instagram: "https://www.instagram.com/insidemantra/",
    pinterest: "https://www.pinterest.it/insidemantra/pins/",
    houzz: "https://www.houzz.com/pro/inside-mantra/inside-mantra",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "The Works", href: "/the-works" },
    { label: "Services", href: "/services" },
    { label: "Magazine", href: "/magazine" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footerLinks: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/the-works" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/magazine" },
    { label: "Locations", href: "/contact" },
    { label: "Contact", href: "/contact" },
  ],

  // Rotating quotes on the home page (from the original Inside Mantra site)
  philosophyQuotes: [
    { label: "Our Philosophy", text: "No design is so arrogantly grand as that which is simple." },
    { label: "What we think", text: "The key to great design is capturing the spirit of the client and the essence of the space." },
    { label: "What we believe", text: "Design is not for philosophy, it's for life." },
  ],

  // Home page hero heading: "Be ___", where the last word cycles through these
  beYou: {
    words: ["Creative", "Bold", "You!"],
  },

  consultationCtaText: "Book Free Consultation",
  consultationHref: "/contact",

  hero: {
    subheading:
      "Affordable, thoughtfully designed interiors for homes and offices — from concept to move-in.",
  },

  offerings: [
    {
      slug: "modular-interiors",
      title: "Modular Interiors",
      shortDescription: "Functional kitchen, wardrobe and storage.",
      longDescription:
        "Modular kitchens, wardrobes and storage units engineered for your exact space — built for daily use, easy to maintain, and tailored to how you actually live.",
      image: "offerings/modular-interiors",
      highlights: [
        "Custom-fit modular kitchens",
        "Sliding and hinged wardrobes",
        "Space-optimised storage units",
        "Choice of finishes and hardware",
      ],
    },
    {
      slug: "full-home-interiors",
      title: "Full Home Interiors",
      shortDescription: "Turnkey interior solutions for your home.",
      longDescription:
        "A single team to handle design, materials and installation for your entire home — so you deal with one point of contact from first sketch to final handover.",
      image: "offerings/full-home-interiors",
      highlights: [
        "End-to-end project management",
        "Room-by-room design plans",
        "Single timeline across the whole home",
        "Post-handover support",
      ],
    },
    {
      slug: "luxury-interiors",
      title: "Luxury Interiors",
      shortDescription: "Tailored interiors that redefine elegance.",
      longDescription:
        "Bespoke design for clients who want premium materials, custom detailing and a fully personalised look — built to a higher standard throughout.",
      image: "offerings/luxury-interiors",
      highlights: [
        "Bespoke material palettes",
        "Custom furniture and detailing",
        "Dedicated senior designer",
        "Premium finish and hardware options",
      ],
    },
    {
      slug: "renovations",
      title: "Renovations",
      shortDescription: "Expert solutions to upgrade your home.",
      longDescription:
        "Refresh an existing space without starting from zero — we work around what's already there to upgrade layout, finishes and function.",
      image: "offerings/renovations",
      highlights: [
        "On-site assessment of existing space",
        "Phased renovation planning",
        "Minimal-disruption execution",
        "Finish and fixture upgrades",
      ],
    },
  ] satisfies Offering[],

  process: [
    { title: "Meet & Agree", description: "We understand your brief, space and budget." },
    { title: "Idea & Concept", description: "You get a design concept tailored to your needs." },
    { title: "Design & Create", description: "3D designs and material selection, finalised with you." },
    { title: "Build & Install", description: "Turnkey installation, followed by post-delivery support." },
  ],

  whyChooseUs: [
    { title: "Transparent Pricing", description: "Clear quotes with no hidden costs." },
    { title: "Flexible Payment Plans", description: "Options to suit your budget." },
    { title: "On-Time Delivery", description: "Project timelines we commit to and track." },
    { title: "Quality Checked", description: "Every project inspected before handover." },
    { title: "Post-Delivery Support", description: "We're here after the keys are handed over." },
  ],

  // Real, verifiable recognitions go here. Keep placeholders until you have more to add —
  // don't invent numbers or awards that aren't true yet.
  trophies: [
    { title: "Recognised by the Houzz community", subtitle: "Houzz" },
    { title: "Add your next recognition here", subtitle: "Edit in config/site.ts" },
    { title: "Add your next recognition here", subtitle: "Edit in config/site.ts" },
  ],

  // Fill these in with real, current figures before publishing.
  stats: [
    { value: "Add number", label: "Homes delivered" },
    { value: "Add number", label: "Expert designers" },
    { value: "Add number", label: "Cities served" },
  ],

  journey: [
    {
      year: "2018",
      items: ["Inside Mantra founded."],
    },
    {
      year: "2019",
      items: ["Add a milestone for this year in config/site.ts."],
    },
    {
      year: "2020",
      items: ["Add a milestone for this year in config/site.ts."],
    },
  ] satisfies JourneyEntry[],

  servicesTiles: [
    {
      title: "Kitchen",
      description: "With many modules to mix and match, let's cook up a kitchen to suit your taste.",
      image: "services/kitchen",
      href: "/offerings/modular-interiors",
    },
    {
      title: "Wardrobe",
      description: "Is it yours, hers, or theirs? Get wardrobes personalised to your needs.",
      image: "services/wardrobe",
      href: "/offerings/modular-interiors",
    },
    {
      title: "Storage",
      description: "A beautiful space for everything. Bookshelves, shoe racks, TV units and more.",
      image: "services/storage",
      href: "/offerings/modular-interiors",
    },
  ],

  craftingSteps: [
    { title: "Design", description: "Tailored for you, applying real design science to make living easy and beautiful.", image: "crafting/design" },
    { title: "Core Materials", description: "Carefully sourced and checked against our own quality standards.", image: "crafting/core-materials" },
    { title: "Manufacturing", description: "Precision engineered, checked at every stage.", image: "crafting/manufacturing" },
    { title: "Quality Checks", description: "Hardware and finish checks to make sure things last.", image: "crafting/quality-checks" },
    { title: "Packaging", description: "Protected well, so every module reaches you in pristine condition.", image: "crafting/packaging" },
    { title: "Delivery & Installation", description: "Installed by trained professionals, end to end.", image: "crafting/delivery-installation" },
  ],

  locations: [
    {
      city: "Vijayawada",
      address: "Add the full office address for Vijayawada here.",
      mapQuery: "Inside Mantra Vijayawada",
      phone: "+91 83 67477788",
    },
    {
      city: "Visakhapatnam",
      address: "Add the full office address for Visakhapatnam here.",
      mapQuery: "Inside Mantra Visakhapatnam",
      phone: "+91 83 67477788",
    },
    {
      city: "Hyderabad",
      address: "Add the full office address for Hyderabad here.",
      mapQuery: "Inside Mantra Hyderabad",
      phone: "+91 83 67477788",
    },
  ] satisfies Location[],
};

export type SiteConfig = typeof siteConfig;
