import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path").notNull(),
  backdropPath: text("backdrop_path"),
  releaseYear: integer("release_year").notNull(),
  duration: integer("duration"), // in minutes
  rating: text("rating"), // PG, PG-13, R, etc.
  voteAverage: text("vote_average"), // rating out of 10
  genres: text("genres").array(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tvShows = pgTable("tv_shows", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  posterPath: text("poster_path").notNull(),
  backdropPath: text("backdrop_path"),
  firstAirYear: integer("first_air_year").notNull(),
  lastAirYear: integer("last_air_year"),
  status: text("status"), // Ongoing, Ended, etc.
  seasons: integer("seasons"),
  episodes: integer("episodes"),
  rating: text("rating"), // TV-PG, TV-14, etc.
  voteAverage: text("vote_average"), // rating out of 10
  genres: text("genres").array(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentId: integer("content_id").notNull(),
  contentType: text("content_type").notNull(), // "movie" or "tvshow"
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentId: integer("content_id").notNull(),
  contentType: text("content_type").notNull(), // "movie" or "tvshow"
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
  progress: integer("progress").default(0), // progress in seconds
  completed: boolean("completed").default(false),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  imageUrl: text("image_url").notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatarUrl: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
});

export const insertTvShowSchema = createInsertSchema(tvShows).omit({
  id: true,
  createdAt: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  addedAt: true,
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({
  id: true,
  watchedAt: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertTvShow = z.infer<typeof insertTvShowSchema>;
export type TvShow = typeof tvShows.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;

export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;

export type InsertGenre = z.infer<typeof insertGenreSchema>;
export type Genre = typeof genres.$inferSelect;
