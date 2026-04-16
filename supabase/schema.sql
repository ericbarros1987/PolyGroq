-- PolyGrok Database Schema for Supabase
-- Execute this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  current_language VARCHAR(10) NOT NULL DEFAULT 'en',
  level VARCHAR(50) NOT NULL DEFAULT 'beginner',
  streak_days INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 0,
  immersion_mode BOOLEAN DEFAULT FALSE,
  last_lesson_date TIMESTAMP WITH TIME ZONE,
  errors_frequency JSONB DEFAULT '{}',
  completed_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  language VARCHAR(10) NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  duration_seconds INTEGER DEFAULT 0,
  corrections_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  language VARCHAR(10) NOT NULL,
  level VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  topics TEXT[] NOT NULL DEFAULT '{}',
  xp_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  achievement_id VARCHAR(100) NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_language ON lessons(language);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Insert default lessons for English (English first focus)
INSERT INTO lessons (title, description, language, level, duration_minutes, topics, xp_reward) VALUES
  ('Apresentações', 'Aprenda a se apresentar e conhecer pessoas novas', 'en', 'beginner', 10, ARRAY['greetings', 'introductions', 'basic_phrases'], 50),
  ('No Restaurante', 'Como pedir comida, fazer reservas e interagir com garçons', 'en', 'beginner', 12, ARRAY['ordering', 'reservations', 'menu_vocabulary'], 60),
  ('Direções', 'Perguntar e dar direções na rua', 'en', 'elementary', 10, ARRAY['asking_directions', 'giving_directions', 'landmarks'], 50),
  ('Compras', 'Em lojas, mercados e shoppings', 'en', 'elementary', 15, ARRAY['shopping', 'prices', 'sizes'], 75),
  ('Viagens', 'Aeroportos, hotéis e transporte', 'en', 'intermediate', 15, ARRAY['airports', 'hotels', 'transportation'], 75),
  ('Entrevista de Emprego', 'Preparação para entrevistas de trabalho', 'en', 'upper_intermediate', 15, ARRAY['interview', 'cv', 'professional'], 75),
  ('Discussões Complexas', 'Debater temas abstratos e complexos', 'en', 'advanced', 15, ARRAY['abstract_topics', 'debate', 'critical_thinking'], 100),
  ('Fluência Total', 'Conversas naturais sobre qualquer tema', 'en', 'fluent', 15, ARRAY['native_level', 'idioms', 'cultural_references'], 150)
ON CONFLICT DO NOTHING;

-- Insert default lessons for Spanish (will be unlocked after 6 months of English)
INSERT INTO lessons (title, description, language, level, duration_minutes, topics, xp_reward) VALUES
  ('Saludos y Presentaciones', 'Aprende a presentarte y conocer personas', 'es', 'beginner', 10, ARRAY['saludos', 'presentaciones', 'frases_basicas'], 50),
  ('En el Restaurante', 'Cómo pedir comida y hacer reservas', 'es', 'beginner', 12, ARRAY['pedidos', 'reservas', 'vocabulario'], 60)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_progress
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policy for user_progress: users can only access their own data
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy for chat_history: users can only access their own data
CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own chat history" ON chat_history
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy for user_achievements: users can only access their own data
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Enable anonymous access for the app (using localStorage user_id)
-- Note: In production, consider implementing proper authentication

COMMENT ON TABLE user_progress IS 'Stores user learning progress and preferences';
COMMENT ON TABLE chat_history IS 'Stores conversation history with AI tutor';
COMMENT ON TABLE lessons IS 'Available lessons for each language and level';
COMMENT ON TABLE user_achievements IS 'User achievements and milestones';
