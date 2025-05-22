"use client"

import { useState } from "react"
import { CreditCard, Lock, User, Mail, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface CheckoutFormProps {
  selectedPlan: {
    id: string
    name: string
    price: number
    period: string
  }
  onSubmit: (formData: CheckoutFormData) => void
  loading?: boolean
}

export interface CheckoutFormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Company Info (optional)
  company?: string
  
  // Payment Info
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  
  // Billing Address
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export function CheckoutForm({ selectedPlan, onSubmit, loading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "BR"
  })

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(' ').substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-zinc-800 bg-zinc-900/50 sticky top-6">
            <CardHeader>
              <CardTitle className="text-white">Resumo do Pedido</CardTitle>
              <CardDescription>Plano selecionado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{selectedPlan.name}</p>
                  <p className="text-sm text-gray-400">Cobrança mensal</p>
                </div>
                <p className="font-bold text-white">R${selectedPlan.price}</p>
              </div>
              
              <Separator className="bg-zinc-700" />
              
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Desconto (14 dias grátis)</p>
                <p className="text-green-500">-R${(selectedPlan.price * 0.5).toFixed(0)}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Subtotal</p>
                <p className="text-white">R${(selectedPlan.price * 0.5).toFixed(0)}</p>
              </div>
              
              <Separator className="bg-zinc-700" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <p className="text-white">Total hoje</p>
                <p className="text-white">R${(selectedPlan.price * 0.5).toFixed(0)}</p>
              </div>
              
              <div className="text-xs text-gray-400 mt-4">
                <p>• 14 dias grátis inclusos</p>
                <p>• Cancele a qualquer momento</p>
                <p>• Suporte incluído</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">Nome</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Sobrenome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="company" className="text-gray-300">Empresa (opcional)</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Informações de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber" className="text-gray-300">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="expiryDate" className="text-gray-300">Validade</Label>
                    <Input
                      id="expiryDate"
                      type="text"
                      required
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                    <Input
                      id="cvv"
                      type="text"
                      required
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 3))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardholderName" className="text-gray-300">Nome no Cartão</Label>
                  <Input
                    id="cardholderName"
                    type="text"
                    required
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="border-zinc-800 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Endereço de Cobrança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address" className="text-gray-300">Endereço</Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-300">Cidade</Label>
                    <Input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-300">Estado</Label>
                    <Input
                      id="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300">CEP</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value.replace(/\D/g, '').substring(0, 8))}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="12345-678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">País</Label>
                    <Input
                      id="country"
                      type="text"
                      required
                      value="Brasil"
                      readOnly
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto min-w-[300px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                <Lock className="w-4 h-4 mr-2" />
                {loading ? 'Processando...' : `Finalizar Compra - R$${(selectedPlan.price * 0.5).toFixed(0)}`}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>Seus dados estão seguros com criptografia SSL</p>
              <p>Cancele a qualquer momento durante o período de teste</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}