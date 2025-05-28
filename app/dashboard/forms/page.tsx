"use client"

import React, { useState } from 'react';
import { FormBuilder, FormTemplateSelector } from '@/components/forms';
import { FormConfigSchema } from '@/lib/forms/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function FormsPage() {
  const [selectedConfig, setSelectedConfig] = useState<FormConfigSchema | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);

  const handleTemplateSelect = (config: FormConfigSchema) => {
    setSelectedConfig(config);
    setShowTemplates(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplates(true);
    setSelectedConfig(null);
  };

  const handleFormSubmit = async (values: any) => {
    console.log('Form submitted:', values);
    // TODO: Implement form submission logic
    alert('Form submitted successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white/90 mb-2">Forms</h1>
        <p className="text-white/70">
          Create and manage forms for lead capture, feedback, and onboarding.
        </p>
      </div>

      {showTemplates ? (
        <div>
          <Card className="bg-[#1a1a1d] border-[#27272a] mb-8">
            <CardHeader>
              <CardTitle className="text-white/90">Choose a Template</CardTitle>
              <CardDescription className="text-white/60">
                Select a pre-built template to get started quickly, or create a form from scratch.
              </CardDescription>
            </CardHeader>
          </Card>
          <FormTemplateSelector onSelect={handleTemplateSelect} />
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToTemplates}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </div>
          
          {selectedConfig && (
            <FormBuilder 
              config={selectedConfig} 
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
}