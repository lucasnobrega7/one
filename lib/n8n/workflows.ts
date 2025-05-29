/**
 * N8N Workflows Service
 * Serviços específicos para workflows comuns do N8N
 */

import { getN8nClient } from './client';

export interface WorkflowTriggerOptions {
  waitForCompletion?: boolean;
  timeout?: number;
}

/**
 * Workflow para processamento de leads
 */
export async function triggerLeadProcessing(
  leadData: {
    name: string;
    email: string;
    phone?: string;
    source: string;
    message?: string;
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  // Assumindo que existe um webhook específico para leads
  const webhookId = process.env.N8N_LEAD_WEBHOOK_ID || 'lead-processing';
  
  return await client.triggerWebhook(webhookId, {
    ...leadData,
    timestamp: new Date().toISOString(),
    source: leadData.source || 'website'
  });
}

/**
 * Workflow para envio de WhatsApp
 */
export async function triggerWhatsAppMessage(
  messageData: {
    phoneNumber: string;
    message: string;
    mediaUrl?: string;
    templateName?: string;
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_WHATSAPP_WEBHOOK_ID || 'whatsapp-sender';
  
  return await client.triggerWebhook(webhookId, {
    ...messageData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Workflow para análise de sentimento
 */
export async function triggerSentimentAnalysis(
  text: string,
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_SENTIMENT_WEBHOOK_ID || 'sentiment-analysis';
  
  return await client.triggerWebhook(webhookId, {
    text,
    timestamp: new Date().toISOString(),
    language: 'pt-BR'
  });
}

/**
 * Workflow para backup de dados
 */
export async function triggerDataBackup(
  backupData: {
    type: 'users' | 'conversations' | 'agents' | 'full';
    includeFiles?: boolean;
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_BACKUP_WEBHOOK_ID || 'data-backup';
  
  return await client.triggerWebhook(webhookId, {
    ...backupData,
    timestamp: new Date().toISOString(),
    requestedBy: 'system'
  });
}

/**
 * Workflow para notificações de sistema
 */
export async function triggerSystemNotification(
  notification: {
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    channels: ('email' | 'slack' | 'discord' | 'whatsapp')[];
    urgent?: boolean;
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_NOTIFICATION_WEBHOOK_ID || 'system-notifications';
  
  return await client.triggerWebhook(webhookId, {
    ...notification,
    timestamp: new Date().toISOString(),
    source: 'saas-system'
  });
}

/**
 * Workflow para integração com CRM
 */
export async function triggerCrmSync(
  contactData: {
    action: 'create' | 'update' | 'delete';
    contactId?: string;
    data: Record<string, any>;
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_CRM_WEBHOOK_ID || 'crm-sync';
  
  return await client.triggerWebhook(webhookId, {
    ...contactData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Workflow para geração de relatórios
 */
export async function triggerReportGeneration(
  reportConfig: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom';
    format: 'pdf' | 'excel' | 'csv';
    recipients: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  },
  options: WorkflowTriggerOptions = {}
) {
  const client = getN8nClient();
  
  const webhookId = process.env.N8N_REPORTS_WEBHOOK_ID || 'report-generator';
  
  return await client.triggerWebhook(webhookId, {
    ...reportConfig,
    timestamp: new Date().toISOString(),
    requestedBy: 'system'
  });
}

/**
 * Monitora execução de workflow até conclusão
 */
export async function monitorWorkflowExecution(
  executionId: string,
  timeout = 60000 // 1 minuto
): Promise<any> {
  const client = getN8nClient();
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        if (Date.now() - startTime > timeout) {
          reject(new Error('Workflow execution timeout'));
          return;
        }

        const result = await client.getExecution(executionId);
        
        if (!result.success) {
          reject(new Error(result.error));
          return;
        }

        const execution = result.data;
        
        if (execution.finished) {
          if (execution.status === 'success') {
            resolve(execution.data);
          } else {
            reject(new Error(`Workflow failed with status: ${execution.status}`));
          }
        } else {
          // Ainda executando, verificar novamente em 2 segundos
          setTimeout(checkStatus, 2000);
        }
      } catch (error) {
        reject(error);
      }
    };

    checkStatus();
  });
}

/**
 * Executa workflow e aguarda resultado
 */
export async function executeAndWait(
  workflowId: string,
  data: Record<string, any>,
  timeout = 60000
) {
  const client = getN8nClient();
  
  // Executa o workflow
  const execution = await client.executeWorkflow({ workflowId, data });
  
  if (!execution.success || !execution.executionId) {
    throw new Error(execution.error || 'Failed to start workflow execution');
  }

  // Monitora até conclusão
  return await monitorWorkflowExecution(execution.executionId, timeout);
}