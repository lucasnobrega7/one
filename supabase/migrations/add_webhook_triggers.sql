-- Migration: Add Webhook System Tables and Triggers
-- Create webhook-related tables and database triggers for N8N integration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- WEBHOOK ENDPOINTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  organization_id UUID, -- For multi-tenancy support
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}', -- Array of event types this endpoint listens to
  secret TEXT, -- Secret for webhook signature verification
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- WEBHOOK EVENTS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_source TEXT NOT NULL DEFAULT 'supabase', -- supabase, api, manual
  table_name TEXT, -- Which table triggered this event
  record_id UUID, -- ID of the affected record
  user_id UUID REFERENCES public.users(id),
  organization_id UUID,
  data JSONB NOT NULL DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- WEBHOOK DELIVERIES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_event_id UUID REFERENCES public.webhook_events(id) ON DELETE CASCADE,
  webhook_endpoint_id UUID REFERENCES public.webhook_endpoints(id) ON DELETE CASCADE,
  status_code INTEGER,
  response_body TEXT,
  response_headers JSONB,
  delivery_duration_ms INTEGER,
  attempt_number INTEGER DEFAULT 1,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- N8N WORKFLOWS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.n8n_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id TEXT NOT NULL UNIQUE, -- N8N workflow ID
  name TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  event_types TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- USER ONBOARDING STATUS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.user_onboarding_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 1,
  completed_steps INTEGER[] DEFAULT '{}',
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, paused
  payment_confirmed BOOLEAN DEFAULT false,
  whatsapp_connected BOOLEAN DEFAULT false,
  openai_connected BOOLEAN DEFAULT false,
  agent_created BOOLEAN DEFAULT false,
  template_applied BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- AGENT TEMPLATES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  system_prompt TEXT NOT NULL,
  model_id TEXT DEFAULT 'gpt-3.5-turbo',
  temperature DOUBLE PRECISION DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- EXTERNAL INTEGRATIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.external_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- whatsapp, openai, stripe, etc.
  provider TEXT NOT NULL, -- z-api, openai, stripe, etc.
  configuration JSONB NOT NULL DEFAULT '{}',
  credentials JSONB, -- Encrypted credentials
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending', -- pending, active, error, disabled
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, integration_type, provider)
);

