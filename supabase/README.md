# Configuração do Supabase

Este documento descreve como configurar o Supabase para o projeto Agentes de Conversão.

## Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase

## Configuração do Banco de Dados

1. Acesse o SQL Editor no painel do Supabase
2. Execute o script SQL em `schema.sql` para criar todas as tabelas e configurações necessárias

## Configuração de Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente ao seu projeto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
\`\`\`

## Configuração de Autenticação

1. No painel do Supabase, vá para Authentication > Settings
2. Configure o URL do site e as URLs de redirecionamento
3. Habilite os provedores de autenticação desejados (Email, Google, etc.)

## Políticas de Segurança (RLS)

As políticas de Row Level Security já estão configuradas no script SQL. Elas garantem que:

1. Usuários só podem ver e modificar seus próprios dados
2. Bases de conhecimento são públicas para leitura
3. Documentos de conhecimento são públicos para leitura

## Funções e Triggers

O script SQL também configura:

1. Trigger para adicionar role padrão a novos usuários
2. Trigger para criar configurações padrão para novos usuários
3. Funções para gerenciar roles de usuários

## Verificação da Configuração

Para verificar se tudo está configurado corretamente:

1. Acesse a rota `/api/db-status` da sua aplicação
2. Verifique se o status retorna "online"
