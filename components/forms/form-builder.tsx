"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormConfigSchema, FormFieldSchema, handleFormValid } from '@/lib/forms';
import { Trash2, Plus } from 'lucide-react';

interface FormBuilderProps {
  config: FormConfigSchema;
  onSubmit?: (values: any) => void;
  onUpdate?: (config: FormConfigSchema) => void;
  readOnly?: boolean;
}

export function FormBuilder({ config, onSubmit, onUpdate, readOnly = false }: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    config.fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.name} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      
      if (field.type === 'phoneNumber' && formData[field.name]) {
        const phoneRegex = /^[+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid phone number';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Reset form after successful submission
      setFormData({});
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormFieldSchema) => {
    const commonProps = {
      id: field.id,
      name: field.name,
      required: field.required,
      disabled: isSubmitting,
    };

    const value = formData[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="text"
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'email':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="email"
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'phoneNumber':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="tel"
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="number"
              value={value}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || '')}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textArea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
              rows={4}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(value) => handleFieldChange(field.name, value)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={field.id} className="space-y-2">
            <Label className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.choices.map((choice) => (
                <div key={choice} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${choice}`}
                    checked={Array.isArray(value) && value.includes(choice)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (checked) {
                        handleFieldChange(field.name, [...currentValues, choice]);
                      } else {
                        handleFieldChange(field.name, currentValues.filter((v: string) => v !== choice));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${choice}`}>{choice}</Label>
                </div>
              ))}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFieldChange(field.name, file);
                }
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {config.startScreen && (
        <CardHeader>
          <CardTitle>{config.startScreen.title}</CardTitle>
          <CardDescription>{config.startScreen.description}</CardDescription>
        </CardHeader>
      )}
      
      <CardContent>
        {config.overview && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{config.overview}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {config.fields.map(renderField)}
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}