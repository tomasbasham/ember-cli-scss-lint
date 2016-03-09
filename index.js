/* jshint node: true */
'use strict';

var path = require('path')
 , defaults = require('lodash/object/defaults')
 , ScssLinter = require('broccoli-scss-linter');

module.exports = {
  name: 'ember-cli-scss-lint',

  /*
   * Merge scss-lint configuration
   * options from the consuming
   * application.
   *
   * @method included
   *
   * @param {Object} app
   *   An EmberApp instance.
   */
  included: function(app) {
    this.app = app;

    // Merge the consuming application's options with the default options.
    this.app.options.scssLintOptions = defaults(this.app.options.scssLintOptions || {}, {
      config: path.join(this.app.project.root, '/.scss-lint.yml'),
      bundleExec: false
    });
  },

  /*
   * Lint the application's styles
   * tree and report errors to the
   * user.
   *
   * @method lintTree
   *
   * @param {String} treeType
   *   Either 'app', 'tests' or 'addon'.
   *
   * @return {Object}
   *   Tree to be merged.
   */
  lintTree: function(treeType) {
    if (treeType === 'app') {
      return new ScssLinter([this.app.trees.styles], this.app.options.scssLintOptions);
    }

    return this.app.trees.styles;
  }
};
