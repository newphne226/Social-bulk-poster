const fs = require('fs');

// Fix about page - completely rewrite the footer section
function fixAboutPage() {
  let content = fs.readFileSync('src/app/about/page.tsx', 'utf8');
  
  // Find the footer section and fix it
  const footerStart = content.indexOf('<footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">');
  if (footerStart === -1) return;
  
  // Find the end of the footer
  const footerEnd = content.indexOf('</footer>', footerStart);
  if (footerEnd === -1) return;
  
  // Extract footer content
  const footerContent = content.substring(footerStart, footerEnd + 9);
  
  // Fix the footer structure
  let fixedFooter = footerContent
    .replace(
      /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
      '$1</p></div>\n      </footer>'
    )
    .replace(
      /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>\s*<\/footer>/g,
      '            </p></div>\n      </footer>'
    );
  
  // Reconstruct the file
  content = content.substring(0, footerStart) + fixedFooter + content.substring(footerEnd + 9);
  
  fs.writeFileSync('src/app/about/page.tsx', content);
  console.log('Fixed: about/page.tsx');
}

// Fix blog page
function fixBlogPage() {
  let content = fs.readFileSync('src/app/blog/page.tsx', 'utf8');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync('src/app/blog/page.tsx', content);
  console.log('Fixed: blog/page.tsx');
}

function fixCareersPage() {
  let content = fs.readFileSync('src/app/careers/page.tsx', 'utf8');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Also fix the subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  fs.writeFileSync('src/app/careers/page.tsx', content);
  console.log('Fixed: careers/page.tsx');
}

function fixContactPage() {
  let content = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
  
  // Fix the header structure - remove extra closing divs
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync('src/app/contact/page.tsx', content);
  console.log('Fixed: contact/page.tsx');
}

function fixCookiesPage() {
  let content = fs.readFileSync('src/app/cookies/page.tsx', 'utf8');
  
  // Fix thead
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
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
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync('src/app/privacy/page.tsx', content);
  console.log('Fixed: privacy/page.tsx');
}

function fixTermsPage() {
  let content = fs.readFileSync('src/app/terms/page.tsx', 'utf8');
  
  // Fix subscription & billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix the subscription line
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.<\/li>\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix the subscription line - fix the broken JSX
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.<\/li>\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix section 4 title
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix section 10 title
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix any remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  fs.writeFileSync('src/app/terms/page.tsx', content);
  console.log('Fixed: terms/page.tsx');
}

// Run all fixes
fixAboutPage();
fixBlogPage();
fixCareersPage();
fixContactPage();
fixCookiesPage();
fixDocsPage();
fixPrivacyPage();
fixTermsPage();

console.log('All fixes applied!');