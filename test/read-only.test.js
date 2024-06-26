'use strict';

var should            = require('should');
var Sequelize         = require('sequelize');
var sequelizeNoUpdate = require('../lib');

var sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  logging: false,
  operatorsAliases: false,
});
sequelizeNoUpdate(sequelize);

var Model_1 = sequelize.define('Model_1', {
  attr1: Sequelize.STRING,
  attr2: Sequelize.STRING
});

var Model_2 = sequelize.define('Model_2', {
  attr1: {
    type    : Sequelize.STRING,
    readOnly: true
  },
  attr2: {
    type    : Sequelize.STRING,
    readOnly: false
  },
  attr3: Sequelize.STRING
});

describe('if `readOnly`', function () {
  before(function () {
    return sequelize
      .sync({
        force: true
      });
  });

  describe('was not set', function () {
    it('should allow attributes modifications', function () {
      var instanceData = {
        attr1: Math.random().toString(),
        attr2: Math.random().toString()
      };

      return Model_1
        .create(instanceData)
        .then(function (newInstance) {
          return newInstance.update({
            attr1: Math.random().toString()
          });
        })
        .should.be.fulfilled();
    });
  });

  describe('was set', function () {
    it('should allow modifications on attributes without `readOnly` set', function () {
      var instanceData = {
        attr1: Math.random().toString(),
        attr2: Math.random().toString(),
        attr3: Math.random().toString()
      };

      return Model_2
        .create(instanceData)
        .then(function (newInstance) {
          return newInstance.update({
            attr3: Math.random().toString()
          });
        })
        .should.be.fulfilled();
    });

    it('should allow modifications on attributes with `readOnly=false` set', function () {
      var instanceData = {
        attr1: Math.random().toString(),
        attr2: Math.random().toString(),
        attr3: Math.random().toString()
      };

      return Model_2
        .create(instanceData)
        .then(function (newInstance) {
          return newInstance.update({
            attr2: Math.random().toString()
          });
        })
        .should.be.fulfilled();
    });

    it('should not allow modifications on attributes with `readOnly=true` set', function () {
      var instanceData = {
        attr1: Math.random().toString(),
        attr2: Math.random().toString(),
        attr3: Math.random().toString()
      };

      return Model_2
        .create(instanceData)
        .then(function (newInstance) {
          return newInstance.update({
            attr1: Math.random().toString()
          });
        })
        .should.be.rejected();
    });
  });
});
