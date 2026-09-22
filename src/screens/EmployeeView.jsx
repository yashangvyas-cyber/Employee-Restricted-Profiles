/* View Employee — General Info.
 *
 * Source: modules/people/dom/employee_view_general_info_2026-09-22.html
 * Every class string below is pasted from that capture.
 *
 * Layout is a fixed-width LEFT PROFILE PANEL beside a scrolling RIGHT COLUMN,
 * split by `divide-x-2`. The right column holds a tab strip, an Edit Employee
 * button, an <hr>, then a 3-up header card and the detail sections.
 */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { employeeDetail } from '../api/mockApi'
import { peoplePath } from '../lib/tenant'
import { StatusPill, initials, HiddenBadge } from '../components/primitives'
import HiddenAvatar from '../components/HiddenAvatar'

/* Captured for this employee. The tab set is per-employee / permission driven —
   a different employee showed Job Interviews, Client Interview Resource
   Allocation and Projects instead of Performance. */
const TABS = [
  { key: 'general-info',     label: 'General Info' },
  { key: 'timeline',         label: 'Timeline' },
  { key: 'assets-allocated', label: 'Assets Allocated' },
  { key: 'performance',      label: 'Performance' },
]
const TAB_ON =
  'min-w-[fit-content] text-indigo-700 bg-indigo-50 rounded-md tab-transition font-semibold relative z-[20] whitespace-nowrap 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:px-3 2xl-to-xl:px-2 px-2 w-fit 2xl:text-sm 2xl-to-xl:text-xs text-xs text-center'
const TAB_OFF =
  'min-w-[fit-content] text-gray-500 rounded-md tab-transition font-semibold relative z-[20] whitespace-nowrap 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:px-3 2xl-to-xl:px-2 px-2 w-fit 2xl:text-sm 2xl-to-xl:text-xs text-xs text-center'
const VAL =
  'custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal mt-1 block 2xl:text-sm 2xl-to-xl:text-xs text-xs'

