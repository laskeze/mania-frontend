'use client'

import React, { useState } from 'react'
import { Upload, Camera, DollarSign, Bot, TrendingUp } from 'lucide-react'

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [costPrice, setCostPrice] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProcessedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const processWithAI = async () => {
    if (!processedImage || !costPrice) return
    
    setIsProcessing(true)
    
    // Simular processamento dos 109 agentes
    setTimeout(() => {
      setResult({
        title: "Smartphone Samsung Galaxy A54 128GB",
        suggestedPrice: (parseFloat(costPrice) * 2.5).toFixed(2),
        margin: "150%",
        category: "Celulares e Smartphones",
        tags: ["Samsung", "Android", "128GB", "Camera 50MP"]
      })
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">MAN IA</h1>
          <p className="text-xl">109 Agentes IA Automatizados</p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <Bot className="w-5 h-5" />
            <span className="text-sm">Sistema Online e Funcionando</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Upload de Produto para Análise IA
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
                    Processando com 109 Agentes...
                  </div>
                ) : (
                  'Processar com MAN IA'
                )}
              </button>
            </div>

            {/* Results */}
            <div>
              {isProcessing && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">
                    🤖 Agentes IA Trabalhando...
                  </h3>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="processing-animation">✓ Análise de imagem concluída</div>
                    <div className="processing-animation">✓ Reconhecimento de produto</div>
                    <div className="processing-animation">✓ Pesquisa de mercado</div>
                    <div className="processing-animation">✓ Cálculo de preços</div>
                    <div className="processing-animation">⏳ Otimização de título...</div>
                  </div>
                </div>
              )}

              {result && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-4">
                    ✅ Análise Concluída!
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Título:</span>
                      <p className="text-gray-900">{result.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Preço Sugerido:</span>
                      <p className="text-green-600 font-bold text-lg">R$ {result.suggestedPrice}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Margem:</span>
                      <p className="text-green-600">{result.margin}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Categoria:</span>
                      <p className="text-gray-900">{result.category}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Upload Inteligente</h3>
            <p className="text-gray-600 text-sm mt-2">IA analisa suas fotos automaticamente</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <Bot className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">109 Agentes IA</h3>
            <p className="text-gray-600 text-sm mt-2">Processamento paralelo inteligente</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900">Preços Otimizados</h3>
            <p className="text-gray-600 text-sm mt-2">Máxima margem de lucro garantida</p>
          </div>
        </div>
      </main>
    </div>
  )
}
