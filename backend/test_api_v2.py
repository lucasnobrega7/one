#!/usr/bin/env python3
"""
Test script for Agentes de Conversão API v2.0
Tests basic functionality and endpoints
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime

# API Configuration
API_BASE_URL = "http://localhost:8000"  # Change for production
TEST_TOKEN = "test_token_here"  # Replace with valid token

class APITester:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    
    async def test_health_check(self, session):
        """Test basic health check"""
        print("🔍 Testing health check...")
        try:
            async with session.get(f"{self.base_url}/") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Health check: {data}")
                    return True
                else:
                    print(f"❌ Health check failed: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    async def test_docs_access(self, session):
        """Test API documentation access"""
        print("📚 Testing docs access...")
        try:
            async with session.get(f"{self.base_url}/docs") as response:
                if response.status == 200:
                    print("✅ Docs accessible")
                    return True
                else:
                    print(f"❌ Docs not accessible: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Docs access error: {e}")
            return False
    
    async def test_agents_endpoint(self, session):
        """Test agents endpoint (requires auth)"""
        print("🤖 Testing agents endpoint...")
        try:
            async with session.get(
                f"{self.base_url}/api/v2/agents", 
                headers=self.headers
            ) as response:
                if response.status in [200, 401]:  # 401 is expected without valid token
                    print(f"✅ Agents endpoint responding: {response.status}")
                    return True
                else:
                    print(f"❌ Agents endpoint error: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Agents endpoint error: {e}")
            return False
    
    async def test_models_endpoint(self, session):
        """Test models endpoint"""
        print("🎯 Testing models endpoint...")
        try:
            async with session.get(f"{self.base_url}/api/v2/models") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Models endpoint: {len(data)} models available")
                    return True
                else:
                    print(f"❌ Models endpoint error: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Models endpoint error: {e}")
            return False
    
    async def test_streaming_endpoint(self, session):
        """Test streaming capabilities (basic connectivity)"""
        print("🌊 Testing streaming endpoint connectivity...")
        try:
            # Just test if the endpoint exists and responds appropriately
            async with session.post(
                f"{self.base_url}/api/v2/agents/test/chat/stream",
                headers=self.headers,
                json={"messages": [{"role": "user", "content": "test"}]}
            ) as response:
                if response.status in [200, 401, 404]:  # Expected responses
                    print(f"✅ Streaming endpoint responding: {response.status}")
                    return True
                else:
                    print(f"❌ Streaming endpoint error: {response.status}")
                    return False
        except Exception as e:
            print(f"❌ Streaming endpoint error: {e}")
            return False
    
    async def run_all_tests(self):
        """Run all tests"""
        print(f"🚀 Starting API v2.0 tests at {datetime.now()}")
        print(f"🌐 Base URL: {self.base_url}")
        print("-" * 50)
        
        async with aiohttp.ClientSession() as session:
            tests = [
                self.test_health_check(session),
                self.test_docs_access(session),
                self.test_models_endpoint(session),
                self.test_agents_endpoint(session),
                self.test_streaming_endpoint(session)
            ]
            
            results = await asyncio.gather(*tests, return_exceptions=True)
            
            passed = sum(1 for result in results if result is True)
            total = len(results)
            
            print("-" * 50)
            print(f"📊 Results: {passed}/{total} tests passed")
            
            if passed == total:
                print("🎉 All tests passed! API v2.0 is ready!")
                return True
            else:
                print("⚠️  Some tests failed. Check the output above.")
                return False

async def main():
    """Main test function"""
    if len(sys.argv) > 1:
        api_url = sys.argv[1]
    else:
        api_url = API_BASE_URL
    
    tester = APITester(api_url, TEST_TOKEN)
    success = await tester.run_all_tests()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n❌ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test runner error: {e}")
        sys.exit(1)