import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  try {
    const { chats_id } = await req.json()

    if (!Array.isArray(chats_id) || chats_id.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Invalid chats_id array' }), { status: 400 })
    }

    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .in('id', chats_id)
      
    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new NextResponse(JSON.stringify({ chats }), { status: 200 })
  } catch (err) {
		console.error('Error fetching chats:', err)
    return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
  }
}
