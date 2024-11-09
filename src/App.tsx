import React, { useEffect, useState } from 'react';
import { getAllStudents, initializeData, getStudentMarks, getStudentAttendance, updateMark, updateAttendance } from './db';
import StudentList from './components/StudentList';
import StudentDetails from './components/StudentDetails';
import { GraduationCap } from 'lucide-react';

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await initializeData();
      const loadedStudents = await getAllStudents();
      setStudents(loadedStudents);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadStudentData = async () => {
      if (selectedStudent) {
        const studentMarks = await getStudentMarks(selectedStudent.id);
        const studentAttendance = await getStudentAttendance(selectedStudent.id);
        setMarks(studentMarks);
        setAttendance(studentAttendance);
      }
    };
    loadStudentData();
  }, [selectedStudent]);

  const handleUpdateMarks = async (markId: number, newScore: number) => {
    await updateMark(markId, newScore);
    if (selectedStudent) {
      const updatedMarks = await getStudentMarks(selectedStudent.id);
      setMarks(updatedMarks);
    }
  };

  const handleUpdateAttendance = async (attendanceId: number, newStatus: string) => {
    await updateAttendance(attendanceId, newStatus);
    if (selectedStudent) {
      const updatedAttendance = await getStudentAttendance(selectedStudent.id);
      setAttendance(updatedAttendance);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Student Management System</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-6">
          <StudentList
            students={students}
            onSelectStudent={setSelectedStudent}
            selectedStudentId={selectedStudent?.id}
          />
          {selectedStudent ? (
            <StudentDetails
              student={selectedStudent}
              marks={marks}
              attendance={attendance}
              onUpdateMarks={handleUpdateMarks}
              onUpdateAttendance={handleUpdateAttendance}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Select a student to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;