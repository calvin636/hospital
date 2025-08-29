// React hooks for API calls
import { useState, useEffect } from 'react'
import { apiClient } from './client'
import type { MemberContext, UsageMeter, PolicyDocument } from '../memberContext'

export function useMemberContext() {
  const [context, setContext] = useState<MemberContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContext() {
      try {
        const data = await apiClient.get('/me/context')
        setContext(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load context')
      } finally {
        setLoading(false)
      }
    }

    fetchContext()
  }, [])

  return { context, loading, error }
}

export function useMemberPolicy() {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPolicy() {
      try {
        const data = await apiClient.get('/me/policy')
        setPolicy(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load policy')
      } finally {
        setLoading(false)
      }
    }

    fetchPolicy()
  }, [])

  return { policy, loading, error }
}

export function useUsageMeters() {
  const [meters, setMeters] = useState<UsageMeter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMeters() {
      try {
        const data = await apiClient.get('/me/meters')
        setMeters(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meters')
      } finally {
        setLoading(false)
      }
    }

    fetchMeters()
  }, [])

  const refetch = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get('/me/meters')
      setMeters(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh meters')
    } finally {
      setLoading(false)
    }
  }

  return { meters, loading, error, refetch }
}
