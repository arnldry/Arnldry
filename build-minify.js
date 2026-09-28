const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Arnold Lapuz Portfolio Minification Tool ===');

// 1. Minify CSS
function minifyCSS(css) {
  return css
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    // Remove space around braces, colons (not inside calc), semicolons, commas
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/\s+(!important)/g, '$1')
    // Remove trailing semicolons before closing brace
    .replace(/;}/g, '}')
    .trim();
}

const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
const minCssPath = path.join(__dirname, 'assets', 'css', 'style.min.css');

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  const minCss = minifyCSS(css);
  fs.writeFileSync(minCssPath, minCss, 'utf8');
  console.log(`[CSS] Minified: ${css.length} bytes -> ${minCss.length} bytes (-${Math.round((1 - minCss.length / css.length) * 100)}%)`);
}

// 2. Minify JS
function minifyJS(source) {
  let output = '';
  let i = 0;
  const n = source.length;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;

  while (i < n) {
    const ch = source[i];
    const next = source[i + 1];

    // Inside normal string literal (' or ")
    if (inString) {
      output += ch;
      if (ch === '\\') {
        output += next || '';
        i += 2;
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      i++;
      continue;
    }

    // Inside template literal (`)
    if (inTemplate) {
      output += ch;
      if (ch === '\\') {
        output += next || '';
        i += 2;
        continue;
      }
      if (ch === '`') {
        inTemplate = false;
      }
      i++;
      continue;
    }

    // Single line comment: // ...
    if (ch === '/' && next === '/') {
      while (i < n && source[i] !== '\n') {
        i++;
      }
      continue;
    }

    // Multi line comment: /* ... */
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        i++;
      }
      i += 2;
      continue;
    }

    // Entering single or double quote string
    if (ch === '\'' || ch === '"') {
      inString = true;
      stringChar = ch;
      output += ch;
      i++;
      continue;
    }

    // Entering template literal
    if (ch === '`') {
      inTemplate = true;
      output += ch;
      i++;
      continue;
    }

    output += ch;
    i++;
  }

  // Second pass: compact line breaks and trim lines while preserving code structure
  const lines = output.split('\n');
  const cleanLines = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx].trim();
    if (trimmed.length > 0) {
      cleanLines.push(trimmed);
    }
  }

  return cleanLines.join('\n');
}

const jsPath = path.join(__dirname, 'assets', 'js', 'main.js');
const minJsPath = path.join(__dirname, 'assets', 'js', 'main.min.js');

if (fs.existsSync(jsPath)) {
  const js = fs.readFileSync(jsPath, 'utf8');
  const minJs = minifyJS(js);
  fs.writeFileSync(minJsPath, minJs, 'utf8');
  console.log(`[JS] Minified: ${js.length} bytes -> ${minJs.length} bytes (-${Math.round((1 - minJs.length / js.length) * 100)}%)`);

  // Verify syntax with Node compiler
  try {
    execSync(`node -c "${minJsPath}"`);
    console.log('[JS] Syntax verification: PASSED (100% valid JavaScript)');
  } catch (err) {
    console.error('[JS] Syntax verification error:', err.message);
  }
}

console.log('=== Minification complete! ===');
