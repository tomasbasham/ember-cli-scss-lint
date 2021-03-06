# ember-cli-scss-lint [![Build Status](https://travis-ci.com/tomasbasham/ember-cli-scss-lint.svg?branch=master)](https://travis-ci.com/tomasbasham/ember-cli-scss-lint) [![Maintainability](https://api.codeclimate.com/v1/badges/c14cf45a0ef5339b5104/maintainability)](https://codeclimate.com/github/tomasbasham/ember-cli-scss-lint/maintainability)

An [Ember CLI](https://ember-cli.com/) addon to integrate
[sass-lint](https://github.com/sasstools/sass-lint) for standards adherence and
improved style consistency.

One of the many great features of Ember CLI is its rich toolset surrounding the
framework such as eslint. This provides you with the ability to more easily
write consistent and self documenting code that any developer could understand.
However there is currently no similar feature to lint your stylesheets.

If you choose to compose your stylesheets using a preprocessor language such as
SCSS you will equally find no support to ensure your code follows best
practice. This addon solves this by integrating the `sass-lint` nodejs package
into the Ember CLI build process.

Previous versions of this addon made use of the Ruby implementation of
[scss-lint](https://github.com/brigade/scss-lint). However the Sass core team
is now building Sass in Dart instead of Ruby, and will no longer be maintaining
the Ruby implementation. Since `scss-lint` relies on the Ruby Sass
implementation, this means it will eventually not support the latest Sass
features and bug fixes. As such `sass-lint` has taken over in it's place which
offers better integration into an already JavaScript pipeline.

## Compatibility

* Ember.js v2.18 or above
* Ember CLI v2.13 or above

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-scss-lint
```

## Usage

Every time you run an Ember CLI process that requires building the application
(`ember server`, `ember test`, `ember build`) your stylesheets will be linted
and any errors output to the command line.

```
$ ember s
version: 1.13.13
Livereload server on http://localhost:49154
Serving on http://localhost:4200/

partials/_pagination.scss
  1:1   warning  Type-selector should be nested within its parent Class   force-element-nesting
  1:1   warning  Class should be nested within its parent Type-selector   force-element-nesting
  1:24  warning  Qualifying elements are not allowed for class selectors  no-qualifying-elements

✖ 3 problems (0 errors, 3 warnings)

Build successful - 24281ms.
```

### Configuration

#### sass-lint.yml

Linting can be configured by creating a `.sass-lint.yml` file in the root
directory of your Ember CLI project alongside your `.eslintrc` file. If you
already have a config for `scss-lint`, you can instantly convert it to the
equivalent `sass-lint` config
[here](sasstools.github.io/make-sass-lint-config).

##### Configuration Example

```yml
files:
  include: '**/*.scss'

options:
  formatter: stylish
  merge-default-rules: false

rules:
  border-zero:
    - 1
    - convention: zero

  brace-style:
    - 1
    - allow-single-line: true

  ...
```

#### ember-cli-build.js

Any configuration option you can set within the `.sass-lint.yml` file can also
be set within the `ember-cli-build.js` file of the consuming application. Any
option here will take precedence over those in the `.sass-lint.yml` file. This
is useful when needing to programmatically define rule sets depending upon some
condition.

##### JavaScript Configuration Example

```JavaScript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    scssLintOptions: {
      rules: [
        'border-zero': 2,
        'brace-style': 0
      ]
    }
  });

  return app.toTree();
};
```

For more information on the available rules see the [sass-lint linters
documentation](https://github.com/sasstools/sass-lint/tree/master/docs/rules).

#### Adding trees

By default this addon forwards the entire app tree to be linted, but will not
lint any files outside of the `app` folder. For most use cases this will be
sufficient, but for others this is limiting. If for example you wish to lint
files contained within the `vendor` tree you must tell the addon to do so. This
can be done within the `ember-cli-build.js` file.

##### Trees Example

```JavaScript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    scssLintOptions: {
      includePaths: [
        'vendor'
      ]
    }
  });

  return app.toTree();
};
```

## License

This project is licensed under the [MIT License](LICENSE.md).
