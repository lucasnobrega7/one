import { NextRequest, NextResponse } from 'next/server';
import { getN8nClient } from '@/lib/n8n/client';

/**
 * API route para executar workflows do N8N
 */

export async function POST(request: NextRequest) {
  try {
    const { workflowId, data } = await request.json();

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      );
    }

    const client = getN8nClient();
    const result = await client.executeWorkflow({
      workflowId,
      data: data || {}
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        executionId: result.executionId,
        data: result.data
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('N8N execution error:', error);
    return NextResponse.json(
      { error: 'Failed to execute workflow' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}