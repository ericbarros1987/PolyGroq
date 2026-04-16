-- PolyGrok - Tabela de Conversas
-- Execute este SQL no Supabase SQL Editor

-- Criar tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  scenario TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0,
  accuracy NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice para buscas frequentes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_language ON conversations(language);

-- Habilitar Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias conversas
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid()::text = user_id);

-- Política para usuários inserirem apenas suas próprias conversas
CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Política para usuários atualizarem apenas suas próprias conversas
CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Política para usuários deletarem apenas suas próprias conversas
CREATE POLICY "Users can delete own conversations" ON conversations
  FOR DELETE USING (auth.uid()::text = user_id);

-- Comentários
COMMENT ON TABLE conversations IS 'Histórico de conversas do usuário com o professor IA';
COMMENT ON COLUMN conversations.messages IS 'Array de mensagens da conversa em formato JSON';
COMMENT ON COLUMN conversations.accuracy IS 'Porcentagem de precisão do aluno na conversa (0-100)';
