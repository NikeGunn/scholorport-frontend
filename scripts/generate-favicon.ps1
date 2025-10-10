# Favicon Generator Script for Scholarport
# This script generates favicon files from your logo

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Scholarport Favicon Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$logoPath = "public/image/mainLogoMark.png"
$outputDir = "public/image"

# Check if logo exists
if (-not (Test-Path $logoPath)) {
    Write-Host "[ERROR] Logo file not found: $logoPath" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Found logo: $logoPath" -ForegroundColor Green

# Method 1: Try using ImageMagick (if installed)
$imageMagick = Get-Command "magick" -ErrorAction SilentlyContinue

if ($imageMagick) {
    Write-Host "[INFO] ImageMagick found! Generating favicons..." -ForegroundColor Green
    
    # Generate 16x16 favicon
    & magick convert $logoPath -resize 16x16 -background white -gravity center -extent 16x16 "$outputDir/favicon-16x16.png"
    Write-Host "  ✓ Created favicon-16x16.png" -ForegroundColor Green
    
    # Generate 32x32 favicon
    & magick convert $logoPath -resize 32x32 -background white -gravity center -extent 32x32 "$outputDir/favicon-32x32.png"
    Write-Host "  ✓ Created favicon-32x32.png" -ForegroundColor Green
    
    # Generate 180x180 Apple touch icon
    & magick convert $logoPath -resize 180x180 -background white -gravity center -extent 180x180 "$outputDir/apple-touch-icon.png"
    Write-Host "  ✓ Created apple-touch-icon.png" -ForegroundColor Green
    
    # Generate favicon.ico (multi-size)
    & magick convert $logoPath -resize 32x32 -background white -gravity center -extent 32x32 "$outputDir/favicon.ico"
    Write-Host "  ✓ Created favicon.ico" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "[SUCCESS] All favicons generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Deploy your application: .\scripts\deploy.ps1" -ForegroundColor White
    Write-Host "  2. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "  3. Check your favicon at https://scholarport.co" -ForegroundColor White
    
} else {
    Write-Host "[INFO] ImageMagick not found. Using alternative method..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OPTION 1 - Online Tool (Recommended):" -ForegroundColor Green
    Write-Host "  1. Go to: https://realfavicongenerator.net/" -ForegroundColor White
    Write-Host "  2. Upload: public/image/mainLogoMark.png" -ForegroundColor White
    Write-Host "  3. Download the favicon package" -ForegroundColor White
    Write-Host "  4. Extract and copy these files to public/image/:" -ForegroundColor White
    Write-Host "     - favicon-16x16.png" -ForegroundColor White
    Write-Host "     - favicon-32x32.png" -ForegroundColor White
    Write-Host "     - apple-touch-icon.png" -ForegroundColor White
    Write-Host "     - favicon.ico" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 2 - Use Local HTML Tool:" -ForegroundColor Green
    Write-Host "  1. Open: scripts/generate-favicon.html in your browser" -ForegroundColor White
    Write-Host "  2. Load your logo (mainLogoMark.png)" -ForegroundColor White
    Write-Host "  3. Download all generated favicons" -ForegroundColor White
    Write-Host "  4. Move them to public/image/ folder" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTION 3 - Install ImageMagick:" -ForegroundColor Green
    Write-Host "  1. Install via Chocolatey: choco install imagemagick" -ForegroundColor White
    Write-Host "  2. Or download from: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
    
    # Open the HTML tool
    $htmlTool = Resolve-Path "scripts\generate-favicon.html"
    Write-Host "[INFO] Opening favicon generator tool..." -ForegroundColor Cyan
    Start-Process $htmlTool
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
