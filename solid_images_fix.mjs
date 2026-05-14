// solid_images_fix.mjs
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch'; // Standard fetch if node < 18, but I'll use it for compatibility

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET
});

const PEXELS_API_KEY = process.env.VITE_PEXELS_API_KEY;

// Layer 1: Hardcoded High-Quality Specific Dictionary (Page Titles)
const specificImages = {
  'Gulab Jamun': 'Gulab jamun',
  'Rasgulla': 'Rasgulla',
  'Kaju Katli': 'Kaju katli',
  'Jalebi': 'Jalebi',
  'Samosa': 'Samosa',
  'Ghevar': 'Ghevar',
  'Mysore Pak': 'Mysore pak',
  'Soan Papdi': 'Soan papdi',
  'Barfi': 'Barfi',
  'Motichoor Laddu': 'Laddu',
  'Besan Laddu': 'Laddu',
  'Peda': 'Peda',
  'Gajar Ka Halwa': 'Gajar ka halwa',
  'Rasmalai': 'Ras malai',
  'Gujiya': 'Gujiya',
  'Shrikhand': 'Shrikhand',
  'Phirni': 'Phirni',
  'Malpua': 'Malpua',
  'Lassi': 'Lassi',
  'Mango Lassi': 'Lassi'
};

async function getWikimediaUrl(title, isSearch = false) {
  try {
    const headers = { 'User-Agent': 'SolidImageFixer/1.0 (admin@shyam-sweets.com)' };
    let finalTitle = title;

    if (isSearch) {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title + " food")}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl, { headers });
      const searchData = await searchRes.json();
      if (!searchData.query.search || searchData.query.search.length === 0) return null;
      finalTitle = searchData.query.search[0].title;
    }

    // Get images from the page
    const fileSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(finalTitle)}&prop=images&format=json&origin=*`;
    const fileSearchRes = await fetch(fileSearchUrl, { headers });
    const fileSearchData = await fileSearchRes.json();
    
    const pages = fileSearchData.query.pages;
    const pageId = Object.keys(pages)[0];
    const images = pages[pageId].images;
    
    if (images && images.length > 0) {
      const validImage = images.find(img => img.title.toLowerCase().endsWith('.jpg') || img.title.toLowerCase().endsWith('.png'));
      if (validImage) {
        const imageUrlRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(validImage.title)}&prop=imageinfo&iiprop=url&format=json&origin=*`, { headers });
        const imageUrlData = await imageUrlRes.json();
        const imgPages = imageUrlData.query.pages;
        const imgPageId = Object.keys(imgPages)[0];
        return imgPages[imgPageId].imageinfo[0].url;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function getPexelsImage(productName) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(productName + " indian food")}&per_page=1`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || null;
  } catch (err) {
    return null;
  }
}

async function uploadToCloudinary(sourceUrl, productName) {
  try {
    const publicId = productName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const response = await fetch(sourceUrl, { 
      headers: { 'User-Agent': 'SolidImageFixer/1.0 (admin@shyam-sweets.com)' } 
    });
    
    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${response.headers.get('content-type')};base64,${buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'solid_images_fixed',
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 800, height: 800, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:good' }
      ]
    });
    return result.secure_url;
  } catch (err) {
    console.error(`Cloudinary Upload Error for ${productName}:`, err);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Solid Image Fix Script...');
  
  const mockDataPath = path.resolve('src/data/mockData.js');
  let content = fs.readFileSync(mockDataPath, 'utf8');
  
  // Find where products array starts
  const productsStartMarker = 'export const products = ';
  const startIndex = content.indexOf(productsStartMarker);
  
  if (startIndex === -1) {
    console.error('Could not find products export in mockData.js');
    return;
  }
  
  const prefix = content.substring(0, startIndex + productsStartMarker.length);
  const arrayPart = content.substring(startIndex + productsStartMarker.length);
  
  // Find where array ends (assuming it ends with ]; at the end or followed by other exports)
  const endIndex = arrayPart.lastIndexOf('];') + 2;
  const productsArrayString = arrayPart.substring(0, endIndex);
  const suffix = arrayPart.substring(endIndex);
  
  let products;
  try {
    // Basic JSON-like parsing for the array string
    // This is risky if the file has complex logic, but we updated it to be static JSON-like before.
    products = eval(productsArrayString); 
  } catch (err) {
    console.error('Error parsing products array:', err.message);
    return;
  }

  console.log(`📋 Found ${products.length} products to process.`);

  const report = { success: 0, failed: 0, layer1: 0, layer2: 0, layer3: 0 };
  const CHUNK_SIZE = 5;

  for (let i = 0; i < products.length; i += CHUNK_SIZE) {
    const chunk = products.slice(i, i + CHUNK_SIZE);
    console.log(`\n📦 Processing Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(products.length / CHUNK_SIZE)}...`);
    
    await Promise.all(chunk.map(async (p, idx) => {
      let sourceUrl = null;
      let layer = '';

      // Layer 1: Dictionary
      if (specificImages[p.name]) {
        sourceUrl = await getWikimediaUrl(specificImages[p.name], false);
        if (sourceUrl) {
          layer = 'Layer 1 (Dictionary Title)';
          report.layer1++;
        }
      } 
      
      // Layer 2: Wikimedia Search
      if (!sourceUrl) {
        sourceUrl = await getWikimediaUrl(p.name, true);
        if (sourceUrl) {
          layer = 'Layer 2 (Wikimedia Search)';
          report.layer2++;
        }
      }

      // Layer 3: Pexels API
      if (!sourceUrl) {
        sourceUrl = await getPexelsImage(p.name);
        if (sourceUrl) {
          layer = 'Layer 3 (Pexels API)';
          report.layer3++;
        }
      }

      if (sourceUrl) {
        const cloudUrl = await uploadToCloudinary(sourceUrl, p.name);
        if (cloudUrl) {
          p.image = cloudUrl;
          report.success++;
          console.log(`   [${i + idx + 1}] ✅ ${p.name} updated via ${layer}`);
        } else {
          report.failed++;
          console.log(`   [${i + idx + 1}] ❌ ${p.name} Cloudinary failed`);
        }
      } else {
        report.failed++;
        console.log(`   [${i + idx + 1}] ❌ ${p.name} No image found`);
      }
    }));

    // Wait a bit between chunks to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  // Save back to file
  const newContent = prefix + JSON.stringify(products, null, 2) + ';' + suffix;
  fs.writeFileSync(mockDataPath, newContent);

  console.log('\n═══════════════════════════════');
  console.log('         FINAL REPORT          ');
  console.log('═══════════════════════════════');
  console.log(`✅ Success : ${report.success}`);
  console.log(`❌ Failed  : ${report.failed}`);
  console.log(`   Layer 1: ${report.layer1}`);
  console.log(`   Layer 2: ${report.layer2}`);
  console.log(`   Layer 3: ${report.layer3}`);
  console.log('═══════════════════════════════');
  console.log('✅ mockData.js updated and saved.');
}

main().catch(err => console.error('Script Failed:', err));
