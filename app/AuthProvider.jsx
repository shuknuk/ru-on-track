'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authInitWarning, setAuthInitWarning] = useState('')
  const initialized = useRef(false)

  const withTimeout = async (promise, timeoutMs = 10000) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timed out. Please check your internet and try again.')), timeoutMs)
    })
    return Promise.race([promise, timeoutPromise])
  }

  useEffect(() => {
    if (initialized.current) return

    if (!supabase) {
      setLoading(false)
      return
    }

    initialized.current = true

    const fetchProfile = async (currentUser) => {
      if (!currentUser?.id) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } else if (data) {
        setProfile(data)
      } else {
        const { data: createdProfile, error: createError } = await createProfile(currentUser.id, currentUser.email)
        if (createError) {
          console.error('Error creating profile:', createError)
          setProfile(null)
        } else {
          setProfile(createdProfile || null)
        }
      }
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await withTimeout(supabase.auth.getSession())

        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user)
          setAuthInitWarning('')
        } else {
          setUser(null)
          setProfile(null)
          setAuthInitWarning('')
        }
      } catch (error) {
        console.error('Get session error:', error)
        setUser(null)
        setProfile(null)
        setAuthInitWarning('Authentication check took too long. You can still sign in, but please verify your connection if this keeps happening.')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null)
        setProfile(null)
        setAuthInitWarning('')
        setLoading(false)
        return
      }

      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user)
        setAuthInitWarning('')
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
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
      .maybeSingle()

    if (!error && data) {
      setProfile(data)
    } else if (!error) {
      setProfile(null)
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase client is not configured.') }
    }

    try {
      const result = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      )

      if (result?.data?.user) {
        const signedInUser = result.data.user
        setUser(signedInUser)
        setAuthInitWarning('')

        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signedInUser.id)
          .maybeSingle()

        if (profileError) {
          console.error('Error fetching profile after sign in:', profileError)
          setProfile(null)
        } else if (existingProfile) {
          setProfile(existingProfile)
        } else {
          const { data: createdProfile, error: createError } = await createProfile(signedInUser.id, signedInUser.email)
          if (createError) {
            console.error('Error creating profile after sign in:', createError)
            setProfile(null)
          } else {
            setProfile(createdProfile || null)
          }
        }
      }

      return result
    } catch (error) {
      return { data: null, error }
    }
  }

  const signUp = async (email, password) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase client is not configured.') }
    }

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
      )

      if (data?.user && !error) {
        if (data.session?.user) {
          setUser(data.session.user)
          setAuthInitWarning('')
        }

        try {
          await createProfile(data.user.id, email)
        } catch (profileError) {
          console.error('Profile creation failed:', profileError)
        }
      }

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      setUser(null)
      setProfile(null)
      return { error: null }
    }

    try {
      const { error } = await withTimeout(supabase.auth.signOut())
      setUser(null)
      setProfile(null)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      authInitWarning,
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
