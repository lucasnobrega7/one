"use client"

import type React from "react"
import { useState } from "react"
import type { Node } from "reactflow"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NodeEditorProps {
  node: Node
  onClose: () => void
  onUpdate: (nodeId: string, data: any) => void
  onDelete: (nodeId: string) => void
}

export function NodeEditor({ node, onClose, onUpdate, onDelete }: NodeEditorProps) {
  const [formData, setFormData] = useState(node.data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(node.id, formData)
  }

  const renderFields = () => {
    switch (node.type) {
      case "intentNode":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" value={formData.label} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intents">Intents (one per line)</Label>
              <Textarea
                id="intents"
                name="intents"
                value={Array.isArray(formData.intents) ? formData.intents.join("\n") : ""}
                onChange={(e) => {
                  const intents = e.target.value.split("\n").filter(Boolean)
                  setFormData((prev: any) => ({ ...prev, intents }))
                }}
                rows={5}
              />
            </div>
          </>
        )
      case "messageNode":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" value={formData.label} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={8} />
            </div>
          </>
        )
      case "actionNode":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" value={formData.label} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Input id="action" name="action" value={formData.action} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parameters">Parameters (JSON)</Label>
              <Textarea
                id="parameters"
                name="parameters"
                value={typeof formData.parameters === "object" ? JSON.stringify(formData.parameters, null, 2) : "{}"}
                onChange={(e) => {
                  try {
                    const parameters = JSON.parse(e.target.value)
                    setFormData((prev: any) => ({ ...prev, parameters }))
                  } catch (error) {
                    // Handle JSON parse error
                  }
                }}
                rows={5}
              />
            </div>
          </>
        )
      case "conditionNode":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" value={formData.label} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Textarea id="condition" name="condition" value={formData.condition} onChange={handleChange} rows={5} />
            </div>
            <div className="space-y-2">
              <Label>Branches</Label>
              {formData.branches &&
                formData.branches.map((branch: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={branch}
                      onChange={(e) => {
                        const newBranches = [...formData.branches]
                        newBranches[index] = e.target.value
                        setFormData((prev: any) => ({ ...prev, branches: newBranches }))
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newBranches = formData.branches.filter((_: any, i: number) => i !== index)
                        setFormData((prev: any) => ({ ...prev, branches: newBranches }))
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newBranches = [...(formData.branches || []), ""]
                  setFormData((prev: any) => ({ ...prev, branches: newBranches }))
                }}
              >
                Add Branch
              </Button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Card className="fixed right-4 top-20 w-96 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Edit {node.type?.replace("Node", "")}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">{renderFields()}</div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" type="button" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this node and remove it from the flow.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(node.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
