"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  instructions: z.string().min(20, {
    message: "Instructions must be at least 20 characters.",
  }),
  model_name: z.string(),
  temperature: z.number().min(0).max(1),
  visibility: z.enum(["private", "public", "organization"]),
  handle: z.string().optional(),
  include_sources: z.boolean().default(true),
})

type AgentFormValues = z.infer<typeof formSchema>

const defaultValues: Partial<AgentFormValues> = {
  name: "",
  description: "",
  instructions: "You are a helpful AI assistant. Answer the user's questions to the best of your ability.",
  model_name: "gpt-4",
  temperature: 0.7,
  visibility: "private",
  include_sources: true,
}

interface AgentFormProps {
  initialValues?: Partial<AgentFormValues>
  onSubmit?: (values: AgentFormValues) => Promise<void>
  isEdit?: boolean
}

export function AgentForm({ initialValues, onSubmit, isEdit = false }: AgentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultValues,
  })

  async function handleSubmit(values: AgentFormValues) {
    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(values)
      } else {
        // Default submission logic
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/agents${isEdit ? `/${initialValues?.id}` : ""}`,
          {
            method: isEdit ? "PATCH" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          },
        )

        if (!response.ok) {
          throw new Error("Failed to save agent")
        }

        const data = await response.json()

        toast({
          title: isEdit ? "Agent updated" : "Agent created",
          description: `Your agent "${values.name}" has been ${isEdit ? "updated" : "created"} successfully.`,
        })

        router.push(`/agents/${data.id}/settings`)
      }
    } catch (error) {
      console.error("Error saving agent:", error)
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} agent. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Agent" : "Create New Agent"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your AI agent's settings and behavior"
            : "Configure your new AI agent to handle specific tasks and answer questions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer Support Agent" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for your agent.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="This agent helps customers with product questions and troubleshooting."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of what your agent does.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a customer support agent for Acme Inc. Help customers with product questions, troubleshooting, and returns."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed instructions for your agent. This is what guides the agent's behavior.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="model_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The AI model that powers your agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Who can access this agent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls randomness: Lower values are more deterministic, higher values are more creative.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handle (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="support-agent" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>A unique identifier for your agent. Used in URLs.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_sources"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Sources</FormLabel>
                    <FormDescription>When enabled, the agent will include sources in its responses.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update Agent" : "Create Agent"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
