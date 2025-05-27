import { NextRequest, NextResponse } from 'next/server'

// Store temporário para resultados (em produção usar banco de dados)
const resultsStore = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('Resultado recebido do N8N:', {
      sessionId: data.sessionId,
      success: data.success,
      hasResult: !!data.result
    })
    
    // Validar se é um resultado válido do N8N
    if (!data.sessionId || !data.result) {
      return NextResponse.json(
        { error: 'Dados inválidos do N8N' },
        { status: 400 }
      )
    }

    // Armazenar resultado no store temporário
    resultsStore.set(data.sessionId, {
      result: data.result,
      processedAt: new Date().toISOString(),
      success: data.success
    })

    console.log(`Resultado armazenado para sessão ${data.sessionId}`)

    return NextResponse.json({
      success: true,
      message: 'Resultado recebido e processado'
    })

  } catch (error) {
    console.error('Erro no webhook N8N:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Exportar store para uso em outros endpoints
export { resultsStore }
