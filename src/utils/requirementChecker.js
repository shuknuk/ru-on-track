export function checkSASCoreCompletion(courses) {
  const coreCategories = {
    'QR': { required: 3, completed: 0 },
    'SCL': { required: 3, completed: 0 },
    'AH': { required: 6, completed: 0 },
    'NS': { required: 6, completed: 0 },
    'WC': { required: 3, completed: 0 },
  }

  courses.forEach(course => {
    if (course.fulfills) {
      course.fulfills.forEach(category => {
        if (coreCategories[category]) {
          coreCategories[category].completed += course.credits || 0
        }
      })
    }
  })

  return coreCategories
}

export function calculateMajorProgress(completedCredits, majorRequirementCredits = 60) {
  const percent = Math.min(100, (completedCredits / majorRequirementCredits) * 100)
  return {
    completed: completedCredits,
    required: majorRequirementCredits,
    percent: Math.round(percent),
  }
}