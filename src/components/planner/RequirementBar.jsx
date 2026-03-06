export default function RequirementBar() {
  const requirements = [
    { label: 'SAS Core', completed: 12, total: 21, color: 'bg-blue-500' },
    { label: 'Major Requirements', completed: 45, total: 60, color: 'bg-scarlet' },
    { label: 'Free Electives', completed: 9, total: 30, color: 'bg-green-500' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-bold text-lg mb-4">Requirement Progress</h3>
      <div className="space-y-4">
        {requirements.map((req) => {
          const percent = Math.round((req.completed / req.total) * 100)
          return (
            <div key={req.label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{req.label}</span>
                <span>{req.completed} / {req.total} credits</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${req.color} rounded-full`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}