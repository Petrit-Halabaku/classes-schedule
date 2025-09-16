"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function InstructorForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("instructors").insert({
        name: formData.get("name") as string,
        email: (formData.get("email") as string) || null,
        title: (formData.get("title") as string) || null,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Instructor added successfully",
      })

      // Reset form
      e.currentTarget.reset()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add instructor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input name="name" placeholder="e.g., K.Rrmoku" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input name="email" type="email" placeholder="instructor@university.edu" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Select name="title">
            <SelectTrigger>
              <SelectValue placeholder="Select title (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
              <SelectItem value="Teaching Assistant">Teaching Assistant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding Instructor..." : "Add Instructor"}
      </Button>
    </form>
  )
}
