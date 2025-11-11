module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(jsdom|parse5))" // 👈 transforma também jsdom e parse5
  ],
  moduleFileExtensions: ["js", "json", "node"]
};
