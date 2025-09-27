#!/usr/bin/env node

// Prebuild script to ensure React Native config is properly set up
const fs = require('fs');
const path = require('path');

console.log('🔧 Running prebuild script...');

// Ensure react-native.config.js exists and has the correct content
const configPath = path.join(__dirname, 'react-native.config.js');
const configContent = `module.exports = {
  project: {
    android: {
      packageName: 'com.gajendran2908.mobile',
      sourceDir: './android',
    },
    ios: {},
  },
};`;

try {
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Updated react-native.config.js');
} catch (error) {
  console.log('❌ Error writing react-native.config.js:', error.message);
}

// Verify the config
try {
  const config = require(configPath);
  console.log('✅ Config verification:', JSON.stringify(config, null, 2));
} catch (error) {
  console.log('❌ Config verification failed:', error.message);
}

console.log('🔧 Prebuild script completed');
