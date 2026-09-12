import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  console.error('❌ Error: VITE_UNSPLASH_ACCESS_KEY is missing from your .env file.');
  process.exit(1);
}

// Inline fallback menu categories & dishes to prevent config asset import clashes during script execution
const menuData = {
  Chicken: [
    { name: "Chicken Malai Botti", price: 1090 },
    { name: "Chicken Tikka Boti", price: 950 },
    { name: "Chicken Seekh Kebab", price: 890 },
    { name: "Lahori Chargha", price: 1350 }
  ],
  Mutton: [
    { name: "Mutton Ribs Tikka", price: 1850 },
    { name: "Mutton Seekh Kebab", price: 1250 }
  ],
  Karahi: [
    { name: "Chicken White Karahi", price: 2400 },
    { name: "Mutton Nalli Karahi", price: 3600 },
    { name: "Desi Chicken Karahi", price: 2800 }
  ],
  Handi: [
    { name: "Chicken Makhani Handi", price: 2500 },
    { name: "Shahi Paneer Handi", price: 2100 }
  ],
  Fish: [
    { name: "Lahori Fried Fish", price: 1950 },
    { name: "Grilled Fish Tikka", price: 2100 }
  ],
  Tandoor: [
    { name: "Roghni Naan", price: 90 },
    { name: "Garlic Naan", price: 120 },
    { name: "Khamiri Roti", price: 40 },
    { name: "Desi Ghee Naan", price: 150 }
  ],
  Beverages: [
    { name: "Special Lahori Lassi", price: 250 },
    { name: "Fresh Mint Margarita", price: 300 },
    { name: "Soft Drink (1.5L)", price: 200 },
    { name: "Mineral Water", price: 100 }
  ]
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const searchTermMapping = {
  "chicken malai botti": "grilled chicken skewers",
  "taka tak": "spicy stir fry meat",
  "mutton nalli karahi": "lamb curry",
  "chicken jalfrezi": "chicken stir fry",
  "roghni naan": "flatbread naan",
  "garlic naan": "garlic flatbread",
  "desi ghee": "clarified butter food",
  "kheer": "rice pudding dessert",
  "gulab jamun": "sweet dessert pastry"
};

const outputDir = path.resolve('src/assets/images/menu');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAndSaveImages() {
  console.log('🚀 Starting Unsplash Menu Image Fetch Pipeline...\n');
  
  let successCount = 0;
  let failCount = 0;
  const categories = Object.keys(menuData);

  for (const cat of categories) {
    const dishes = menuData[cat] || [];
    console.log(`📂 Processing category: ${cat} (${dishes.length} items)`);

    for (const dish of dishes) {
      const slug = slugify(dish.name);
      const filePath = path.join(outputDir, `${slug}.jpg`);

      if (fs.existsSync(filePath)) {
        console.log(`   ⏭️ Skipping "${dish.name}" (already exists)`);
        successCount++;
        continue;
      }

      const rawQuery = dish.name.toLowerCase();
      const searchQuery = searchTermMapping[rawQuery] || rawQuery + ' food';
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1`;

      try {
        console.log(`   🔍 Searching Unsplash for: "${dish.name}"...`);
        const response = await fetch(url, {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
        });

        if (!response.ok) throw new Error(`API status ${response.status}`);

        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const imageUrl = data.results[0].urls.regular;
          const imageRes = await fetch(imageUrl);
          const buffer = await imageRes.buffer();
          fs.writeFileSync(filePath, buffer);

          console.log(`   ✅ Saved: ${slug}.jpg`);
          successCount++;
        } else {
          console.warn(`   ⚠️ No results found for "${dish.name}"`);
          failCount++;
        }
      } catch (err) {
        console.error(`   ❌ Failed to fetch "${dish.name}":`, err.message);
        failCount++;
      }

      await delay(1000);
    }
  }

  console.log('\n==============================');
  console.log('📊 Image Fetch Pipeline Complete');
  console.log(`   Succeeded: ${successCount}`);
  console.log(`   Failed/Missing: ${failCount}`);
  console.log('==============================\n');
}

fetchAndSaveImages();