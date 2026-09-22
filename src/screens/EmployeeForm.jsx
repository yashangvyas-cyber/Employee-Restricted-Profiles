/* Add Employee / Edit Employee — one component, two modes, as the app does it
 * (both routes render the same form; only the heading, the prefill and whether
 * an id is sent differ).
 *
 * Source DOM : modules/people/dom/employee_add_2026-09-21.html
 *              modules/people/dom/employee_edit.html
 * Source API : GET  /v1/employee/employee-details/{id}   (prefill)
 *              POST /v1/employee/add-edit                (save)
 *              + the 12 reference-data endpoints in endpoints.js
 *
 * Layout is the app's own: a sticky header carrying the title, a Form Config
 * link, Cancel and Submit; then a scroll area of 17 sections, each of which is
 * a left gutter (title + description) beside a white card holding a 3-column
 * field grid. Section ids are the app's own anchors.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  employeeEditData, employeeAddEdit,
  getBusinessUnits, getDepartments, getDesignations, getRoles, getShifts, getSources,
  getReportingManagers, getCountries, getStates,
} from '../api/mockApi'
import { peoplePath, TENANT } from '../lib/tenant'
import { VALIDATION } from '../api/endpoints'
import {
  Section, GRID, GRID_TOP, Text, Select, Phone, TextArea, Toggle, Check,
  AddButton, FieldError, LabelRow, DateField, InlineCheck, SubHeading, RadioGroup, Typeahead,
} from '../components/formPrimitives'
import {
  GENDER, BLOOD_GROUP, EMPLOYEE_STATUS, EMPLOYEE_TYPE, RELATION, MARITAL_STATUS,
} from '../api/options'
import { INPUT } from '../components/primitives'

/* Section titles, descriptions and ids copied from the crawled form, in order. */
const SECTIONS = [
  ['personal_information',         'Personal Information',         'Employee basic profile details.'],
  ['employee_information',         'Employee Information',         'Workplace identity of the employee.'],
  ['employee_role_information',    'Employee Role Information',    'Roles assigned to the employee based on which the permissions would be granted in CollabCRM.'],
  ['company_contact_information',  'Company Contact Information',  'Company contact information details of the employee.'],
  ['personal_contact_information', 'Personal Contact Information', 'Personal contact information details of the employee.'],
  ['experience',                   'Experience',                   'Total work experience of the employee.'],
  ['family_details',               'Family Details',               'Immediate family members of the employee.'],
  ['address',                      'Address',                      'Residential address of the employee.'],
  ['documents',                    'Documents',                    'Important documents of the employee.'],
  ['health_insurance',             'Health Insurance',             'Health insurance details of the employee.'],
  ['emergency_contact',            'Emergency Contact',            'Emergency contact information of the employee.'],
  ['social_media_links',           'Social Media Links',           'Online presence of the employee.'],
  ['timesheet_filling',            'Timesheet Filling',            'Daily timesheet filling requirement of the employee.'],
  ['source_of_hire',               'Source of Hire',               'Source of hiring of the employee.'],
  ['employee_remark',              'Employer Remarks',             'Put employer remarks if any. This is not visible to others.'],
  /* NEW — replaces the standalone account_status and invite_employee sections.
     Title and description are [PROPOSED]; the two existing toggles' helper lines
     are their former section descriptions, copied verbatim. */
  ['employee_settings',            'Access & Visibility',          'Login and visibility settings of the employee.'],
  /* Add-only: absent from the Edit form in the capture. */
  ['invite_employee',              'Invite Employee',              'If turned on, employee will receive a welcome email with the instructions to create their password for the portal.'],
]
const S = Object.fromEntries(SECTIONS.map(([id, title, desc]) => [id, { id, title, desc }]))

const unwrap = (r) => (Array.isArray(r) ? r : r?.data ?? [])
const personLabel = (o) =>
  `${[o.first_name, o.last_name].filter(Boolean).join(' ')}${o.employee_code ? ` (${o.employee_code})` : ''}`
/* The app sends dropdowns as {label, value}, not bare ids. */
const opt = (list, id, label = (o) => o.title || o.name || o.label) => {
  const o = (list || []).find((x) => String(x.id) === String(id))
  return o ? { label: label(o), value: o.id } : null
}

