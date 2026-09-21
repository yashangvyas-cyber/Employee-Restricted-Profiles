/* KPI card. Class strings COPIED from the six cards in
   modules/people/dom/employee_listing.html. The app renders two variants:
   an enabled card (hover border) and a disabled one (cursor-not-allowed). */

export default function StatCard({ label, value, action = 'view', disabled }) {
  const shell = disabled
    ? '2xl:py-5 2xl-to-xl:p-4 p-4 transition-colors focus:outline-none focus-visible:outline-none h-full bg-white rounded-xl border cursor-not-allowed'
    : '2xl:py-5 2xl-to-xl:p-4 p-4 focus:outline-none focus-visible:outline-none h-full bg-white rounded-xl border transition-colors cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/60'

  const icon =
    action === 'add'
      ? 'icon-plus 2xl:text-xl 2xl-to-xl:text-lg text-lg 2xl:p-2 2xl-to-xl:p-1.5 p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 cursor-pointer'
      : action === 'verified'
      ? 'icon-check-verified-02 2xl:text-xl 2xl-to-xl:text-lg text-lg cursor-pointer 2xl:p-2 2xl-to-xl:p-1.5 p-1.5 rounded-lg border border-success-300 bg-success-50 text-success-500'
      : disabled
      ? 'icon-eye 2xl:text-xl 2xl-to-xl:text-lg text-lg 2xl:p-2 2xl-to-xl:p-1.5 p-1.5 rounded-lg border border-gray-300 bg-gray-200 cursor-not-allowed text-gray-400'
      : 'icon-eye 2xl:text-xl 2xl-to-xl:text-lg text-lg 2xl:p-2 2xl-to-xl:p-1.5 p-1.5 rounded-lg border border-gray-300 cursor-pointer text-gray-700'

  return (
    <div className="h-full">
      <div className={shell}>
        <h3 className="text-gray-600 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium">{label}</h3>
        <div className="flex justify-between items-center mt-4">
          <div className="font-semibold 2xl:text-4xl 2xl-to-xl:text-2xl text-2xl text-gray-900 truncate">{value}</div>
          <div><span className={icon} /></div>
        </div>
      </div>
    </div>
  )
}
