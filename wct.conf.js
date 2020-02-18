//var path = require('path');

var ret = {
  suites: ["test/**/*.html"],
  plugins: {
    local: {
      browsers: ['chrome']
    },
    sauce: {
      disabled: true
    },
    istanbub: {
      dir: './coverage',
      reporters: ['text-summary', 'lcov'],
      include: [
        '/src/**/*.js'
      ]
    //   ,
    //   thresholds: {
    //     global: {
    //       statements: 80,
    //       branches: 80,
    //       functions: 90,
    //       lines: 80
    //     }
    //   }
    }
  }
};

module.exports = ret;