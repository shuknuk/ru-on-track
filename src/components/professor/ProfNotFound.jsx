export default function ProfNotFound() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <h3 className="text-lg font-bold text-yellow-800 mb-2">No Professor Data Available</h3>
      <p className="text-yellow-700 mb-4">
        We don't store professor ratings directly. Instead, we link to RateMyProfessors.com where you can find up-to-date ratings and reviews.
      </p>
      <div className="text-sm text-yellow-600 border-t border-yellow-200 pt-4 mt-4">
        <p className="font-semibold">Disclaimer:</p>
        <p>Professor ratings are sourced from RateMyProfessors. Data may be outdated or inaccurate. Not guaranteed.</p>
      </div>
    </div>
  )
}