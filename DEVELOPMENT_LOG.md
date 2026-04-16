# PolyGrok - Histórico de Desenvolvimento

## Visão Geral
PolyGrok é uma ferramenta profissional de poliglotismo com IA que funciona como professor nativo real, adaptando o ensino ao nível do aluno.

## Tecnologias Utilizadas

### APIs Gratuitas
- **Gemini API** (Google AI) - Chatbot IA com `gemini-2.0-flash`
- **Groq API** (Llama 3.1 8B) - Chatbot IA alternativo gratuito
- **Web Speech API** - TTS e STT nativos do browser
- **Supabase** - Banco de dados PostgreSQL

### Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Supabase (banco de dados + auth)
- PWA (Service Worker)

## Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Landing page
│   ├── onboarding/       # Configuração inicial
│   ├── app/              # Dashboard principal
│   ├── chat/              # Chat com Professor AI
│   ├── lesson/           # Lição estruturada
│   ├── speaking/         # Prática de pronúncia
│   ├── vocabulary/       # flashcards
│   ├── achievements/     # Conquistas
│   ├── languages/        # Seleção de idioma
│   ├── avatar/           # Seleção de professor
│   ├── settings/         # Configurações
│   └── assessment/       # Avaliação de nível
├── components/           # Componentes React
│   ├── ProfessorAI.tsx   # Chatbot com IA adaptativa
│   ├── LessonFlow.tsx     # Lição guiada (metodologia)
│   ├── PremiumAvatar.tsx  # Avatar SVG animado
│   └── ...
├── data/                  # Dados estáticos
│   ├── languages.ts      # Definições de idiomas
│   ├── avatarCharacters.ts # Personagens de avatar
│   └── teachingMethodology.ts # Metodologia CEFR
├── hooks/                 # Custom hooks
│   └── useSpeechRecognition.ts
├── lib/
│   └── supabase.ts       # Cliente Supabase
├── store/
│   └── userStore.ts      # Zustand store
└── types/
    └── index.ts          # Tipos TypeScript
```

## Metodologia de Ensino

### 5 Fases de Aprendizagem
1. **Vocabulary (Vocabulário)** - 90% nativo, 10% alvo
2. **Phrases (Frases)** - 70% nativo, 30% alvo
3. **Dialogues (Diálogos)** - 50% nativo, 50% alvo
4. **Conversation (Conversação)** - 20% nativo, 80% alvo
5. **Mastery (Domínio)** - 100% imersão

### Níveis CEFR
- beginner (A1-A2) - Iniciante
- elementary (A2-B1) - Elementar
- intermediate (B1-B2) - Intermediário
- upper_intermediate (B2-C1) - Upper Intermediário
- advanced (C1) - Avançado
- fluent (C2) - Fluente

## Funcionalidades Principais

### 1. Chat com Professor AI
- Respostas adaptativas baseadas no nível do aluno
- Correção gramatical em tempo real
- Sugestões de vocabulário
- Dicas de gramática
- Encorajamento e feedback

### 2. Lição Estruturada
- Progressão gradual (vocabulário → frases → diálogos)
- Exercícios interativos
- Feedback imediato
- Sistema de XP e recompensas

### 3. Prática de Pronúncia
- Reconhecimento de fala (Web Speech API)
- Feedback em tempo real
- Comparação com nativos

### 4. Sistema de Progresso
- XP points
- Streak days
- Níveis CEFR
- Conquistas/medalhas

## Bancos de Dados

### Tabelas Supabase
1. **user_progress** - Progresso do usuário
2. **conversations** - Histórico de conversas
3. **vocabulary** - Palavras aprendidas
4. **achievements** - Conquistas desbloqueadas

## Configuração de Ambiente

```env
# APIs de IA (gratuitas)
GEMINI_API_KEY=your_gemini_key
GROK_API_KEY=your_grok_key
OPENROUTER_API_KEY=your_openrouter_key (opcional)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Deploy

### Vercel
- URL: https://poly-grok.vercel.app
- GitHub: https://github.com/ericbarros1987/PolyGroq

### Variáveis de Ambiente Necessárias
Definir no painel da Vercel:
- `GEMINI_API_KEY`
- `GROK_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notas de Manutenção

### Persistência de Dados
- Progresso salvo no Supabase via `userStore.saveProgress()`
- Histórico de conversas mantido em memória (para contexto da sessão)
- Para persistir conversas longamente, usar tabela `conversations` no Supabase

### Avatar e Professores
- PremiumAvatar.tsx usa SVG animado (sem APIs pagas)
- Professores definidos em `data/avatarCharacters.ts`
- Para avatares mais realistas, integrar HeyGen/D-ID (pagos)

### Línguas Suportadas
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- Russian (ru)

## Comandos Úteis

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Typecheck
npm run typecheck
```

## Autores
- Eric Barros (@ericbarros1987)

## Licença
Para uso pessoal (não comercial)
