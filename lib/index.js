const {
  ValidationError,
  ValidationErrorItem,
} = require('sequelize/lib/errors');

module.exports = (sequelize) => {
  if (!sequelize) {
    throw new Error('The required sequelize instance option is missing');
  }
  sequelize.addHook('beforeValidate', (instance, options) => {
    if (!options.validate) return;

    if (instance.isNewRecord) return;

    const changedKeys = [];

    const instance_changed = Array.from(instance._changed);

    instance_changed.forEach((value) => changedKeys.push(value));

    if (!changedKeys.length) return;

    const validationErrors = [];

    changedKeys.forEach((fieldName) => {
      const fieldDefinition = instance.rawAttributes[fieldName];

      if (!fieldDefinition.noUpdate) return;

      if (fieldDefinition.noUpdate.readOnly) {
        validationErrors.push(
          new ValidationErrorItem(
            `\`${fieldName}\` cannot be updated due \`noUpdate:readOnly\` constraint`,
            'readOnly Violation',
            fieldName,
            instance[fieldName]
          )
        );
        return;
      }
      if (
        instance._previousDataValues[fieldName] !== undefined &&
        instance._previousDataValues[fieldName] !== null
      ) {
        validationErrors.push(
          new ValidationErrorItem(
            `\`${fieldName}\` cannot be updated due \`noUpdate\` constraint`,
            'noUpdate Violation',
            fieldName,
            instance[fieldName]
          )
        );
      }
    });

    if (validationErrors.length)
      throw new ValidationError(null, validationErrors);
  });
};
