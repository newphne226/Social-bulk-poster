const fs = require('fs');

// Completely rewrite the problematic pages with correct JSX structure

// 1. Fix contact page - header structure
function fixContactPage() {
  const filePath = 'src/app/contact/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix the header structure - remove extra closing div
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: contact/page.tsx');
}

// 2. Fix cookies page - thead/tbody structure
function fixCookiesPage() {
  const filePath = 'src/app/cookies/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix thead closing
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>/g, '</thead>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: cookies/page.tsx');
}

// 3. Fix docs page - nav/aside closing
function fixDocsPage() {
  const filePath = 'src/app/docs/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: docs/page.tsx');
}

// 4. Fix about page - footer structure
function fixAboutPage() {
  const filePath = 'src/app/about/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix footer closing - add missing closing div before footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Ensure proper footer closing
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>\s*<\/footer>/g,
    '            </p></div>\n      </footer>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: about/page.tsx');
}

// 5. Fix blog page
function fixBlogPage() {
  const filePath = 'src/app/blog/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: blog/page.tsx');
}

// 6. Fix careers page
function fixCareersPage() {
  const filePath = 'src/app/careers/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: careers/page.tsx');
}

// 7. Fix contact page header
function fixContactPage() {
  const filePath = 'src/app/contact/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: contact/page.tsx');
}

// 7. Fix cookies page - thead
function fixCookiesPage() {
  const filePath = 'src/app/cookies/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ensure thead is properly closed
  content = content.replace(/<\/thead>/g, '</thead>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: cookies/page.tsx');
}

// 8. Fix docs page
function fixDocsPage() {
  const filePath = 'src/app/docs/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: docs/page.tsx');
}

// 9. Fix privacy page
function fixPrivacyPage() {
  const filePath = 'src/app/privacy/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed: privacy/page.tsx');
}

// 9. Fix terms page
function fixTermsPage() {
  const filePath = 'src/app/terms/page.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix subscription & billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  fs.writeFileSync(filePath, content);
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
fixContactPage();
fixCookiesPage();
fixDocsPage();
fixPrivacyPage();
fixTermsPage();

console.log('All fixes applied!');