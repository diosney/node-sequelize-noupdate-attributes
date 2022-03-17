'use strict';
const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  if (!sequelize) {
    throw new Error('The required sequelize instance option is missing');
  }

  sequelize.addHook('beforeValidate', function (instance, options) {
    if (!options.validate) {
      return;
    }
    if (instance.isNewRecord) {
      return;
    }

    var changedKeys = [];

    Object
      .keys(instance._changed)
      .forEach(function (fieldName) {
        if (instance._changed[fieldName]) {
          changedKeys.push(fieldName);
        }
      });

    if (!changedKeys.length) {
      return;
    }

    var validationErrors = [];
    changedKeys.forEach(function (fieldName) {
      var fieldDefinition = instance.rawAttributes[fieldName];

      if (!fieldDefinition['noUpdate']) {
        return;
      }
      if (fieldDefinition.noUpdate['readOnly']) {
        
        validationErrors.push(new Sequelize.ValidationErrorItem('`' + fieldName + '` cannot be updated due `noUpdate:readOnly` constraint', 'readOnly Violation', fieldName, instance[fieldName]));
        return;
      }
      if (instance._previousDataValues[fieldName] !== undefined
          && instance._previousDataValues[fieldName] !== null) {

        validationErrors.push(new Sequelize.ValidationErrorItem('`' + fieldName + '` cannot be updated due `noUpdate` constraint', 'noUpdate Violation', fieldName, instance[fieldName]));
      }
    });

    if (validationErrors.length) {
      return Sequelize.Promise.try(function () {
        throw new Sequelize.ValidationError(null, validationErrors);
      });
    }
  });
};
