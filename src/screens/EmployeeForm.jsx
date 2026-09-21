/* Add Employee / Edit Employee - one component, two modes, exactly as the app
 * does it (both routes render the same form; only the heading, the prefilled
 * values and the submit target differ).
 *
 * Source DOM : modules/people/dom/employee_add_2026-09-21.html
 *              modules/people/dom/employee_edit.html
 * Source API : GET /v1/employee/employee-details/{id} (prefill)
 *              + the 12 dropdown endpoints in endpoints.js
 *
 * The 15 section titles and their one-line descriptions, every field label, the
 * required markers and the radio/checkbox wording are all copied from those
 * dumps. Dropdown OPTIONS come from the captured dropdown responses.
 *
 * NOT CAPTURED: the submit request/response, and any validation messages - the
 * forms were never submitted against staging. See GAPS.md.
 */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  employeeEditData, employeeCreate, employeeUpdate,
  getBusinessUnits, getDepartments, getDesignations, getRoles, getShifts, getSources,
  getReportingManagers, getCountries, getStates,
} from '../api/mockApi'
import { peoplePath } from '../lib/tenant'
import { Label, INPUT, TEXTAREA } from '../components/primitives'

/* Section titles + descriptions: copied verbatim from the Edit Employee DOM. */
const SECTIONS = [
  ['Personal Information',         'Employee basic profile details.'],
  ['Employee Information',         'Workplace identity of the employee.'],
  ['Company Contact Information',  'Company contact information details of the employee.'],
  ['Personal Contact Information', 'Personal contact information details of the employee.'],
  ['Experience',                   'Total work experience of the employee.'],
  ['Family Details',               'Immediate family members of the employee.'],
  ['Address',                      'Residential address of the employee.'],
  ['Documents',                    'Important documents of the employee.'],
  ['Health Insurance',             'Health insurance details of the employee.'],
  ['Emergency Contact',            'Emergency contact information of the employee.'],
  ['Social Media Links',           'Online presence of the employee.'],
  ['Timesheet Filling',            'Daily timesheet filling requirement of the employee.'],
  ['Source of Hire',               'Source of hiring of the employee.'],
  ['Employer Remarks',             'Put employer remarks if any. This is not visible to others.'],
  ['Account Status',               'If disabled, the employee will not be able to login to the portal.'],
]

function Section({ title, desc, children, cols = 3, heading }) {
  /* Only the custom-fields group ("Compliance Details") is a real heading tag in
     the crawled DOM - an <h3> with this exact class. The rest are plain text. */
  const H = heading || 'p'
  return (
    <div className="bg-white rounded-xl border border-gray-200 2xl:p-5 2xl-to-xl:p-3 p-3 mb-4">
      <H className={heading
        ? 'font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-xs'
        : 'font-semibold text-gray-900 2xl:text-base 2xl-to-xl:text-sm text-sm'}>{title}</H>
      <p className="text-gray-500 2xl:text-sm 2xl-to-xl:text-xs text-xs mt-1 mb-4">{desc}</p>
      <div className={`grid grid-cols-${cols} gap-y-4 gap-x-6`}>{children}</div>
    </div>
  )
}

function Text({ label, required, name, value, onChange, type = 'text', placeholder }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        className={INPUT}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  )
}

function Select({ label, required, name, value, onChange, options, getLabel = (o) => o.title || o.name || o.label, getValue = (o) => o.id }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <select
        className={INPUT}
        name={name}
        value={value ?? ''}
        onChange={(e) => onChange(name, e.target.value)}
      >
        <option value="">Select</option>
        {(options || []).map((o) => (
          <option key={getValue(o)} value={getValue(o)}>{getLabel(o)}</option>
        ))}
      </select>
    </div>
  )
}

const unwrap = (r) => (Array.isArray(r) ? r : r?.data ?? [])

