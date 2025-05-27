import { z } from 'zod';

export const FormFieldBaseSchema = z.object({
  id: z.string(),
  required: z.boolean().default(true),
  name: z.string().toLowerCase().trim().min(3),
});

export const FormFieldSchema = z.discriminatedUnion('type', [
  FormFieldBaseSchema.extend({
    type: z.literal('text'),
    placeholder: z.string().optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('number'),
    placeholder: z.string().optional(),
    min: z.coerce.number().default(0).optional(),
    max: z.coerce.number().default(42).optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('multiple_choice'),
    choices: z.array(z.string().min(1)).min(1),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('file'),
    fileUrl: z.string().optional(),
    placeholder: z.string().optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('email'),
    placeholder: z.string().optional(),
    shouldCreateContact: z.boolean().default(true).optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('phoneNumber'),
    placeholder: z.string().optional(),
    defaultCountryCode: z.string().optional(),
    shouldCreateContact: z.boolean().default(true).optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('textArea'),
    placeholder: z.string().optional(),
  }),
  FormFieldBaseSchema.extend({
    type: z.literal('select'),
    options: z.array(z.string().min(1)).min(1),
    placeholder: z.string().optional(),
  }),
]);

export type FormFieldSchema = z.infer<typeof FormFieldSchema>;

// keep sync with FormFieldSchema.
export type TextField = Exclude<
  FormFieldSchema,
  { type: 'multiple_choice' } | { type: 'file' } | { type: 'select' }
>;

export const FormConfigSchema = z.object({
  overview: z.string().max(750).optional().nullable(),
  fields: z.array(FormFieldSchema).superRefine((vals, ctx) => {
    const unique = new Set();
    for (const [i, val] of vals.entries()) {
      if (unique.has(val?.name?.toLowerCase?.())) {
        ctx.addIssue({
          code: 'custom',
          message: 'Field names must be unique',
          path: [`${i}`, 'name'],
        });
      }
      unique.add(val?.name?.toLowerCase?.());
    }
  }),
  startScreen: z
    .object({
      title: z.string().max(50),
      description: z.string().max(250),
      cta: z
        .object({
          label: z.string(),
        })
        .optional(),
    })
    .optional(),
  endScreen: z
    .object({
      cta: z.object({
        label: z.string().max(50),
        url: z.union([z.string().url().nullish(), z.literal('')]),
        target: z.string().optional(),
      }),
      successMessage: z.string().optional(),
    })
    .optional(),
  webhook: z
    .object({
      url: z.union([z.string().url().nullish(), z.literal('')]),
    })
    .optional(),
  schema: z.any(),
});

export type FormConfigSchema = z.infer<typeof FormConfigSchema>;