"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

interface ProfileFormProps {
  user?: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validação básica
    if (newPassword && newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      // Simulação de atualização de perfil
      // Em produção, você implementaria a chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess("Perfil atualizado com sucesso")
    } catch (error) {
      setError("Ocorreu um erro ao atualizar o perfil")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
            {user?.image ? (
              <img
                src={user.image || "/placeholder.svg"}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <span className="text-2xl">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-medium">{name}</h2>
            <p className="text-gray-400">{email}</p>
          </div>
        </div>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">O email não pode ser alterado</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                Senha Atual
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  Nova Senha
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
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
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
