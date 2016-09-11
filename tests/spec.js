/* jshint node: true */
'use strict';

var assert = require('chai').assert;
var broccoli = require('broccoli');
var hook = require('./utils/hook-stdout');
var scssLint = require('..');

var regex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
var builder = null;
var errors = [];

hook(function(string) {
  errors.push(string.replace(regex, ''));
});

function buildDummyApp(sourcePath) {
  return {
    isTestingAddon: true,
    options: {
      scssLintOptions: {
        config: '.scss-lint.yml'
      }
    },
    project: {
      root: sourcePath
    },
    trees: {
      styles: sourcePath
    }
  };
}

function lint(sourcePath) {
  var dummy = buildDummyApp(sourcePath);
  scssLint.included(dummy);

  // Create a new broccoli builder.
  var node = scssLint.lintTree('app');
  builder = new broccoli.Builder(node);

  // Returns a promise.
  return builder.build();
}

describe('ember-cli-scss-lint', function() {
  beforeEach(function() {
    errors = [];
  });

  afterEach(function() {
    builder.cleanup();
  });

  it('lints the styles tree from the dummy app', function() {
    return lint('tests/dummy').then(function() {
      assert.lengthOf(errors, 1);
      assert.equal(errors[0], '\r\n[scss-lint] app/styles/style.scss:6 - ColorKeyword: Color `white` should be written in hexadecimal form as `#ffffff`\n');
    });
  });
});
