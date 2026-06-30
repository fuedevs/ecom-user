import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginRequestSchema, LoginResponseSchema } from '../../../src/lib/schemas/auth'
import { z } from 'zod'
import axiosClient from '../../../src/lib/api/axiosClient'
import { useRouter } from 'next/navigation'

type LoginForm = z.infer<typeof LoginRequestSchema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(LoginRequestSchema)
  })
  const [apiError, setApiError] = useState<string | null>(null)

  async function onSubmit(data: LoginForm) {
    setApiError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const payload = await res.json()
        setApiError(payload?.message || 'Login failed')
        return
      }
      // successful — redirect to home
      router.push('/')
    } catch (e: any) {
      setApiError(e?.message || 'Unexpected error')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      {apiError && <div className="text-sm text-red-600 mb-2">{apiError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full border rounded p-2" {...register('email')} />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 block w-full border rounded p-2" {...register('password')} />
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>
        <div>
          <button disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded">Sign in</button>
        </div>
      </form>
    </div>
  )
}
