const gradePoints = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
}

export function calculateGPA(courses) {
  let totalPoints = 0
  let totalCredits = 0

  courses.forEach(course => {
    if (course.grade && gradePoints[course.grade] !== undefined) {
      const credits = course.credits || 0
      totalPoints += gradePoints[course.grade] * credits
      totalCredits += credits
    }
  })

  if (totalCredits === 0) return 0
  return totalPoints / totalCredits
}

export function estimateFutureGPA(currentGPA, currentCredits, futureCourses, predictedGrades) {
  const currentPoints = currentGPA * currentCredits
  let futurePoints = 0
  let futureCredits = 0

  futureCourses.forEach((course, index) => {
    const grade = predictedGrades[index] || 'B'
    const credits = course.credits || 0
    futurePoints += (gradePoints[grade] || 3.0) * credits
    futureCredits += credits
  })

  const totalCredits = currentCredits + futureCredits
  const totalPoints = currentPoints + futurePoints

  if (totalCredits === 0) return 0
  return totalPoints / totalCredits
}