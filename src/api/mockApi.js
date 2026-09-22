/**
 * Mock API layer.
 *
 * Every function mirrors a real CollabCRM endpoint: same path, same method, same
 * request body keys, same response field names and nesting. Swap `USE_MOCK` off
 * and point `request()` at the real base URL and the screens keep working.
 *
 * Request/response shapes were captured from staging on 2026-09-21.
 */
import { ENDPOINTS, API_BASE, EMPLOYEE_FORM_PAYLOAD, STATUS_CODE } from './endpoints'
import listFixture from '../fixtures/employee-list.json'
import statusCounts from '../fixtures/status-counts.json'
import dropdowns from '../fixtures/dropdowns.json'
import detail1 from '../fixtures/detail-d36d126d-bcdf-4803-909b-ae6fa30ec14c.json'
import detail2 from '../fixtures/detail-0faef543-e6e5-4a42-9d22-7d87ba87a169.json'
import detail3 from '../fixtures/detail-8d5b8b08-4d75-4821-8731-8dee6435cd00.json'
import edit1 from '../fixtures/editdata-d36d126d-bcdf-4803-909b-ae6fa30ec14c.json'
import edit2 from '../fixtures/editdata-0faef543-e6e5-4a42-9d22-7d87ba87a169.json'
import edit3 from '../fixtures/editdata-8d5b8b08-4d75-4821-8731-8dee6435cd00.json'

export const USE_MOCK = true
const LATENCY = 180

const delay = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms))

/**
 * In-memory store so Add/Edit are clickable. Seeded from the captured list and
 * mirrored into sessionStorage so a page refresh during a demo does not wipe it.
 * This is a MOCK-LAYER convenience only - it has no counterpart in CollabCRM.
 * Call resetStore() (or close the tab) to get back to the captured data.
 */
const SEED = {
  employees: listFixture.data.map((e) => ({ ...e })),
  details: {
    [detail1.data.id]: detail1.data,
    [detail2.data.id]: detail2.data,
    [detail3.data.id]: detail3.data,
  },
  editData: {
    [edit1.data.id]: edit1.data,
    [edit2.data.id]: edit2.data,
    [edit3.data.id]: edit3.data,
  },
}
const STORE_KEY = 'collabcrm-employee-prototype-store'

function loadStore() {
  try {
    const raw = sessionStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* private mode / storage disabled - fall through to the seed */ }
  return structuredClone(SEED)
}
const store = loadStore()
function persist() {
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(store)) } catch { /* ignore */ }
}
/** Drop any added/edited records and go back to the captured data. */
export function resetStore() {
  try { sessionStorage.removeItem(STORE_KEY) } catch { /* ignore */ }
  Object.assign(store, structuredClone(SEED))
}

const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v)
const dd = (k) => { try { return parse(dropdowns[k]) } catch { return { data: [] } } }

/** Mirrors the server's meta envelope exactly. */
const envelope = (data, meta = {}) => ({ data, meta: { code: STATUS_CODE.SUCCESS, message: '', ...meta } })

/* ------------------------------------------------------------------ listing */

/** The one field the "Filter Results..." box and the chips both feed.
 *  Matching here mirrors what the server returned for the operators we saw. */
function applyFilters(rows, filters = []) {
  return filters.reduce((acc, f) => {
    const { field_name, operator, value } = f
    if (!field_name || value === '' || value == null) return acc
    const val = String(value).toLowerCase()
    /* Maps each real filter field_name onto the list row that backs it.
       Names are the app's own (see FILTER_FIELDS in endpoints.js). */
    const read = (r) => {
      switch (field_name) {
        case 'name':              return r.name
        case 'employee_code':     return r.employee_code
        case 'business_unit_id':  return r.business_unit_id
        case 'department':        return r.department_name
        case 'designation':       return r.designation_name
        case 'reporting_to':      return r.reporting_name
        case 'email':             return r.email
        case 'personal_mobile':   return r.personal_mobile
        case 'status':            return r.status
        case 'account_status':    return r.account_status
        case 'employee_type':     return r.employee_type
        case 'joining_date':      return r.joined_date
        case 'confirmation_date': return r.confirmed_date
        case 'timesheet_filling': return String(r.timesheet_filling)
        case 'is_2fa_enabled':    return r.is_2fa_enabled ? 'enable' : 'disable'
        case 'is_external_email': return String(r.is_external_email)
        case 'is_hidden':     return String(!!r.is_hidden)
        case 'gender':            return r.gender
        case 'blood_group':       return r.blood_group
        default:                  return r[field_name]
      }
    }
    return acc.filter((r) => {
      const cell = String(read(r) ?? '').toLowerCase()
      if (operator === 'Contains') return cell.includes(val)
      if (operator === 'Is') return cell === val
      if (operator === 'Is not') return cell !== val
      return true
    })
  }, rows)
}

