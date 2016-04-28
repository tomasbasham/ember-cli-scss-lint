# Ember-cli-scss-lint [![Build Status](https://travis-ci.org/tomasbasham/ember-cli-scss-lint.svg?branch=master)](https://travis-ci.org/tomasbasham/ember-cli-scss-lint)

An [Ember CLI](http://www.ember-cli.com/) addon to integrate `scss-lint` for standards adherence and improved style consistency.

One of the many great features of Ember CLI is its rich toolset surrounding the framework such as jshint. This provides you with the ability to more easily write consistent and self documenting code that any developer could understand. However there is currently no similar feature to lint your stylesheets.

If you choose to compose your stylesheets using a preprocessor language such as SCSS you will equally find no support to ensure your code follows best practice. This addon solves this by integrating the `scss-lint` command line tool into the Ember CLI build process.

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-scss-lint
```

**Note:** This addon requires that you first install a version of `scss-lint`. To do this run `gem install scss-lint` from the command line.

## Usage

Every time you run an Ember CLI process that requires building the application (`ember server`, `ember test`, `ember build`) your stylesheets will be linted and any errors output to the command line.

```
$ ember s
version: 1.13.13
Livereload server on http://localhost:49154
Serving on http://localhost:4200/

[scss-lint] mixins/_utilities.scss:8 - PropertySortOrder: Properties should be ordered color, text-decoration
[scss-lint] mixins/_utilities.scss:9 - ColorKeyword: Color `white` should be written in hexadecimal form as `#ffffff`

Build successful - 24281ms.
```

### Configuration

Linting can be configured by creating a `.scss-lint.yml` file in the root directory of your Ember CLI project alongside your `.jshintrc` file.

##### <a name="configuration-example"></a>Example:

```yml
linters:
  BangFormat:
    enabled: true

  BorderZero:
    enabled: true

  ColorKeyword:
    enabled: true

  Comment:
    enabled: true

  ...
```

For more information on the available rules see the [scss-lint linters documentation](https://github.com/causes/scss-lint/blob/master/lib/scss_lint/linter/README.md).

## Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