export default function EmployeeForm({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const [f, setF] = useState({
    employee_type: 'technical', marital_status: 'single',
    account_status: 'active', invite_employee: true,
    /* Hidden defaults OFF, so no existing count moves on release day. */
    is_hidden: false,
  })
  const [ref, setRef] = useState({})
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setF((s) => ({ ...s, [k]: v }))
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  }
  const err = (k) => errors[k]
  /* "Experience @ <BU>" shows tenure since the joining date */
  const tenure = (() => {
    if (!f.joined_date) return ''
    const d = new Date(f.joined_date); if (Number.isNaN(+d)) return ''
    const now = new Date()
    let m = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
    if (now.getDate() < d.getDate()) m -= 1
    if (m < 0) return ''
    const y = Math.floor(m / 12), mm = m % 12
    return [y ? `${y}Y` : null, mm ? `${mm}M` : null].filter(Boolean).join(' ') || '0M'
  })()
  const buName = (ref.business_units || []).find((b) => String(b.id) === String(f.business_unit_id))?.name

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
        company_email: d.email, seating_location: c.seating_location,
        extension_number: c.extension_number, personal_email: c.personal_email,
        personal_mobile: c.personal_mobile, alternate_mobile: c.alternate_mobile,
        joined_date: x.joined_date?.slice(0, 10), confirmed_date: x.confirmed_date?.slice(0, 10),
        prev_exp_year: x.prev_exp_year, prev_exp_month: x.prev_exp_month,
        address: a.address, country_id: a.country_id, state_id: a.state_id,
        city: a.city, zipcode: a.zipcode,
        timesheet_filling: d.timesheet_filling, employer_remarks: d.employer_remarks,
        account_status: d.account_status,
        pan_number: d.pan_number, aadhaar_card_number: d.aadhaar_card_number,
        pf_number: d.pf_number, uan_number: d.uan_number,
        department_name: d.department?.title, designation_name: d.designation?.title,
        /* real field names from the captured edit payload */
        role_id: (d.employee_roles || [])[0]?.role_id,
        role_expire_date: (d.employee_roles || [])[0]?.expire_date?.slice(0, 10),
        remark: (d.employee_roles || [])[0]?.remarks,
        emergency_name: (d.employee_emergency_contacts || [])[0]?.name,
        emergency_contact: (d.employee_emergency_contacts || [])[0]?.contact_number,
        emergency_relation: (d.employee_emergency_contacts || [])[0]?.relation,
        shift_id: d.current_shift?.id ?? (d.shift_assignments || [])[0]?.shift_id,
        source_id: d.hiring_source?.source_id, source_remark: d.hiring_source?.remarks,
        is_external_email: d.is_external_email,
        phone: c.company_mobile,
        permanent_address: (d.employee_addresses || [])[1]?.address,
        father_name: d.employee_family_details?.father_name ?? d.father_name,
        mother_name: d.employee_family_details?.mother_name ?? d.mother_name,
        marital_status: d.employee_family_details?.marital_status || d.marital_status || 'single',
        health_insurance: (d.employee_insurances || []).length > 0,
        invite_employee: true,
        is_hidden: !!d.is_hidden,
      })
    })
  }, [id, isEdit])

  /** Mirrors the app's own required set, captured from an empty submit. */
  const validate = () => {
    const e = {}
    const required = [...VALIDATION.requiredFields, ...(f.fresher ? [] : VALIDATION.requiredUnlessFresher)]
    for (const k of required) {
      const v = f[k]
      if (v === undefined || v === null || String(v).trim() === '') e[k] = VALIDATION.required
    }
    if (f.company_email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.company_email)) {
      e.company_email = VALIDATION.email
    }
    return e
  }

  /* Form state -> the nested body POST /v1/employee/add-edit expects.
     Section names and keys are the app's own (EMPLOYEE_FORM_PAYLOAD). */
  const buildPayload = () => ({
    personal_info: {
      first_name: f.first_name ?? '', middle_name: f.middle_name ?? '', last_name: f.last_name ?? '',
      gender: f.gender ?? '', dob: f.birth_date ?? null, blood_group: f.blood_group ?? null,
      about: f.about ?? '',
    },
    employee_info: {
      business_unit: opt(ref.business_units, f.business_unit_id),
      employee_code: f.employee_code ?? '',
      status: f.status ?? null,
      department: opt(ref.departments, f.department_id),
      designation: opt(ref.designations, f.designation_id),
      reporting_to: (() => {
        const m = (ref.reporting_managers || []).find((x) => personLabel(x) === f.reporting_manager_id)
        return m ? { label: personLabel(m), value: m.id } : (f.reporting_manager_id ? { label: f.reporting_manager_id, value: null } : null)
      })(),
      employee_type: f.employee_type ?? null,
      bioMetricId: f.biometric_id ?? '',
      active_shift: opt(ref.shifts, f.shift_id),
    },
    employee_role_info: [{ role: f.role_id ?? '', expiryDate: f.role_expire_date ?? '', remark: f.remark ?? '' }],
    deleted_employee_roles: [],
    contact_info: {
      company_email: f.company_email ?? '', company_mobile_code: f.company_mobile_code ?? null,
      company_mobile: f.phone ?? '', seating_location: f.seating_location ?? '',
      extension_number: f.extension_number ?? '', personal_email: f.personal_email ?? '',
      personal_mobile_code: f.personal_mobile_code ?? null, personal_mobile: f.personal_mobile ?? '',
      alternate_mobile_code: null, alternate_mobile: f.alternate_mobile ?? '',
      is_external_email: !!f.is_external_email,
    },
    experience: {
      joined_date: f.joined_date ?? null, confirmation_date: f.confirmed_date ?? null,
      prev_exp_year: f.prev_exp_year ?? '', prev_exp_month: f.prev_exp_month ?? '',
      prev_organizations: [], isFresher: !!f.fresher,
    },
    family_details: {
      father_name: f.father_name ?? '', mother_name: f.mother_name ?? '',
      marital_status: f.marital_status ?? 'single', spouse_name: '', marriage_date: null,
      spouse_dob: null, children: [],
    },
    present_address: {
      address: f.address ?? '', country: opt(ref.countries, f.country_id),
      state: opt(ref.states, f.state_id), city: f.city ?? '', pincode: f.zipcode ?? '',
    },
    permanent_address: f.same_as_present
      ? { address: f.address ?? '', country: opt(ref.countries, f.country_id), state: opt(ref.states, f.state_id), city: f.city ?? '', pincode: f.zipcode ?? '' }
      : { address: f.permanent_address ?? '', country: null, state: null, city: '', pincode: '' },
    documents: [], deleted_documents: [],
    health_insurance: !!f.health_insurance,
    health_insurance_info: {
      insuree_name: '', relationship: 'Self', dob: null, gender: null, insurance_company: '',
      insurance_company_code: '', insurance_policy_number: '', insurance_phs_id: '',
      insurance_valid_from: null, insurance_valid_to: null, insurance_sum_assured: '',
    },
    emergency_contacts: [{
      name: f.emergency_name ?? '', country_code: '',
      contact_number: f.emergency_contact ?? '', relation: f.emergency_relation ?? null,
    }],
    deleted_emergency_contacts: [], social_media_links: [], deleted_social_media: [],
    timesheet_filling: !!f.timesheet_filling,
    source_of_hire: { source: f.source_id ?? null, remark: f.source_remark ?? '' },
    employer_remarks: { employer_remarks: f.employer_remarks ?? '' },
    invite_employee: f.invite_employee !== false,
    account_status: f.account_status !== 'inactive',
    /* Sibling top-level boolean, same shape as invite_employee / account_status.
       Snake_case per the captured API style; `hidden_reason` feeds the audit
       trail. Naming pending PM — see PROTOTYPE_NOTES.md. */
    is_hidden: !!f.is_hidden,
    ...(isEdit ? { id } : {}),
    ...(f.pan_number || f.aadhaar_card_number || f.pf_number || f.uan_number
      ? { custom_fields: {
          pan_number: f.pan_number ?? '', aadhaar_card_number: f.aadhaar_card_number ?? '',
          pf_number: f.pf_number ?? '', uan_number: f.uan_number ?? '',
        } }
      : {}),
  })

  const submit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    const bad = Object.keys(v)
    if (bad.length) {
      const first = document.querySelector(`[name="${bad[0]}"]`)
      if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' })
      const orphan = bad.filter((k) => !document.querySelector(`[name="${k}"]`))
      if (orphan.length) setErrors({ ...v, _form: `${VALIDATION.required} (${orphan.join(', ')})` })
      return
    }
    setSaving(true)
    try {
      const res = await employeeAddEdit(buildPayload(), isEdit ? id : null)
      navigate(peoplePath(`/employee-detail/${res.data.id}/general-info`))
    } catch (ex) {
      setSaving(false)
      setErrors({ _form: String(ex?.message || ex) })
    }
  }

  return (
    <div>
      <form className="relative" onSubmit={submit}>
        {/* sticky header */}
        <div className="transition-all duration-300 bg-white flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 sticky z-10 w-full">
          <div className="2xl:py-3 2xl:px-5 2xl-to-xl:py-2 py-2 2xl-to-xl:px-3 px-3 flex flex-col md:flex-row justify-between items-center w-full border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h1 className="2xl:text-lg 2xl-to-xl:text-base text-base flex font-semibold text-gray-900">
                {isEdit ? 'Edit Employee' : 'Add Employee'}&nbsp;
                {isEdit && f.first_name && (
                  <span className="text-gray-500 font-normal">&nbsp;-&nbsp;{[f.first_name, f.last_name].filter(Boolean).join(' ')}</span>
                )}
              </h1>
              <a
                className="inline-flex items-center justify-center gap-1 bg-indigo-50 border border-indigo-300 text-indigo-700 font-semibold rounded-md px-3 shrink-0 2xl:text-sm 2xl-to-xl:text-xs text-xs 2xl:h-9 2xl-to-xl:h-8 h-8"
                href={`/people/${TENANT}/form-customisation/add-employee/edit`}
              >
                <span className="icon-settings-02 2xl:text-md 2xl-to-xl:text-sm text-sm" />Form Config
              </a>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => navigate(peoplePath('/employee'))}
                className="outline-none rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 hover:opacity-90 px-3.5 mr-2 bg-white border-gray-300 text-gray-700 font-semibold hover:!bg-gray-50 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs"
              >
                <div className="flex items-center justify-center gap-2">Cancel</div>
              </button>
              {/* The dump shows Submit with disabled="" at load, but on staging it
                  becomes clickable once the form has initialised and then shows
                  validation. The exact enable condition was NOT captured, so this
                  only disables while saving. */}
              <button
                type="submit"
                disabled={saving}
                className="outline-none font-semibold rounded-lg disabled:cursor-not-allowed border disabled:opacity-100 disabled:bg-indigo-200 px-3.5 border-transparent bg-indigo-600 text-white 2xl:py-1.5 2xl-to-xl:py-1 py-1 2xl:h-9 2xl-to-xl:h-8 h-8 2xl:text-sm 2xl-to-xl:text-xs text-xs relative"
              >
                <div className="flex items-center justify-center gap-2">{saving ? 'Saving…' : 'Submit'}</div>
              </button>
            </div>
          </div>
        </div>

        {/* scroll area */}
        <div className="relative overflow-auto 2xl:p-4 p-3 scrollbar-hide 2xl:h-[calc(100vh-158px)] 2xl-to-xl:h-[calc(100vh-136px)] h-[calc(100vh-136px)]">
          <div className="max-w-[1350px] w-full">
            {errors._form && <div className="mb-3"><FieldError msg={errors._form} /></div>}

            <Section {...S.personal_information} first>
              {/* profile picture block */}
              <div className="w-full my-auto">
                <div className="flex gap-y-4 w-full items-center">
                  <div className="flex items-center gap-x-4">
                    <div className="dropzone">
                      <div className="cursor-pointer rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center 2xl:size-[120px] 2xl:min-w-[120px] 2xl-to-xl:size-[90px] 2xl-to-xl:min-w-[90px] size-[90px] min-w-[90px]">
                        <span className="icon-user-01 text-gray-400 text-4xl" />
                      </div>
                    </div>
                    <div className="border-gray-300 cursor-pointer flex items-center justify-center rounded-md border">
                      <div className="2xl:p-[9px] 2xl:size-9 2xl-to-xl:size-8 size-8 flex justify-center items-center">
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="2xl:text-lg 2xl-to-xl:text-base text-base text-gray-500">
                          <path d="M16.5 11V12C16.5 13.4001 16.5 14.1002 16.2275 14.635C15.9878 15.1054 15.6054 15.4878 15.135 15.7275C14.6002 16 13.9001 16 12.5 16H5.5C4.09987 16 3.3998 16 2.86502 15.7275C2.39462 15.4878 2.01217 15.1054 1.77248 14.635C1.5 14.1002 1.5 13.4001 1.5 12V11M13.1667 5.16667L9 1M9 1L4.83333 5.16667M9 1V11" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full ml-5">
                    <div>
                      <label className="text-gray-700 text-xs font-semibold !text-gray-700 !text-xs !font-semibold flex w-fit">Profile Picture&nbsp;</label>
                    </div>
                    <p className="text-gray-600 text-xs">Upload Png, Jpg/Jpeg or Webp</p>
                    <p className="text-gray-600 text-xs">(max. 1 MB)</p>
                  </div>
                </div>
              </div>

              <div className={GRID_TOP}>
                <Text label="First Name" required name="first_name" value={f.first_name} onChange={set} error={err('first_name')} />
                <Text label="Middle Name" name="middle_name" value={f.middle_name} onChange={set} />
                <Text label="Last Name" required name="last_name" value={f.last_name} onChange={set} error={err('last_name')} />
                <Select label="Gender" required name="gender" value={f.gender} onChange={set} error={err('gender')}
                  options={GENDER} getValue={(o) => o.value} getLabel={(o) => o.label} />
                <DateField label="Date of Birth" required name="birth_date" value={f.birth_date} onChange={set} />
                <Select label="Blood Group" name="blood_group" value={f.blood_group} onChange={set}
                  options={BLOOD_GROUP} getValue={(o) => o.value} getLabel={(o) => o.label} />
                <TextArea label="About" name="about" value={f.about} onChange={set} counter max={255} />
              </div>
            </Section>

            <Section {...S.employee_information}>
              <div className={GRID}>
                <Select label="Status" required name="status" value={f.status} onChange={set} error={err('status')}
                  options={EMPLOYEE_STATUS} getValue={(o) => o.value} getLabel={(o) => o.label} />
                <Select label="Business Unit" required name="business_unit_id" value={f.business_unit_id} onChange={set} options={ref.business_units} />
                {/* the app renders this one as type="number" */}
                <Text label="Employee Code" required type="number" name="employee_code" value={f.employee_code} onChange={set} error={err('employee_code')} />
                <Select label="Department" required name="department_id" value={f.department_id} onChange={set} options={ref.departments} error={err('department_id')} />
                <Select label="Designation" required name="designation_id" value={f.designation_id} onChange={set} options={ref.designations} error={err('designation_id')} />
                {/* the app renders this as a searchable TEXT input, not a dropdown */}
                <Typeahead label="Reporting to" required name="reporting_manager_id" value={f.reporting_manager_id} onChange={set}
                  options={ref.reporting_managers} getLabel={personLabel} />
                <Text label="Biometric ID" required name="biometric_id" value={f.biometric_id} onChange={set} error={err('biometric_id')} />
                <Select label="Active Shift" required name="shift_id" value={f.shift_id} onChange={set} options={ref.shifts} />
                <div>
                  <LabelRow required>Employee Type</LabelRow>
                  <div className="mt-1.5">
                    <RadioGroup name="employee_type" value={f.employee_type} options={EMPLOYEE_TYPE} onChange={(v) => set('employee_type', v)} />
                  </div>
                  <FieldError msg={err('employee_type')} />
                </div>
              </div>
            </Section>

            <Section {...S.employee_role_information}>
              <div className={GRID}>
                <Select label="Employee Role" required name="role_id" value={f.role_id} onChange={set} options={ref.roles} error={err('role_id')} />
                <DateField label="Expiry Date" info name="role_expire_date" value={f.role_expire_date} onChange={set} />
                <Text label="Remark" name="remark" value={f.remark} onChange={set} />
              </div>
              <input name="role" type="hidden" value={f.role_id ?? ''} readOnly />
              <div className="pt-4"><AddButton onClick={() => {}} /></div>
            </Section>

            <Section {...S.company_contact_information}>
              <div className={GRID}>
                <div>
                  <div className="flex items-end min-h-6 justify-between">
                    <div className="flex items-end">
                      <label className="label">Company Email Address&nbsp;</label>
                      <span className="text-error-500 pe-1">*</span>
                    </div>
                    <button
                      type="button"
                      className="text-indigo-700 2xl:text-xs 2xl-to-xl:text-xxs text-xxs font-medium"
                      onClick={() => set('is_external_email', !f.is_external_email)}
                    >
                      Use external email instead
                    </button>
                  </div>
                  <div className="rounded-lg relative mt-1.5">
                    <input className={INPUT} type="text" name="company_email" value={f.company_email ?? ''} onChange={(e) => set('company_email', e.target.value)} />
                  </div>
                  <FieldError msg={err('company_email')} />
                </div>
                <Phone label="Company Mobile Number" name="phone" value={f.phone} onChange={set} />
                <Text label="Seating Location" name="seating_location" value={f.seating_location} onChange={set} />
                <Text label="Extension Number" type="number" name="extension_number" value={f.extension_number} onChange={set} />
              </div>
            </Section>

            <Section {...S.personal_contact_information}>
              <div className={GRID}>
                <Text label="Personal Email Address" name="personal_email" value={f.personal_email} onChange={set} />
                <Phone label="Personal Mobile Number" required name="personal_mobile" value={f.personal_mobile} onChange={set} error={err('personal_mobile')} />
                <Phone label="Alternate Mobile Number" name="alternate_mobile" value={f.alternate_mobile} onChange={set} />
              </div>
            </Section>

            <Section {...S.experience}>
              <div className={GRID}>
                <DateField label="Joining Date" required name="joined_date" value={f.joined_date} onChange={set} error={err('joined_date')} />
                <DateField label="Confirmation Date" required name="confirmed_date" value={f.confirmed_date} onChange={set} />
                {/* tenure at the business unit - the app shows it read-only */}
                <Text label={`Experience @ ${buName || ''}`.trim()} name="experience_at_bu" value={tenure} onChange={() => {}} />
              </div>
              <div className={`${GRID} pt-3`}>
                <div className="flex items-end min-h-10">
                  <InlineCheck name="isFresher" id="Fresher" checked={f.fresher} onChange={(v) => set('fresher', v)}>Fresher</InlineCheck>
                </div>
                <div className="col-span-2">
                  <div className="mb-1.5 flex items-end min-h-6">
                    <span className="label">Previous Experience</span>
                    <span className="text-error-500 pe-1">*</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <input className={INPUT} name="prev_exp_year" placeholder="Y" value={f.prev_exp_year ?? ''} onChange={(e) => set('prev_exp_year', e.target.value)} />
                    <input className={INPUT} name="prev_exp_month" placeholder="M" value={f.prev_exp_month ?? ''} onChange={(e) => set('prev_exp_month', e.target.value)} />
                  </div>
                  <FieldError msg={err('prev_exp_year')} />
                </div>
              </div>
              <div className="pt-4">
                <SubHeading>Previous Organizations</SubHeading>
                <div className="pt-2"><AddButton onClick={() => {}} /></div>
              </div>
            </Section>

            <Section {...S.family_details}>
              <div className={GRID}>
                <Text label="Father's Name" name="father_name" value={f.father_name} onChange={set} />
                <Text label="Mother's Name" name="mother_name" value={f.mother_name} onChange={set} />
                <div>
                  <div className="mb-1.5 flex items-end min-h-6">
                    <span className="label">Marital Status </span>
                    <span className="text-error-500 pe-1">*</span>
                  </div>
                  <RadioGroup name="marital_status" value={f.marital_status} options={MARITAL_STATUS} onChange={(v) => set('marital_status', v)} />
                </div>
              </div>
              <div className="pt-4">
                <SubHeading>Children</SubHeading>
                <div className="pt-2"><AddButton onClick={() => {}} /></div>
              </div>
            </Section>

            <Section {...S.address}>
              <p className="text-sm text-gray-700 font-medium mb-4">Present Address</p>
              <div className={GRID}>
                <Text label="Address" required name="address" value={f.address} onChange={set} error={err('address')} />
                <Select label="Country" required name="country_id" value={f.country_id} onChange={set} options={ref.countries} error={err('country_id')} />
                <Select label="State" required name="state_id" value={f.state_id} onChange={set} options={ref.states} />
                <Text label="Town/City" required name="city" value={f.city} onChange={set} error={err('city')} />
                <Text label="Zip/Postal Code" required name="zipcode" value={f.zipcode} onChange={set} error={err('zipcode')} />
              </div>
              <div className="pt-4">
                <SubHeading>Permanent Address</SubHeading>
                <div className="pt-2">
                  <InlineCheck name="permanent_address" id="same_as_present" checked={f.same_as_present} onChange={(v) => set('same_as_present', v)}>
                    Same as present address
                  </InlineCheck>
                </div>
              </div>
            </Section>

            <Section {...S.documents}>
              <AddButton onClick={() => {}} />
            </Section>

            <Section {...S.health_insurance}>
              <Check name="health_insurance" id="Employee is insured" checked={f.health_insurance} onChange={(v) => set('health_insurance', v)}>
                Employee is insured
              </Check>
            </Section>

            <Section {...S.emergency_contact}>
              <div className={GRID}>
                <Text label="Name" required name="emergency_name" value={f.emergency_name} onChange={set} error={err('emergency_name')} />
                <Phone label="Contact Number" required name="emergency_contact" value={f.emergency_contact} onChange={set} error={err('emergency_contact')} />
                <Select label="Relation" required name="emergency_relation" value={f.emergency_relation} onChange={set} error={err('emergency_relation')}
                  options={RELATION} getValue={(o) => o.value} getLabel={(o) => o.label} />
              </div>
              <div className="pt-4"><AddButton onClick={() => {}} /></div>
            </Section>

            <Section {...S.social_media_links}>
              <AddButton onClick={() => {}} />
            </Section>

            <Section {...S.timesheet_filling}>
              <Toggle
                id="timesheet_filling_toggle"
                checked={!!f.timesheet_filling}
                onChange={(v) => set('timesheet_filling', v)}
                title="Timesheet filling required"
                desc="When turned on, the employee is required to fill daily timesheet."
              />
            </Section>

            <Section {...S.source_of_hire}>
              <div className={GRID}>
                <Select label="Source" name="source_id" value={f.source_id} onChange={set} options={ref.sources} />
                <Text label="Remark" name="source_remark" value={f.source_remark} onChange={set} />
              </div>
            </Section>

            <Section {...S.employee_remark}>
              <div className={GRID}>
                <Text label="Remark" name="employer_remarks" value={f.employer_remarks} onChange={set} />
              </div>
            </Section>

            <Section {...S.employee_settings}>
              <div className="space-y-5">
                <Toggle
                  id="account_status_toggle"
                  checked={f.account_status !== 'inactive'}
                  onChange={(v) => set('account_status', v ? 'active' : 'inactive')}
                  title="Account Status"
                  desc="If disabled, the employee will not be able to login to the portal."
                />
                {/* NEW — Hidden profile. Label and helper line are [PROPOSED]. */}
                <Toggle
                  id="is_hidden_toggle"
                  checked={!!f.is_hidden}
                  onChange={(v) => set('is_hidden', v)}
                  title="Hidden profile"
                  desc="When turned on, the employee becomes an internal payroll profile — not counted in headcount and not visible across other portals."
                />
              </div>
            </Section>

            {/* Invite Employee is its own section and exists ONLY on Add.
                Verified against the captures: the Add form has 17 sections, Edit
                has 16 — invite_employee is absent from Edit, because sending an
                invitation is a one-time action at creation, not stored state you
                can come back and flip.
                A checkbox, not a toggle, for that reason. [DIVERGENCE: the real
                Add form uses a toggle; deliberate, see PROTOTYPE_NOTES.md] */}
            {!isEdit && (
              <Section {...S.invite_employee}>
                <Check
                  name="invite_employee"
                  id="invite_employee_check"
                  checked={f.invite_employee !== false}
                  onChange={(v) => set('invite_employee', v)}
                >
                  Send invitation email to this employee
                </Check>
              </Section>
            )}

          </div>
        </div>
      </form>
    </div>
  )
}
