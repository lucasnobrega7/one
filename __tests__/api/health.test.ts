import { NextRequest } from 'next/server'
import { GET } from '@/app/api/health/route'

describe('/api/health', () => {
  it('should return health status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health', {
      method: 'GET',
    })

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
    })
  })
})