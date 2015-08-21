/* jshint node: true */
'use strict';

var path = require('path')
 , defaults = require('lodash/object/defaults')
 , mergeTrees = require('broccoli-merge-trees')
 , scssLintTree = require('broccoli-scss-lint');

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
   * @param {Object} tree
   *   The tree to be linted.
   *
   * @return {Object}
   *   Tree to be merged.
   */
  lintTree: function(treeType, tree) {
    if(treeType === 'app') {
      var mergedTrees = mergeTrees([this.app.trees.styles]);
      return scssLintTree(mergedTrees, this.app.options.scssLintOptions);
    }

    return tree;
  }
};
