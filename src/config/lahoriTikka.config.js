const config = {
  name: "Lahori Tikka",
  tagline: "Serving Authentic Taste of Lahore Since 1996",
  logo: "/src/assets/images/logo.png",
  heroImage: "/src/assets/images/hero.png",

  theme: {
    primary: "#C8102E",     // Red from logo
    secondary: "#111111",   // Deep black
    accent: "#FFD700",      // Warm yellow/gold
    background: "#0d0d0d",  // Dark backdrop
    cardBg: "#1a1a1a",
    text: "#FFFFFF",
    textMuted: "#A3A3A3"
  },

  branches: [
    { 
      id: 1, 
      name: "F-8 Markaz", 
      phone: "051-2852915", 
      address: "Plaza 14Z, Shop 4,6,8, Near MCB Bank, Johar Road, F-8 Markaz, Islamabad" 
    },
    { 
      id: 2, 
      name: "Park View City", 
      phone: "0312-5362256", 
      address: "Park View City Branch, Islamabad" 
    }
  ],

  deliveryZones: [
    { sector: "F, G & E Sector", phone1: "051-2852915", phone2: "0306-5550555" }
  ],

  socials: {
    instagram: "https://instagram.com/lahoretikka.isb",
    whatsapp: "https://wa.me/923065550555"
  },

  menu: {
    Chicken: [
      { name: "Chicken Malai Botti (18 Pcs)", price: 1980 },
      { name: "Chicken Botti (24 Pcs)", price: 1430 },
      { name: "Chicken Tikka 6 Pcs", price: 500 },
      { name: "Chicken Wings (15 Pcs)", price: 1980 },
      { name: "Chicken Seekh Kabab (6 Pcs)", price: 1320 },
      { name: "Chicken Shashlik (3 Pcs)", price: 1980 }
    ],
    Mutton: [
      { name: "Mutton Botti (24 Pcs)", price: 2420 },
      { name: "Mutton Seekh Kabab (6 Pcs)", price: 1650 },
      { name: "Mutton Chops 9 Pcs", price: 2500 },
      { name: "Mutton Ribs", price: 4500 },
      { name: "Mutton Joints", price: 950 }
    ],
    Karahi: [
      { name: "Chicken Karahi (Full)", price: 2100 },
      { name: "Chicken Karahi (Half)", price: 1150 },
      { name: "Chicken Desi Karahi (Full)", price: 4400 },
      { name: "Chicken Desi Karahi (Half)", price: 2300 },
      { name: "Mutton Nalli Karahi (Full)", price: 4600 },
      { name: "Mutton Nalli Karahi (Half)", price: 2300 }
    ],
    Handi: [
      { name: "Chicken Achari Karahi", price: 2550 },
      { name: "Mutton Achari", price: 4600 },
      { name: "Chicken Boneless", price: 3200 }
    ],
    Fish: [
      { name: "Fish Tikka (12 Pcs)", price: 2500 },
      { name: "Rohu Fish (Per Kg)", price: 2750 },
      { name: "Fingr Fish (Per Kg)", price: 3150 },
      { name: "Singhara Fish Boneless", price: 3150 }
    ],
    Tandoor: [
      { name: "Chicken Naan", price: 650 },
      { name: "Roghni Naan", price: 100 },
      { name: "Garlic Naan", price: 90 },
      { name: "Plain Naan", price: 30 },
      { name: "Tandoori Paratha", price: 100 }
    ],
    Beverages: [
      { name: "1.5 Litre Drink", price: 240 },
      { name: "Fresh Lime", price: 180 },
      { name: "Mineral Water Large", price: 150 },
      { name: "Cold Drink Tin", price: 150 }
    ]
  },

  specials: [
    {
      title: "Aap Layein, Ham Pakayein",
      description: "Bring your own meat — we cook it fresh over charcoal for you.",
      price: "PKR 2000 / kg cooking charge",
      badge: "Exclusive Service"
    }
  ],

  reviews: [
    { name: "Hamza R.", rating: 5, text: "Authentic spicy Lahori BBQ in Islamabad. The malai boti is top tier." },
    { name: "Zainab K.", rating: 5, text: "Best tandoor and karahi near F-8 Markaz. Fast hot delivery." }
  ],

  since: 1996
};

export default config;