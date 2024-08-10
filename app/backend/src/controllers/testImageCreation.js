const fs = require('fs');
const path = require('path');

const imagesDir = path.resolve(__dirname, '../../images');
const testImagePath = path.join(imagesDir, 'test.png');
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAUA' +
    'AAAFCAYAAACNbyblAAAAHElEQVQI12P4' +
    '//8/w38GIAXDIBKE0DHxgljNBAAO' +
    '9TXL0Y4OHwAAAABJRU5ErkJggg==', 'base64');

try {
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log('Created images directory:', imagesDir);
    }

    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log('Test image written successfully to', testImagePath);
} catch (error) {
    console.error('Error writing test image file:', error);
}