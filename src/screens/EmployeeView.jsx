/* View Employee.
 * Source DOM : modules/people/dom/employee_view_general_info.html (2026-09-21)
 *              + the five sibling tab dumps (assets_allocated, job_interviews,
 *                interview_intimation, projects, timeline)
 * Source API : GET /v1/employee/{id}
 *
 * Section titles, field labels and their ORDER are copied from the General Info
 * dump. The five non-active tabs were captured as pages; their table contents
 * are listed in GAPS.md. */
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { employeeDetail } from '../api/mockApi'
import { peoplePath } from '../lib/tenant'
import { Avatar, StatusPill } from '../components/primitives'

const TABS = [
  { key: 'general-info',         label: 'General Info' },
  { key: 'timeline',             label: 'Timeline' },
  { key: 'assets-allocated',     label: 'Assets Allocated' },
  { key: 'job-interviews',       label: 'Job Interviews' },
  { key: 'interview-intimation', label: 'Client Interview Resource Allocation' },
  { key: 'projects',             label: 'Projects' },
]

const TAB_ACTIVE =
  'min-w-[fit-content] text-indigo-700 bg-white shadow-sm rounded-md tab-transition font-semibold relative z-[20] whitespace-nowrap 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:px-3 2xl-to-xl:px-2 px-2 w-fit 2xl:text-sm 2xl-to-xl:text-xs text-xs text-center'
const TAB_IDLE =
  'min-w-[fit-content] text-gray-500 rounded-md tab-transition font-semibold relative z-[20] whitespace-nowrap 2xl:py-2 2xl-to-xl:py-1 py-1 2xl:px-3 2xl-to-xl:px-2 px-2 w-fit 2xl:text-sm 2xl-to-xl:text-xs text-xs text-center'

