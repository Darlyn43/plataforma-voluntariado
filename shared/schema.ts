import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  profileCompleted: boolean("profilecompleted").default(false),
  role: text("role").default("employee"),
  department: text("department"),
  location: text("location"),
  interest: jsonb("interest").$type<string[]>().default([]),
  created_at: timestamp("created_at").defaultNow()
});

// Volunteer Opportunities
export const volunteerOpportunities = pgTable("volunteer_opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  location: text("location"),
  start_date: timestamp("start_date"),
  duration: integer("duration"),
  max_volunteers: integer("max_volunteers"),
  current_volunteers: integer("current_volunteers").default(0),
  skills: jsonb("skills").$type<string[]>().default([]),
  sdgs: jsonb("sdgs").$type<string[]>().default([]),
  created_at: timestamp("created_at").defaultNow()
});

// Participations
export const participations = pgTable("participations", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  opportunity_id: uuid("opportunity_id").references(() => volunteerOpportunities.id).notNull(),
  hoursCompleted: integer("hourscompleted").default(0),
  status: text("status").default("pending"),
  created_at: timestamp("created_at").defaultNow()
});

// Psychological Assessments
export const psychologicalAssessments = pgTable("psychological_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  traits: jsonb("traits").$type<Record<string, number>>(),
  created_at: timestamp("created_at").defaultNow()
});

// Badges
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  criteria: text("criteria"),
  created_at: timestamp("created_at").defaultNow()
});

// User Badges
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  badge_id: uuid("badge_id").references(() => badges.id).notNull(),
  awarded_at: timestamp("awarded_at").defaultNow()
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  title: text("title"),
  message: text("message"),
  read: boolean("read").default(false),
  created_at: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, created_at: true });
export const insertOpportunitySchema = createInsertSchema(volunteerOpportunities).omit({ id: true, created_at: true });
export const insertParticipationSchema = createInsertSchema(participations).omit({ id: true, created_at: true });
export const insertAssessmentSchema = createInsertSchema(psychologicalAssessments).omit({ id: true, created_at: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Participation = typeof participations.$inferSelect;
export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type PsychologicalAssessment = typeof psychologicalAssessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
