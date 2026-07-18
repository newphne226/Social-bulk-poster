const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix unescaped & in text content
  // Replace & with & in text content, but not in already escaped entities
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific known broken patterns
  // Fix footer text
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix footer structure - ensure </p> before </div>
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
  );
  
  // Fix common broken patterns
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific broken JSX structures
  // Fix footer structure - ensure proper closing
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix cookie page thead closing
  content = content.replace(/<\/thead>/g, '</thead>');
  
  // Fix docs page nav closing
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix terms page specific issues
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
  // Fix broken footer text in various pages
  const footerPatterns = [
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/p>\s*<\/div>/g,
  ];
  
  for (const pattern of footerPatterns) {
    content = content.replace(pattern, 'The fastest way to schedule & publish to 5 platforms.</p></div>');
  }
  
  // Write if changed
  if (content !== fs.readFileSync(process.argv[2], 'utf8')) {
    fs.writeFileSync(process.argv[2], content);
    console.log(`Fixed: ${process.argv[2]}`);
  } else {
    console.log(`No changes: ${process.argv[2]}`);
  }
}

// CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  if (filePath) {
    try {
      fixFile(filePath);
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}