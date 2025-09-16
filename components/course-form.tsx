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

interface Program {
  id: string
  name: string
  code: string
}

interface CourseFormProps {
  programs: Program[]
}

export function CourseForm({ programs }: CourseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("courses").insert({
        program_id: formData.get("program_id") as string,
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        credits: Number.parseInt(formData.get("credits") as string),
        ects_credits: Number.parseInt(formData.get("ects_credits") as string),
        lecture_hours: Number.parseInt(formData.get("lecture_hours") as string),
        lab_hours: Number.parseInt(formData.get("lab_hours") as string),
        semester: Number.parseInt(formData.get("semester") as string),
        year: Number.parseInt(formData.get("year") as string),
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Course added successfully",
      })

      // Reset form
      e.currentTarget.reset()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course",
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
          <Label htmlFor="program_id">Program</Label>
          <Select name="program_id" required>
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Course Name</Label>
          <Input name="name" placeholder="e.g., Hyrje në shkencën e të dhënave" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Course Code</Label>
          <Input name="code" placeholder="e.g., HSD_001" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits">Credits</Label>
          <Input name="credits" type="number" min="1" max="10" defaultValue="2" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ects_credits">ECTS Credits</Label>
          <Input name="ects_credits" type="number" min="1" max="30" defaultValue="6" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lecture_hours">Lecture Hours</Label>
          <Input name="lecture_hours" type="number" min="0" max="10" defaultValue="2" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lab_hours">Lab Hours</Label>
          <Input name="lab_hours" type="number" min="0" max="10" defaultValue="2" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select name="semester" required>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input name="year" type="number" min="2020" max="2030" defaultValue="2025" required />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding Course..." : "Add Course"}
      </Button>
    </form>
  )
}
