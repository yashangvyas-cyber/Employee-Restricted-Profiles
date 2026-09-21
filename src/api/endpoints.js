/**
 * CollabCRM endpoint catalogue - every path, method and request shape below was
 * observed in a real network capture of staging on 2026-09-21, except where the
 * comment says NOT CAPTURED.
 *
 * Source captures:
 *   modules/people/api/employee_module_2026-09-21.json
 *   modules/people/api/employee_filter_2026-09-21.json
 *   modules/people/api/employee_sort_2026-09-21.json
 */
export const API_BASE = 'https://staging-api.collabcrm.com'
export const MASTER_API_BASE = 'https://staging-master-api.collabcrm.com'

export const ENDPOINTS = {
  // ---- Employee listing -----------------------------------------------------
  // VERIFIED request body: {"page":1,"per_page":10}
  //   + optional "filters": [{"field_name","operator","value"}]
  //   + optional "sort_by": <field>, "order": "ASC" | "DESC"
  employeeList:        { method: 'POST', path: '/v1/employee/list' },
  // VERIFIED: {total_employees,total_probation,total_notice_period,total_yet_to_join}
  employeeStatusCounts:{ method: 'GET',  path: '/v1/employee/status-counts' },

  // ---- Employee view --------------------------------------------------------
  employeeDetail:      { method: 'GET',  path: (id) => `/v1/employee/${id}` },
  employeeBadges:      { method: 'GET',  path: (id) => `/v1/employee/received-badges/${id}` },
  employeeTimeline:    { method: 'GET',  path: (id) => `/v1/employee/timeline/${id}` },
  employeeAssets:      { method: 'GET',  path: (id) => `/v1/employee/asset-allocated/${id}` },
  employeeProjects:    { method: 'POST', path: '/v1/projects/profile-project-list' },
  employeeIntimation:  { method: 'POST', path: '/v1/sales/client-int/intimation-list' },
  employeeJobInterviews:{ method:'POST', path: '/v1/candidate-int/my-to-do/list' },

  // ---- Employee edit --------------------------------------------------------
  // VERIFIED: returns the edit-form payload (different shape from employeeDetail)
  employeeEditData:    { method: 'GET',  path: (id) => `/v1/employee/employee-details/${id}` },

  // ---- Form reference data (all VERIFIED) -----------------------------------
  businessUnits:       { method: 'GET',  path: '/v1/organisation/business-unit/business-unit-dropdown' },
  departments:         { method: 'GET',  path: '/v1/organisation/department/department-dropdown' },
  designations:        { method: 'GET',  path: '/v1/organisation/designation/designation-dropdown' },
  roles:               { method: 'GET',  path: '/v1/common/roles' },
  shifts:              { method: 'GET',  path: '/v1/config/shifts/dropdown' },
  sources:             { method: 'GET',  path: '/v1/common/source-dropdown' },
  documentTypes:       { method: 'GET',  path: '/v1/common/employee/document-types' },
  reportingManagers:   { method: 'POST', path: '/v1/common/employees' },
  currencies:          { method: 'GET',  path: '/v1/common/currency/dropdown' },
  customFormSchema:    { method: 'POST', path: '/v1/config/custom-forms/schema' },
  importColumns:       { method: 'POST', path: '/v1/common/export-import/columns' },
  populateCode:        { method: 'GET',  path: '/v1/employee/populate-code/' },
  countries:           { method: 'POST', path: '/v1/common/countries', base: MASTER_API_BASE },
  states:              { method: 'POST', path: '/v1/common/states',    base: MASTER_API_BASE },

  // ---- WRITES: *** NOT CAPTURED *** -----------------------------------------
  // The Add/Edit forms were never submitted against staging (that would have
  // written real records), so the create/update contracts are UNKNOWN.
  // The paths below are PLACEHOLDERS, not observed values. See GAPS.md.
  employeeCreate:      { method: 'POST', path: '/v1/employee',              NOT_CAPTURED: true },
  employeeUpdate:      { method: 'PUT',  path: (id) => `/v1/employee/${id}`, NOT_CAPTURED: true },
}

/** Filter operators observed in the live filter bar for a text field ("Name"). */

/** The 18 filterable fields, copied in order from the live filter dropdown,
 *  each with the icon class the app renders next to it. */
export const FILTER_FIELDS = [
  // VERIFIED = field_name read back from the live URL's filterQuery after applying
  // that filter through the real UI. UNVERIFIED = the filter would not apply
  // headlessly, so the server-side name is unknown; the label and icon ARE copied.
  { label: 'Name',              field_name: 'name',              icon: 'icon-user-01',           verified: true,  operators: ['Contains', 'Is'] },
  { label: 'Code',              field_name: null,                icon: 'icon-hash',              verified: false, operators: ['Contains', 'Is'] },
  { label: 'Business Unit',     field_name: null,                icon: 'icon-building-07',       verified: false, operators: ['Is'] },
  { label: 'Department',        field_name: null,                icon: 'icon-dataflow-04',       verified: false, operators: ['Is', 'Is not'] },
  { label: 'Designation',       field_name: null,                icon: 'icon-award-01',          verified: false, operators: ['Is', 'Is not'] },
  { label: 'Reporting To',      field_name: null,                icon: 'icon-image-user-right',  verified: false, operators: ['Is'] },
  { label: 'Email',             field_name: null,                icon: 'icon-mail-05',           verified: false, operators: ['Contains', 'Is'] },
  { label: 'Email Type',        field_name: 'is_external_email', icon: 'icon-mail-05',           verified: true,  operators: ['Is'] },
  { label: 'Mobile Number',     field_name: null,                icon: 'icon-phone-01',          verified: false, operators: ['Contains', 'Is'] },
  { label: 'Gender',            field_name: null,                icon: 'icon-intersex',          verified: false, operators: ['Is'] },
  { label: 'Joining Date',      field_name: null,                icon: 'icon-calendar',          verified: false, operators: ['Is'] },
  { label: 'Confirmation Date', field_name: null,                icon: 'icon-calendar',          verified: false, operators: ['Is'] },
  { label: 'Timesheet Filling', field_name: 'timesheet_filling', icon: 'icon-calendar-plus-01',  verified: true,  operators: ['Is'] },
  { label: 'Employee Type',     field_name: 'employee_type',     icon: 'icon-two-arrow',         verified: true,  operators: ['Is'] },
  { label: 'Status',            field_name: 'status',            icon: 'icon-check-verified-02', verified: true,  operators: ['Is', 'Is not'] },
  { label: 'Account Status',    field_name: 'account_status',    icon: 'icon-shield-tick',       verified: true,  operators: ['Is'] },
  { label: 'Blood Group',       field_name: null,                icon: 'icon-drop',              verified: false, operators: ['Is'] },
  { label: '2FA',               field_name: 'is_2fa_enabled',    icon: 'icon-two-fa',            verified: true,  operators: ['Is'] },
]

/** Values observed alongside the verified field_names, copied from the live URL. */
export const FILTER_VALUE_SAMPLES = {
  is_external_email: ['false', 'true'],
  timesheet_filling: ['true', 'false'],
  employee_type: ['technical'],
  account_status: ['active'],
  is_2fa_enabled: ['enable'],
}
