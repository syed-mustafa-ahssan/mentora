// Script to update all hardcoded localhost URLs to use getApiUrl
// Run this with: node update-api-urls.js

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const filesToUpdate = [
    'Profile.jsx',
    'CourseDetail.jsx',
    'UpdateProfile.jsx',
    'AddCourse.jsx',
    'EditCourse.jsx',
    'AdminDashboard.jsx'
];

const importStatement = `import { getApiUrl } from "../src/config/api";`;

filesToUpdate.forEach(fileName => {
    const filePath = path.join(pagesDir, fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Check if import already exists
    if (!content.includes('getApiUrl')) {
        // Find the last import statement
        const importLines = content.split('\n');
        let lastImportIndex = -1;

        for (let i = 0; i < importLines.length; i++) {
            if (importLines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
            }
        }

        if (lastImportIndex !== -1) {
            importLines.splice(lastImportIndex + 1, 0, importStatement);
            content = importLines.join('\n');
        }
    }

    // Replace all hardcoded URLs
    const urlPattern = /(['"`])http:\/\/localhost:5000\/api\/users\/([^'"`]+)\1/g;
    const updatedContent = content.replace(urlPattern, (match, quote, endpoint) => {
        return `getApiUrl(${quote}users/${endpoint}${quote})`;
    });

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated: ${fileName}`);
    } else {
        console.log(`ℹ️  No changes needed: ${fileName}`);
    }
});

console.log('\n🎉 Migration complete!');
