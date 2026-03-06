import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async (userId) => {
      if (!userId) {
        setProfile(null)
        return
      }

      // Timeout for profile fetch
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ timedOut: true }), 10000)
      )

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const result = await Promise.race([fetchPromise, timeoutPromise])

      if (result.timedOut) {
        console.error('Profile fetch timed out')
        setProfile(null)
        return
      }

      const { data, error } = result

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    }

    const handleAuthChange = async (session) => {
      try {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error('Auth change error:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session)
    }).catch((error) => {
      console.error('Get session error:', error)
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        await handleAuthChange(session)
      } catch (error) {
        console.error('Auth state change error:', error)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const createProfile = async (userId, email) => {
    // Timeout for profile creation
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ timedOut: true }), 10000)
    )

    const createPromise = supabase
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

    const result = await Promise.race([createPromise, timeoutPromise])

    if (result.timedOut) {
      console.error('Profile creation timed out')
      return { data: null, error: new Error('Profile creation timed out') }
    }

    const { data, error } = result

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    // Add timeout to prevent infinite hang
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

    // Try to create profile, but don't block on failure
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

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }
}