function applySort(rows, sort_by, order) {
  if (!sort_by) return rows
  const dir = order === 'DESC' ? -1 : 1
  return [...rows].sort((a, b) => {
    const x = a[sort_by] ?? '', y = b[sort_by] ?? ''
    return x < y ? -dir : x > y ? dir : 0
  })
}

/**
 * POST /v1/employee/list
 * VERIFIED body: {"page":1,"per_page":10}
 *                 [+ "filters":[{field_name,operator,value}]]
 *                 [+ "sort_by":"name","order":"DESC"]
 */
export async function employeeList({ page = 1, per_page = 10, filters = [], sort_by, order } = {}) {
  await delay()
  let rows = applyFilters(store.employees, filters)
  rows = applySort(rows, sort_by, order)
  const total = rows.length
  const start = (page - 1) * per_page
  return envelope(rows.slice(start, start + per_page), {
    message: 'Employees listing fetched successfully.',
    total, page, per_page,
  })
}

/**
 * GET /v1/employee/status-counts
 * VERIFIED response (2026-09-21) - all eight keys:
 *   total_employees, total_probation, total_notice_period, total_confirmed,
 *   total_intern, total_yet_to_join, total_active_pip, total_flagged_pip
 * Served from the captured fixture so the six KPI cards show the same numbers
 * the real screen shows; the counts that ARE derivable from the list are
 * recomputed so a newly added employee moves them.
 */
export async function employeeStatusCounts() {
  await delay(90)
  const s = store.employees
  const notRelieved = s.filter((e) => e.status !== 'relieved')
  return envelope({
    ...statusCounts.data,
    total_employees: String(notRelieved.length),
    total_confirmed: String(s.filter((e) => e.status === 'confirmed').length),
    total_probation: String(s.filter((e) => e.status === 'probation').length),
    total_intern: String(s.filter((e) => e.status === 'intern').length),
    total_notice_period: String(s.filter((e) => e.status === 'notice_period').length),
    /* Restricted is a SUBSET of Active — same base (non-relieved), so
       Restricted <= Active Employees. See PROTOTYPE_NOTES.md Q3. */
    total_hidden: String(notRelieved.filter((e) => e.is_hidden).length),
  }, { message: 'Employees listing counts.' })
}

/* ------------------------------------------------------------------- detail */

/** GET /v1/employee/{id} */
export async function employeeDetail(id) {
  await delay()
  const d = store.details[id]
  if (d) {
    /* The captured detail records predate is_hidden, so carry the flag
       across from the list row rather than letting View read a stale false. */
    const row = store.employees.find((e) => e.id === id)
    return envelope(
      { ...d, is_hidden: !!(d.is_hidden ?? row?.is_hidden),
              hidden_reason: d.hidden_reason || row?.hidden_reason || '' },
      { message: 'Employee details fetched successfully.' },
    )
  }
  // Only 3 full detail records were captured; synthesise the rest from the list
  // row so every row in the prototype is clickable. Marked so it is obvious.
  const row = store.employees.find((e) => e.id === id)
  if (!row) return envelope(null, { code: 0, message: 'Employee not found.' })
  return envelope(fromListRow(row), { message: 'Employee details fetched successfully.', _synthesised: true })
}

/** GET /v1/employee/employee-details/{id} — the edit-form payload. */
export async function employeeEditData(id) {
  await delay()
  const d = store.editData[id]
  if (d) {
    const row = store.employees.find((e) => e.id === id)
    return envelope(
      { ...d, is_hidden: !!(d.is_hidden ?? row?.is_hidden),
              hidden_reason: d.hidden_reason || row?.hidden_reason || '' },
      { message: 'Employee details fetched successfully.' },
    )
  }
  const row = store.employees.find((e) => e.id === id)
  if (!row) return envelope(null, { code: 0, message: 'Employee not found.' })
  return envelope(fromListRow(row), { message: 'Employee details fetched successfully.', _synthesised: true })
}

