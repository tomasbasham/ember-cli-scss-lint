'use strict';

const merge = require('lodash.merge')
const broccoli = require('broccoli')

module.exports.dummyTreeBuilder = function(scssLint, tree) {
  return function(app) {
    scssLint.included(app);

    // Create a new broccoli builder.
    const node = scssLint.lintTree(tree);
    const builder = new broccoli.Builder(node);

    // Returns a promise.
    return builder.build();
  }
};

module.exports.dummyAppFactory = function(options) {
  options = options || {};

  return merge({
    options: {
      scssLintOptions: {
        config: 'tests/dummy/.scss-lint.yml',
        outputResults: function(results) {
          return results; // Prevents verbose output in tests.
        }
      }
    },
    project: {
      root: 'tests/dummy/app'
    },
    trees: {
      app: 'tests/dummy/app'
    }
  }, options);
};
