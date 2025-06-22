import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  role: text("role").notNull().default("employee"), // employee | admin
  isFirstLogin: boolean("is_first_login").default(true),
  profileCompleted: boolean("profile_completed").default(false),
  testsCompleted: boolean("tests_completed").default(false),
  interests: jsonb("interests").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const psychologicalAssessments = pgTable("psychological_assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  testType: text("test_type").notNull(), // gallup | epi
  responses: jsonb("responses").$type<Record<string, any>>().notNull(),
  results: jsonb("results").$type<Record<string, any>>().notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const volunteerOpportunities = pgTable("volunteer_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // lab | mision
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  duration: integer("duration").notNull(), // hours
  maxVolunteers: integer("max_volunteers").notNull(),
  currentVolunteers: integer("current_volunteers").default(0),
  skills: jsonb("skills").$type<string[]>().default([]),
  sdgs: jsonb("sdgs").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const participations = pgTable("participations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  opportunityId: integer("opportunity_id").references(() => volunteerOpportunities.id).notNull(),
  status: text("status").notNull().default("applied"), // applied | confirmed | completed | cancelled
  hoursCompleted: integer("hours_completed").default(0),
  feedback: text("feedback"),
  rating: integer("rating"),
  joinedAt: timestamp("joined_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  criteria: jsonb("criteria").$type<Record<string, any>>().notNull(),
  points: integer("points").notNull(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // reminder | achievement | opportunity
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(psychologicalAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertOpportunitySchema = createInsertSchema(volunteerOpportunities).omit({
  id: true,
  createdAt: true,
  currentVolunteers: true,
});

export const insertParticipationSchema = createInsertSchema(participations).omit({
  id: true,
  joinedAt: true,
  completedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PsychologicalAssessment = typeof psychologicalAssessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Participation = typeof participations.$inferSelect;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
