"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ALL_TEMPLATES } from '@/lib/forms/templates';
import { FormConfigSchema } from '@/lib/forms/types';

interface FormTemplateSelectorProps {
  onSelect: (config: FormConfigSchema) => void;
}

export function FormTemplateSelector({ onSelect }: FormTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ALL_TEMPLATES.map((template, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                Fields: {template.schema.fields.length}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.schema.fields.slice(0, 3).map((field, fieldIndex) => (
                  <span
                    key={fieldIndex}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 rounded"
                  >
                    {field.type}
                  </span>
                ))}
                {template.schema.fields.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded">
                    +{template.schema.fields.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <Button 
              onClick={() => onSelect(template.schema)} 
              className="w-full"
              variant="outline"
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}