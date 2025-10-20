import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const assigmentsTable = pgTable("assignments", {
    id: text("id").notNull().primaryKey(),
    title: text("title").notNull(),
    subject: text("subject").notNull().references(() => subjectsTable.name, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    status: integer("status").notNull().references(() => assignmentStatus.id),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
    deadline: timestamp("deadline").notNull(),
    userId: text("user_id").notNull().references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
    }),
    description: text("description"),
});

export const usersTable = pgTable("users", {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull(),
    hash: text("hash").notNull(),
    salt: text("salt").notNull(),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const subjectsTable = pgTable("subjects", {
    name: text("name").primaryKey(),
    carrier: text("carrier").notNull(),
});

export const assignmentStatus = pgTable("assigment_status", {
    id: serial("id").primaryKey(),
    status: text("status").notNull(),
});
