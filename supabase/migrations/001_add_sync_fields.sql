-- Add sync fields to agents table
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'error'));
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add sync fields to conversations table
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS external_id TEXT UNIQUE;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('synced', 'pending', 'error'));
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS title TEXT;

-- Add metadata to messages table
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for sync fields
CREATE INDEX IF NOT EXISTS idx_agents_external_id ON public.agents(external_id);
CREATE INDEX IF NOT EXISTS idx_agents_sync_status ON public.agents(sync_status);
CREATE INDEX IF NOT EXISTS idx_conversations_external_id ON public.conversations(external_id);
CREATE INDEX IF NOT EXISTS idx_conversations_sync_status ON public.conversations(sync_status);

-- Create sync log table for tracking sync operations
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('agent', 'conversation', 'message')),
  entity_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete', 'sync')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  error_message TEXT,
  external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for sync logs
CREATE INDEX IF NOT EXISTS idx_sync_logs_entity ON public.sync_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON public.sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at);

-- Create function to automatically update sync_status when external_id is set
CREATE OR REPLACE FUNCTION public.update_sync_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.external_id IS NOT NULL AND OLD.external_id IS NULL THEN
    NEW.sync_status = 'synced';
    NEW.last_sync_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for agents and conversations
DROP TRIGGER IF EXISTS update_agent_sync_status ON public.agents;
CREATE TRIGGER update_agent_sync_status
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE PROCEDURE public.update_sync_status();

DROP TRIGGER IF EXISTS update_conversation_sync_status ON public.conversations;
CREATE TRIGGER update_conversation_sync_status
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE PROCEDURE public.update_sync_status();

-- Create function to log sync operations
CREATE OR REPLACE FUNCTION public.log_sync_operation()
RETURNS TRIGGER AS $$
BEGIN
  -- Log successful sync
  IF NEW.sync_status = 'synced' AND (OLD.sync_status IS NULL OR OLD.sync_status != 'synced') THEN
    INSERT INTO public.sync_logs (entity_type, entity_id, operation, status, external_id)
    VALUES (
      CASE 
        WHEN TG_TABLE_NAME = 'agents' THEN 'agent'
        WHEN TG_TABLE_NAME = 'conversations' THEN 'conversation'
      END,
      NEW.id,
      'sync',
      'success',
      NEW.external_id
    );
  END IF;
  
  -- Log sync errors
  IF NEW.sync_status = 'error' AND (OLD.sync_status IS NULL OR OLD.sync_status != 'error') THEN
    INSERT INTO public.sync_logs (entity_type, entity_id, operation, status)
    VALUES (
      CASE 
        WHEN TG_TABLE_NAME = 'agents' THEN 'agent'
        WHEN TG_TABLE_NAME = 'conversations' THEN 'conversation'
      END,
      NEW.id,
      'sync',
      'error'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for sync logging
DROP TRIGGER IF EXISTS log_agent_sync ON public.agents;
CREATE TRIGGER log_agent_sync
  AFTER UPDATE ON public.agents
  FOR EACH ROW EXECUTE PROCEDURE public.log_sync_operation();

DROP TRIGGER IF EXISTS log_conversation_sync ON public.conversations;
CREATE TRIGGER log_conversation_sync
  AFTER UPDATE ON public.conversations
  FOR EACH ROW EXECUTE PROCEDURE public.log_sync_operation();