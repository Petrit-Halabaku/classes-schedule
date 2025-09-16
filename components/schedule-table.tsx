import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_type: string;
  courses: {
    name: string;
    code: string;
    credits: number;
    ects_credits: number;
    lecture_hours: number;
    lab_hours: number;
    program: {
      name: string;
      code: string;
    };
  };
  instructors: {
    name: string;
    title?: string;
  };
  rooms: {
    name: string;
    code: string;
  };
}

interface ScheduleTableProps {
  schedules: Schedule[];
}

const dayNames = {
  1: "Me", // Monday
  2: "E", // Tuesday
  3: "H", // Wednesday
  4: "H", // Thursday
  5: "P", // Friday
  6: "Sh", // Saturday
  7: "D", // Sunday
};

const sessionTypeColors = {
  LECTURE: "default",
  LAB: "secondary",
  SEMINAR: "outline",
  EXAM: "destructive",
} as const;

export function ScheduleTable({ schedules }: ScheduleTableProps) {
  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds from HH:MM:SS
  };
  const getTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No schedules found</h3>
        <p className="text-muted-foreground">
          There are no scheduled classes at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="border border-border font-semibold text-center min-w-[300px]">
                <div className="flex items-center justify-center space-x-2">
                  <span>Lënda</span>
                </div>
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                OZ
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                OCT
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                ECTS
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                LH
              </TableHead>
              <TableHead className="border border-border font-semibold text-center min-w-[150px]">
                <div className="flex items-center justify-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Mësimdhënës</span>
                </div>
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                Ditë
              </TableHead>
              <TableHead className="border border-border font-semibold text-center min-w-[120px]">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Orë</span>
                </div>
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-20">
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Salla</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow
                key={schedule?.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="border border-border">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {schedule?.courses?.name}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {schedule?.courses?.code}
                      </Badge>
                      <Badge
                        variant={
                          sessionTypeColors[
                            schedule?.session_type as keyof typeof sessionTypeColors
                          ]
                        }
                        className="text-xs"
                      >
                        {schedule?.session_type}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border border-border text-center text-sm">
                  O
                </TableCell>
                <TableCell className="border border-border text-center text-sm">
                  {schedule?.courses?.credits}-{schedule?.courses?.credits}
                </TableCell>
                <TableCell className="border border-border text-center text-sm font-medium">
                  {schedule?.courses?.ects_credits}
                </TableCell>
                <TableCell className="border border-border text-center text-sm">
                  L
                </TableCell>
                <TableCell className="border border-border text-sm">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {schedule?.instructors?.name}
                    </div>
                    {schedule?.instructors?.title && (
                      <div className="text-xs text-muted-foreground">
                        {schedule?.instructors?.title}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="border border-border text-center">
                  <Badge variant="secondary" className="text-sm font-medium">
                    {dayNames[schedule?.day_of_week as keyof typeof dayNames]}
                  </Badge>
                </TableCell>
                <TableCell className="border border-border text-center text-sm font-mono">
                  {getTimeRange(schedule?.start_time, schedule?.end_time)}
                </TableCell>
                <TableCell className="border border-border text-center">
                  <Badge variant="outline" className="text-sm">
                    {schedule?.rooms?.name}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {schedules.map((schedule) => (
          <Card
            key={schedule?.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {schedule?.courses?.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {schedule?.courses?.code}
                    </Badge>
                    <Badge
                      variant={
                        sessionTypeColors[
                          schedule?.session_type as keyof typeof sessionTypeColors
                        ]
                      }
                      className="text-xs"
                    >
                      {schedule?.session_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instructor Info */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">
                      {schedule?.instructors?.name}
                    </div>
                    {schedule?.instructors?.title && (
                      <div className="text-xs text-muted-foreground">
                        {schedule?.instructors?.title}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm font-medium">
                  {dayNames[schedule?.day_of_week as keyof typeof dayNames]}
                </Badge>
              </div>

              {/* Time and Room Info */}
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Orë</div>
                    <div className="text-sm font-mono">
                      {getTimeRange(schedule?.start_time, schedule?.end_time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Salla</div>
                    <Badge variant="outline" className="text-xs">
                      {schedule?.rooms?.name}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                <div className="text-center col-span-1">
                  <div className="text-xs text-muted-foreground">OZ</div>
                  <div className="text-sm font-medium">O</div>
                </div>
                <div className="text-center col-span-1">
                  <div className="text-xs text-muted-foreground">OCT</div>
                  <div className="text-sm font-medium">
                    {schedule?.courses?.credits}-{schedule?.courses?.credits}
                  </div>
                </div>
                <div className="text-center col-span-1">
                  <div className="text-xs text-muted-foreground">ECTS</div>
                  <div className="text-sm font-medium">
                    {schedule?.courses?.ects_credits}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
