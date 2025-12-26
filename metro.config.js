const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add mp4 to the list of asset extensions
config.resolver.assetExts.push('mp4');

module.exports = config;