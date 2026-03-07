'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !supabase) return
    initialized.current = true

    const fetchProfile = async (userId) => {
      if (!userId) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile(data)
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Get session error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createProfile = async (userId, email) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          email: email,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  const refreshProfile = async () => {
    if (!user?.id) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setProfile(data)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const signupPromise = supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ timedOut: true }), 15000)
    )

    const result = await Promise.race([signupPromise, timeoutPromise])

    if (result.timedOut) {
      return { data: null, error: new Error('Signup request timed out. Please try again.') }
    }

    const { data, error } = result

    if (data?.user && !error) {
      try {
        await createProfile(data.user.id, email)
      } catch (profileError) {
        console.error('Profile creation failed:', profileError)
      }
    }
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      refreshProfile,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
