import { ModelAttributeColumnOptions } from 'sequelize';

declare module 'sequelize' {
  interface ModelAttributeColumnOptions {
    noUpdate?: boolean | { readOnly: boolean };
    readOnly?: boolean;
  }
}

export type ModelNoUpdateAttributeColumnOptions = ModelAttributeColumnOptions;

export const enum NoUpdateAttributesValidatorKeys {
  NoUpdateAttribute = 'noUpdateAttribute'
}