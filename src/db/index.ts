import { openDB } from 'idb';

const dbName = 'studentManagementSystem';
const dbVersion = 1;

export const initDb = async () => {
  const db = await openDB(dbName, dbVersion, {
    upgrade(db) {
      // Students store
      if (!db.objectStoreNames.contains('students')) {
        const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
        studentStore.createIndex('rollNumber', 'rollNumber', { unique: true });
      }

      // Marks store
      if (!db.objectStoreNames.contains('marks')) {
        const marksStore = db.createObjectStore('marks', { keyPath: 'id', autoIncrement: true });
        marksStore.createIndex('studentId', 'studentId');
      }

      // Attendance store
      if (!db.objectStoreNames.contains('attendance')) {
        const attendanceStore = db.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
        attendanceStore.createIndex('studentId', 'studentId');
      }
    },
  });

  return db;
};

export const initializeData = async () => {
  const db = await initDb();
  const tx = db.transaction(['students', 'marks', 'attendance'], 'readwrite');

  // Check if data already exists
  const existingStudents = await tx.objectStore('students').count();
  if (existingStudents > 0) {
    return;
  }

  // Add sample students
  const students = tx.objectStore('students');
  const student1 = await students.add({
    name: 'John Doe',
    rollNumber: 'CS001',
    email: 'john.doe@example.com',
    class: 'CS-A',
  });

  // Add sample marks
  const marks = tx.objectStore('marks');
  await marks.add({
    studentId: student1,
    type: 'midterm',
    score: 85,
    totalMarks: 100,
    date: '2024-03-01',
  });

  await marks.add({
    studentId: student1,
    type: 'endsem',
    score: 90,
    totalMarks: 100,
    date: '2024-03-15',
  });

  await marks.add({
    studentId: student1,
    type: 'fat1',
    score: 88,
    totalMarks: 100,
    date: '2024-02-15',
  });

  await marks.add({
    studentId: student1,
    type: 'fat2',
    score: 92,
    totalMarks: 100,
    date: '2024-03-01',
  });

  // Add sample attendance
  const attendance = tx.objectStore('attendance');
  await attendance.add({
    studentId: student1,
    date: '2024-03-15',
    status: 'present',
  });

  await attendance.add({
    studentId: student1,
    date: '2024-03-14',
    status: 'present',
  });

  await attendance.add({
    studentId: student1,
    date: '2024-03-13',
    status: 'absent',
  });

  await tx.done;
};

export const getAllStudents = async () => {
  const db = await initDb();
  return db.getAll('students');
};

export const getStudentMarks = async (studentId: number) => {
  const db = await initDb();
  const tx = db.transaction('marks', 'readonly');
  const index = tx.store.index('studentId');
  return index.getAll(studentId);
};

export const getStudentAttendance = async (studentId: number) => {
  const db = await initDb();
  const tx = db.transaction('attendance', 'readonly');
  const index = tx.store.index('studentId');
  return index.getAll(studentId);
};

export const updateMark = async (markId: number, newScore: number) => {
  const db = await initDb();
  const tx = db.transaction('marks', 'readwrite');
  const store = tx.objectStore('marks');
  const mark = await store.get(markId);
  mark.score = newScore;
  await store.put(mark);
  return mark;
};

export const updateAttendance = async (attendanceId: number, newStatus: string) => {
  const db = await initDb();
  const tx = db.transaction('attendance', 'readwrite');
  const store = tx.objectStore('attendance');
  const attendance = await store.get(attendanceId);
  attendance.status = newStatus;
  await store.put(attendance);
  return attendance;
};

export const addAttendance = async (studentId: number, date: string, status: string) => {
  const db = await initDb();
  const tx = db.transaction('attendance', 'readwrite');
  const store = tx.objectStore('attendance');
  const attendance = await store.add({
    studentId,
    date,
    status,
  });
  return attendance;
};