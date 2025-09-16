"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Room {
  id: string;
  name: string;
  code: string;
  capacity?: number;
  room_type?: string;
}

interface RoomsTableProps {
  rooms: Room[];
}

export function RoomsTable({ rooms }: RoomsTableProps) {
  const [localRooms, setLocalRooms] = useState<Room[]>(rooms);
  const { toast } = useToast();

  function RoomEditDialog({ room }: { room: Room }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(room.name);
    const [code, setCode] = useState(room.code);
    const [capacity, setCapacity] = useState<number | undefined>(room.capacity);
    const [roomType, setRoomType] = useState<string>(room.room_type || "");
    const [isSaving, setIsSaving] = useState(false);

    const onSave = async () => {
      setIsSaving(true);
      const supabase = createClient();
      try {
        const { error } = await supabase
          .from("rooms")
          .update({
            name,
            code,
            capacity: capacity ?? null,
            room_type: roomType || null,
          })
          .eq("id", room.id);
        if (error) throw error;
        setLocalRooms((prev) =>
          prev.map((r) =>
            r.id === room.id
              ? {
                  ...r,
                  name,
                  code,
                  capacity,
                  room_type: roomType || undefined,
                }
              : r
          )
        );
        toast({ title: "Saved", description: "Room updated" });
        setOpen(false);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to update room",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="room-name">
                Name
              </label>
              <Input
                id="room-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="room-code">
                Code
              </label>
              <Input
                id="room-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="room-capacity">
                Capacity
              </label>
              <Input
                id="room-capacity"
                type="number"
                value={capacity ?? ""}
                onChange={(e) =>
                  setCapacity(
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Type</label>
              <Select value={roomType} onValueChange={setRoomType}>
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
          <DialogFooter>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.code}</TableCell>
                  <TableCell>{room.capacity || "—"}</TableCell>
                  <TableCell>{room.room_type || "—"}</TableCell>
                  <TableCell>
                    <RoomEditDialog room={room} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
