const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // 1. Fix unescaped & in text content (not in HTML entities)
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific known broken patterns
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
  // Fix broken JSX patterns
  
  // Fix broken h3/h1 tags with unclosed spans
  content = content.replace(/\{job\.title\}<\/span>/g, '{job.title}</h3>');
  content = content.replace(/\{post\.title\}<\/span>/g, '{post.title}</h3>');
  content = content.replace(/\{post\.title\}<\/span>/g, '{post.title}</h3>');
  
  // Fix specific broken JSX patterns in careers page
  content = content.replace(
    /<h3 className="text-2xl font-bold text-slate-900 dark:text-white">\{job\.title\}<\/span>/g,
    '<h3 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h3>'
  );
  
  // Fix blog slug page h1
  content = content.replace(
    /<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">\{post\.title\}<\/span>/g,
    '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">{post.title}</h1>'
  );
  
  // Fix blog page h1
  content = content.replace(
    /<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">\{post\.title\}<\/span>/g,
    '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">{post.title}</h1>'
  );
  
  // Fix footer text - The fastest way to schedule & publish to 5 platforms
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
  );
  
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
  );
  
  // Fix footer closing
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix contact page header
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookies page thead
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix docs page nav/aside
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix about page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix blog page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix careers page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix careers page specific issue with Subscription & Billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix contact page header structure
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookies page thead
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix docs page nav/aside
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix blog slug page
  content = content.replace(/<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">\{post\.title\}<\/span>/g, '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">{post.title}</h1>');
  
  // Fix blog slug page breadcrumb
  content = content.replace(/<Link href="\/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog<\/Link>/g, '<Link href="/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</Link>');
  
  // Fix blog slug page nav
  content = content.replace(/<Link href="\/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features<\/Link>/g, '<Link href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</Link>');
  
  // Fix terms page - subscription line
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.<\/li>\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page - fix the specific line 141 issue with EU
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix all remaining unescaped & in text content
  // This is the most comprehensive fix
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix specific broken JSX patterns
  // Fix unclosed span in careers page
  content = content.replace(/\{job\.title\}<\/span>/g, '{job.title}</h3>');
  content = content.replace(/\{post\.title\}<\/span>/g, '{post.title}</h3>');
  
  // Fix blog slug page h1
  content = content.replace(
    /<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">\{post\.title\}<\/span>/g,
    '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">{post.title}</h1>'
  );
  
  // Fix blog slug page breadcrumb
  content = content.replace(
    /<Link href="\/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog<\/Link>/g,
    '<Link href="/blog" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Blog</Link>'
  );
  
  // Fix blog slug page nav
  content = content.replace(/<Link href="\/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features<\/Link>/g, '<Link href="/features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Features</Link>');
  
  // Fix careers page h3
  content = content.replace(
    /<h3 className="text-2xl font-bold text-slate-900 dark:text-white">\{job\.title\}<\/span>/g,
    '<h3 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h3>'
  );
  
  // Fix about page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix blog page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix careers page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix privacy page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix terms page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix contact page header
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookies page thead
  content = content.replace(/<\/thead>/g, '</thead>');
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix docs page nav/aside
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix privacy page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix terms page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix terms page - fix the specific line 141 issue
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue
  content = content.replace(
    /You must be at least 13 years old \(16 in EU\) to create an account\.<\/li>/g,
    'You must be at least 13 years old (16 in EU) to create an account.</li>'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix terms page governing law
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  
  // Fix terms page - fix the specific line 141 issue
  content = content.replace(
    /Subscriptions renew automatically unless cancelled before the renewal date\.<\/li>\s*<li className="flex items-start gap-3">/g,
    'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
  );
  
  // Fix terms page subscription & billing line
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
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
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  
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
  
  // Fix all remaining unescaped &
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  if (content !== originalContent) {
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
    console.error(`Error fixing ${file}:`, e.message);
  }
}