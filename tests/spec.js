'use strict';

const assert = require('chai').assert
const specHelper = require('./spec-helper');
const scssLint = require('../')
const Sinon = require('sinon');

const lint = specHelper.dummyTreeBuilder(scssLint, 'app');
let sandbox, errors;

describe('ember-cli-scss-lint', function() {
  beforeEach(function() {
    sandbox = Sinon.sandbox.create();
    errors = []
  });

  afterEach(function() {
    sandbox.restore();
  });

  // Because the full Ember stack is not created when testing it is important
  // to fool the addon that the test suite is aware under normal circumstance
  // the addon will be created with a super property that is called within the
  // included hook.
  before(function() {
    scssLint._super = Object.create(Function.prototype);
    scssLint._super.included = function() {};
  });

  it('is aware of calls to super', function() {
    const stub = sandbox.stub(scssLint._super, 'included').callsFake(function() {
      return true;
    });

    const dummyApp = specHelper.dummyAppFactory('tests/dummy/app');

    lint(dummyApp).then(function() {
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

    const dummyApp = specHelper.dummyAppFactory('tests/dummy/app', {
      options: {
        scssLintOptions: {
          postProcess: postProcess
        }
      }
    });

    lint(dummyApp).then(function() {
      expected.forEach(assertMessage);
    });
  });

  it('accepts configuration values from the dummy app', function() {
    const expected = [
      'Color \'white\' should be written in its hexadecimal form #ffffff',
      'Color literals such as \'white\' should only be used in variable declarations'
    ];

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    const dummyApp = specHelper.dummyAppFactory({
      options: {
        scssLintOptions: {
          postProcess: postProcess,
          rules: {
            'single-line-per-selector': 0
          }
        }
      }
    });

    lint(dummyApp).then(function() {
      expected.forEach(assertMessage);
    });
  });

  it('ignores files specified within the linting configuration', function() {
    const expected = [
      'Selectors must be placed on new lines'
    ];

    const assertMessage = function(message, index) {
      assert.equal(errors[index].message, message);
    };

    const dummyApp = specHelper.dummyAppFactory({
      options: {
        scssLintOptions: {
          config: 'tests/dummy/.scss-lint-ignore-files.yml',
          postProcess: postProcess
        }
      }
    });

    lint(dummyApp).then(function() {
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
