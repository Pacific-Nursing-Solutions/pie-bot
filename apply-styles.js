#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define replacements for standardized CSS classes
const replacements = [
  // Button replacements
  {
    pattern: /className="([^"]*?)px-4 py-2 bg-orange-500([^"]*?)text-white([^"]*?)rounded(-lg)?([^"]*?)"/g,
    replacement: 'className="btn-primary$5"'
  },
  {
    pattern: /className="([^"]*?)px-4 py-2 bg-blue-600([^"]*?)text-white([^"]*?)rounded(-lg)?([^"]*?)"/g,
    replacement: 'className="btn-secondary$5"'
  },
  {
    pattern: /className="([^"]*?)bg-orange-500 hover:bg-orange-600 text-white([^"]*?)"/g,
    replacement: 'className="btn-primary$2"'
  },
  {
    pattern: /className="([^"]*?)bg-blue-600 hover:bg-blue-700 text-white([^"]*?)"/g,
    replacement: 'className="btn-secondary$2"'
  },
  
  // Card replacements
  {
    pattern: /className="([^"]*?)bg-white dark:bg-gray-800 rounded-xl shadow(-sm|-md)? border border-gray-200 dark:border-gray-700([^"]*?)"/g,
    replacement: 'className="card-default$3"'
  },
  {
    pattern: /className="([^"]*?)bg-orange-50 dark:bg-gray-800 rounded-xl([^"]*?)"/g,
    replacement: 'className="card-primary$2"'
  },
  {
    pattern: /className="([^"]*?)bg-blue-50 dark:bg-gray-800 rounded-xl([^"]*?)"/g,
    replacement: 'className="card-secondary$2"'
  },
  
  // Text color replacements
  {
    pattern: /text-orange-500/g,
    replacement: 'text-accessible-orange'
  },
  {
    pattern: /text-blue-600/g,
    replacement: 'text-accessible-blue'
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
}

// Process all TypeScript and JavaScript files in src directory
const files = glob.sync('./client/src/**/*.{ts,tsx,js,jsx}');

console.log('Applying standardized CSS classes...');
files.forEach(processFile);
console.log('Done!');