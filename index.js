'use strict';

const path = require('path');
const defaults = require('lodash.defaults');
const mergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');
const ScssLinter = require('broccoli-scss-linter');

module.exports = {
  name: require('./package').name,

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
    this._super.included.call(this, app);

    // Merge the consuming application's options with the default options.
    this.scssLintOptions = defaults(app.options.scssLintOptions || {}, {
      config: path.join(app.project.root, '.sass-lint.yml'),
      testGenerator: 'qunit'
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
      let trees = [this.app.trees.app];

      // Push any custom paths onto the trees array
      // to be linted.
      if (this.scssLintOptions.includePaths) {
        trees.push.apply(trees, this.scssLintOptions.includePaths);
      }

      const linted = trees.map(function(tree) {
        const filteredTreeToBeLinted = new Funnel(tree, { exclude: ['**/*.js'] });
        return new ScssLinter(mergeTrees([filteredTreeToBeLinted]), this.scssLintOptions);
      }, this);

      return mergeTrees(linted, { overwrite : true });
    }
  }
};
