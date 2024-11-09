import React from 'react';
import { User, Plus } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  email: string;
  class: string;
}

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudentId: number | null;
}

export default function StudentList({ students, onSelectStudent, selectedStudentId }: StudentListProps) {
  return (
    <div className="w-64 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-indigo-600">
        <h2 className="text-white font-semibold text-lg">Students</h2>
      </div>
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
              selectedStudentId === student.id ? 'bg-indigo-50' : ''
            }`}
          >
            <User className="w-5 h-5 text-gray-500" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{student.name}</p>
              <p className="text-xs text-gray-500">{student.rollNumber}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}