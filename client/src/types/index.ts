export type ClassEvent = {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  schedule: string;
};

export type DaySchedule = {
  date: Date;
  classes: ClassEvent[];
};

export type User = {
  id: string,
  role: 'admin' | 'user'
}