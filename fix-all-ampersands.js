const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace all unescaped & characters in text content with &
  // This regex finds & that are not already part of an HTML entity
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Also fix specific known issues
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  
  // Fix specific broken JSX patterns
  // Fix unclosed span tags
  content = content.replace(/<span>/g, '<span>');
  content = content.replace(/<\/span>/g, '</span>');
  
  // Fix specific broken patterns
  content = content.replace(/<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g, '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>');
  content = content.replace(/<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.<\/div>/g, '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>');
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
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
  'src/app/blog/[slug]/page.tsx',
];

for (const file of files) {
  try {
    fixFile(file);
  } catch (e) {
    console.error('Error fixing', file, e.message);
  }
}