// Standalone extraction (YUNIMOBILE-0009): Expo's default Metro config.
// The monorepo-specific watchFolders/nodeModulesPaths overrides were removed;
// expo/metro-config detects the local pnpm workspace on its own.
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
