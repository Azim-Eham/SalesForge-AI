import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract body content (between <body...> and </body>)
body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
if not body_match:
    print("Could not find body tag")
    exit(1)

body_content = body_match.group(1)

# Remove script tags at the bottom
body_content = re.sub(r'<script.*?</script>', '', body_content, flags=re.DOTALL | re.IGNORECASE)

# Convert class to className
body_content = body_content.replace('class="', 'className="')
body_content = body_content.replace('for="', 'htmlFor="')

# Close br tags
body_content = body_content.replace('<br>', '<br />')

# Close img tags (simple regex, assuming no > inside attributes)
body_content = re.sub(r'(<img[^>]+)(?<!/)>', r'\1 />', body_content)

# Convert comments
body_content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body_content, flags=re.DOTALL)

# Add inline styles object if any (none exist in the html but just in case, wait, there's style="--sticky-top: ..." set in JS, not HTML)

# Read main.js
with open('main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

# Remove DOMContentLoaded and extract functions
# The functions are initNav, initHero, initFeatures, initStickyStack, initTestimonials
# We can just put the entire main.js inside a useEffect, but we must remove DOMContentLoaded
main_js = re.sub(r'document\.addEventListener\("DOMContentLoaded", \(\) => {([\s\S]*?)}\);', r'\1', main_js)

# Combine into App.jsx
app_jsx = f"""import React, {{ useEffect }} from 'react';
import './index.css';

export default function App() {{
  useEffect(() => {{
    // We assume gsap and ScrollTrigger are available globally via CDN, or we should import them.
    // To make it proper React, we'll import them at the top.
    const initApp = () => {{
{main_js}
      initNav();
      initHero();
      initFeatures();
      initStickyStack();
      initTestimonials();
    }};
    
    // Give DOM a small tick to render before triggering GSAP
    setTimeout(initApp, 100);

    return () => {{
      // Cleanup if needed (optional for this simple port)
    }};
  }}, []);

  return (
    <>
{body_content}
    </>
  );
}}
"""

# Let's fix the gsap register in main.js
app_jsx = app_jsx.replace("gsap.registerPlugin(ScrollTrigger);", "")
app_jsx = f"import {{ gsap }} from 'gsap';\nimport {{ ScrollTrigger }} from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\n{app_jsx}"

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)

print("App.jsx created successfully")
