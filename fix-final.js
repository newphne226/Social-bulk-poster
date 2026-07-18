const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix 1: Fix unescaped & in text content
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix 2: Fix specific known issues
  
  // Fix footer text - ensure proper closing
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
  
  // Fix specific known broken patterns
  content = content.replace(
    /<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*<\/div>/g,
    '<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms.</p></div>'
  );
  
  // Fix Subscription & Billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix specific broken JSX patterns
  // Fix footer closing
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix terms page specific issues
  // Fix the line with unescaped & in terms page
  content = content.replace(
    /Subscription & Billing/g,
    'Subscription & Billing'
  );
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix the terms page line 159 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix contact page header
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookie page thead
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix docs page nav/aside
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix footer text in all pages
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
  );
  
  // Fix footer closing
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix terms page specific line 159 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix contact page header structure
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookie page thead
  content = content.replace(/<\/thead>/g, '</thead>');
  
  // Fix docs page
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix all remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
    return true;
  } else {
    console.log(`No changes: ${filePath}`);
    return false;
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