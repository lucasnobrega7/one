"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

export function SettingsForm() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("pt-BR")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Simulação de atualização de configurações
      // Em produção, você implementaria a chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess("Configurações atualizadas com sucesso")
    } catch (error) {
      setError("Ocorreu um erro ao atualizar as configurações")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-green-500">
          <CheckCircle className="h-5 w-5" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Preferências de Notificação</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-4 w-4 border border-gray-600 bg-gray-700 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="emailNotifications" className="font-medium">
                  Notificações por Email
                </label>
                <p className="text-sm text-gray-400">Receba atualizações sobre suas conversas e agentes</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketingEmails"
                  type="checkbox"
                  checked={marketingEmails}
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="h-4 w-4 border border-gray-600 bg-gray-700 focus:ring-0 focus:ring-offset-0"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="marketingEmails" className="font-medium">
                  Emails de Marketing
                </label>
                <p className="text-sm text-gray-400">Receba novidades, dicas e ofertas especiais</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Aparência</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium mb-2">
                Tema
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-2">
                Idioma
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Segurança</h3>
          <div className="space-y-4">
            <div>
              <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors">
                Ativar autenticação de dois fatores
              </button>
            </div>
            <div>
              <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors">
                Gerenciar dispositivos conectados
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : null}
            Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  )
}
