const fs = require('fs');

function fixContactPage() {
  let content = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
  let originalContent = content;
  
  // Fix the header structure - remove extra closing divs
  content = content.replace(
    /(\s*<\/nav>\s*)<\/div>\s*<\/div>\s*<\/header>/g,
    '$1\n          </div>\n        </header>'
  );
  
  if (content !== fs.readFileSync('src/app/contact/page.tsx', 'utf8')) {
    fs.writeFileSync('src/app/contact/page.tsx', content);
    console.log('Fixed: contact/page.tsx');
    return true;
  }
  return false;
}

function fixCookiesPage() {
  let content = fs.readFileSync('src/app/cookies/page.tsx', 'utf8');
  
  // Fix thead closing - ensure it's properly closed
  content = content.replace(/<\/thead>/g, '</thead>');
  
  // Ensure tbody follows thead
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  fs.writeFileSync('src/app/cookies/page.tsx', content);
  console.log('Fixed: cookies/page.tsx');
}

function fixDocsPage() {
  let content = fs.readFileSync('src/app/docs/page.tsx', 'utf8');
  
  // Fix nav/aside closing
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  fs.writeFileSync('src/app/docs/page.tsx', content);
  console.log('Fixed: docs/page.tsx');
}

function fixPrivacyPage() {
  let content = fs.readFileSync('src/app/privacy/page.tsx', 'utf8');
  
  // Fix footer closing
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync('src/app/privacy/page.tsx', content);
  console.log('Fixed: privacy/page.tsx');
}

function fixTermsPage() {
  let content = fs.readFileSync('src/app/terms/page.tsx', 'utf8');
  
  // Fix the subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix the specific line 159 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync('src/app/terms/page.tsx', content);
  console.log('Fixed: terms/page.tsx');
}

// Run all fixes
const fs = require('fs');

fixContactPage();
fixCookiesPage();
fixDocsPage();
fixPrivacyPage();
fixTermsPage();

console.log('All fixes applied!');