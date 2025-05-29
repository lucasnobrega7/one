import { NextRequest, NextResponse } from 'next/server';
import { getN8nClient } from '@/lib/n8n/client';

/**
 * API route para verificar status do N8N e execuções
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const executionId = searchParams.get('executionId');
    const workflowId = searchParams.get('workflowId');
    const action = searchParams.get('action') || 'health';

    const client = getN8nClient();

    switch (action) {
      case 'health':
        // Verificar saúde da conexão com N8N
        const healthCheck = await client.testConnection();
        return NextResponse.json(healthCheck);

      case 'execution':
        // Buscar execução específica
        if (!executionId) {
          return NextResponse.json(
            { error: 'executionId is required for execution status' },
            { status: 400 }
          );
        }

        const execution = await client.getExecution(executionId);
        return NextResponse.json(execution);

      case 'executions':
        // Buscar execuções de um workflow
        const limit = parseInt(searchParams.get('limit') || '20');
        const executions = await client.getExecutions(workflowId || undefined, limit);
        return NextResponse.json(executions);

      case 'workflows':
        // Listar workflows
        const workflows = await client.getWorkflows();
        return NextResponse.json(workflows);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: health, execution, executions, or workflows' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('N8N status error:', error);
    return NextResponse.json(
      { error: 'Failed to get N8N status' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}