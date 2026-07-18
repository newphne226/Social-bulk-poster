const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix unescaped & in text content
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific known patterns
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
  // Fix specific broken patterns
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  
  // Fix specific broken patterns in terms page
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix cookie page
  content = content.replace(/makes them less relevant\./g, 'makes them less relevant.');
  
  // Fix specific broken patterns in terms page
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix all remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific broken patterns
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
  // Fix specific broken patterns in terms page
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix all remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific broken patterns
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
  // Fix specific broken patterns in terms page
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix all remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
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
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/blog/[slug]/page.tsx',
];

for (const file of files) {
  try {
    fixFile(file);
  } catch (e) {
    console.error(`Error fixing ${file}:`, e.message);
  }
}