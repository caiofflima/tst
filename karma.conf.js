// Karma configuration
// Generated on Fri Feb 24 2023 11:24:18 GMT+0000 (Greenwich Mean Time)

module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
          require('karma-jasmine'),
          require('karma-firefox-launcher'),
          require('karma-jasmine-html-reporter'),
          require('karma-coverage-istanbul-reporter'),
          require('@angular-devkit/build-angular/plugins/karma'),
          require('karma-spec-reporter'),
          require('karma-junit-reporter'),
          require('karma-sonarqube-reporter')
      ],
      sonarqubeReporter: {
          basePath: 'src/app',
          filePattern: '**/*spec.ts',
          encoding: 'utf-8',
          outputFolder: 'reports',
          legacyMode: false,
          reportName: function (metadata) {
              return 'sonarqubeTestReport.xml';
          },
      },
      exclude: [
          '**/*.spec.ts'  // Ignora todos os arquivos com extensão .spec.ts
      ],
      client: {
          jasmine: {
              random: false
          },
          clearContext: false, // leave Jasmine Spec Runner output visible in browser
      },
      jasmineHtmlReporter: {
          suppressAll: true // removes the duplicated traces
      },
      coverageIstanbulReporter: {
          dir: require('path').join(__dirname, 'coverage'),
          reports: ['html', 'lcovonly', 'text-summary'],
          fixWebpackSourcePaths: true
      },
      junitReporter: {
          outputDir: 'junit'
      }, 
      reporters: ['progress', 'kjhtml', 'junit', 'coverage-istanbul', 'spec', 'sonarqube'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['FirefoxHeadless'],
      singleRun: true,
      restartOnFileChange: true,
    })
  }