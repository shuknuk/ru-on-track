export default function ProfCard({ professor }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-2">{professor?.name || 'Professor Name'}</h3>
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-amber-500 text-lg font-bold">4.2</div>
        <div className="text-gray-600">Quality</div>
        <div className="text-gray-500">|</div>
        <div className="text-green-500 text-lg font-bold">3.8</div>
        <div className="text-gray-600">Difficulty</div>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        {professor?.comment || 'No comments available'}
      </p>
      <a
        href={`https://www.ratemyprofessors.com/search/professors?q=${encodeURIComponent(professor?.name || '')}+rutgers`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm text-scarlet hover:underline"
      >
        View on RateMyProfessors →
      </a>
    </div>
  )
}