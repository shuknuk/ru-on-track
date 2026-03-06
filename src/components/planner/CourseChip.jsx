export default function CourseChip({ course }) {
  return (
    <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center space-x-2">
      <span className="font-medium">{course?.course_code || 'CSC 123'}</span>
      <span className="text-gray-600">{course?.title || 'Intro to CS'}</span>
      <span className="text-xs bg-scarlet text-white px-2 py-0.5 rounded-full">
        {course?.credits || 3}cr
      </span>
    </div>
  )
}