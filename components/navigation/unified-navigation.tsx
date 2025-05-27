"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UnifiedNavigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">
                Agentes de Conversão
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default UnifiedNavigation;