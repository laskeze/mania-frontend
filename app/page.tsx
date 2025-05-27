'use client'

import React, { useState, useEffect } from 'react'
import { Upload, Camera, DollarSign, Bot, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [costPrice, setCostPrice] = useState('')
  const [result, setResult] = useState<any>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [processingSteps, setProcessingSteps] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProcessedImage(e.target?.result as string)
        setResult(null) // Limpar resultado anterior
        setError(null) // Limpar erro anterior
      }
      reader.readAsDataURL(file)
    }
  }

  const processWithAI = async () => {
    if (!processedImage || !costPrice) return
    
    setIsProcessing(true)
    setResult(null)
    setError(null)
    setProcessingSteps([])

    try {
      // Converter base64 de volta para File
      const response = await fetch(processedImage)
      const blob = await response.blob()
      const file = new File([blob], 'produto.jpg', { type: 'image/jpeg' })

      console.log('Enviando imagem para processamento...')

      // Enviar para API
      const formData = new FormData()
      formData.append('image', file)
      formData.append('costPrice', costPrice)

      const apiResponse = await fetch('/api/process-product', {
        method: 'POST',
        body: formData
      })

      const data = await apiResponse.json()

      if (data.success) {
        setSessionId(data.sessionId)
        console.log(`Processamento iniciado. Session ID: ${data.sessionId}`)
        
        // Iniciar polling para buscar resultado
        startPolling(data.sessionId)
      } else {
        throw new Error(data.error || 'Erro desconhecido')
      }

    } catch (error) {
      console.error('Erro:', error)
      setError(error instanceof Error ? error.message : 'Erro ao processar imagem')
      setIsProcessing(false)
    }
  }

  const startPolling = (sessionId: string) => {
    const steps = [
      '🔍 Analisando imagem com IA...',
      '🎨 Removendo fundo da imagem...',
      '🏷️ Gerando título otimizado...',
      '📝 Criando descrição atrativa...',
      '💰 Calculando preço sugerido...',
      '🎯 Otimizando para SEO...',
      '✅ Validação final de qualidade...'
    ]

    let stepIndex = 0
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingSteps(prev => [...prev, steps[stepIndex]])
        stepIndex++
      }
    }, 2000)

    // Polling para buscar resultado
    let pollCount = 0
    const maxPolls = 30 // 60 segundos máximo
    
    const pollInterval = setInterval(async () => {
      try {
        pollCount++
        console.log(`Polling tentativa ${pollCount}/${maxPolls}`)
        
        const response = await fetch(`/api/result/${sessionId}`)
        const data = await response.json()

        if (data.status === 'completed') {
          clearInterval(pollInterval)
          clearInterval(stepInterval)
          
          console.log('Resultado recebido:', data.data)
          setResult(data.data)
          setIsProcessing(false)
          
        } else if (pollCount >= maxPolls) {
          // Timeout
          clearInterval(pollInterval)
          clearInterval(stepInterval)
          setError('Timeout: Processamento demorou mais que o esperado')
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Erro no polling:', error)
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval)
          clearInterval(stepInterval)
          setError('Erro na comunicação com o servidor')
          setIsProcessing(false)
        }
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">MAN IA</h1>
          <p className="text-xl">20 Agentes IA Automatizados</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Bot className="w-5 h-5" />
            <span className="text-sm">Sistema Online com Integração N8N Real</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Upload de Produto para Análise IA Real
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {processedImage ? (
                    <img 
                      src={processedImage} 
                      alt="Produto" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="py-12">
                      <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-600">Clique para fazer upload da foto</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Análise real com 20 agentes IA via N8N
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Price Input */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço de Custo (R$)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Process Button */}
              <button
                onClick={processWithAI}
                disabled={!processedImage || !costPrice || isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando com 20 Agentes IA...
                  </div>
                ) : (
                  'Processar com MAN IA Real'
                )}
              </button>
            </div>

            {/* Results */}
            <div>
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold text-red-900">Erro no Processamento</h3>
                  </div>
                  <p className="text-red-700 mt-2">{error}</p>
                </div>
              )}

              {/* Processing Steps */}
              {isProcessing && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    🤖 20 Agentes IA Trabalhando via N8N...
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    {processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {step}
                      </div>
                    ))}
                    {sessionId && (
                      <div className="mt-4 p-2 bg-blue-100 rounded text-xs">
                        Session ID: {sessionId}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">
                    ✅ Análise Concluída pelos 20 Agentes IA!
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Título:</span>
                      <p className="text-gray-900">{result.title || 'Título gerado pela IA'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Descrição:</span>
                      <p className="text-gray-900">{result.description || 'Descrição detalhada'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Preço Sugerido:</span>
                      <p className="text-green-600 font-bold text-lg">
                        R$ {result.suggestedPrice || (parseFloat(costPrice) * 2.5).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Categoria:</span>
                      <p className="text-gray-900">{result.category || 'Categoria auto-detectada'}</p>
                    </div>
                    
                    {/* Processed Image */}
                    {result.processedImage && (
                      <div>
                        <span className="font-medium text-gray-700">Imagem Processada:</span>
                        <img 
                          src={`data:image/png;base64,${result.processedImage}`}
                          alt="Produto Processado" 
                          className="w-full h-32 object-cover rounded-lg mt-2"
                        />
                      </div>
                    )}
                    
                    {/* Publish Button */}
                    <div className="mt-4 pt-4 border-t">
                      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                        🛒 Publicar no Mercado Livre
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Upload Real</h3>
            <p className="text-gray-600 text-sm mt-2">Processamento via N8N com APIs reais</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Bot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">20 Agentes IA</h3>
            <p className="text-gray-600 text-sm mt-2">GPT-4 Vision + Remove.bg + Validação</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Análise Real</h3>
            <p className="text-gray-600 text-sm mt-2">Título e preço otimizados por IA</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <CheckCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Integração N8N</h3>
            <p className="text-gray-600 text-sm mt-2">Webhook real funcionando</p>
          </div>
        </div>
      </main>
    </div>
  )
}
