/* eslint-env node */
'use strict';

const assert = require('chai').assert
const merge = require('lodash/object/merge')
const broccoli = require('broccoli')
const scssLint = require('../')
const Sinon = require('sinon');

let sandbox, builder, errors = [];

// Default linting function using the `app`
// tree type.
const lint = dummyTreeBuilder('app');

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
    const stub = sandbox.stub(scssLint._super, 'included', function() {
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

    return lint('tests/dummy/app').then(function() {
      assert.lengthOf(errors, 3);
      expected.forEach(function(message, index) { assert.equal(errors[index].message, message) });
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

    return lint('tests/dummy/app', options).then(function() {
      assert.lengthOf(errors, 2);
      expected.forEach(function(message, index) { assert.equal(errors[index].message, message) });
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

    return lint('tests/dummy/app', options).then(function() {
      assert.lengthOf(errors, 1);
      expected.forEach(function(message, index) { assert.equal(errors[index].message, message) });
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

    return lint('tests/dummy/app', options).then(function() {
      assert.lengthOf(errors, 1);
      expected.forEach(function(message, index) { assert.equal(errors[index].message, message) });
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
