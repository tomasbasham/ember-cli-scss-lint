/* jshint node: true */
'use strict';

var path = require('path')
 , defaults = require('lodash/object/defaults')
 , mergeTrees = require('broccoli-merge-trees')
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
    if (!app.isTestingAddon) {
      this._super.included.call(this, app);
    }

    // Merge the consuming application's options with the default options.
    this.scssLintOptions = defaults(app.options.scssLintOptions || {}, {
      config: path.join(app.project.root, '/.scss-lint.yml'),
      bundleExec: false
    });

    this.app = app;
  },

  /*
   * Lint the application's styles
   * tree and report errors to the
   * user.
   *
   * @method lintTree
   *
   * @param {String} treeType
   *   Either 'app', 'tests', 'templates', or 'addon'.
   *
   * @return {Object}
   *   Tree to be merged.
   */
  lintTree: function(treeType) {
    if (treeType === 'app') {
      var stylesTree = mergeTrees([this.app.trees.styles])
      return new ScssLinter(stylesTree, this.app.options.scssLintOptions);
    }

    return this.app.trees.styles;
  }
};
