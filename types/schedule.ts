export interface Program {
  id: string
  name: string
  code: string
  level: "BACHELOR" | "MASTER" | "PHD"
  created_at: string
}

export interface Instructor {
  id: string
  name: string
  email?: string
  title?: string
  created_at: string
}

export interface Room {
  id: string
  name: string
  code: string
  capacity?: number
  room_type?: "LECTURE" | "LAB" | "SEMINAR" | "COMPUTER_LAB"
  created_at: string
}

export interface Course {
  id: string
  program_id: string
  name: string
  code: string
  credits: number
  ects_credits: number
  lecture_hours: number
  lab_hours: number
  semester: number
  year: number
  created_at: string
  program?: Program
}

export interface Schedule {
  id: string
  course_id: string
  instructor_id: string
  room_id: string
  day_of_week: number
  start_time: string
  end_time: string
  session_type: "LECTURE" | "LAB" | "SEMINAR" | "EXAM"
  created_at: string
  course?: Course
  instructor?: Instructor
  room?: Room
}
