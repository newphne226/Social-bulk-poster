const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix unescaped & in text content
  // The issue is that & in text content needs to be & in JSX
  
  // Fix specific known patterns
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  
  // Fix the footer text in all pages
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix specific broken patterns
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  content = content.replace(
    /The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    'The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix specific broken patterns in terms page
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix the specific broken line in terms page
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix the cookie page unescaped &
  content = content.replace(/makes them less relevant\./g, 'makes them less relevant.');
  
  // Fix any remaining unescaped & in text content (but not in HTML entities)
  // This regex finds & that are not part of HTML entities
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  if (content !== fs.readFileSync(process.argv[2], 'utf8')) {
    fs.writeFileSync(process.argv[2], content);
    console.log(`Fixed: ${process.argv[2]}`);
    return true;
  }
  return false;
}

const filePath = process.argv[2];
if (filePath) {
  try {
    fixFile(filePath);
  } catch (e) {
    console.error('Error fixing', filePath, e.message);
  }
}