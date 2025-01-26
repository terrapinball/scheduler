import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';

import { ClassEvent, DaySchedule } from '../types';
import { fetchClasses } from '../services/classService';
import { useDarkMode } from '../hooks/useDarkMode';

const ClassScheduler = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isMonthView, setIsMonthView] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassEvent | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadClasses = async () => {
        try {
            const fetchedClasses = await fetchClasses();
            setClasses(fetchedClasses);
          } catch (error) {
            console.error('Error loading classes:', error);
          }
        };
        
      loadClasses();
  }, []);

  const toggleView = () => setIsMonthView(!isMonthView);

  const parseSchedule = (schedule: string): number[] => {
    const dayMap: { [key: string]: number } = {
      'Su': 0, 'M': 1, 'Tu': 2, 'W': 3, 
      'Th': 4, 'F': 5, 'Sa': 6
    }

    const days = schedule.replace(/[{}]/g, '').split(',');
    return days.map(day => dayMap[day.trim()]);
  };

  const classOccursOnDate = (classEvent: ClassEvent, date: Date): boolean => {
    const scheduledDays = parseSchedule(classEvent.schedule);
    return scheduledDays.includes(date.getDay());
  };


  const getDaysInMonth = (date: Date, classes: ClassEvent[]) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    const daysFromPrevMonth = firstDayOfWeek;
    
    const lastDayOfWeek = lastDay.getDay();
    const daysFromNextMonth = 6 - lastDayOfWeek;
    
    const days: DaySchedule[] = [];
    
    // Previous month's days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      const dayClasses = classes.filter(c => classOccursOnDate(c, day));
      days.push({
        date: day,
        classes: dayClasses
      });
    }
    
    // Current month's days
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const dayClasses = classes.filter(c => classOccursOnDate(c, currentDate));
      days.push({
        date: currentDate,
        classes: dayClasses
      });
    }
    
    // Next month's days
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const day = new Date(year, month + 1, i);
      const dayClasses = classes.filter(c => classOccursOnDate(c, day));
      days.push({
        date: day,
        classes: dayClasses
      });
    }
    
    return days;
  };
  
  const getDaysInWeek = (date: Date, classes: ClassEvent[]) => {
    const week: DaySchedule[] = [];
    const currentDay = new Date(date);
    const firstDayOfWeek = new Date(currentDay.setDate(currentDay.getDate() - currentDay.getDay()));
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      const dayClasses = classes.filter(c => classOccursOnDate(c, day));
      week.push({
        date: day,
        classes: dayClasses
      });
    }
    return week;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (isMonthView) {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !name || !email) return;
    
    // make API call to book the class
    alert(`Booked ${selectedClass.title} for ${name}`);
    setSelectedClass(null);
    setName('');
    setEmail('');
  };

  const days = isMonthView ? getDaysInMonth(currentDate, classes) : getDaysInWeek(currentDate, classes);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 dark:text-gray-200" />
              <h1 className="text-2xl font-bold dark:text-white">Class Schedule</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleView}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white transition-colors duration-200"
              >
                {isMonthView ? 'Week View' : 'Month View'}
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold dark:text-white">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                ...(isMonthView ? {} : { day: 'numeric' })
              })}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className={`grid ${isMonthView ? 'grid-cols-7' : 'grid-cols-7'} gap-2`}>
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-semibold dark:text-gray-200">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((day, index) => (
              <div
                key={index}
                className="min-h-[120px] p-2 border rounded dark:border-gray-700"
              >
                <div className="text-sm font-medium mb-2 dark:text-gray-300">
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.classes.map(classEvent => (
                    <button
                      key={classEvent.id}
                      onClick={() => setSelectedClass(classEvent)}
                      className="w-full text-left text-xs p-1 rounded bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                    >
                      <div className="font-medium dark:text-gray-200">{classEvent.title}</div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {classEvent.startTime} - {classEvent.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          {selectedClass && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full m-4">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Book {selectedClass.title}
                </h2>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block mb-1 dark:text-gray-200">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 dark:text-gray-200">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      Book Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedClass(null)}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassScheduler;