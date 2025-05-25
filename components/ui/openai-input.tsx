import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "openai-input w-full",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm",
        default: "px-4 py-3 text-base",
        lg: "px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const OpenAIInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
OpenAIInput.displayName = "OpenAIInput"

const TextareaVariants = cva(
  "openai-input w-full min-h-[120px] resize-none",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm",
        default: "px-4 py-3 text-base", 
        lg: "px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof TextareaVariants> {}

const OpenAITextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <textarea
        className={cn(TextareaVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
OpenAITextarea.displayName = "OpenAITextarea"

export { OpenAIInput, OpenAITextarea, inputVariants }