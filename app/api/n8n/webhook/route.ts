import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Webhook handler para receber callbacks do N8N
 */

interface N8nWebhookPayload {
  executionId: string;
  workflowId: string;
  status: 'success' | 'error' | 'running' | 'waiting';
  data?: any;
  error?: string;
  timestamp: string;
  nodeData?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar assinatura do webhook (opcional)
    const headersList = headers();
    const signature = headersList.get('x-n8n-signature');
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

    // Se configurado, verificar a assinatura
    if (webhookSecret && signature) {
      const isValidSignature = await verifyWebhookSignature(
        await request.text(),
        signature,
        webhookSecret
      );

      if (!isValidSignature) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const payload: N8nWebhookPayload = await request.json();

    // Log da execução
    console.log(`N8N Webhook received: ${payload.workflowId} - ${payload.status}`);

    // Processar o webhook baseado no status
    switch (payload.status) {
      case 'success':
        await handleWorkflowSuccess(payload);
        break;
      case 'error':
        await handleWorkflowError(payload);
        break;
      case 'running':
        await handleWorkflowRunning(payload);
        break;
      case 'waiting':
        await handleWorkflowWaiting(payload);
        break;
      default:
        console.warn('Unknown workflow status:', payload.status);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('N8N webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleWorkflowSuccess(payload: N8nWebhookPayload) {
  console.log(`✅ Workflow ${payload.workflowId} completed successfully`);
  
  try {
    // Processar resultado baseado no tipo de workflow
    const workflowType = getWorkflowType(payload.workflowId);
    
    switch (workflowType) {
      case 'lead-processing':
        await handleLeadProcessingSuccess(payload);
        break;
      case 'whatsapp-sender':
        await handleWhatsAppSuccess(payload);
        break;
      case 'sentiment-analysis':
        await handleSentimentAnalysisSuccess(payload);
        break;
      case 'data-backup':
        await handleBackupSuccess(payload);
        break;
      case 'crm-sync':
        await handleCrmSyncSuccess(payload);
        break;
      default:
        console.log('Generic workflow success:', payload.data);
    }

    // Salvar resultado no banco de dados se necessário
    // await saveWorkflowExecution(payload);
    
  } catch (error) {
    console.error('Error handling workflow success:', error);
  }
}

async function handleWorkflowError(payload: N8nWebhookPayload) {
  console.error(`❌ Workflow ${payload.workflowId} failed:`, payload.error);
  
  try {
    // Enviar notificação de erro
    await sendErrorNotification(payload);
    
    // Tentar recuperação automática se configurado
    await attemptWorkflowRecovery(payload);
    
    // Salvar erro no banco de dados
    // await saveWorkflowError(payload);
    
  } catch (error) {
    console.error('Error handling workflow failure:', error);
  }
}

async function handleWorkflowRunning(payload: N8nWebhookPayload) {
  console.log(`🔄 Workflow ${payload.workflowId} is running...`);
  
  // Atualizar status em tempo real se necessário
  // await updateWorkflowStatus(payload.executionId, 'running');
}

async function handleWorkflowWaiting(payload: N8nWebhookPayload) {
  console.log(`⏳ Workflow ${payload.workflowId} is waiting...`);
  
  // Verificar se precisa de intervenção manual
  // await checkWaitingWorkflow(payload);
}

function getWorkflowType(workflowId: string): string {
  // Extrair tipo do workflow baseado no ID
  if (workflowId.includes('lead')) return 'lead-processing';
  if (workflowId.includes('whatsapp')) return 'whatsapp-sender';
  if (workflowId.includes('sentiment')) return 'sentiment-analysis';
  if (workflowId.includes('backup')) return 'data-backup';
  if (workflowId.includes('crm')) return 'crm-sync';
  return 'generic';
}

async function handleLeadProcessingSuccess(payload: N8nWebhookPayload) {
  console.log('Lead processing completed:', payload.data);
  
  // Processar resultado do lead
  const leadResult = payload.data;
  
  if (leadResult?.leadScore) {
    // Notificar equipe de vendas se lead é qualificado
    if (leadResult.leadScore > 7) {
      // await notifySalesTeam(leadResult);
    }
  }
}

async function handleWhatsAppSuccess(payload: N8nWebhookPayload) {
  console.log('WhatsApp message sent successfully:', payload.data);
  
  // Atualizar status da mensagem no banco
  // await updateMessageStatus(payload.data.messageId, 'sent');
}

async function handleSentimentAnalysisSuccess(payload: N8nWebhookPayload) {
  console.log('Sentiment analysis completed:', payload.data);
  
  // Processar resultado da análise
  const sentiment = payload.data;
  
  if (sentiment?.score < 0.3) {
    // Sentimento negativo - alertar equipe de suporte
    // await alertSupportTeam(sentiment);
  }
}

async function handleBackupSuccess(payload: N8nWebhookPayload) {
  console.log('Backup completed successfully:', payload.data);
  
  // Verificar integridade do backup
  // await verifyBackupIntegrity(payload.data.backupPath);
}

async function handleCrmSyncSuccess(payload: N8nWebhookPayload) {
  console.log('CRM sync completed:', payload.data);
  
  // Atualizar timestamp da última sincronização
  // await updateLastSyncTimestamp();
}

async function sendErrorNotification(payload: N8nWebhookPayload) {
  // Implementar notificação de erro
  console.log('Sending error notification for workflow:', payload.workflowId);
  
  // Exemplo: enviar para Slack, Discord, email, etc.
  // await sendToSlack({
  //   text: `🚨 Workflow Error: ${payload.workflowId}`,
  //   details: payload.error
  // });
}

async function attemptWorkflowRecovery(payload: N8nWebhookPayload) {
  // Implementar lógica de recuperação automática
  console.log('Attempting workflow recovery for:', payload.workflowId);
  
  // Exemplo: retry automático para certos tipos de erro
  // if (payload.error?.includes('timeout')) {
  //   await retryWorkflow(payload.workflowId, payload.data);
  // }
}

async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = `sha256=${hmac.digest('hex')}`;
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}