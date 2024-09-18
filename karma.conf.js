module.exports = function (config) {
  config.set({
    frameworks: ["jasmine", "angular-filesort"],
    files: ["src/**/*.js", "src/**/*.html", "test/**/*.spec.js"],
    preprocessors: {
      "src/**/*.js": ["coverage"],
      "src/**/*.html": ["ng-html2js"],
    },
    reporters: ["progress", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    concurrency: Infinity,
  });
};
