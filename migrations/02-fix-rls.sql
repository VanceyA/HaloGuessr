-- Drop permissive write policies that allowed the anon key to insert/update
-- game sessions and rounds. All writes go through server API endpoints which
-- use the service_role key, which bypasses RLS entirely. Read policies remain.
DROP POLICY IF EXISTS "Allow insert/update game sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow insert/update game rounds" ON game_rounds;
