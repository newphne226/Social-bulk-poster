const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix 1: Fix unescaped & in text content
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix 2: Fix specific broken JSX patterns
  
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
  
  // Fix footer closing
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g,
    '$1</p></div>\n      </footer>'
  );
  
  // Fix specific broken patterns
  content = content.replace(/& publish/g, '& publish');
  content = content.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  content = content.replace(/Terms & Conditions/g, 'Terms & Conditions');
  content = content.replace(/Privacy & Security/g, 'Privacy & Security');
  content = content.replace(/Third-Party & Services/g, 'Third-Party & Services');
  content = content.replace(/schedule & publish/g, 'schedule & publish');
  
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