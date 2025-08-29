// Auth utilities and session management
import { supabase } from './db'

export interface User {
  id: string
  email: string
  role?: string
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email!,
    role: user.user_metadata?.role
  }
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({
    email,
    password
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email)
}
