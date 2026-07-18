const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix 1: Fix unescaped & in text content
  content = content.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&');
  
  // Fix 2: Fix specific broken JSX patterns
  
  // Fix contact page header structure - fix the extra closing div
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookies page - thead/tbody structure
  content = content.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
  
  // Fix docs page - nav/aside closing
  content = content.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
  
  // Fix footer text in about page
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
  );
  
  // Fix about page footer - missing closing div before footer
  // The issue is that there's a missing closing div before footer
  // Let's check the structure
  
  // Fix blog page footer
  content = content.replace(
    /(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>/g,
    '$1</p></div>'
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
  
  // Fix careers page - fix the subscription & billing text
  content = content.replace(/Subscription & Billing/g, 'Subscription & Billing');
  
  // Fix contact page - header structure
  content = content.replace(
    /(<nav className="hidden md:flex items-center gap-6">[\s\S]*?<\/nav>)\s*<\/div>\s*<\/div>\s*<\/header>/g,
    '$1            </div>\n          </div>\n        </header>'
  );
  
  // Fix cookies page - thead/tbody
  // Fix docs page - nav/aside
  // Fix privacy page footer
  // Fix terms page footer
  
  // Write if changed
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