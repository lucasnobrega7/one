import type { Schema as JSONSchema } from 'jsonschema';
import { FormFieldSchema } from './types';
import { formToJsonSchema } from './form-to-json-schema';

export { formToJsonSchema };
export * from './types';
export * from './templates';

export enum FormStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface FormSubmission {
  id: string;
  conversationId?: string;
  formId: string;
  data: any;
  status: FormStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const handleFormValid = async ({
  conversationId,
  formId,
  values,
  webhookUrl,
  submissionId = crypto.randomUUID(),
}: {
  formId: string;
  conversationId?: string;
  submissionId?: string;
  webhookUrl?: string;
  values: any;
}) => {
  // Create form submission object
  const submission: FormSubmission = {
    id: submissionId,
    conversationId,
    formId,
    data: values,
    status: FormStatus.COMPLETED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // TODO: Save to database
  // const savedSubmission = await prisma.formSubmission.upsert({
  //   where: { id: submissionId },
  //   create: submission,
  //   update: {
  //     data: values,
  //     status: FormStatus.COMPLETED,
  //   },
  // });

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });
    } catch (e) {
      console.log('Webhook error:', e);
    }
  }

  return submission;
};