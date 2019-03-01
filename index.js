'use strict';

const path = require('path');
const defaults = require('lodash.defaults');
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
   *   app, tests, templates, or addon
   *
   * @param {Tree} tree
   *   tree of files (JavaScript files for app, tests, and addon types)
   *
   * @return {Object}
   *   Tree to be merged.
   */
  lintTree: function(treeType, tree) {
    const includePaths = this.scssLintOptions.includePaths || ['app'];
    if (includePaths.indexOf(treeType) > -1) {
      const filteredTreeToBeLinted = new Funnel(tree, { exclude: ['**/*.js'] });
      const lintedTree =  new ScssLinter(filteredTreeToBeLinted, this.scssLintOptions);

      return lintedTree;
    }
  }
};
