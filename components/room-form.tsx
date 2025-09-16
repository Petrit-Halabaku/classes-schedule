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

export function RoomForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("rooms").insert({
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        capacity: formData.get("capacity") ? Number.parseInt(formData.get("capacity") as string) : null,
        room_type: (formData.get("room_type") as string) || null,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Room added successfully",
      })

      // Reset form
      e.currentTarget.reset()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add room",
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
          <Label htmlFor="name">Room Name</Label>
          <Input name="name" placeholder="e.g., Lab M" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Room Code</Label>
          <Input name="code" placeholder="e.g., LAB_M" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity (Optional)</Label>
          <Input name="capacity" type="number" min="1" max="500" placeholder="30" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_type">Room Type</Label>
          <Select name="room_type">
            <SelectTrigger>
              <SelectValue placeholder="Select room type (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LECTURE">Lecture Hall</SelectItem>
              <SelectItem value="LAB">Laboratory</SelectItem>
              <SelectItem value="COMPUTER_LAB">Computer Lab</SelectItem>
              <SelectItem value="SEMINAR">Seminar Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Adding Room..." : "Add Room"}
      </Button>
    </form>
  )
}
