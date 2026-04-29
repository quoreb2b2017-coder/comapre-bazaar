import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a smart, helpful AI assistant for Compare Bazaar (compare-bazaar.com), an independent business software comparison website.

Help users find and compare business software in these categories:
Marketing (CRM, Email Marketing, Website Builders)
Technology (Payroll, VoIP/Phone Systems, GPS Fleet, Employee Management)
Sales (Sales CRM, Call Center, Project Management)

Keep answers short (2-4 sentences), practical, and end with a clear call-to-action.
Do not invent pricing numbers. If unsure, suggest getting free quotes.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { reply: 'Chatbot is not configured yet. Please set ANTHROPIC_API_KEY in environment variables.' },
        { status: 200 }
      )
    }

    const candidateModels = [
      process.env.ANTHROPIC_MODEL,
      'claude-3-5-haiku-20241022',
      'claude-3-5-sonnet-20241022',
    ].filter(Boolean)

    let response: Response | null = null
    let lastErrText = ''

    
    for (const model of candidateModels) {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: messages.slice(-10),
        }),
      })

      if (response.status === 401) {
        console.error('Unauthorized: Invalid API key')
        return NextResponse.json(
          { reply: 'Anthropic API key is invalid. Please re-check ANTHROPIC_API_KEY in .env.local.' },
          { status: 200 }
        )
      }

      if (response.ok) break

      lastErrText = await response.text()
      // If model is unavailable, try next candidate model.
      if (response.status === 404 && lastErrText.includes('model')) continue

      console.error('Anthropic API error:', lastErrText)
      return NextResponse.json(
        { reply: 'I am temporarily unavailable. Please try again in a moment.' },
        { status: 200 }
      )
    }

    if (!response || !response.ok) {
      console.error('Anthropic model selection error:', lastErrText)
      return NextResponse.json(
        {
          reply:
            'Chat model config issue detected. Please set ANTHROPIC_MODEL in .env.local to a model available on your Anthropic account.',
        },
        { status: 200 }
      )
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text ?? 'Sorry, I could not generate a response. Please try again.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
