'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const LoginSchema = z.object({
  phone: z.string().min(5, 'Enter phone'),
  otp: z.string().min(1).optional(),
})

type LoginForm = z.infer<typeof LoginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema)
  })
  const [apiError, setApiError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function onSubmit(data: LoginForm) {
    setApiError(null)
    setInfo(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })

      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        setApiError(payload?.message || 'Login failed')
        return
      }

      // Server sets HttpOnly cookie. Inform user and redirect.
      setInfo('Login successful — cookie set. Redirecting...')
      setTimeout(() => router.push('/'), 800)
    } catch (e: any) {
      setApiError(e?.message || 'Unexpected error')
    }
  }

  function fillTestCreds() {
    setValue('phone', '0130000001')
    setValue('otp', '1234')
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in (Phone + OTP)</h2>
      {apiError && <div className="text-sm text-red-600 mb-2">{apiError}</div>}
      {info && <div className="text-sm text-green-600 mb-2">{info}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input className="mt-1 block w-full border rounded p-2" {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">OTP</label>
          <input className="mt-1 block w-full border rounded p-2" {...register('otp')} />
          <p className="text-xs text-gray-500">If you don't have an OTP, press &quot;Use test creds&quot; (0130000001 / 1234) for staging.</p>
        </div>

        <div className="flex gap-2">
          <button disabled={isSubmitting} className="flex-1 bg-blue-600 text-white p-2 rounded">Sign in</button>
          <button type="button" onClick={fillTestCreds} className="px-3 py-2 bg-gray-100 rounded">Use test creds</button>
        </div>
      </form>
    </div>
  )
}