/** Build a detail-shaped object out of a list row, keeping the real field names. */
function fromListRow(row) {
  const [first_name, ...rest] = (row.name || '').split(' ')
  const tmpl = detail1.data
  return {
    ...tmpl,
    id: row.id,
    first_name,
    middle_name: null,
    last_name: rest.join(' ') || null,
    email: row.email,
    employee_code: row.employee_code,
    status: row.status,
    account_status: row.account_status,
    employee_type: row.employee_type,
    business_unit_id: row.business_unit_id,
    profile_picture: row.profile_picture,
    profile_picture_url: null,
    is_hidden: !!row.is_hidden,
    hidden_reason: row.hidden_reason || '',
    department: { ...tmpl.department, title: row.department_name },
    designation: { ...tmpl.designation, title: row.designation_name },
    businessUnit: row.businessUnit || tmpl.businessUnit,
    reporting_to: row.reporting_name
      ? { ...tmpl.reporting_to, first_name: (row.reporting_name || '').split(' ')[0],
          last_name: (row.reporting_name || '').split(' ').slice(1).join(' ') }
      : null,
    employee_contact_info: { ...tmpl.employee_contact_info, personal_mobile: row.personal_mobile,
      personal_country_code: row.personal_country_code },
    employee_experiences: { ...tmpl.employee_experiences, joined_date: row.joined_date,
      confirmed_date: row.confirmed_date, prev_exp_year: row.prev_exp_year, prev_exp_month: row.prev_exp_month },
  }
}

/* -------------------------------------------------------------------- write */
/* *** NOT CAPTURED *** The Add/Edit forms were never submitted against staging,
 * so the real create/update request and response contracts are unknown. These
 * keep the prototype clickable and write to the in-memory store only. The field
 * names used ARE the real ones (they come from the captured GET payloads);
 * the endpoint paths and the envelope are placeholders. See GAPS.md.          */

/**
 * POST /v1/employee/add-edit — ONE endpoint for both Add and Edit, as the app
 * does it. `payload` is the nested EMPLOYEE_FORM_PAYLOAD shape; an edit carries
 * the employee's id alongside it.
 *
 * Path, request shape AND response envelope are all the app's own, read out of
 * its bundle (the call site plus its onSuccess handler) — no record had to be
 * created on staging.
 *
 * Real clients must then do step 2: PUT each attached file to the presigned URL
 * the response hands back in `meta`. This mock accepts no files, so it returns
 * those keys empty rather than faking upload targets.
 */
export async function employeeAddEdit(payload, id = null) {
  await delay(320)
  const p = payload || structuredClone(EMPLOYEE_FORM_PAYLOAD)
  const pi = p.personal_info || {}
  const ei = p.employee_info || {}
  const ci = p.contact_info || {}
  const ex = p.experience || {}

  const name = [pi.first_name, pi.middle_name, pi.last_name].filter(Boolean).join(' ')
  const pick = (v) => (v && typeof v === 'object' ? v.value ?? v.id ?? null : v)
  const labelOf = (v) => (v && typeof v === 'object' ? v.label ?? v.title ?? null : v)

  const employeeId = id || `new-${Math.random().toString(36).slice(2, 10)}`
  const row = {
    ...listFixture.data[0],
    id: employeeId,
    name,
    employee_code: ei.employee_code,
    email: ci.company_email,
    department_name: labelOf(ei.department),
    designation_name: labelOf(ei.designation),
    reporting_name: labelOf(ei.reporting_to),
    business_unit_id: pick(ei.business_unit),
    status: pick(ei.status) || 'probation',
    employee_type: pick(ei.employee_type) || 'technical',
    account_status: p.account_status === false ? 'inactive' : 'active',
    personal_mobile: ci.personal_mobile || null,
    personal_country_code: ci.personal_mobile_code || null,
    gender: pi.gender || null,
    blood_group: pick(pi.blood_group),
    joined_date: ex.joined_date || null,
    confirmed_date: ex.confirmation_date || null,
    prev_exp_year: ex.prev_exp_year || 0,
    prev_exp_month: ex.prev_exp_month || 0,
    timesheet_filling: !!p.timesheet_filling,
    is_external_email: !!ci.is_external_email,
    is_2fa_enabled: false,
    is_hidden: !!p.is_hidden,
    hidden_reason: p.hidden_reason || '',
    last_login_time: id ? undefined : null,
  }

  const existing = store.employees.find((e) => e.id === employeeId)
  store.employees = existing
    ? store.employees.map((e) => (e.id === employeeId ? { ...e, ...row } : e))
    : [row, ...store.employees]

  const detail = { ...fromListRow(row), ...flattenForDetail(p), id: employeeId }
  store.details[employeeId] = detail
  store.editData[employeeId] = detail
  persist()
  return envelope({ id: employeeId }, {
    message: id ? 'Employee updated successfully.' : 'Employee created successfully.',
    /* presigned upload targets the real endpoint returns; empty here because
       the mock takes no files. Shape copied from the app's success handler. */
    upload_url: null,
    upload_file_headers: null,
    documentsUrl: [],
    custom_file_urls: {},
  })
}

