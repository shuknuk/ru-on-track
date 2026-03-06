export default function SemesterCard({ year, semester }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          Year {year} - {semester}
        </h3>
        <span className="text-sm text-gray-500">0 credits</span>
      </div>
      <div className="text-gray-500 text-sm">
        No courses added yet
      </div>
      <button className="mt-4 w-full text-center py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-scarlet hover:text-scarlet transition">
        + Add Course
      </button>
    </div>
  )
}