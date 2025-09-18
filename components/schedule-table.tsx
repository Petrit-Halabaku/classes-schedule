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
  start_time: string | null;
  end_time: string | null;
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

// const dayNames = {
//   1: "Monday", // Monday
//   2: "Tuesday", // Tuesday
//   3: "Wednesday", // Wednesday
//   4: "Thursday", // Thursday
//   5: "Friday", // Friday
//   6: "Saturday", // Saturday
//   7: "Sunday", // Sunday
// };

const dayNamesShort = {
  1: "H", // Monday
  2: "Ma", // Tuesday
  3: "Me", // Wednesday
  4: "E", // Thursday
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
  const getSessionLabelFromCode = (code?: string | null) => {
    if (!code) return "Ligjerate/Ushrime";
    const trimmed = code.trim();
    if (trimmed.endsWith("001")) return "Ligjerate";
    if (trimmed.endsWith("002")) return "Ushrime";
    return "Ligjerate/Ushrime";
  };
  const formatTime = (time?: string | null) => {
    if (!time) return "—";
    return time.slice(0, 5); // Remove seconds from HH:MM:SS
  };
  const getTimeRange = (startTime?: string | null, endTime?: string | null) => {
    const start = formatTime(startTime);
    const end = formatTime(endTime);
    if (start === "—" && end === "—") return "—";
    return `${start}-${end}`;
  };

  const getDateForWeekday = (dayOfWeek: number) => {
    const now = new Date();
    const currentIsoDay = now.getDay() === 0 ? 7 : now.getDay();
    const diff = dayOfWeek - currentIsoDay;
    const target = new Date(now);
    target.setDate(now.getDate() + diff);
    const month = String(target.getMonth() + 1).padStart(2, "0");
    const day = String(target.getDate()).padStart(2, "0");
    const year = target.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get current day of week (1 = Monday, 7 = Sunday)
  const getCurrentDayOfWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // Convert Sunday (0) to 7, and shift Monday to 1
    return dayOfWeek === 0 ? 7 : dayOfWeek;
  };

  // Sort schedules by day of week (Monday to Friday)
  const sortedSchedules = [...schedules].sort((a, b) => {
    return a.day_of_week - b.day_of_week;
  });

  const currentDay = getCurrentDayOfWeek();

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
              {/* <TableHead className="border border-border font-semibold text-center w-16">
                O/Z
              </TableHead> */}
              <TableHead className="border border-border font-semibold text-center w-16">
                Ligjerate/Ushrime
              </TableHead>
              <TableHead className="border border-border font-semibold text-center w-16">
                ECTS
              </TableHead>
              {/* <TableHead className="border border-border font-semibold text-center w-16">
                LH
              </TableHead> */}
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
            {sortedSchedules.map((schedule) => {
              const isCurrentDay = schedule.day_of_week === currentDay;
              return (
                <TableRow
                  key={schedule?.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    isCurrentDay ? "bg-blue-50 dark:bg-blue-950/20" : ""
                  }`}
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
                          variant="outline"
                          // variant=
                          // {
                          //   sessionTypeColors[
                          //     schedule?.session_type as keyof typeof sessionTypeColors
                          //   ]
                          // }
                          className="text-xs"
                        >
                          {schedule?.session_type}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell className="border border-border text-center text-sm">
                    O
                  </TableCell> */}
                  <TableCell className="border border-border text-center text-sm">
                    <Badge variant="secondary" className="flex flex-col">
                      <span>
                        {getSessionLabelFromCode(schedule?.courses?.code)}
                      </span>
                      <span>{schedule?.courses?.credits} x 45min</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="border border-border text-center text-sm font-medium">
                    <Badge variant="secondary">
                      {" "}
                      {schedule?.courses?.ects_credits}
                    </Badge>
                  </TableCell>
                  {/* <TableCell className="border border-border text-center text-sm">
                    L
                  </TableCell> */}
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
                    <Badge
                      variant={isCurrentDay ? "default" : "secondary"}
                      className={`text-sm font-medium ${
                        isCurrentDay ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      {
                        dayNamesShort[
                          schedule?.day_of_week as keyof typeof dayNamesShort
                        ]
                      }
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
              );
            })}
          </TableBody>
        </Table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedSchedules.map((schedule) => {
          const isCurrentDay = schedule.day_of_week === currentDay;
          return (
            <Card
              key={schedule?.id}
              className={`hover:shadow-md gap-3 transition-shadow ${
                isCurrentDay
                  ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  : ""
              }`}
            >
              <CardHeader className="pb-1">
                <div className="flex items-start justify-center">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {schedule?.courses?.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {schedule?.courses?.code}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {/* {
                          sessionTypeColors[
                            schedule?.session_type as keyof typeof sessionTypeColors
                          ]
                        } */}
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
                    {/* <User className="h-4 w-4 text-muted-foreground" /> */}
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
                  <div className="font-medium text-sm">
                    {getDateForWeekday(schedule?.day_of_week)}
                  </div>
                </div>

                {/* Time and Room Info */}
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Orë</div>
                      <div className="text-md font-bold">
                        {getTimeRange(schedule?.start_time, schedule?.end_time)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <MapPin className="h-4 w-4 text-muted-foreground" /> */}
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
                    <div className="text-xs text-muted-foreground">
                      {getSessionLabelFromCode(schedule?.courses?.code)}
                    </div>
                    <div className="text-xs font-normal">
                      {schedule?.courses?.credits} x 45min
                    </div>
                  </div>
                  <div className="text-center items-center col-span-1">
                    <div className="text-xs text-muted-foreground">Dita</div>
                    <Badge
                      variant={isCurrentDay ? "default" : "secondary"}
                      className={`text-md font-bold ${
                        isCurrentDay ? "bg-blue-600 text-white" : ""
                      }`}
                    >
                      {
                        dayNamesShort[
                          schedule?.day_of_week as keyof typeof dayNamesShort
                        ]
                      }
                    </Badge>
                  </div>
                  <div className="text-center col-span-1">
                    <div className="text-xs text-muted-foreground">ECTS</div>
                    <div className="text-xs font-medium">
                      {schedule?.courses?.ects_credits}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
