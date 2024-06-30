import {
  Model,
  ModelStatic,
  Sequelize,
  ValidationError,
  ValidationErrorItem,
  ValidationErrorItemOrigin
} from 'sequelize';

import { ValidationOptions } from 'sequelize/types/instance-validator';

import './sequelize-extensions';
import { NoUpdateAttributesValidatorKeys } from './sequelize-extensions';

function addHook(sequelize: Sequelize) {
  if (!sequelize) {
    throw new Error('Missing required `sequelize` instance option.');
  }

  sequelize.addHook('beforeValidate', 'noUpdateAttributes', (instance: Model, options: ValidationOptions) => {
    if (instance.isNewRecord) {
      return;
    }

    const changedAttributes = instance.changed() || [];

    if (!changedAttributes || !changedAttributes.length) {
      return;
    }

    const validationErrors: ValidationErrorItem[] = [];
    const fieldDefinitions                        = (instance.constructor as ModelStatic<Model>).getAttributes();

    changedAttributes.forEach((fieldName) => {
      const fieldDefinition = fieldDefinitions[fieldName];
      const noUpdate        = fieldDefinition.noUpdate;
      const readOnly        = (fieldDefinition.readOnly || noUpdate && (noUpdate as any).readOnly);

      if (!noUpdate && !readOnly) {
        return;
      }

      const currentFieldValue: any = instance.get(fieldName);

      if (readOnly) {
        validationErrors.push(new ValidationErrorItem(
          `(noUpdateAttributes): \`${fieldName}\` cannot be updated due to \`readOnly\` constraint.`,
          ValidationErrorItemOrigin.FUNCTION,
          fieldName,
          currentFieldValue,
          instance,
          NoUpdateAttributesValidatorKeys.NoUpdateAttribute,
          '',
          []));

        return;
      }

      // Only throws if is an update.
      if (instance.previous(fieldName) !== undefined
          && instance.previous(fieldName) !== null) {

        validationErrors.push(new ValidationErrorItem(
          `(noUpdateAttributes): \`${fieldName}\` cannot be updated due to \`noUpdate\` constraint.`,
          ValidationErrorItemOrigin.FUNCTION,
          fieldName,
          currentFieldValue,
          instance,
          NoUpdateAttributesValidatorKeys.NoUpdateAttribute,
          '',
          []));
      }
    });

    if (validationErrors.length) {
      throw new ValidationError(`(noUpdateAttributes): Cannot update field(s) due to \`noUpdate\` or \`readOnly\` constraint.`, validationErrors);
    }
  });
}

export = addHook;