'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Cloud, Server, DollarSign, Activity } from 'lucide-react'
import { digitalOceanClient } from '@/lib/digitalocean'

interface DropletInfo {
  id: number
  name: string
  status: string
  region: { name: string; slug: string }
  size: { slug: string; memory: number; vcpus: number; disk: number; price_monthly: number }
  image: { name: string; distribution: string }
  created_at: string
}

interface AccountInfo {
  account: {
    droplet_limit: number
    floating_ip_limit: number
    email: string
    uuid: string
    email_verified: boolean
    status: string
  }
}

interface BillingInfo {
  account_balance: string
  generated_at: string
  month_to_date_balance: string
  month_to_date_usage: string
}

export default function DigitalOceanIntegrationPage() {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [droplets, setDroplets] = useState<DropletInfo[]>([])
  const [account, setAccount] = useState<AccountInfo | null>(null)
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      const connected = await digitalOceanClient.isConnected()
      setIsConnected(connected)

      if (connected) {
        await loadData()
      }
    } catch (err) {
      setError('Failed to check DigitalOcean connection')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadData = async () => {
    try {
      const [dropletsData, accountData] = await Promise.all([
        digitalOceanClient.getDroplets(),
        digitalOceanClient.getAccount(),
      ])

      setDroplets(dropletsData.droplets || [])
      setAccount(accountData)

      // Try to get billing info (might require additional permissions)
      try {
        const billingData = await digitalOceanClient.getBilling()
        setBilling(billingData)
      } catch (billingError) {
        console.warn('Could not fetch billing data:', billingError)
      }
    } catch (err) {
      setError('Failed to load DigitalOcean data')
      console.error(err)
    }
  }

  const handleConnect = () => {
    const authUrl = digitalOceanClient.getAuthorizationUrl()
    window.location.href = authUrl
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await digitalOceanClient.disconnect()
      setIsConnected(false)
      setDroplets([])
      setAccount(null)
      setBilling(null)
      setError(null)
    } catch (err) {
      setError('Failed to disconnect DigitalOcean account')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'new':
        return 'bg-blue-500'
      case 'off':
        return 'bg-gray-500'
      default:
        return 'bg-yellow-500'
    }
  }

  if (isLoading && !isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DigitalOcean Integration</h1>
          <p className="text-muted-foreground">
            Manage your DigitalOcean droplets and infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-500/10 text-gray-700">
              Disconnected
            </Badge>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Connect to DigitalOcean
            </CardTitle>
            <CardDescription>
              Connect your DigitalOcean account to manage droplets and monitor your infrastructure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnect} className="w-full">
              Connect DigitalOcean Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* Account Overview */}
          {account && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{account.account.status}</div>
                  <p className="text-xs text-muted-foreground">
                    {account.account.email}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Droplet Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{account.account.droplet_limit}</div>
                  <p className="text-xs text-muted-foreground">
                    {droplets.length} active droplets
                  </p>
                </CardContent>
              </Card>

              {billing && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Account Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${billing.account_balance}</div>
                    <p className="text-xs text-muted-foreground">
                      MTD Usage: ${billing.month_to_date_usage}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Droplets List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Droplets ({droplets.length})
                </CardTitle>
                <CardDescription>Your DigitalOcean droplets</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disconnect'}
              </Button>
            </CardHeader>
            <CardContent>
              {droplets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No droplets found
                </div>
              ) : (
                <div className="space-y-4">
                  {droplets.map((droplet) => (
                    <div
                      key={droplet.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{droplet.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(droplet.status)} text-white`}
                          >
                            {droplet.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {droplet.image.distribution} • {droplet.region.name} • 
                          {droplet.size.vcpus} vCPU, {droplet.size.memory}MB RAM
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${droplet.size.price_monthly}/mo</div>
                        <div className="text-sm text-muted-foreground">
                          Created {new Date(droplet.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}