export default function EmployeeForm({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const [f, setF] = useState({ employee_type: 'technical', marital_status: 'single' })
  const [ref, setRef] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))

  useEffect(() => {
    Promise.all([
      getBusinessUnits(), getDepartments(), getDesignations(), getRoles(), getShifts(),
      getSources(), getReportingManagers(), getCountries(), getStates(),
    ]).then(([bu, dep, des, rol, shi, src, rm, cou, sta]) => {
      setRef({
        business_units: unwrap(bu), departments: unwrap(dep), designations: unwrap(des),
        roles: unwrap(rol), shifts: unwrap(shi), sources: unwrap(src),
        reporting_managers: unwrap(rm), countries: unwrap(cou), states: unwrap(sta),
      })
    })
  }, [])

  useEffect(() => {
    if (!isEdit || !id) return
    employeeEditData(id).then((r) => {
      const d = r.data || {}
      const c = d.employee_contact_info || {}
      const x = d.employee_experiences || {}
      const a = (d.employee_addresses || [])[0] || {}
      setF({
        first_name: d.first_name, middle_name: d.middle_name, last_name: d.last_name,
        gender: d.gender, birth_date: d.birth_date?.slice(0, 10), blood_group: d.blood_group,
        about: d.about, status: d.status, business_unit_id: d.business_unit_id,
        employee_code: d.employee_code, department_id: d.department_id,
        designation_id: d.designation_id, reporting_manager_id: d.reporting_manager_id,
        biometric_id: d.biometric_id, employee_type: d.employee_type,
        company_email: d.email, company_mobile: c.company_mobile,
        seating_location: c.seating_location, extension_number: c.extension_number,
        personal_email: c.personal_email, personal_mobile: c.personal_mobile,
        alternate_mobile: c.alternate_mobile,
        joined_date: x.joined_date?.slice(0, 10), confirmed_date: x.confirmed_date?.slice(0, 10),
        prev_exp_year: x.prev_exp_year, prev_exp_month: x.prev_exp_month,
        father_name: d.father_name, mother_name: d.mother_name,
        marital_status: d.marital_status || 'single',
        address: a.address, country_id: a.country_id, state_id: a.state_id,
        city: a.city, zipcode: a.zipcode,
        timesheet_filling: d.timesheet_filling, employer_remarks: d.employer_remarks,
        account_status: d.account_status,
        pan_number: d.pan_number, aadhaar_card_number: d.aadhaar_card_number,
        pf_number: d.pf_number, uan_number: d.uan_number,
        department_name: d.department?.title, designation_name: d.designation?.title,
      })
    })
  }, [id, isEdit])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...f,
      department_name: ref.departments?.find((d) => d.id === f.department_id)?.title ?? f.department_name,
      designation_name: ref.designations?.find((d) => d.id === f.designation_id)?.title ?? f.designation_name,
      reporting_name: (() => {
        const m = ref.reporting_managers?.find((r) => r.id === f.reporting_manager_id)
        return m ? [m.first_name, m.last_name].filter(Boolean).join(' ') : f.reporting_name
      })(),
    }
    if (isEdit) { await employeeUpdate(id, payload); navigate(peoplePath(`/employee-detail/${id}/general-info`)) }
    else { const r = await employeeCreate(payload); navigate(peoplePath(`/employee-detail/${r.data.id}/general-info`)) }
  }

  return (
    <form onSubmit={submit}>
      {/* the real form carries these as hidden inputs */}
      <input type="hidden" name="role" value={f.role_id ?? ''} readOnly />
      {/* sticky action bar - copied from the Edit Employee DOM */}
      <div className="2xl:py-4 2xl:px-5 2xl-to-xl:py-2 py-2 2xl-to-xl:px-3 px-3 bg-white sticky top-0 z-2 border rounded-lg border-gray-200 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="2xl:text-lg 2xl-to-xl:text-base text-base flex font-semibold text-gray-900">
            {isEdit ? 'Edit Employee' : 'Add Employee'}
            {isEdit && f.first_name && (
              <span className="text-gray-500 font-normal">&nbsp;-&nbsp;{[f.first_name, f.last_name].filter(Boolean).join(' ')}</span>
            )}
          </h1>
          <div className="flex items-center gap-x-3">
            <a
              href="#form-config"
              className="outline-none font-semibold rounded-lg border hover:opacity-90 border-indigo-200 bg-indigo-50 text-indigo-700 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:px-4 2xl-to-xl:px-3 px-3 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs inline-flex items-center"
            >
              Form Config
            </a>
            <button
              type="button"
              onClick={() => navigate(peoplePath('/employee'))}
              className="outline-none font-semibold rounded-lg border hover:opacity-90 border-gray-300 bg-white text-gray-700 2xl:py-2.5 2xl-to-xl:py-1 py-1 2xl:px-4 2xl-to-xl:px-3 px-3 2xl:h-10 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 disabled:bg-indigo-200 px-4 border-transparent bg-indigo-600 text-white 2xl:py-[7px] 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
            >
              {saving ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>

      <Section title={SECTIONS[0][0]} desc={SECTIONS[0][1]}>
        <div className="col-span-3">
          <Label>Profile Picture</Label>
          <p className="text-gray-500 2xl:text-xs 2xl-to-xl:text-xxs text-xxs">Upload Png, Jpg/Jpeg or Webp (max. 1 MB)</p>
          <input type="file" className="mt-2 2xl:text-sm 2xl-to-xl:text-xs text-xs" />
        </div>
        <Text label="First Name" required name="first_name" value={f.first_name} onChange={set} />
        <Text label="Middle Name" name="middle_name" value={f.middle_name} onChange={set} />
        <Text label="Last Name" required name="last_name" value={f.last_name} onChange={set} />
        <Select label="Gender" required name="gender" value={f.gender} onChange={set}
          options={[{ id: 'male', title: 'Male' }, { id: 'female', title: 'Female' }, { id: 'other', title: 'Other' }]} />
        <Text label="Date of Birth" required type="date" name="birth_date" value={f.birth_date} onChange={set} />
        <Select label="Blood Group" name="blood_group" value={f.blood_group} onChange={set}
          options={['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((b) => ({ id: b, title: b }))} />
        <div className="col-span-3">
          <Label>About</Label>
          <textarea className={TEXTAREA} maxLength={255} value={f.about ?? ''} onChange={(e) => set('about', e.target.value)} />
          <p className="text-right text-gray-400 2xl:text-xs 2xl-to-xl:text-xxs text-xxs">{(f.about || '').length}/255</p>
        </div>
      </Section>

      <Section title={SECTIONS[1][0]} desc={SECTIONS[1][1]}>
        <Select label="Status" required name="status" value={f.status} onChange={set}
          options={['confirmed','probation','intern','notice_period','relieved'].map((s) => ({ id: s, title: s }))} />
        <Select label="Business Unit" required name="business_unit_id" value={f.business_unit_id} onChange={set} options={ref.business_units} />
        <Text label="Employee Code" required name="employee_code" value={f.employee_code} onChange={set} />
        <Select label="Department" required name="department_id" value={f.department_id} onChange={set} options={ref.departments} />
        <Select label="Designation" required name="designation_id" value={f.designation_id} onChange={set} options={ref.designations} />
        <Select label="Reporting to" required name="reporting_manager_id" value={f.reporting_manager_id} onChange={set}
          options={ref.reporting_managers} getLabel={(o) => `${[o.first_name, o.last_name].filter(Boolean).join(' ')}${o.employee_code ? ` (${o.employee_code})` : ''}`} />
        <Text label="Biometric ID" required name="biometric_id" value={f.biometric_id} onChange={set} />
        <Select label="Active Shift" required name="shift_id" value={f.shift_id} onChange={set} options={ref.shifts} />
        <div>
          <Label required>Employee Type</Label>
          <div className="flex gap-4 mt-2">
            {['technical', 'non-technical'].map((t) => (
              <label key={t} className="text-gray-900 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium py-0.5 cursor-pointer flex items-center gap-2">
                <input type="radio" name="employee_type" checked={f.employee_type === t} onChange={() => set('employee_type', t)} />
                <span className="capitalize">{t === 'non-technical' ? 'Non-Technical' : 'Technical'}</span>
              </label>
            ))}
          </div>
        </div>
        <Select label="Employee Role" required name="role_id" value={f.role_id} onChange={set} options={ref.roles} />
        <Text label="Expiry Date" type="date" name="role_expire_date" value={f.role_expire_date} onChange={set} />
        <Text label="Remark" name="remark" value={f.remark} onChange={set} />
      </Section>

      <Section title={SECTIONS[2][0]} desc={SECTIONS[2][1]}>
        <Text label="Company Email Address" required name="company_email" value={f.company_email} onChange={set} />
        {/* the phone widget renders name="phone" in the real DOM */}
        <Text label="Company Mobile Number" name="phone" type="tel" placeholder="1 (702) 123-4567" value={f.phone} onChange={set} />
        <Text label="Seating Location" name="seating_location" value={f.seating_location} onChange={set} />
        <Text label="Extension Number" name="extension_number" value={f.extension_number} onChange={set} />
      </Section>

      <Section title={SECTIONS[3][0]} desc={SECTIONS[3][1]}>
        <Text label="Personal Email Address" name="personal_email" value={f.personal_email} onChange={set} />
        <Text label="Personal Mobile Number" required name="personal_mobile" type="tel" placeholder="1 (702) 123-4567" value={f.personal_mobile} onChange={set} />
        <Text label="Alternate Mobile Number" name="alternate_mobile" type="tel" placeholder="1 (702) 123-4567" value={f.alternate_mobile} onChange={set} />
      </Section>

      <Section title={SECTIONS[4][0]} desc={SECTIONS[4][1]}>
        <Text label="Joining Date" required type="date" name="joined_date" value={f.joined_date} onChange={set} />
        <Text label="Confirmation Date" required type="date" name="confirmed_date" value={f.confirmed_date} onChange={set} />
        <div>
          <Label>Previous Experience</Label>
          <div className="flex gap-2 items-center">
            <input className={INPUT} name="prev_exp_year" placeholder="Y" value={f.prev_exp_year ?? ''} onChange={(e) => set('prev_exp_year', e.target.value)} />
            <input className={INPUT} name="prev_exp_month" placeholder="M" value={f.prev_exp_month ?? ''} onChange={(e) => set('prev_exp_month', e.target.value)} />
          </div>
        </div>
        <label className="text-gray-900 2xl:text-sm 2xl-to-xl:text-xs font-medium py-0.5 cursor-pointer text-xs flex items-center gap-2 self-end">
          <input type="checkbox" checked={!!f.fresher} onChange={(e) => set('fresher', e.target.checked)} /> Fresher
        </label>
      </Section>

      <Section title={SECTIONS[5][0]} desc={SECTIONS[5][1]}>
        <Text label="Father's Name" name="father_name" value={f.father_name} onChange={set} />
        <Text label="Mother's Name" name="mother_name" value={f.mother_name} onChange={set} />
        <div>
          <Label required>Marital Status</Label>
          <div className="flex gap-4 mt-2">
            {['single', 'married'].map((t) => (
              <label key={t} className="text-gray-900 2xl:text-sm 2xl-to-xl:text-xs text-xs font-medium py-0.5 cursor-pointer flex items-center gap-2">
                <input type="radio" name="marital_status" checked={f.marital_status === t} onChange={() => set('marital_status', t)} />
                <span className="capitalize">{t}</span>
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title={SECTIONS[6][0]} desc={SECTIONS[6][1]}>
        <div className="col-span-3"><p className="font-medium text-gray-700 2xl:text-sm 2xl-to-xl:text-xs text-xs">Present Address</p></div>
        <div className="col-span-3">
          <Label required>Address</Label>
          <textarea className={TEXTAREA} value={f.address ?? ''} onChange={(e) => set('address', e.target.value)} />
        </div>
        <Select label="Country" required name="country_id" value={f.country_id} onChange={set} options={ref.countries} />
        <Select label="State" required name="state_id" value={f.state_id} onChange={set} options={ref.states} />
        <Text label="Town/City" required name="city" value={f.city} onChange={set} />
        <Text label="Zip/Postal Code" required name="zipcode" value={f.zipcode} onChange={set} />
        <div className="col-span-3">
          <p className="font-medium text-gray-700 2xl:text-sm 2xl-to-xl:text-xs text-xs">Permanent Address</p>
          <label className="text-gray-900 py-0.5 cursor-pointer 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal flex items-center gap-2 mt-2">
            <input type="checkbox" checked={!!f.same_as_present} onChange={(e) => set('same_as_present', e.target.checked)} />
            Same as present address
          </label>
          {!f.same_as_present && (
            <textarea
              className={`${TEXTAREA} mt-2`}
              name="permanent_address"
              value={f.permanent_address ?? ''}
              onChange={(e) => set('permanent_address', e.target.value)}
            />
          )}
        </div>
      </Section>

      <Section title={SECTIONS[8][0]} desc={SECTIONS[8][1]} cols={1}>
        <label className="text-gray-900 py-0.5 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal cursor-pointer flex items-center gap-2">
          <input type="checkbox" name="health_insurance" checked={!!f.health_insurance} onChange={(e) => set('health_insurance', e.target.checked)} />
          Employee is insured
        </label>
      </Section>

      <Section title={SECTIONS[9][0]} desc={SECTIONS[9][1]}>
        <Text label="Name" required name="emergency_name" value={f.emergency_name} onChange={set} />
        <Text label="Contact Number" required name="emergency_contact" type="tel" placeholder="1 (702) 123-4567" value={f.emergency_contact} onChange={set} />
        <Select label="Relation" required name="emergency_relation" value={f.emergency_relation} onChange={set}
          options={['spouse','father','mother','sibling','friend','other'].map((r) => ({ id: r, title: r }))} />
      </Section>

      <Section title={SECTIONS[11][0]} desc={SECTIONS[11][1]} cols={1}>
        <label className="text-gray-900 py-0.5 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal cursor-pointer flex items-center gap-2">
          <input type="checkbox" checked={!!f.timesheet_filling} onChange={(e) => set('timesheet_filling', e.target.checked)} />
          Timesheet filling required
        </label>
      </Section>

      <Section title={SECTIONS[12][0]} desc={SECTIONS[12][1]}>
        <Select label="Source" name="source_id" value={f.source_id} onChange={set} options={ref.sources} />
        <Text label="Remark" name="source_remark" value={f.source_remark} onChange={set} />
      </Section>

      <Section title={SECTIONS[13][0]} desc={SECTIONS[13][1]} cols={1}>
        <div>
          <Label>Remark</Label>
          <textarea className={TEXTAREA} value={f.employer_remarks ?? ''} onChange={(e) => set('employer_remarks', e.target.value)} />
        </div>
      </Section>

      <Section title={SECTIONS[14][0]} desc={SECTIONS[14][1]} cols={1}>
        <label className="text-gray-900 py-0.5 2xl:text-sm 2xl-to-xl:text-xs text-xs !text-gray-700 font-normal cursor-pointer flex items-center gap-2">
          <input type="checkbox" checked={f.account_status !== 'inactive'} onChange={(e) => set('account_status', e.target.checked ? 'active' : 'inactive')} />
          Account Status
        </label>
      </Section>

      {/* "Custom Fields defined by your Organization" - the app renders this
          group from POST /v1/config/custom-forms/schema. On this tenant it
          contained exactly these four. */}
      <Section title="Compliance Details" desc="Custom Fields defined by your Organization" heading="h3">
        <Text label="PAN Number" name="pan_number" value={f.pan_number} onChange={set} />
        <Text label="Aadhaar Card Number" name="aadhaar_card_number" value={f.aadhaar_card_number} onChange={set} />
        <Text label="PF Number" name="pf_number" value={f.pf_number} onChange={set} />
        <Text label="UAN Number" name="uan_number" value={f.uan_number} onChange={set} />
      </Section>
    </form>
  )
}
