# node-sequelize-noupdate-attributes

A very simple [Sequelize](https://github.com/sequelize/sequelize) plugin which adds **no update** and **readonly** attributes support.

## Prerequisites

Have previously installed the `sequelize` package in the project.

## Install

```sh
npm install --save sequelize-noupdate-attributes
```

## Usage

Add the plugin to the sequelize instance and then set the noupdate
properties in your models, as shown in the basic example below:

```js
var sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes');

var sequelize = new Sequelize('database', 'user', 'password');
sequelizeNoUpdateAttributes(sequelize); // Note that is the `sequelize` instance the passed reference.

var Post = sequelize.define('Post', {
  content: {
    type    : Sequelize.STRING,
    noUpdate: true
  }
});
```

What this do is to mark the `content` attribute so if an update is done, then:

* if the field previous value is null, it will accept the change
* if the field previous value is not null, it will trigger a `SequelizeValidationErrorItem` error.

so, the `content` field becomes a **readonly** after its becomes not null.

Works too with foreign key fields in associations:

```js
models.Post.belongsTo(models.Person, {
  as        : 'Creator',
  foreignKey: {
    allowNull: false,
    noUpdate : true    // Will mark the `CreatorId` field to be `noUpdate`d.
  }
});
```

### Readonly attributes

If you do want truly **readonly** attributes with no modifications at all
being allowed, you can use the `readonly` option as shown below:

```js
var Post = sequelize.define('Post', {
  content: {
    type    : Sequelize.STRING,
    noUpdate: {
      readOnly: true
    }
  }
});
```

which effectively disables any modification on the `content` attribute,
no matter if the previous value was null or not, though exception is
when the record is new.

## Issues

The source is available for download from [GitHub](https://github.com/diosney/node-sequelize-noupdate-attributes)
and there is a [issue tracker](https://github.com/diosney/node-sequelize-noupdate-attributes/issues) so you can report bugs there.

## Tests

To run the tests just execute `npm test`.

## License

The MIT License (MIT)

Copyright (c) Diosney Sarmiento

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