# PolyGrok - Professor IA de Idiomas

Um aplicativo web para aprendizado de idiomas com um professor IA paciente e nativo, usando OpenRouter (Claude/Grok) para conversação em tempo real.

## Funcionalidades

- **Conversação em Tempo Real**: Fale ou digite mensagens e receba feedback imediato
- **Correção Gentil**: A IA corrige gramática e pronúncia com explicações
- **Modo Imersão**: Para níveis avançados, a IA só fala no idioma alvo
- **Lições Diárias**: 10-15 minutos focados em conversação real
- **Progresso Personalizado**: XP, streaks, níveis e conquistas
- **Suporte a Múltiplos Idiomas**: Inglês (foco inicial), Espanhol, Francês, Alemão, Italiano, Japonês, etc.

## Stack Técnica

- **Framework**: Next.js 15 (App Router)
- **TypeScript**: Para type safety
- **Estilo**: Tailwind CSS
- **Estado**: Zustand
- **IA**: OpenRouter API (Claude/Grok)
- **Áudio**: Web Speech API (Speech-to-Text e Text-to-Speech)
- **Backend**: Supabase
- **Deploy**: Vercel

## Cronograma

- **Meses 1-6**: Foco total em Inglês
- **Após 6 meses**: Suporte estruturado para Espanhol (mantendo progresso do Inglês)

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Banco de Dados Supabase

Execute o SQL em `supabase/schema.sql` no editor SQL do Supabase para criar as tabelas necessárias.

### 3. Instalação de Dependências

```bash
npm install
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000)

### 5. Build para Produção

```bash
npm run build
npm start
```

## Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel
3. Deploy automático a cada push

## Estrutura do Projeto

```
poly-grok/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── app/               # Main app pages
│   │   ├── chat/              # Chat interface
│   │   ├── onboarding/        # Onboarding flow
│   │   └── settings/          # Settings page
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── public/                    # Static files
├── supabase/                  # Database schema
└── package.json
```

## Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar servidor de produção
- `npm run lint` - Verificar lint

## Licença

MIT
