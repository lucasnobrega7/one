-- Fix Service Role Permissions for Schema Public
-- Execute this script in Supabase SQL Editor to grant full permissions to postgres role

-- Grant USAGE on schema public
GRANT USAGE ON SCHEMA public TO postgres;

-- Grant ALL privileges on all existing tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;

-- Grant USAGE and SELECT on all sequences in public schema
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Grant EXECUTE on all functions in public schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- Set default privileges for future tables created in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;

-- Set default privileges for future sequences created in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO postgres;

-- Set default privileges for future functions created in public schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO postgres;

-- Specific grants for Prisma-created tables
GRANT ALL PRIVILEGES ON TABLE public.organizations TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.memberships TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.users TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.agents TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.conversations TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.messages TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.datastores TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.datasources TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.api_keys TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.usage TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.analytics TO postgres;
GRANT ALL PRIVILEGES ON TABLE public.api_usage TO postgres;

-- Grant privileges on Prisma migration table
GRANT ALL PRIVILEGES ON TABLE public._prisma_migrations TO postgres;

-- Ensure postgres role can create tables and other objects
GRANT CREATE ON SCHEMA public TO postgres;

-- Refresh privileges
SELECT 'Service role permissions updated successfully!' AS status;