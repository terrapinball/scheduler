import { ClassEvent } from '../types';

export const fetchClasses = async (): Promise<ClassEvent[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/classes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      instructor: item.instructor,
      startTime: item.startTime,
      endTime: item.endTime,
      capacity: item.capacity,
      enrolled: item.enrolled,
      schedule: item.schedule
    }));
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};