import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const status = searchParams.get('status')
    const agentId = searchParams.get('agent_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('conversations')
      .select(`
        *,
        agent:agents(name, id),
        messages(id, content, created_at)
      `)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    
    if (agentId) {
      query = query.eq('agent_id', agentId)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })

    if (status) countQuery = countQuery.eq('status', status)
    if (agentId) countQuery = countQuery.eq('agent_id', agentId)

    const { count } = await countQuery

    return NextResponse.json({
      conversations,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { 
      agent_id, 
      customer_name, 
      customer_email, 
      customer_phone,
      channel = 'web',
      initial_message 
    } = body

    // Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        agent_id,
        customer_name,
        customer_email,
        customer_phone,
        channel,
        status: 'active',
        priority: 'medium'
      })
      .select()
      .single()

    if (conversationError) {
      console.error('Error creating conversation:', conversationError)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    // Create initial message if provided
    if (initial_message && conversation) {
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          content: initial_message,
          sender_type: 'customer',
          sender_name: customer_name
        })

      if (messageError) {
        console.error('Error creating initial message:', messageError)
      }
    }

    return NextResponse.json({ conversation }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}