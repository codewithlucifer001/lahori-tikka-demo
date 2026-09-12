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
      address: "Plaza 14Z, Shop 4,6,8, Near MCB Bank, Johar Road, F-8 Markaz, Islamabad",
      deliveryZones: ["F-8", "F-7", "F-6", "E-7", "G-8", "G-7", "G-9"]
    },
    { 
      id: 2, 
      name: "Park View City", 
      phone: "0312-5362256", 
      address: "Park View City Branch, Islamabad",
      deliveryZones: ["Park View City", "Bahria Enclave", "Zone IV"]
    }
  ],

  deliveryZones: [
    { sector: "F, G & E Sector", phone1: "051-2852915", phone2: "0306-5550555" }
  ],

  socials: {
    instagram: "https://instagram.com/lahoretikka.isb",
    whatsapp: "https://wa.me/923065550555"
  },

  banners: [
    {
      title: "Crispy Outside. Juicy Inside.",
      subtitle: "Char-grilled over live coals for that signature smoky desi flavor. Serving authentic Lahori karahi, platters, and BBQ right in F-8 Markaz & Park View City.",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      ctaText: "Explore Live Menu",
      ctaLink: "#menu"
    },
    {
      title: "Aap Layein, Ham Pakayein",
      subtitle: "Bring your own raw meat or marinades, and let our master Tandoor chefs grill it to perfection with our secret Lahori spices.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      ctaText: "Reserve a Table",
      ctaLink: "#reservation"
    },
    {
      title: "Free Delivery in F, G & E Sectors",
      subtitle: "Enjoy hot and fresh meals delivered straight to your doorstep within 30 minutes across all Islamabad F, G, and E sectors.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      ctaText: "Order Now",
      ctaLink: "#menu"
    }
  ],

  menu: {
    Chicken: [
      { name: "Chicken Malai Botti (18 Pcs)", price: 1980, image: "https://images.unsplash.com/photo-1599487488170-d3319024f2e5?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Botti (24 Pcs)", price: 1430, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Tikka 6 Pcs", price: 500, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Wings (15 Pcs)", price: 1980, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Seekh Kabab (6 Pcs)", price: 1320, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Shashlik (3 Pcs)", price: 1980, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" }
    ],
    Mutton: [
      { name: "Mutton Botti (24 Pcs)", price: 2420, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Seekh Kabab (6 Pcs)", price: 1650, image: "https://images.unsplash.com/photo-1599487488170-d3319024f2e5?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Chops 9 Pcs", price: 2500, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Ribs", price: 4500, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Joints", price: 950, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" }
    ],
    Karahi: [
      { name: "Chicken Karahi (Full)", price: 2100, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Karahi (Half)", price: 1150, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Desi Karahi (Full)", price: 4400, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Desi Karahi (Half)", price: 2300, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Nalli Karahi (Full)", price: 4600, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Nalli Karahi (Half)", price: 2300, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" }
    ],
    Handi: [
      { name: "Chicken Achari Karahi", price: 2550, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
      { name: "Mutton Achari", price: 4600, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
      { name: "Chicken Boneless", price: 3200, image: "https://images.unsplash.com/photo-1599487488170-d3319024f2e5?auto=format&fit=crop&w=600&q=80" }
    ],
    Fish: [
      { name: "Fish Tikka (12 Pcs)", price: 2500, image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80" },
      { name: "Rohu Fish (Per Kg)", price: 2750, image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80" },
      { name: "Fingr Fish (Per Kg)", price: 3150, image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80" },
      { name: "Singhara Fish Boneless", price: 3150, image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80" }
    ],
    Tandoor: [
      { name: "Chicken Naan", price: 650, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" },
      { name: "Roghni Naan", price: 100, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" },
      { name: "Garlic Naan", price: 90, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" },
      { name: "Plain Naan", price: 30, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" },
      { name: "Tandoori Paratha", price: 100, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80" }
    ],
    Beverages: [
      { name: "1.5 Litre Drink", price: 240, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" },
      { name: "Fresh Lime", price: 180, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
      { name: "Mineral Water Large", price: 150, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80" },
      { name: "Cold Drink Tin", price: 150, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80" }
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