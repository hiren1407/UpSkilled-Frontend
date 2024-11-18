module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Transform JavaScript/JSX files
    },
    transformIgnorePatterns: [
      "node_modules/(?!axios|@reduxjs/toolkit|jwt-decode)" // Specify packages to transform
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS files
    },
    testEnvironment: "jsdom", // Set test environment for React
  };
  