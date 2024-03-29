// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/socket.io-client/dist/socket.io.js',
      'app/bower_components/angular-socket-io/socket.js',
      'app/bower_components/d3/d3.js',
      'app/bower_components/nvd3/nv.d3.js',
      'app/bower_components/moment/moment.js',
      'app/bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/smoothie-bower/smoothie.js',
      'app/scripts/*.js',
      'app/scripts/**/*.js',
      'test/karma/mock/**/*.js',
      'test/karma/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
