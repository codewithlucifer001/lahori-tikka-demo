import logoImg from '../assets/images/logo.png';
import heroImg from '../assets/images/hero.png';

const config = {
  name: "Lahori Tikka",
  tagline: "Serving Authentic Taste of Lahore Since 1996",
  logo: logoImg,
  heroImage: heroImg,

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
      { name: "Chicken Malai Botti (18 Pcs)", price: 1980, image: "/src/assets/images/menu/chicken-malai-botti.jpg" },
      { name: "Chicken Botti (24 Pcs)", price: 1430, image: "/src/assets/images/menu/chicken-botti.jpg" },
      { name: "Chicken Tikka 6 Pcs", price: 500, image: "/src/assets/images/menu/chicken-tikka.jpg" },
      { name: "Chicken Wings (15 Pcs)", price: 1980, image: "/src/assets/images/menu/chicken-wings.jpg" },
      { name: "Chicken Seekh Kabab (6 Pcs)", price: 1320, image: "/src/assets/images/menu/chicken-seekh-kabab.jpg" },
      { name: "Chicken Shashlik (3 Pcs)", price: 1980, image: "/src/assets/images/menu/chicken-shashlik.jpg" }
    ],
    Mutton: [
      { name: "Mutton Botti (24 Pcs)", price: 2420, image: "/src/assets/images/menu/mutton-botti.jpg" },
      { name: "Mutton Seekh Kabab (6 Pcs)", price: 1650, image: "/src/assets/images/menu/mutton-seekh-kabab.jpg" },
      { name: "Mutton Chops 9 Pcs", price: 2500, image: "/src/assets/images/menu/mutton-chops.jpg" },
      { name: "Mutton Ribs", price: 4500, image: "/src/assets/images/menu/mutton-ribs.jpg" },
      { name: "Mutton Joints", price: 950, image: "/src/assets/images/menu/mutton-joints.jpg" }
    ],
    Karahi: [
      { name: "Chicken Karahi (Full)", price: 2100, image: "/src/assets/images/menu/chicken-karahi-full.jpg" },
      { name: "Chicken Karahi (Half)", price: 1150, image: "/src/assets/images/menu/chicken-karahi-half.jpg" },
      { name: "Chicken Desi Karahi (Full)", price: 4400, image: "/src/assets/images/menu/chicken-desi-karahi-full.jpg" },
      { name: "Chicken Desi Karahi (Half)", price: 2300, image: "/src/assets/images/menu/chicken-desi-karahi-half.jpg" },
      { name: "Mutton Nalli Karahi (Full)", price: 4600, image: "/src/assets/images/menu/mutton-nalli-karahi-full.jpg" },
      { name: "Mutton Nalli Karahi (Half)", price: 2300, image: "/src/assets/images/menu/mutton-nalli-karahi-half.jpg" }
    ],
    Handi: [
      { name: "Chicken Achari Karahi", price: 2550, image: "/src/assets/images/menu/chicken-achari-karahi.jpg" },
      { name: "Mutton Achari", price: 4600, image: "/src/assets/images/menu/mutton-achari.jpg" },
      { name: "Chicken Boneless", price: 3200, image: "/src/assets/images/menu/chicken-boneless.jpg" }
    ],
    Fish: [
      { name: "Fish Tikka (12 Pcs)", price: 2500, image: "/src/assets/images/menu/fish-tikka.jpg" },
      { name: "Rohu Fish (Per Kg)", price: 2750, image: "/src/assets/images/menu/rohu-fish.jpg" },
      { name: "Fingr Fish (Per Kg)", price: 3150, image: "/src/assets/images/menu/finger-fish.jpg" },
      { name: "Singhara Fish Boneless", price: 3150, image: "/src/assets/images/menu/singhara-fish-boneless.jpg" }
    ],
    Tandoor: [
      { name: "Chicken Naan", price: 650, image: "/src/assets/images/menu/chicken-naan.jpg" },
      { name: "Roghni Naan", price: 100, image: "/src/assets/images/menu/roghni-naan.jpg" },
      { name: "Garlic Naan", price: 90, image: "/src/assets/images/menu/garlic-naan.jpg" },
      { name: "Plain Naan", price: 30, image: "/src/assets/images/menu/plain-naan.jpg" },
      { name: "Tandoori Paratha", price: 100, image: "/src/assets/images/menu/tandoori-paratha.jpg" }
    ],
    Beverages: [
      { name: "1.5 Litre Drink", price: 240, image: "/src/assets/images/menu/1-5-litre-drink.jpg" },
      { name: "Fresh Lime", price: 180, image: "/src/assets/images/menu/fresh-lime.jpg" },
      { name: "Mineral Water Large", price: 150, image: "/src/assets/images/menu/mineral-water-large.jpg" },
      { name: "Cold Drink Tin", price: 150, image: "/src/assets/images/menu/cold-drink-tin.jpg" }
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