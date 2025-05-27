import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const costPrice = formData.get('costPrice') as string
    
    if (!image || !costPrice) {
      return NextResponse.json(
        { error: 'Imagem e preço de custo são obrigatórios' },
        { status: 400 }
      )
    }

    // Converter imagem para base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = image.type

    // Dados para enviar ao N8N
    const n8nPayload = {
      image: {
        data: base64Image,
        mimeType: mimeType,
        filename: image.name
      },
      costPrice: parseFloat(costPrice),
      timestamp: new Date().toISOString(),
      sessionId: generateSessionId()
    }

    console.log('Enviando para N8N:', {
      sessionId: n8nPayload.sessionId,
      imageSize: base64Image.length,
      costPrice: n8nPayload.costPrice
    })

    // Enviar para N8N
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(n8nPayload)
    })

    if (!n8nResponse.ok) {
      throw new Error(`Erro N8N: ${n8nResponse.status}`)
    }

    const result = await n8nResponse.json()

    return NextResponse.json({
      success: true,
      sessionId: n8nPayload.sessionId,
      message: 'Processamento iniciado com 20 agentes IA',
      estimatedTime: '30-60 segundos',
      data: result
    })

  } catch (error) {
    console.error('Erro no processamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generateSessionId(): string {
  return `mania_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
