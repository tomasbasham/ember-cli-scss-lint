'use strict';

const assert = require('chai').assert
const merge = require('lodash.merge')
const broccoli = require('broccoli')
const scssLint = require('../')
const Sinon = require('sinon');

const lint = dummyTreeBuilder('app');
let sandbox, builder, errors;

describe('ember-cli-scss-lint', function() {
  beforeEach(function() {
    sandbox = Sinon.sandbox.create();
    errors = [];
  });

  afterEach(function() {
    sandbox.restore();
    builder.cleanup();
  });

  // Because the full Ember stack is not created
  // when testing it is important to fool the
  // addon that the test suite is aware under
  // normal circumstance the addon will be
  // created with a super property that is called
  // within the included hook.
  before(function() {
    scssLint._super = Object.create(Function.prototype);
    scssLint._super.included = function() {};
  });

  it('is aware of calls to super', function() {
    const stub = sandbox.stub(scssLint._super, 'included').callsFake(function() {
      return true;
    });

    return lint('tests/dummy/app').then(function() {
      assert.ok(stub.calledOnce);
    });
  });

  it('lints the styles tree from the dummy app', function() {
    const expected = [
      'Color \'white\' should be written in its hexadecimal form #ffffff',
      'Color literals such as \'white\' should only be used in variable declarations',
      'Selectors must be placed on new lines'
    ];

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    return lint('tests/dummy/app').then(function() {
      expected.forEach(assertMessage);
    });
  });

  it('accepts configuration values from the dummy app', function() {
    const expected = [
      'Color \'white\' should be written in its hexadecimal form #ffffff',
      'Color literals such as \'white\' should only be used in variable declarations'
    ];

    const options = {
      options: {
        scssLintOptions: {
          rules: {
            'single-line-per-selector': 0
          }
        }
      }
    };

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    return lint('tests/dummy/app', options).then(function() {
      expected.forEach(assertMessage);
    });
  });

  it('ignores file specified within the linting configuration', function() {
    const expected = [
      'Selectors must be placed on new lines'
    ];

    const options = {
      options: {
        scssLintOptions: {
          config: '.scss-lint-ignore-file.yml'
        }
      }
    };

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    return lint('tests/dummy/app', options).then(function() {
      expected.forEach(assertMessage);
    });
  });

  it('ignored files specified within the linting configuration', function() {
    const expected = [
      'Selectors must be placed on new lines'
    ];

    const options = {
      options: {
        scssLintOptions: {
          config: '.scss-lint-ignore-files.yml'
        }
      }
    };

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    return lint('tests/dummy/app', options).then(function() {
      expected.forEach(assertMessage);
    });
  })
});

function postProcess(results) {
  const report = results.report;
  const output = results.output;

  if (report.errorCount || report.warningCount) {
    errors = errors.concat(report.messages);
  }

  return { output: output };
}

function dummyFactory(sourcePath, options) {
  return merge({
    options: {
      scssLintOptions: {
        config: '.scss-lint.yml',
        postProcess: postProcess
      }
    },
    project: {
      root: sourcePath
    },
    trees: {
      app: sourcePath
    }
  }, options || {});
}

function dummyTreeBuilder(tree) {
  return function(sourcePath, options) {
    const dummy = dummyFactory(sourcePath, options);
    scssLint.included(dummy);

    // Create a new broccoli builder.
    const node = scssLint.lintTree(tree);
    builder = new broccoli.Builder(node);

    // Returns a promise.
    return builder.build();
  }
}
