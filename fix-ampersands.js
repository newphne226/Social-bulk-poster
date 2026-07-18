const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace all unescaped & in text content (not already escaped entities)
  // We need to be careful to only replace & that are in text content, not in attributes or already escaped
  
  // Strategy: Replace & with & in text content but not in:
  // - Already escaped entities (&, <, >, ", &#xxx;, &#x...;)
  // - Inside quotes/attributes
  // - Inside JavaScript code
  
  // For now, let's do a targeted approach - fix the specific known issues
  
  // Fix known patterns
  const patterns = [
    ['schedule & publish', 'schedule & publish'],
    ['Governing Law & Dispute Resolution', 'Governing Law & Dispute Resolution'],
    ['Subscription & Billing', 'Subscription & Billing'],
    ['Terms & Conditions', 'Terms & Conditions'],
    ['Privacy & Security', 'Privacy & Security'],
    ['Third-Party & Services', 'Third-Party & Services'],
    ['Terms & Conditions', 'Terms & Conditions'],
    ['Privacy & Security', 'Privacy & Security'],
  ];
  
  for (const [from, to] of patterns) {
    content = content.split('&').join('&');
  }
  
  // This won't work because it replaces all &. Let me be more careful.
  // The issue is that in JSX, & in text content must be escaped as &
  // But we need to be careful not to double-escape.
  
  // Let's use a regex that finds & not followed by a valid entity name
  // &, <, >, ", &apos;, &#nnn;, &#xNNN;
  
  content = content.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&');
  
  if (content !== fs.readFileSync(process.argv[2], 'utf8')) {
    fs.writeFileSync(process.argv[2], content);
    console.log(`Fixed: ${process.argv[2]}`);
  } else {
    console.log(`No changes needed: ${process.argv[2]}`);
  }
}

// For CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  if (filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  }
}