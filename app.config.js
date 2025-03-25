// Import app.json config
const appJson = require("./app.json");

// Create a config that extends app.json
const config = {
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    EXPO_OS: process.platform,
  },
  // Ensure these critical settings are explicitly set
  newArchEnabled: true,
  scheme: "lms2025mobile",
};

export default config;
