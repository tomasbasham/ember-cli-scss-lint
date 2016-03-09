var expect = require('chai').expect
 , EmberApp = require('ember-cli/lib/broccoli/ember-app')
 , ScssLinter = require('broccoli-scss-linter')
 , emberCliScssLint = require('../index');

describe('scss-lint', function() {
  var app = null;

  beforeEach(function() {
    app = new EmberApp();
    app.options.scssLintOptions = {
      config: '.scss-lint.yml',
      bundleExec: true // Default is false.
    };
  });

  it('merges options from the consuming application', function() {
    emberCliScssLint.included(app);
    expect(app.options.scssLintOptions).to.have.property('bundleExec').that.equals(true);
  });

  it('lints the styles tree when the tree type is app', function() {
    expect(emberCliScssLint.lintTree('app')).to.be.an.instanceof(ScssLinter);
  });

  it('returns the styles tree when the tree type is not app', function() {
    expect(emberCliScssLint.lintTree('test')).to.deep.equal(app.trees.styles);
  });
});