const fmtDate = (d) => {
  if (!d) return '-'
  const dt = new Date(d); if (Number.isNaN(+dt)) return '-'
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${String(dt.getDate()).padStart(2,'0')}-${M[dt.getMonth()]}-${dt.getFullYear()}`
}

/** Label/value pair - the read-only idiom used all over General Info. */
function Field({ label, value }) {
  return (
    <div>
      <p className="2xl:text-xs 2xl-to-xl:text-xxs text-xxs font-medium text-gray-500">{label}</p>
      <p className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-900 font-medium mt-1 break-words">
        {value === null || value === undefined || value === '' ? '-' : value}
      </p>
    </div>
  )
}

function Section({ title, children, cols = 3, heading }) {
  /* "Compliance Details" is the only section the app renders as a heading tag
     (<h3>, this exact class). Everything else is plain text. */
  const H = heading || 'p'
  return (
    <div className="bg-white rounded-xl border border-gray-200 2xl:p-5 2xl-to-xl:p-3 p-3 mb-4">
      <H className={(heading
        ? 'font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-xs'
        : 'font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-sm') + ' mb-4'}>{title}</H>
      <div className={`grid grid-cols-${cols} gap-y-4 gap-x-6`}>{children}</div>
    </div>
  )
}

export default function EmployeeView() {
  const { id, tab = 'general-info' } = useParams()
  const navigate = useNavigate()
  const [e, setE] = useState(null)

  useEffect(() => { employeeDetail(id).then((r) => setE(r.data)) }, [id])

  if (!e) return <div className="bg-white rounded-xl border border-gray-200 p-6">Loading…</div>

  const full = [e.first_name, e.middle_name, e.last_name].filter(Boolean).join(' ')
  const contact = e.employee_contact_info || {}
  const exp = e.employee_experiences || {}
  const addr = (e.employee_addresses || [])[0] || {}
  const role = (e.employee_roles || [])[0] || {}

  return (
    <>
      {/* identity header */}
      <div className="bg-white rounded-xl border border-gray-200 2xl:p-5 2xl-to-xl:p-3 p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Avatar name={full} />
            <div>
              <span className="2xl:text-sm 2xl-to-xl:text-xs text-xs text-gray-900 font-semibold custom-text-break whitespace-pre-wrap first-letter:uppercase mt-1 block">
                {full}
              </span>
              <p className="truncate 2xl:text-xs 2xl-to-xl:text-xxs text-xxs leading-5 text-gray-500">
                {e.designation?.title} · {e.department?.title}
              </p>
            </div>
            <div className="ms-6"><StatusPill status={e.status} /></div>
          </div>
          <div className="flex items-center gap-x-3">
            <button className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:whitespace-normal whitespace-nowrap px-2">
              Send Password to Employee
            </button>
            <Link
              to={peoplePath(`/employee/${id}/edit`)}
              className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white whitespace-nowrap 2xl:h-9 h-8 2xl-to-xl:h-8 py-1 2xl:text-sm 2xl-to-xl:text-xs text-xs inline-flex items-center"
            >
              Edit Employee
            </Link>
          </div>
        </div>

        {/* tab strip */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mt-4 w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={t.key === tab ? TAB_ACTIVE : TAB_IDLE}
              onClick={() => navigate(peoplePath(`/employee-detail/${id}/${t.key}`))}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab !== 'general-info' ? (
        <div className="bg-white rounded-xl border border-gray-200 2xl:p-5 2xl-to-xl:p-3 p-3">
          <p className="font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-sm">
            {TABS.find((t) => t.key === tab)?.label}
          </p>
          <p className="text-gray-500 2xl:text-sm 2xl-to-xl:text-xs text-xs mt-2">
            This tab was captured as a page but its table contents were not extracted. See GAPS.md.
          </p>
        </div>
      ) : (
        <>
          <Section title="Personal Information">
            <Field label="First Name" value={e.first_name} />
            <Field label="Middle Name" value={e.middle_name} />
            <Field label="Last Name" value={e.last_name} />
            <Field label="Gender" value={e.gender} />
            <Field label="Date of Birth" value={fmtDate(e.birth_date)} />
            <Field label="Blood Group" value={e.blood_group} />
          </Section>

          <Section title="Employee Information">
            <Field label="Business Unit" value={e.businessUnit?.name} />
            <Field label="Employee Code" value={e.employee_code} />
            <Field label="Status" value={e.status} />
            <Field label="Department" value={e.department?.title} />
            <Field label="Designation" value={e.designation?.title} />
            <Field label="Reporting to" value={[e.reporting_to?.first_name, e.reporting_to?.last_name].filter(Boolean).join(' ')} />
            <Field label="Employee Type" value={e.employee_type} />
            <Field label="Biometric ID" value={e.biometric_id} />
            <Field label="Active Shift" value={e.shift?.name} />
          </Section>

          <Section title="Employee Role Information">
            <Field label="Employee Role" value={role.role?.title} />
            <Field label="Expiry Date" value={fmtDate(role.expire_date)} />
            <Field label="Remarks" value={role.remarks} />
          </Section>

          <Section title="Company Contact Information">
            <Field label="Company Email Address" value={e.email} />
            <Field label="Company Mobile Number" value={contact.company_mobile} />
            <Field label="Seating Location" value={contact.seating_location} />
            <Field label="Extension Number" value={contact.extension_number} />
          </Section>

          <Section title="Personal Contact Information">
            <Field label="Personal Email Address" value={contact.personal_email} />
            <Field label="Personal Mobile Number" value={contact.personal_mobile ? `+${contact.personal_country_code || '91'} ${contact.personal_mobile}` : null} />
            <Field label="Alternate Phone Number" value={contact.alternate_mobile} />
          </Section>

          <Section title="Experience">
            <Field label="Joining Date" value={fmtDate(exp.joined_date)} />
            <Field label="Confirmation Date" value={fmtDate(exp.confirmed_date)} />
            <Field label={`Experience @ ${e.businessUnit?.name || ''}`.trim()} value={null} />
            <Field label="Previous Experience" value={exp.prev_exp_year || exp.prev_exp_month ? `${exp.prev_exp_year || 0}Y ${exp.prev_exp_month || 0}M` : null} />
          </Section>

          <Section title="Family Details">
            <Field label="Father's Name" value={e.father_name} />
            <Field label="Mother's Name" value={e.mother_name} />
            <Field label="Spouse's Name" value={e.spouse_name} />
            <Field label="Marital Status" value={e.marital_status} />
            <Field label="Marriage Date" value={fmtDate(e.marriage_date)} />
            <Field label="Spouse's Date of Birth" value={fmtDate(e.spouse_birth_date)} />
          </Section>

          <Section title="Present Address">
            <Field label="Address" value={addr.address} />
            <Field label="Country" value={addr.country?.name} />
            <Field label="State" value={addr.state?.name} />
            <Field label="Town/City" value={addr.city} />
            <Field label="Pin Code" value={addr.zipcode} />
          </Section>

          <Section title="Timesheet Filling" cols={3}>
            <Field label="Timesheet filling required" value={e.timesheet_filling ? 'Yes' : 'No'} />
          </Section>

          <Section title="Source of Hire">
            <Field label="Source" value={e.hiring_source?.sources} />
            <Field label="Remark" value={e.hiring_source?.remarks} />
          </Section>

          <Section title="Employer Remark" cols={1}>
            <Field label="Employer Remark" value={e.employer_remarks} />
          </Section>

          <Section title="Compliance Details" heading="h3">
            <Field label="PAN Number" value={e.pan_number} />
            <Field label="Aadhaar Card Number" value={e.aadhaar_card_number} />
            <Field label="PF Number" value={e.pf_number} />
            <Field label="UAN Number" value={e.uan_number} />
          </Section>

          <Section title="Added By">
            <Field label="Added by" value={[e.created_by_details?.first_name, e.created_by_details?.last_name].filter(Boolean).join(' ')} />
            <Field label="Date time" value={fmtDate(e.created_at)} />
            <Field label="Last Modified by" value={[e.updated_by_details?.first_name, e.updated_by_details?.last_name].filter(Boolean).join(' ')} />
            <Field label="Date time" value={fmtDate(e.updated_at)} />
          </Section>
        </>
      )}
    </>
  )
}