/** Nested form payload -> the flat shape the READ endpoints return. */
function flattenForDetail(p) {
  const pi = p.personal_info || {}, ei = p.employee_info || {}
  const ci = p.contact_info || {}, ex = p.experience || {}
  const fd = p.family_details || {}, ad = p.present_address || {}
  const pick = (v) => (v && typeof v === 'object' ? v.value ?? v.id ?? null : v)
  const labelOf = (v) => (v && typeof v === 'object' ? v.label ?? v.title ?? null : v)
  return {
    first_name: pi.first_name, middle_name: pi.middle_name, last_name: pi.last_name,
    gender: pi.gender, birth_date: pi.dob, blood_group: pick(pi.blood_group), about: pi.about,
    employee_code: ei.employee_code, status: pick(ei.status),
    employee_type: pick(ei.employee_type), biometric_id: ei.bioMetricId,
    email: ci.company_email,
    department: { title: labelOf(ei.department) },
    designation: { title: labelOf(ei.designation) },
    employee_contact_info: {
      company_mobile: ci.company_mobile, seating_location: ci.seating_location,
      extension_number: ci.extension_number, personal_email: ci.personal_email,
      personal_mobile: ci.personal_mobile, personal_country_code: ci.personal_mobile_code,
      alternate_mobile: ci.alternate_mobile,
    },
    employee_experiences: {
      joined_date: ex.joined_date, confirmed_date: ex.confirmation_date,
      prev_exp_year: ex.prev_exp_year, prev_exp_month: ex.prev_exp_month,
    },
    father_name: fd.father_name, mother_name: fd.mother_name,
    marital_status: fd.marital_status, spouse_name: fd.spouse_name,
    employee_addresses: [{
      address: ad.address, city: ad.city, zipcode: ad.pincode,
      country: { name: labelOf(ad.country) }, state: { name: labelOf(ad.state) },
    }],
    timesheet_filling: !!p.timesheet_filling,
    employer_remarks: (p.employer_remarks || {}).employer_remarks,
  }
}

/* --------------------------------------------------------- reference lookups */
export const getBusinessUnits     = async () => (await delay(60), dd('business_units'))
export const getDepartments       = async () => (await delay(60), dd('departments'))
export const getDesignations      = async () => (await delay(60), dd('designations'))
export const getRoles             = async () => (await delay(60), dd('roles'))
export const getShifts            = async () => (await delay(60), dd('shifts'))
export const getSources           = async () => (await delay(60), dd('sources'))
export const getDocumentTypes     = async () => (await delay(60), dd('document_types'))
export const getReportingManagers = async () => (await delay(60), dd('reporting_managers'))
export const getCountries         = async () => (await delay(60), dd('countries'))
export const getStates            = async () => (await delay(60), dd('states'))
export const getEmployeeCode      = async () => (await delay(60), dd('employee_code'))

/** Where a developer swaps the mock out. Paths come from ENDPOINTS. */
export async function request(endpoint, { params, body } = {}) {
  const path = typeof endpoint.path === 'function' ? endpoint.path(params) : endpoint.path
  const res = await fetch(`${endpoint.base || API_BASE}${path}`, {
    method: endpoint.method,
    headers: { 'Content-Type': 'application/json' },
    body: endpoint.method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  })
  return res.json()
}

export { ENDPOINTS }
