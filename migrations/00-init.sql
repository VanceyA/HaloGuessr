-- Initial HaloGuessr Database Schema
-- This represents the current state of your existing database

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: levels
-- Stores Halo game level data including screenshots, maps, and location coordinates
CREATE TABLE public.levels (
    id text NOT NULL UNIQUE,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    "screenshotPath" text,
    "mapPath" text,
    "mapName" text,
    "levelName" text,
    "gameMode" text,
    "haloGame" text,
    location jsonb,
    CONSTRAINT levels_pkey PRIMARY KEY (id)
);

-- Table: game_sessions
-- Stores multiplayer game session configuration and state
CREATE TABLE public.game_sessions (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    settings jsonb NOT NULL DEFAULT '{}'::jsonb,
    current_round integer NOT NULL DEFAULT 0,
    max_rounds integer NOT NULL DEFAULT 5,
    total_score integer NOT NULL DEFAULT 0,
    is_complete boolean NOT NULL DEFAULT false,
    user_id uuid,
    public_code text,
    CONSTRAINT game_sessions_pkey PRIMARY KEY (id)
);

-- Table: game_rounds
-- Stores individual round data for game sessions
CREATE TABLE public.game_rounds (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    session_id uuid NOT NULL,
    level_id text NOT NULL,
    round_number integer NOT NULL,
    score integer NOT NULL DEFAULT 0,
    guess jsonb,
    correct_location jsonb,
    created_at timestamp with time zone DEFAULT now(),
    time_taken integer,
    CONSTRAINT game_rounds_pkey PRIMARY KEY (id),
    CONSTRAINT game_rounds_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.game_sessions(id)
);

-- Indexes for better query performance
CREATE INDEX idx_levels_halo_game ON levels("haloGame");
CREATE INDEX idx_levels_map_name ON levels("mapName");
CREATE INDEX idx_game_sessions_is_complete ON game_sessions(is_complete);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at);
CREATE INDEX idx_game_rounds_session_id ON game_rounds(session_id);
CREATE INDEX idx_game_rounds_level_id ON game_rounds(level_id);
CREATE INDEX idx_game_rounds_round_number ON game_rounds(session_id, round_number);

-- Row Level Security (RLS) policies
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;

-- Allow read access to levels for all users (public data)
CREATE POLICY "Allow public read access to levels" ON levels
    FOR SELECT USING (true);

-- Allow read access to game sessions
CREATE POLICY "Allow read access to game sessions" ON game_sessions
    FOR SELECT USING (true);

-- Allow insert/update for game sessions
CREATE POLICY "Allow insert/update game sessions" ON game_sessions
    FOR ALL USING (true);

-- Allow read access to game rounds
CREATE POLICY "Allow read access to game rounds" ON game_rounds
    FOR SELECT USING (true);

-- Allow insert/update for game rounds
CREATE POLICY "Allow insert/update game rounds" ON game_rounds
    FOR ALL USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_sessions_updated_at BEFORE UPDATE ON game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data structure comments:
-- levels.location example: {"x": 123.45, "y": 67.89}
-- game_sessions.settings example: {"games": ["halo1", "halo2"], "timeLimit": 60, "difficulty": "normal"}
-- game_rounds.guess example: {"x": 120.0, "y": 65.0} or null for timeout
-- game_rounds.correct_location example: {"x": 123.45, "y": 67.89}
