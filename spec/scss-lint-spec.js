var expect = require('chai').expect
 , scssLintTree = require('broccoli-scss-linter');

describe('scss-lint', function() {
  var tree, options;

  beforeEach(function() {
    tree = {};
    options = {
      config: '.scss-lint.yml',
      bundleExec: false
    };
  });

  it('throws an error if no options are given', function() {
    expect(scssLintTree.bind(tree)).to.throw(TypeError);
  });

  it('throws an error if given invalid options', function() {
    expect(scssLintTree.bind(tree, {})).to.throw(TypeError);
  });

  it('accepts valid options', function() {
    expect(scssLintTree.bind(tree, options)).to.be.ok;
  });
});
