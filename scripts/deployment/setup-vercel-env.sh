#!/bin/bash

echo "🔧 Configurando variáveis de ambiente no Vercel..."

# NEXTAUTH Configuration
echo "efa3c79722b0aa1870d03ede89d7a33424ac937b487c1b8cec469d0fbb00490cadc2cba2e0d1a2bad759abd2152eb60fcc8c15fa698b2835c567432a1dcc93a9" | vercel env add NEXTAUTH_SECRET production --force

echo "https://www.agentesdeconversao.com.br" | vercel env add NEXTAUTH_URL production --force

# Supabase Configuration  
echo "https://jiasbwazaicmcckmehtn.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --force

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppYXNid2F6YWljbWNja21laHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTk3MTcsImV4cCI6MjA2MjU5NTcxN30.ylb91zHcJ_RN7s_pOUDIjx9YM2gq_Lp1JtW3upmZII4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --force

echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppYXNid2F6YWljbWNja21laHRuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzAxOTcxNywiZXhwIjoyMDYyNTk1NzE3fQ.8ofzu7Hhe-Hokju4B6M51bnlvH1HvtGOoAExHLuuZj8" | vercel env add SUPABASE_SERVICE_ROLE_KEY production --force

# Database Configuration
echo "postgresql://postgres:6dTntKYfZ6tnilXb@db.jiasbwazaicmcckmehtn.supabase.co:5432/postgres" | vercel env add DATABASE_URL production --force

# API Configuration
echo "https://api.agentesdeconversao.com.br" | vercel env add NEXT_PUBLIC_API_URL production --force

echo "✅ Variáveis de ambiente configuradas com sucesso!"
echo "🚀 Fazendo redeploy..."

vercel --prod --yes