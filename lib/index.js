'use strict';

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
        validationErrors.push(new sequelize.ValidationErrorItem('`' + fieldName + '` cannot be updated due `noUpdate:readOnly` constraint', 'readOnly Violation', fieldName, instance[fieldName]));
        return;
      }
      if (instance._previousDataValues[fieldName] !== undefined
          && instance._previousDataValues[fieldName] !== null) {

        validationErrors.push(new sequelize.ValidationErrorItem('`' + fieldName + '` cannot be updated due `noUpdate` constraint', 'noUpdate Violation', fieldName, instance[fieldName]));
      }
    });

    if (validationErrors.length) {
      return sequelize.Promise.try(function () {
        throw new sequelize.ValidationError(null, validationErrors);
      });
    }
  });
};