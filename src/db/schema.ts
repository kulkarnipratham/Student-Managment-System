import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  rollNumber: text('roll_number').notNull().unique(),
  email: text('email').notNull(),
  class: text('class').notNull(),
});

export const attendance = sqliteTable('attendance', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  date: text('date').notNull(),
  status: text('status').notNull(), // present, absent, late
});

export const marks = sqliteTable('marks', {
  id: integer('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id),
  type: text('type').notNull(), // midterm, assignment, endsem
  subject: text('subject').notNull(),
  score: integer('score').notNull(),
  totalMarks: integer('total_marks').notNull(),
  date: text('date').notNull(),
});