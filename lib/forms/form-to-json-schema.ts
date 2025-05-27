import type { Schema as JSONSchema } from 'jsonschema';
import { FormFieldSchema } from './types';

export const formToJsonSchema = (
  fields: FormFieldSchema[]
): JSONSchema => {
  const properties: Record<string, any> = {};
  const required: string[] = [];

  for (const field of fields) {
    const { name, type, required: isRequired } = field;

    if (isRequired) {
      required.push(name);
    }

    switch (type) {
      case 'text':
      case 'textArea':
        properties[name] = {
          type: 'string',
          title: name,
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      case 'email':
        properties[name] = {
          type: 'string',
          format: 'email',
          title: name,
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      case 'phoneNumber':
        properties[name] = {
          type: 'string',
          title: name,
          pattern: '^[+]?[0-9\\s\\-\\(\\)]+$',
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      case 'number':
        properties[name] = {
          type: 'number',
          title: name,
          ...(field.min !== undefined && { minimum: field.min }),
          ...(field.max !== undefined && { maximum: field.max }),
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      case 'select':
        properties[name] = {
          type: 'string',
          title: name,
          enum: field.options,
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      case 'multiple_choice':
        properties[name] = {
          type: 'array',
          title: name,
          items: {
            type: 'string',
            enum: field.choices,
          },
          uniqueItems: true,
        };
        break;

      case 'file':
        properties[name] = {
          type: 'string',
          format: 'uri',
          title: name,
          ...(field.placeholder && { description: field.placeholder }),
        };
        break;

      default:
        properties[name] = {
          type: 'string',
          title: name,
        };
    }
  }

  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  };
};