-- =========================================
-- SYSTEM NOTIFICATIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS public.system_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- success, warning, error, info
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_user_id ON public.webhook_endpoints(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_active ON public.webhook_endpoints(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_user_id ON public.webhook_events(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.webhook_events(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_id ON public.webhook_deliveries(webhook_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint_id ON public.webhook_deliveries(webhook_endpoint_id);
CREATE INDEX IF NOT EXISTS idx_n8n_workflows_active ON public.n8n_workflows(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON public.user_onboarding_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_status ON public.user_onboarding_status(status);
CREATE INDEX IF NOT EXISTS idx_external_integrations_user_id ON public.external_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_external_integrations_type ON public.external_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON public.system_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_unread ON public.system_notifications(user_id, is_read) WHERE is_read = false;

-- =========================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

-- Webhook endpoints policies
CREATE POLICY "Users can manage their own webhook endpoints"
  ON public.webhook_endpoints FOR ALL
  USING (auth.uid() = user_id);

-- Webhook events policies (readable by related users)
CREATE POLICY "Users can view their own webhook events"
  ON public.webhook_events FOR SELECT
  USING (auth.uid() = user_id);

-- N8N workflows are system-managed (admin access only)
CREATE POLICY "Admin access to N8N workflows"
  ON public.n8n_workflows FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- User onboarding status
CREATE POLICY "Users can view/update their own onboarding status"
  ON public.user_onboarding_status FOR ALL
  USING (auth.uid() = user_id);

-- Agent templates (public read, admin write)
CREATE POLICY "Everyone can view agent templates"
  ON public.agent_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage agent templates"
  ON public.agent_templates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- External integrations
CREATE POLICY "Users can manage their own integrations"
  ON public.external_integrations FOR ALL
  USING (auth.uid() = user_id);

-- System notifications
CREATE POLICY "Users can view their own notifications"
  ON public.system_notifications FOR ALL
  USING (auth.uid() = user_id);

-- =========================================
-- TRIGGER FUNCTIONS FOR WEBHOOK EVENTS
-- =========================================

-- Function to create webhook event
CREATE OR REPLACE FUNCTION public.create_webhook_event(
  p_event_type TEXT,
  p_table_name TEXT,
  p_record_id UUID,
  p_user_id UUID,
  p_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.webhook_events (
    event_type,
    table_name,
    record_id,
    user_id,
    data,
    event_source
  ) VALUES (
    p_event_type,
    p_table_name,
    p_record_id,
    p_user_id,
    p_data,
    'supabase'
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User registration trigger function
CREATE OR REPLACE FUNCTION public.trigger_user_registration_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Create webhook event for user registration
  PERFORM public.create_webhook_event(
    'user.registered',
    'users',
    NEW.id,
    NEW.id,
    jsonb_build_object(
      'user_id', NEW.id,
      'email', NEW.email,
      'name', NEW.name,
      'created_at', NEW.created_at
    )
  );
  
  -- Initialize onboarding status
  INSERT INTO public.user_onboarding_status (user_id, status)
  VALUES (NEW.id, 'in_progress')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agent creation trigger function
CREATE OR REPLACE FUNCTION public.trigger_agent_created_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_webhook_event(
    'agent.created',
    'agents',
    NEW.id,
    NEW.user_id,
    jsonb_build_object(
      'agent_id', NEW.id,
      'user_id', NEW.user_id,
      'name', NEW.name,
      'description', NEW.description,
      'model_id', NEW.model_id,
      'created_at', NEW.created_at
    )
  );
  
  -- Update onboarding status
  UPDATE public.user_onboarding_status
  SET 
    agent_created = true,
    completed_steps = array_append(completed_steps, 5),
    current_step = GREATEST(current_step, 6),
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conversation created trigger function
CREATE OR REPLACE FUNCTION public.trigger_conversation_created_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_webhook_event(
    'conversation.created',
    'conversations',
    NEW.id,
    NEW.user_id,
    jsonb_build_object(
      'conversation_id', NEW.id,
      'agent_id', NEW.agent_id,
      'user_id', NEW.user_id,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Message added trigger function
CREATE OR REPLACE FUNCTION public.trigger_message_added_webhook()
RETURNS TRIGGER AS $$
DECLARE
  conv_user_id UUID;
BEGIN
  -- Get user_id from conversation
  SELECT user_id INTO conv_user_id
  FROM public.conversations
  WHERE id = NEW.conversation_id;
  
  PERFORM public.create_webhook_event(
    'conversation.message.added',
    'messages',
    NEW.id,
    conv_user_id,
    jsonb_build_object(
      'message_id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'content', NEW.content,
      'role', NEW.role,
      'user_id', conv_user_id,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- External integration trigger function
CREATE OR REPLACE FUNCTION public.trigger_integration_connected_webhook()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_webhook_event(
    'integration.' || NEW.integration_type || '.connected',
    'external_integrations',
    NEW.id,
    NEW.user_id,
    jsonb_build_object(
      'integration_id', NEW.id,
      'user_id', NEW.user_id,
      'integration_type', NEW.integration_type,
      'provider', NEW.provider,
      'is_active', NEW.is_active,
      'created_at', NEW.created_at
    )
  );
  
  -- Update onboarding status based on integration type
  IF NEW.integration_type = 'whatsapp' AND NEW.is_active THEN
    UPDATE public.user_onboarding_status
    SET 
      whatsapp_connected = true,
      completed_steps = array_append(completed_steps, 3),
      current_step = GREATEST(current_step, 4),
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.integration_type = 'openai' AND NEW.is_active THEN
    UPDATE public.user_onboarding_status
    SET 
      openai_connected = true,
      completed_steps = array_append(completed_steps, 4),
      current_step = GREATEST(current_step, 5),
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- CREATE DATABASE TRIGGERS
-- =========================================

-- User registration webhook trigger
DROP TRIGGER IF EXISTS webhook_user_registration ON public.users;
CREATE TRIGGER webhook_user_registration
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_user_registration_webhook();

-- Agent creation webhook trigger
DROP TRIGGER IF EXISTS webhook_agent_created ON public.agents;
CREATE TRIGGER webhook_agent_created
  AFTER INSERT ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_agent_created_webhook();

-- Conversation creation webhook trigger
DROP TRIGGER IF EXISTS webhook_conversation_created ON public.conversations;
CREATE TRIGGER webhook_conversation_created
  AFTER INSERT ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_conversation_created_webhook();

-- Message creation webhook trigger
DROP TRIGGER IF EXISTS webhook_message_added ON public.messages;
CREATE TRIGGER webhook_message_added
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_message_added_webhook();

-- Integration connection webhook trigger
DROP TRIGGER IF EXISTS webhook_integration_connected ON public.external_integrations;
CREATE TRIGGER webhook_integration_connected
  AFTER INSERT OR UPDATE ON public.external_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_integration_connected_webhook();

-- =========================================
-- HELPER FUNCTIONS
-- =========================================

-- Function to update onboarding step
CREATE OR REPLACE FUNCTION public.update_onboarding_step(
  p_user_id UUID,
  p_step INTEGER,
  p_metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  UPDATE public.user_onboarding_status
  SET 
    current_step = GREATEST(current_step, p_step),
    completed_steps = array_append(
      COALESCE(completed_steps, '{}'), 
      p_step
    ),
    metadata = COALESCE(metadata, '{}') || p_metadata,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Create system notification
  INSERT INTO public.system_notifications (
    user_id,
    type,
    title,
    message,
    metadata
  ) VALUES (
    p_user_id,
    'info',
    'Progresso do Onboarding',
    'Etapa ' || p_step || ' concluída com sucesso!',
    jsonb_build_object('step', p_step, 'completed_at', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete onboarding
CREATE OR REPLACE FUNCTION public.complete_onboarding(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_onboarding_status
  SET 
    status = 'completed',
    onboarding_completed = true,
    completion_date = NOW(),
    current_step = 7,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Create completion event
  PERFORM public.create_webhook_event(
    'onboarding.completed',
    'user_onboarding_status',
    p_user_id,
    p_user_id,
    jsonb_build_object(
      'user_id', p_user_id,
      'completed_at', NOW()
    )
  );
  
  -- Create system notification
  INSERT INTO public.system_notifications (
    user_id,
    type,
    title,
    message,
    metadata
  ) VALUES (
    p_user_id,
    'success',
    '🎉 Onboarding Concluído!',
    'Parabéns! Você completou todas as etapas do onboarding. Seu agente está pronto para uso.',
    jsonb_build_object('completed_at', NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================
-- INSERT DEFAULT N8N WORKFLOWS
-- =========================================
INSERT INTO public.n8n_workflows (workflow_id, name, webhook_url, event_types) VALUES
  ('dkbY8I5uombxmvgj', 'User Registration', 'https://primary-em-atividade.up.railway.app/webhook/user-registration', ARRAY['user.registered']),
  ('FldlvK2bWumCZKjB', 'Payment Processed', 'https://primary-em-atividade.up.railway.app/webhook/payment-processed', ARRAY['payment.confirmed']),
  ('lObbf36H57cqVoTu', 'WhatsApp Integration', 'https://primary-em-atividade.up.railway.app/webhook/whatsapp-connected', ARRAY['integration.whatsapp.connected']),
  ('azDbM1j9UpSvU1wl', 'OpenAI Integration', 'https://primary-em-atividade.up.railway.app/webhook/openai-connected', ARRAY['integration.openai.connected']),
  ('jd2ydLGtQhvbC2q8', 'Agent Created', 'https://primary-em-atividade.up.railway.app/webhook/agent-created', ARRAY['agent.created']),
  ('xFfJRPSsgxZpx0NH', 'Template Applied', 'https://primary-em-atividade.up.railway.app/webhook/template-applied', ARRAY['template.applied']),
  ('5a8pr08Hyyw3DmHk', 'Onboarding Complete', 'https://primary-em-atividade.up.railway.app/webhook/onboarding-complete', ARRAY['onboarding.completed'])
ON CONFLICT (workflow_id) DO NOTHING;

-- =========================================
-- INSERT DEFAULT AGENT TEMPLATES
-- =========================================
INSERT INTO public.agent_templates (name, description, category, system_prompt, model_id, temperature) VALUES
  (
    'Assistente de Vendas',
    'Agente especializado em vendas e conversão de leads',
    'sales',
    'Você é um assistente especializado em vendas. Seu objetivo é ajudar a converter leads em clientes, identificando necessidades e apresentando soluções adequadas. Seja persuasivo mas natural, empático e focado em resolver problemas reais do cliente.',
    'gpt-3.5-turbo',
    0.7
  ),
  (
    'Suporte ao Cliente',
    'Agente para atendimento e suporte ao cliente',
    'support',
    'Você é um assistente de suporte ao cliente. Ajude os usuários a resolver problemas, tire dúvidas e forneça informações precisas. Seja paciente, claro e sempre busque resolver a questão do cliente da melhor forma possível.',
    'gpt-3.5-turbo',
    0.5
  ),
  (
    'Marketing Digital',
    'Agente especializado em marketing e campanhas',
    'marketing',
    'Você é um especialista em marketing digital. Ajude com estratégias de marketing, criação de conteúdo, campanhas publicitárias e análise de mercado. Seja criativo, estratégico e focado em resultados mensuráveis.',
    'gpt-3.5-turbo',
    0.8
  )
ON CONFLICT DO NOTHING;

-- =========================================
-- FINAL SETUP
-- =========================================

-- Create notification for system setup
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get admin user (if exists)
  SELECT id INTO admin_user_id
  FROM public.users u
  JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  LIMIT 1;
  
  -- Create setup notification if admin exists
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.system_notifications (
      user_id,
      type,
      title,
      message,
      metadata
    ) VALUES (
      admin_user_id,
      'success',
      '🚀 Sistema de Webhooks Configurado',
      'O sistema de webhooks foi configurado com sucesso. N8N workflows estão prontos para integração.',
      jsonb_build_object(
        'setup_date', NOW(),
        'webhooks_count', 7,
        'triggers_created', 5
      )
    );
  END IF;
END $$;

COMMENT ON TABLE public.webhook_endpoints IS 'Gerencia endpoints de webhook configurados pelos usuários';
COMMENT ON TABLE public.webhook_events IS 'Registra todos os eventos de webhook gerados pelo sistema';
COMMENT ON TABLE public.webhook_deliveries IS 'Histórico de entregas de webhook para monitoramento';
COMMENT ON TABLE public.n8n_workflows IS 'Workflows N8N registradas no sistema';
COMMENT ON TABLE public.user_onboarding_status IS 'Status do processo de onboarding por usuário';
COMMENT ON TABLE public.agent_templates IS 'Templates pré-configurados para criação de agentes';
COMMENT ON TABLE public.external_integrations IS 'Integrações externas configuradas (WhatsApp, OpenAI, etc.)';
COMMENT ON TABLE public.system_notifications IS 'Notificações do sistema para usuários';