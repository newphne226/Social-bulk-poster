const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix unescaped & in JSX text
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  
  // Fix the specific footer text
  content = content.replace(
    'The fastest way to schedule & publish to 5 platforms.</            </div>',
    'The fastest way to schedule & publish to 5 platforms.</p>'
  );
  
  content = content.replace(
    'The fastest way to schedule & publish to 5 platforms.</div>',
    'The fastest way to schedule & publish to 5 platforms.</p>'
  );
  
  // Fix any other unescaped & in JSX text
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix any missing </p> before </div> in footer area
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix specific broken JSX in cookies page - thead closing
  content = content.replace(/<\/thead>/g, '</thead>');
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  } else {
    console.log('No changes:', filePath);
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
    console.error('Error fixing', file, e.message);
  }
}