const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const fmtDate = (d) => {
  if (!d) return '-'
  const t = new Date(d); if (Number.isNaN(+t)) return '-'
  return `${String(t.getDate()).padStart(2,'0')}-${M[t.getMonth()]}-${t.getFullYear()}`
}
const fmtDateTime = (d) => {
  if (!d) return '-'
  const t = new Date(d); if (Number.isNaN(+t)) return '-'
  let h = t.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12
  return `${fmtDate(d)}, ${String(h).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')} ${ap}`
}
const tenure = (from) => {
  if (!from) return '-'
  const d = new Date(from); if (Number.isNaN(+d)) return '-'
  const now = new Date()
  let months = (now.getFullYear()-d.getFullYear())*12 + (now.getMonth()-d.getMonth())
  let days = now.getDate() - d.getDate()
  if (days < 0) { months -= 1; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
  if (months < 0) return '-'
  const y = Math.floor(months/12), mm = months%12
  return [y?`${y}Y`:null, mm?`${mm}M`:null, days?`${days}D`:null].filter(Boolean).join(' ') || '0D'
}

/** Detail section: white card, grey-bordered header bar, 3-column body. */
function Section({ id, title, children, cols = 3, change }) {
  return (
    <div id={id} className="bg-white border rounded-lg mb-3 last:mb-0 border-gray-200" {...(change ? { 'data-change': change } : {})}>
      <div className="flex items-center justify-between border-b 2xl:p-4 2xl-to-xl:p-3 p-3 rounded-t-lg bg-gray-100 border-gray-200 !bg-white">
        <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-800 font-medium">{title}</p>
      </div>
      <div className="2xl:p-6 2xl-to-xl:p-3 p-3">
        <div className={`grid grid-cols-${cols} gap-x-2 gap-y-6`}>{children}</div>
      </div>
    </div>
  )
}
function F({ label, value, children }) {
  return (
    <div>
      <p className="label">{label}</p>
      {children ?? <p className={VAL}>{value === null || value === undefined || value === '' ? '-' : value}</p>}
    </div>
  )
}
/** Left-panel block: padded, bottom-bordered. */
function Block({ label, children, extra }) {
  return (
    <div className={`p-4 border-b border-gray-200${extra ? ' ' + extra : ''}`}>
      {label && <p className="label">{label}</p>}
      {children}
    </div>
  )
}

export default function EmployeeView() {
  const { id, tab = 'general-info' } = useParams()
  const navigate = useNavigate()
  const [e, setE] = useState(null)
  useEffect(() => { employeeDetail(id).then((r) => setE(r.data)) }, [id])
  if (!e) return <div className="p-6">Loading…</div>

  const full = [e.first_name, e.middle_name, e.last_name].filter(Boolean).join(' ')
  const c = e.employee_contact_info || {}
  const x = e.employee_experiences || {}
  const a = (e.employee_addresses || [])[0] || {}
  const role = (e.employee_roles || [])[0] || {}
  const ec = (e.employee_emergency_contacts || [])
  const bu = e.businessUnit?.name || ''
  const mgr = [e.reporting_to?.first_name, e.reporting_to?.last_name].filter(Boolean).join(' ')
  const skills = e.skills || []

  return (
    <div className="2xl:h-[calc(100vh-98px)] 2xl-to-xl:h-[calc(100vh-86px)] h-[calc(100vh-86px)] flex divide-x-2 justify-start">

      {/* ---------------- LEFT PROFILE PANEL ---------------- */}
      <div className="bg-white overflow-y-auto scrollbar-hide relative group 2xl:w-[326px] w-[208px] 2xl:flex-[0_0_326px] flex-[0_0_208px]">
        <div className="w-full">
          <div className="pt-2">
            <div className="flex justify-between gap-x-1 2xl:px-6 px-3">
              <div className="flex gap-x-1 items-center">
                <div className="rounded-2xl border flex w-max font-medium items-center !rounded-lg cursor-pointer 2xl:!text-xs 2xl-to-xl:!text-xxs !text-xxs z-10 bg-gray-50 border-gray-200 py-0.5 px-2 text-xs">
                  <span><p>YET TO CHECK-IN</p></span>
                </div>
              </div>
            </div>

            <div className="p-4 text-center border-b border-gray-200 flex flex-col items-center relative">
              {/* #OpenToWork-style arc band across the bottom of the avatar,
                  with the label curved along it. See HiddenAvatar.jsx. */}
              <div className="flex justify-center w-fit relative" {...(e.is_hidden ? { 'data-change': 'NEW' } : {})}>
                <HiddenAvatar initials={initials(full)} hidden={!!e.is_hidden} />
              </div>
              <p className="text-gray-900 font-medium 2xl:text-lg 2xl-to-xl:text-base text-base mt-4 max-w-72 overflow-hidden text-ellipsis">{full}</p>
              <p className="text-gray-600 2xl:text-sm 2xl-to-xl:text-xs text-xs font-normal max-w-72 overflow-hidden text-ellipsis">{e.designation?.title}</p>
              <div className="flex justify-center flex-col">
                <div className="flex justify-center">
                  <div className="rounded-2xl border flex w-max font-medium items-center border-gray-200 !rounded-lg text-gray-700 mt-3 py-0.5 px-2 text-xs">
                    <span><p className="truncate max-w-48 text-gray-700">{e.department?.title}</p></span>
                  </div>
                </div>
                <div className="mt-3 z-1 2xl:mb-0 2xl-to-xl:mb-1 mb-1">
                  <button type="submit" className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:whitespace-normal whitespace-nowrap px-2">
                    <div className="flex items-center justify-center gap-2">Send Password to Employee</div>
                  </button>
                </div>
              </div>
            </div>

            <Block label="About Me">
              <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal block mt-2 text-gray-900">{e.about || '-'}</p>
            </Block>

            <Block label="Business Unit">
              <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs custom-text-break whitespace-pre-wrap first-letter:uppercase flex gap-x-2 items-center mt-2 text-gray-900 font-semibold">{bu || '-'}</p>
            </Block>

            <Block label="Experience">
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700">Previous</p>
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold text-gray-900 ">
                    {x.prev_exp_year || x.prev_exp_month ? `${x.prev_exp_year||0}Y ${x.prev_exp_month||0}M` : '-'}
                  </p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-700">At {bu}</p>
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs font-semibold text-gray-900">{tenure(x.joined_date)}</p>
                </div>
              </div>
            </Block>

            <Block extra="space-y-2" label={null}>
              <p className="label">Skills<span className="icon-info-circle text-gray-400 align-text-top text-sm cursor-pointer ml-1" /></p>
              <div className="flex flex-wrap gap-2 items-center">
                {skills.length === 0
                  ? <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-900">-</p>
                  : skills.map((s) => (
                      <div key={s}>
                        <div className="border flex w-max font-medium items-center rounded-md 2xl:text-sm 2xl-to-xl:text-xs max-w-fit bg-success-50 border-success-200 text-success-700 py-0.5 px-2 text-xs">
                          <span>{s}</span>
                        </div>
                      </div>
                    ))}
              </div>
            </Block>

            <Block label="Badges Received">
              <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs mt-2 text-gray-900">No badges received.</p>
            </Block>

            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-x-4">
                <div className="flex-1">
                  <p className="label">Seating Location</p>
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal block mt-2 text-gray-900">{c.seating_location || '-'}</p>
                </div>
                <div className="flex-1">
                  <p className="label">Extension Number</p>
                  <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal block mt-2 text-gray-900">{c.extension_number || '-'}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <button type="submit" className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs whitespace-nowrap px-2 w-full">
                <div className="flex items-center justify-center gap-2">Give Feedback</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT COLUMN ---------------- */}
      <div className="w-full overflow-hidden">
        <div className="flex items-center justify-between 2xl:p-4 2xl-to-xl:p-3 p-3">
          <div className="block w-full">
            <nav aria-label="Tabs" className="scrollbar-hide tab flex items-center relative overflow-x-auto overflow-y-hidden 2xl:gap-3 2xl-to-xl:gap-2 gap-2">
              {TABS.map((t, i) => (
                <button
                  key={t.key}
                  id={`tab-${i}`}
                  type="button"
                  className={t.key === tab ? TAB_ON : TAB_OFF}
                  onClick={() => navigate(peoplePath(`/employee-detail/${id}/${t.key}`))}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex gap-3 items-center ml-2">
            <Link to={peoplePath(`/employee/${id}/edit`)}>
              <button type="submit" className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white whitespace-nowrap 2xl:h-9 h-8 2xl-to-xl:h-8 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs">
                <div className="flex items-center justify-center gap-2">Edit Employee</div>
              </button>
            </Link>
          </div>
        </div>
        <hr className="w-full" />

        <div className="2xl:max-h-[calc(100vh-150px)] 2xl-to-xl:max-h-[calc(100vh-132px)] max-h-[calc(100vh-132px)] h-full overflow-y-auto 2xl:p-4 p-3">
          {tab !== 'general-info' ? (
            <div className="bg-white border rounded-lg border-gray-200 2xl:p-6 p-3">
              <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-800 font-medium">{TABS.find((t) => t.key === tab)?.label}</p>
              <p className="label mt-2">Captured as a page; contents not extracted. See GAPS.md.</p>
            </div>
          ) : (
          <div>
            <div className="3xl:flex gap-x-5 rounded-xl">
              <div className="flex 2xl:gap-y-1 flex-col flex-1 3xl:w-3/4 w-full rounded-xl">

                {/* 3-up header card */}
                <div className="bg-white border border-gray-200 rounded-lg grid grid-cols-3 mb-3">
                  <div className="border-r border-gray-200 2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="flex justify-between items-center">
                      <div className="border-gray-100 cursor-pointer flex items-center justify-center rounded-md border">
                        <a href={`mailto:${e.email || ''}`} className="icon-mail-01 2xl:text-xl 2xl-to-xl:text-lg text-lg text-gray-700 2xl:p-2 2xl-to-xl:p-1 p-1" />
                      </div>
                      <div><span className="icon-copy-03 2xl:text-xl 2xl-to-xl:text-lg text-lg text-gray-400 cursor-pointer" /></div>
                    </div>
                    <div className="mt-2">
                      <p className="label">Email Address</p>
                      <p className="custom-text-break whitespace-pre-wrap font-medium mt-1 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{e.email || '-'}</p>
                    </div>
                  </div>
                  <div className="border-r border-gray-200 2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="mt-2">
                      <p className="label">Employee Code</p>
                      <p className="custom-text-break whitespace-pre-wrap font-medium mt-1 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{e.employee_code || '-'}</p>
                    </div>
                  </div>
                  <div className="2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="flex items-center gap-x-3">
                      <div className="rounded-full flex items-center justify-center bg-primary-500 2xl:h-9 h-8 2xl:w-9 w-8">
                        <span className="font-medium text-white uppercase 2xl:text-base text-sm">{initials(mgr)}</span>
                      </div>
                      <div>
                        <p className="label">Reporting Manager</p>
                        <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-900 font-medium">{mgr || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Section id="personal_information" title="Personal Information">
                  <F label="First Name" value={e.first_name} />
                  <F label="Middle Name" value={e.middle_name} />
                  <F label="Last Name" value={e.last_name} />
                  <F label="Gender" value={e.gender} />
                  <F label="Date of Birth" value={fmtDate(e.birth_date)} />
                  <F label="Blood Group" value={e.blood_group} />
                </Section>

                <Section id="employee_information" title="Employee Information">
                  <F label="Business Unit" value={bu} />
                  <F label="Employee Code" value={e.employee_code} />
                  <F label="Status"><div className="mt-1"><StatusPill status={e.status} /></div></F>
                  <F label="Department" value={e.department?.title} />
                  <F label="Designation" value={e.designation?.title} />
                  <F label="Reporting to" value={mgr} />
                  <F label="Employee Type" value={e.employee_type} />
                  <F label="Biometric ID" value={e.biometric_id} />
                  <F label="Active Shift">
                    <p className={VAL}>{e.current_shift?.name || '-'}</p>
                    {e.current_shift?.timing && <p className="text-gray-500 2xl:text-xs 2xl-to-xl:text-xxs text-xxs">{e.current_shift.timing}</p>}
                  </F>
                </Section>

                <Section id="employee_role_information" title="Employee Role Information">
                  <F label="Employee Role" value={role.role?.title} />
                  <F label="Expiry Date" value={fmtDate(role.expire_date)} />
                  <F label="Remarks" value={role.remarks} />
                </Section>

                <Section id="company_contact_information" title="Company Contact Information">
                  <F label="Company Email Address" value={e.email} />
                  <F label="Company Mobile Number" value={c.company_mobile} />
                  <F label="Seating Location" value={c.seating_location} />
                  <F label="Extension Number" value={c.extension_number} />
                </Section>

                <Section id="personal_contact_information" title="Personal Contact Information">
                  <F label="Personal Email Address" value={c.personal_email} />
                  <F label="Personal Mobile Number" value={c.personal_mobile ? `+${c.personal_country_code || '91'} ${c.personal_mobile}` : null} />
                  <F label="Alternate Phone Number" value={c.alternate_mobile} />
                </Section>

                <Section id="experience" title="Experience">
                  <F label="Joining Date" value={fmtDate(x.joined_date)} />
                  <F label="Confirmation Date" value={fmtDate(x.confirmed_date)} />
                  <F label={`Experience @ ${bu}`} value={tenure(x.joined_date)} />
                  <F label="Previous Experience" value={x.prev_exp_year || x.prev_exp_month ? `${x.prev_exp_year||0}Y ${x.prev_exp_month||0}M` : null} />
                </Section>

                <Section id="family_details" title="Family Details">
                  <F label="Father's Name" value={e.father_name} />
                  <F label="Mother's Name" value={e.mother_name} />
                  <F label="Spouse's Name" value={e.spouse_name} />
                  <F label="Marital Status" value={e.marital_status} />
                  <F label="Marriage Date" value={fmtDate(e.marriage_date)} />
                  <F label="Spouse's Date of Birth" value={fmtDate(e.spouse_birth_date)} />
                </Section>

                <div id="present_address" className="bg-white border rounded-lg mb-3 last:mb-0 border-gray-200">
                  <div className="flex items-center justify-between border-b 2xl:p-4 2xl-to-xl:p-3 p-3 rounded-t-lg bg-gray-100 border-gray-200 !bg-white">
                    <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-800 font-medium">Present Address</p>
                  </div>
                  <div className="2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-6">
                      <F label="Address" value={a.address} />
                      <F label="Country" value={a.country?.name} />
                      <F label="State" value={a.state?.name} />
                      <F label="Town/City" value={a.city} />
                      <F label="Pin Code" value={a.zipcode} />
                    </div>
                    <p className="2xl:text-xs 2xl-to-xl:text-xxs text-xxs font-medium text-gray-700 mt-4">Permanent Address - Same as above</p>
                  </div>
                </div>

                <div id="emergency_contact" className="bg-white border rounded-lg mb-3 last:mb-0 border-gray-200">
                  <div className="flex items-center justify-between border-b 2xl:p-4 2xl-to-xl:p-3 p-3 rounded-t-lg bg-gray-100 border-gray-200 !bg-white">
                    <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-800 font-medium">Emergency Contact</p>
                  </div>
                  <div className="2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-6">
                      <p className="label">Name</p>
                      <p className="label">Contact Number</p>
                      <p className="label">Relation</p>
                    </div>
                    {(ec.length ? ec : [{}]).map((r, i) => (
                      <div key={i} className="grid grid-cols-3 gap-x-2 gap-y-2 2xl:mt-2 2xl-to-xl:mt-1 mt-1">
                        <div><p className="custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal mt-0 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{r.name || '-'}</p></div>
                        <div><p className="custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal mt-0 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{r.contact_number ? `+${r.country_code || '91'} ${r.contact_number}` : '-'}</p></div>
                        <div><p className="custom-text-break whitespace-pre-wrap first-letter:uppercase font-normal mt-0 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{r.relation || '-'}</p></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Read side of the new Add/Edit section. View has no such
                    section today — [PROPOSED], mirroring Access & Visibility. */}
                <Section id="employee_settings" title="Access & Visibility" change="NEW">
                  <F label="Account Status" value={e.account_status} />
                  <F label="Hidden profile" value={e.is_hidden ? 'Yes' : 'No'} />
                </Section>

                <Section id="timesheet_filling" title="Timesheet Filling" cols={1}>
                  <F label="Timesheet filling required" value={e.timesheet_filling ? 'Yes' : 'No'} />
                </Section>

                <Section id="source_of_hire" title="Source of Hire">
                  <F label="Source" value={e.hiring_source?.sources} />
                  <F label="Remark" value={e.hiring_source?.remarks} />
                </Section>

                <Section id="employer_remark" title="Employer Remark" cols={1}>
                  <F label="Employer Remark" value={e.employer_remarks} />
                </Section>

                <Section id="added_by" title="Added By">
                  <F label="Added by" value={[e.created_by_details?.first_name, e.created_by_details?.last_name].filter(Boolean).join(' ')} />
                  <F label="Date time" value={fmtDateTime(e.created_at)} />
                  <F label="Last Modified by" value={[e.updated_by_details?.first_name, e.updated_by_details?.last_name].filter(Boolean).join(' ')} />
                  <F label="Date time" value={fmtDateTime(e.updated_at)} />
                </Section>

                <div id="compliance_details" className="bg-white border rounded-lg mb-3 last:mb-0 border-gray-200">
                  <div className="flex items-center justify-between border-b 2xl:p-4 2xl-to-xl:p-3 p-3 rounded-t-lg bg-gray-100 border-gray-200 !bg-white">
                    <h3 className="font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-xs">Compliance Details</h3>
                  </div>
                  <div className="2xl:p-6 2xl-to-xl:p-3 p-3">
                    <div className="grid grid-cols-3 gap-x-2 gap-y-6">
                      {[['PAN Number', e.pan_number], ['Aadhaar Card Number', e.aadhaar_card_number], ['PF Number', e.pf_number], ['UAN Number', e.uan_number]].map(([l, v]) => (
                        <div key={l}>
                          <p className="label capitalize">{l}</p>
                          <p className="whitespace-pre-wrap font-normal mt-1 block 2xl:text-sm 2xl-to-xl:text-xs text-xs">{v || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
