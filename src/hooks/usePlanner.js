import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function usePlanner(userId) {
  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching plans:', error)
      } else {
        setPlans(data)
        if (data.length > 0) {
          setCurrentPlan(data.find(p => p.is_active) || data[0])
        }
      }
      setLoading(false)
    }

    fetchPlans()
  }, [userId])

  const createPlan = async (planData) => {
    const { data, error } = await supabase
      .from('plans')
      .insert([{ ...planData, user_id: userId }])
      .select()

    if (!error && data?.[0]) {
      setPlans([data[0], ...plans])
      setCurrentPlan(data[0])
    }

    return { data, error }
  }

  return {
    plans,
    currentPlan,
    loading,
    createPlan,
  }
}