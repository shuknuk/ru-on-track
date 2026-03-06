export function calculateTotalCredits(courses) {
  return courses.reduce((sum, course) => sum + (course.credits || 0), 0)
}

export function calculateSemesterCredits(semesterCourses) {
  return calculateTotalCredits(semesterCourses)
}

export function calculateRemainingCredits(totalCompleted, graduationRequirement = 120) {
  return Math.max(0, graduationRequirement - totalCompleted)
}