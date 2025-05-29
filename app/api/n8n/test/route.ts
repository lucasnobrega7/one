import { NextRequest, NextResponse } from 'next/server';
import { getN8nClient } from '@/lib/n8n/client';

/**
 * API route para testar a integração N8N
 */

export async function GET(request: NextRequest) {
  try {
    const client = getN8nClient();
    
    // Testar conexão listando workflows
    const result = await client.getWorkflows();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Integração N8N funcionando',
        workflows: result.data?.data || [],
        workflowCount: result.data?.data?.length || 0,
        apiUrl: process.env.N8N_API_URL,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro na integração N8N',
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('N8N test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}