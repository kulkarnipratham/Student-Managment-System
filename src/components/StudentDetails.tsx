import React, { useState } from 'react';
import { Edit2, Save, X, Calendar } from 'lucide-react';

interface Mark {
  id: number;
  type: string;
  score: number;
  totalMarks: number;
  date: string;
}

interface Attendance {
  id: number;
  date: string;
  status: string;
}

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  email: string;
  class: string;
}

interface StudentDetailsProps {
  student: Student;
  marks: Mark[];
  attendance: Attendance[];
  onUpdateMarks: (markId: number, newScore: number) => void;
  onUpdateAttendance: (attendanceId: number, newStatus: string) => void;
}

export default function StudentDetails({
  student,
  marks,
  attendance,
  onUpdateMarks,
  onUpdateAttendance,
}: StudentDetailsProps) {
  const [editingMarkId, setEditingMarkId] = useState<number | null>(null);
  const [editingScore, setEditingScore] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);

  const handleEditMark = (mark: Mark) => {
    setEditingMarkId(mark.id);
    setEditingScore(mark.score);
  };

  const handleSaveMark = (markId: number) => {
    onUpdateMarks(markId, editingScore);
    setEditingMarkId(null);
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentDays = attendance.filter(record => record.status === 'present').length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const midSemesterMarks = marks.filter(mark => mark.type === 'midterm')[0] || { score: 0, totalMarks: 100 };
  const endSemesterMarks = marks.filter(mark => mark.type === 'endsem')[0] || { score: 0, totalMarks: 100 };
  const fat1Marks = marks.filter(mark => mark.type === 'fat1')[0] || { score: 0, totalMarks: 100 };
  const fat2Marks = marks.filter(mark => mark.type === 'fat2')[0] || { score: 0, totalMarks: 100 };

  const renderMarkCard = (title: string, mark: Mark) => (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-indigo-600">
          {mark.score}/{mark.totalMarks}
        </span>
        {editingMarkId === mark.id ? (
          <div className="flex space-x-2">
            <input
              type="number"
              value={editingScore}
              onChange={(e) => setEditingScore(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded"
            />
            <button
              onClick={() => handleSaveMark(mark.id)}
              className="text-green-600 hover:text-green-900"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingMarkId(null)}
              className="text-red-600 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleEditMark(mark)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <p>Roll Number: {student.rollNumber}</p>
          <p>Class: {student.class}</p>
          <p>Email: {student.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Performance</h2>
          <div className="grid grid-cols-2 gap-6 mb-6">
            {renderMarkCard("Mid Semester", midSemesterMarks)}
            {renderMarkCard("End Semester", endSemesterMarks)}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {renderMarkCard("FAT 1 Assignment", fat1Marks)}
            {renderMarkCard("FAT 2 Assignment", fat2Marks)}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Attendance Record</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAttendanceForm(false)}
                className={`px-4 py-2 rounded-lg ${!showAttendanceForm ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Total Attendance
              </button>
              <button
                onClick={() => setShowAttendanceForm(true)}
                className={`px-4 py-2 rounded-lg ${showAttendanceForm ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Today's Attendance
              </button>
            </div>
          </div>

          {showAttendanceForm ? (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Today's Attendance</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    onChange={(e) => {
                      // Handle new attendance submission
                      console.log(selectedDate, e.target.value);
                    }}
                  >
                    <option value="">Select status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-100 text-indigo-800 px-6 py-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total Attendance</span>
                  <span className="text-2xl font-bold">{calculateAttendancePercentage()}%</span>
                </div>
                <div className="mt-2 text-sm text-indigo-600">
                  Present: {attendance.filter(record => record.status === 'present').length} days
                  <span className="mx-2">|</span>
                  Total: {attendance.length} days
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {attendance.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-900">{record.date}</p>
                    <select
                      value={record.status}
                      onChange={(e) => onUpdateAttendance(record.id, e.target.value)}
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}