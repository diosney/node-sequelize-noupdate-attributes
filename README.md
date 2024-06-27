# node-sequelize-noupdate-attributes

A [Sequelize](https://sequelize.org) plugin which adds **no update** and **readonly** attributes support to models.

[![donate](https://shields.io/badge/ko--fi-donate-ff5f5f?logo=ko-fi&style=for-the-badgeKo-fi)](https://ko-fi.com/diosney)
[![tests](https://github.com/diosney/node-sequelize-noupdate-attributes/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/diosney/node-sequelize-noupdate-attributes/actions/workflows/tests.yml)
[![npm](https://img.shields.io/npm/v/sequelize-noupdate-attributes)](https://www.npmjs.com/package/sequelize-noupdate-attributes)

> **Note:** Starting from version `2.0.0`, the plugin supports Sequelize `v6`.
> <br>Ensure to have at least the `v6.16.0` since there are some typings and functions, like `.getAttributes()`, that
> weren't available from `v6.1.0`.

## Installation

Ensure the `sequelize` package has been previously installed in the project.

```sh
npm install --save sequelize-noupdate-attributes
```

## Usage

### How to Import

If you are using Javascript, you can import using the regular CommonJS `require` as follows:

    const sequelizeNoUpdateAttributes  = require('sequelize-noupdate-attributes');

If you are using Typescript, you can use the `require` calls, or just the Ecmascript modules import:

    import sequelizeNoUpdateAttributes from 'sequelize-noupdate-attributes';

### How to Use

Add the plugin to the `sequelize` instance, then set the `noUpdate` or `readOnly` properties in your models
as demonstrated in the examples below:

```js
const sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');

const sequelize = new Sequelize('sqlite::memory:');
// Note that the passed reference is the `sequelize` instance.
sequelizeNoUpdateAttributes(sequelize);

const Post = sequelize.define('Post', {
  content: {
    type    : DataTypes.STRING,
    noUpdate: true
  }
});
```

What this does is to mark the `content` attribute so if an update is done, then:

* if the field's previous value is `null`, it will accept the change
* if the field's previous value is not `null`, it will trigger a `ValidationErrorItem` error.

so, the `content` field becomes **readonly** after its becomes not `null`.

Works too with foreign key fields in associations:

```js
models.Post.belongsTo(models.Person, {
  as        : 'Creator',
  foreignKey: {
    allowNull: false,
    noUpdate : true    // It will mark the `CreatorId` field to be `noUpdate`.
  }
});
```

### Readonly Attributes

If you want truly **readonly** attributes with no modifications at all
being allowed, you can use the `readonly` option as shown below:

```js
const Post = sequelize.define('Post', {
  content: {
    type    : DataTypes.STRING,
    readOnly: true
  }
});

// Or
const Post = sequelize.define('Post', {
  content: {
    type    : DataTypes.STRING,
    noUpdate: {
      readOnly: true
    }
  }
});
```

which effectively disables any modification on the `content` attribute,
no matter if the previous value was `null` or not, though the exception is
when the record is new.

If by any chance both `readonly` and `noUpdate` are present, `readOnly` takes precedence if is truthy.

## Notes

- The plugin does its work by registering a custom `beforeValidate` hook named `noUpdateAttributes`.

- If the plugin triggers a validation error, it will be a Sequelize `ValidationError` instance containing an `errors` 
  property of type `ValidationErrorItem[]`. 

  Each `ValidationErrorItem` instance will have an attribute called `validatorKey`, which, in the case of a plugin
  validation error, will be` 'noUpdateAttribute'` (`NoUpdateAttributesValidatorKeys.NoUpdateAttribute`).

## Issues

The source code can be accessed on [GitHub](https://github.com/diosney/node-sequelize-noupdate-attributes).
<br>
If you encounter any bugs or need a new feature, please report them on the
[issue tracker](https://github.com/diosney/node-sequelize-noupdate-attributes/issues).

## Tests

Just run `npm test`.

## License

The MIT License (MIT)

Copyright (c) 2016-Present Diosney Sarmiento

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
