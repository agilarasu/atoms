'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGitHubLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('github', { callbackUrl: '/' })
    } catch (error) {
      console.error('Failed to sign in with GitHub', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <Button
        onClick={handleGitHubLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center">
            <Github className="w-5 h-5 mr-2" />
            Sign in with GitHub
          </span>
        )}
      </Button>
    </div>
  )
}

