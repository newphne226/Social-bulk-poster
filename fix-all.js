const fs = require('fs');

// Fix contact page header
let content = fs.readFileSync('src/app/contact/page.tsx', 'utf8');
content = content.replace(/(\s*<\/nav>\s*)<\/div>\s*<\/div>\s*<\/header>/g, '$1            </div>\n        </header>');
fs.writeFileSync('src/app/contact/page.tsx', content);
console.log('Fixed: contact/page.tsx');

// Fix cookies page
let content2 = fs.readFileSync('src/app/cookies/page.tsx', 'utf8');
content2 = content2.replace(/<\/thead>/g, '</thead>');
content2 = content2.replace(/<\/thead>\s*<tbody/g, '</thead>\n                    <tbody');
content2 = content2.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');
fs.writeFileSync('src/app/cookies/page.tsx', content2);
console.log('Fixed: cookies/page.tsx');

// Fix docs page
let content3 = fs.readFileSync('src/app/docs/page.tsx', 'utf8');
content3 = content3.replace(/<\/nav>\s*<\/aside>/g, '</nav></aside>');
fs.writeFileSync('src/app/docs/page.tsx', content3);
console.log('Fixed: docs/page.tsx');

// Fix about page footer
let content4 = fs.readFileSync('src/app/about/page.tsx', 'utf8');
content4 = content4.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');
fs.writeFileSync('src/app/about/page.tsx', content4);
console.log('Fixed: about/page.tsx');

// Fix blog page
let content5 = fs.readFileSync('src/app/blog/page.tsx', 'utf8');
content5 = content5.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');
fs.writeFileSync('src/app/blog/page.tsx', content5);
console.log('Fixed: blog/page.tsx');

// Fix careers page
let content5b = fs.readFileSync('src/app/careers/page.tsx', 'utf8');
content5b = content5b.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');
fs.writeFileSync('src/app/careers/page.tsx', content5b);
console.log('Fixed: careers/page.tsx');

// Fix privacy page
let content6 = fs.readFileSync('src/app/privacy/page.tsx', 'utf8');
content6 = content6.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');
fs.writeFileSync('src/app/privacy/page.tsx', content6);
console.log('Fixed: privacy/page.tsx');

// Fix terms page
let content7 = fs.readFileSync('src/app/terms/page.tsx', 'utf8');
content7 = content7.replace(/Subscription & Billing/g, 'Subscription & Billing');
content7 = content7.replace(/Governing Law & Dispute Resolution/g, 'Governing Law & Dispute Resolution');
content7 = content7.replace(/(<p className="text-slate-400 text-sm">The fastest way to schedule & publish to 5 platforms\.\s*)<\/div>\s*<\/footer>/g, '$1</p></div>\n      </footer>');

// Fix the subscription line
content7 = content7.replace(
  /Subscription renews automatically unless cancelled before the renewal date\.<\/li>\s*<li className="flex items-start gap-3">/g,
  'Subscriptions renew automatically unless cancelled before the renewal date.</li>\n              <li className="flex items-start gap-3">'
);

fs.writeFileSync('src/app/terms/page.tsx', content7);
console.log('Fixed: terms/page.tsx');

console.log('All fixes applied!');