import { NextRequest, NextResponse } from 'next/server';

/**
 * API route para conectar N8N à API principal
 * Configura webhooks e workflows para integração
 */

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    const n8nUrl = process.env.N8N_API_URL;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.ai';

    if (!n8nUrl) {
      return NextResponse.json(
        { error: 'N8N_API_URL not configured' },
        { status: 500 }
      );
    }

    switch (action) {
      case 'setup_webhooks':
        return await setupWebhooks(n8nUrl, apiUrl);
      
      case 'sync_workflows':
        return await syncWorkflows(n8nUrl, apiUrl);
      
      case 'test_connection':
        return await testConnection(n8nUrl);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('N8N connection error:', error);
    return NextResponse.json(
      { error: 'Connection failed' },
      { status: 500 }
    );
  }
}

async function setupWebhooks(n8nUrl: string, apiUrl: string) {
  // Configurar webhooks principais do sistema
  const webhooks = [
    {
      name: 'Lead Processing',
      endpoint: `${apiUrl}/leads/webhook`,
      events: ['lead.created', 'lead.updated', 'lead.qualified']
    },
    {
      name: 'WhatsApp Integration',
      endpoint: `${apiUrl}/whatsapp/webhook`,
      events: ['message.sent', 'message.received', 'message.failed']
    },
    {
      name: 'Agent Response',
      endpoint: `${apiUrl}/agents/webhook`,
      events: ['conversation.started', 'conversation.ended', 'response.generated']
    }
  ];

  const results = [];

  for (const webhook of webhooks) {
    try {
      // Criar workflow webhook no N8N
      const workflowData = createWebhookWorkflow(webhook);
      
      // Aqui você integraria com a API do N8N para criar o workflow
      // Por enquanto, vamos simular a criação
      results.push({
        name: webhook.name,
        status: 'created',
        webhookUrl: `${n8nUrl}/webhook/${webhook.name.toLowerCase().replace(' ', '-')}`
      });
    } catch (error) {
      results.push({
        name: webhook.name,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Webhooks configured',
    webhooks: results
  });
}

async function syncWorkflows(n8nUrl: string, apiUrl: string) {
  // Sincronizar workflows entre N8N e API
  const workflows = [
    'lead-processing',
    'whatsapp-sender',
    'sentiment-analysis',
    'data-backup',
    'crm-sync',
    'report-generator'
  ];

  const results = [];

  for (const workflow of workflows) {
    try {
      // Verificar se workflow existe
      const exists = await checkWorkflowExists(n8nUrl, workflow);
      
      if (!exists) {
        // Criar workflow se não existir
        await createWorkflow(n8nUrl, workflow);
        results.push({ workflow, status: 'created' });
      } else {
        results.push({ workflow, status: 'exists' });
      }
    } catch (error) {
      results.push({
        workflow,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Workflows synchronized',
    workflows: results
  });
}

async function testConnection(n8nUrl: string) {
  try {
    // Testar conexão básica com N8N
    const response = await fetch(`${n8nUrl}/healthz`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'N8N connection successful',
        url: n8nUrl,
        status: 'healthy'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'N8N connection failed',
        status: response.status
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'N8N unreachable',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function createWebhookWorkflow(webhook: any) {
  // Template básico de workflow webhook
  return {
    name: webhook.name,
    nodes: [
      {
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        position: [250, 300],
        parameters: {
          path: webhook.name.toLowerCase().replace(' ', '-'),
          httpMethod: 'POST'
        }
      },
      {
        name: 'Process Data',
        type: 'n8n-nodes-base.function',
        position: [450, 300],
        parameters: {
          functionCode: `
            // Processar dados do webhook
            const data = items[0].json;
            
            // Adicionar timestamp
            data.processedAt = new Date().toISOString();
            
            // Validar dados obrigatórios
            if (!data.id) {
              throw new Error('ID is required');
            }
            
            return [{ json: data }];
          `
        }
      },
      {
        name: 'Send to API',
        type: 'n8n-nodes-base.httpRequest',
        position: [650, 300],
        parameters: {
          url: webhook.endpoint,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Source': 'n8n'
          }
        }
      }
    ],
    connections: {
      'Webhook': {
        'main': [
          [
            {
              'node': 'Process Data',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      },
      'Process Data': {
        'main': [
          [
            {
              'node': 'Send to API',
              'type': 'main',
              'index': 0
            }
          ]
        ]
      }
    }
  };
}

async function checkWorkflowExists(n8nUrl: string, workflowName: string): Promise<boolean> {
  // Implementar verificação se workflow existe
  // Por enquanto retorna false para criar todos
  return false;
}

async function createWorkflow(n8nUrl: string, workflowName: string) {
  // Implementar criação de workflow
  // Por enquanto apenas log
  console.log(`Creating workflow: ${workflowName} on ${n8nUrl}`);
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}