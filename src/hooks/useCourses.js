import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('course_code')

      if (error) {
        setError(error.message)
      } else {
        setCourses(data)
      }
      setLoading(false)
    }

    fetchCourses()
  }, [])

  const searchCourses = async (query) => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .or(`course_code.ilike.%${query}%,title.ilike.%${query}%`)
      .limit(20)

    if (error) {
      console.error('Error searching courses:', error)
      return []
    }

    return data
  }

  return {
    courses,
    loading,
    error,
    searchCourses,
  }
}