const fs = require('fs');
const path = require('path');

// Fix all JSX issues in the pages
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix unescaped & in JSX text content
  // Replace & that are not already HTML entities
  content = content.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&');
  
  // Fix specific common patterns
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  
  // Fix common JSX structure issues
  // Fix unclosed tags
  content = content.replace(/<\/thead>/g, '</thead>');
  
  // Fix specific known issues
  content = content.replace(/<span className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.<\/div>/g, '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p>');
  content = content.replace(/The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g, 'The fastest way to schedule & publish to 5 platforms.</p>');
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}

const files = [
  'src/app/about/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/careers/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/cookies/page.tsx',
  'src/app/docs/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
];

for (const file of files) {
  try {
    fixFile(file);
  } catch (e) {
    console.error(`Error fixing ${file}:`, e.message);
  }
}