import { NextRequest, NextResponse } from 'next/server'
import { resultsStore } from '../../webhook/n8n/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId

    console.log(`Buscando resultado para sessão: ${sessionId}`)

    // Buscar resultado no store temporário
    const storedResult = resultsStore.get(sessionId)

    if (!storedResult) {
      return NextResponse.json({
        status: 'processing',
        message: '20 agentes IA ainda trabalhando...',
        sessionId: sessionId
      })
    }

    console.log(`Resultado encontrado para sessão ${sessionId}`)

    return NextResponse.json({
      status: 'completed',
      sessionId: sessionId,
      data: storedResult.result,
      processedAt: storedResult.processedAt
    })

  } catch (error) {
    console.error('Erro ao buscar resultado:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar resultado' },
      { status: 500 }
    )
  }
}
