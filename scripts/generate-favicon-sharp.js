// Favicon Generator using Sharp
// Run: npm install sharp --save-dev
// Then: node scripts/generate-favicon-sharp.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  Generating Favicons with Sharp');
console.log('========================================\n');

const logoPath = path.join(__dirname, '..', 'public', 'image', 'mainLogoMark.png');
const outputDir = path.join(__dirname, '..', 'public', 'image');

const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon.ico', size: 32 } // ICO as 32x32 PNG
];

async function generateFavicons() {
    try {
        console.log('📁 Reading logo:', logoPath);
        
        for (const config of sizes) {
            const outputPath = path.join(outputDir, config.name);
            
            await sharp(logoPath)
                .resize(config.size, config.size, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .png()
                .toFile(outputPath);
            
            console.log(`✓ Created ${config.name} (${config.size}x${config.size})`);
        }
        
        console.log('\n✅ All favicons generated successfully!');
        console.log('\nNext steps:');
        console.log('  1. Deploy: .\\scripts\\deploy.ps1');
        console.log('  2. Clear browser cache (Ctrl+Shift+R)');
        console.log('  3. Visit: https://scholarport.co');
        console.log('\n========================================\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\nIf Sharp is not installed, run:');
        console.log('  npm install sharp --save-dev');
        process.exit(1);
    }
}

generateFavicons();
