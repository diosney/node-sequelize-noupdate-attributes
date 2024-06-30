import { ModelAttributeColumnOptions } from 'sequelize';

declare module 'sequelize' {
  interface ModelAttributeColumnOptions {
    noUpdate?: boolean | { readOnly: boolean };
    readOnly?: boolean;
  }
}

export const enum NoUpdateAttributesValidatorKeys {
  NoUpdateAttribute = 'noUpdateAttribute'
}