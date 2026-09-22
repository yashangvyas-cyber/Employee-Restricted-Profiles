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

  // ---- WRITES ---------------------------------------------------------------
  // ONE endpoint serves both Add and Edit. Read out of the app's own bundle:
  //   const pBr = async e => (await rn.post("/employee/add-edit", e)).data
  // Editing sends the same call with the employee's id inside the payload.
  // Request body: EMPLOYEE_FORM_PAYLOAD. Response: ADD_EDIT_RESPONSE.
  employeeAddEdit:     { method: 'POST', path: '/v1/employee/add-edit' },
}

/** Filter operators observed in the live filter bar for a text field ("Name"). */

/** The 18 filterable fields, copied in order from the live filter dropdown,
 *  each with the icon class the app renders next to it. */
export const FILTER_FIELDS = [
  // field_name, type and operators are the app's own filter config, read out of
  // the JS bundle (each entry is {id, label, operator, options, type}). The seven
  // marked `live: true` were additionally confirmed by applying that filter in the
  // browser and reading field_name back from the URL - all seven agreed with the
  // bundle, which is why the other eleven are trusted.
  { label: 'Name',              field_name: 'name',              type: 'text',           icon: 'icon-user-01',           operators: ['Contains', 'Is'], live: true },
  { label: 'Code',              field_name: 'employee_code',     type: 'text',           icon: 'icon-hash',              operators: ['Contains', 'Is'] },
  { label: 'Business Unit',     field_name: 'business_unit_id',  type: 'multi-dropdown', icon: 'icon-building-07',       operators: ['Is'] },
  { label: 'Department',        field_name: 'department',        type: 'multi-dropdown', icon: 'icon-dataflow-04',       operators: ['Is', 'Is not'] },
  { label: 'Designation',       field_name: 'designation',       type: 'multi-dropdown', icon: 'icon-award-01',          operators: ['Is', 'Is not'] },
  { label: 'Reporting To',      field_name: 'reporting_to',      type: 'multi-dropdown', icon: 'icon-image-user-right',  operators: ['Is'] },
  { label: 'Email',             field_name: 'email',             type: 'text',           icon: 'icon-mail-05',           operators: ['Contains', 'Is'] },
  { label: 'Email Type',        field_name: 'is_external_email', type: 'dropdown',       icon: 'icon-mail-05',           operators: ['Is'], live: true },
  { label: 'Mobile Number',     field_name: 'personal_mobile',   type: 'text',           icon: 'icon-phone-01',          operators: ['Contains', 'Is'] },
  { label: 'Gender',            field_name: 'gender',            type: 'dropdown',       icon: 'icon-intersex',          operators: ['Is'] },
  { label: 'Joining Date',      field_name: 'joining_date',      type: 'date',           icon: 'icon-calendar',          operators: ['Is', 'Is between', 'Is ≥', 'Is ≤'] },
  { label: 'Confirmation Date', field_name: 'confirmation_date', type: 'date',           icon: 'icon-calendar',          operators: ['Is', 'Is between', 'Is ≥', 'Is ≤'] },
  { label: 'Timesheet Filling', field_name: 'timesheet_filling', type: 'dropdown',       icon: 'icon-calendar-plus-01',  operators: ['Is'], live: true },
  { label: 'Employee Type',     field_name: 'employee_type',     type: 'dropdown',       icon: 'icon-two-arrow',         operators: ['Is'], live: true },
  { label: 'Status',            field_name: 'status',            type: 'multi-dropdown', icon: 'icon-check-verified-02', operators: ['Is', 'Is not'], live: true },
  { label: 'Account Status',    field_name: 'account_status',    type: 'dropdown',       icon: 'icon-shield-tick',       operators: ['Is'], live: true },
  { label: 'Blood Group',       field_name: 'blood_group',       type: 'multi-dropdown', icon: 'icon-drop',              operators: ['Is'] },
  { label: '2FA',               field_name: 'is_2fa_enabled',    type: 'dropdown',       icon: 'icon-two-fa',            operators: ['Is'], live: true },
  /* NEW — 19th field. Follows the is_2fa_enabled pattern exactly. */
  { label: 'Hidden',        field_name: 'is_hidden',     type: 'dropdown',       icon: 'icon-lock-01',           operators: ['Is'], proposed: true },
]

/** Every operator the filter bar can offer, with the value sent to the server.
 *  Copied from the bundle's operator constants (label ≠ value for the date ones). */
export const FILTER_OPERATORS = {
  'Contains':   'Contains',
  'Is':         'Is',
  'Is not':     'Is not',
  'Is ≥':       'Is greaterThan',
  'Is ≤':       'Is lessThan',
  'Is between': 'Is between',
}

/** Values observed alongside the verified field_names, copied from the live URL. */
export const FILTER_VALUE_SAMPLES = {
  is_external_email: ['false', 'true'],
  timesheet_filling: ['true', 'false'],
  employee_type: ['technical', 'non-technical'],
  account_status: ['active'],
  is_2fa_enabled: ['enable'],
  status: ['confirmed', 'probation', 'intern', 'notice_period', 'relieved'],
  is_hidden: ['true', 'false'],
}

/**
 * The DEFAULT filter the app applies when you reach the listing from the
 * sub-sidebar. Copied from the "Employee List" href in the flyout markup - this
 * is why the real screen opens showing two chips.
 */
export const DEFAULT_FILTER_QUERY = [
  { field_name: 'status',         operator: 'Is not', value: 'relieved' },
  { field_name: 'account_status', operator: 'Is',     value: 'active' },
  /* NEW — hidden profiles are hidden by default; the Hidden stat card
     is the way in. [PROPOSED] */
  { field_name: 'is_hidden',  operator: 'Is',     value: 'false' },
]

/**
 * Request body for POST /v1/employee/add-edit, copied from the form's
 * initial-values object in the app bundle. Note it is NESTED BY SECTION - it is
 * not the flat field list the read endpoints return.
 */
export const EMPLOYEE_FORM_PAYLOAD = {
  personal_info: { first_name: '', middle_name: '', last_name: '', gender: '', dob: null, blood_group: null, about: '' },
  employee_info: { business_unit: null, employee_code: '', status: null, department: null, designation: null, reporting_to: null, employee_type: null, bioMetricId: '', active_shift: null },
  employee_role_info: [{ role: '', expiryDate: '', remark: '' }],
  deleted_employee_roles: [],
  contact_info: { company_email: '', company_mobile_code: null, company_mobile: '', seating_location: '', extension_number: '', personal_email: '', personal_mobile_code: null, personal_mobile: '', alternate_mobile_code: null, alternate_mobile: '', is_external_email: false },
  experience: { joined_date: null, confirmation_date: null, prev_exp_year: '', prev_exp_month: '', prev_organizations: [], isFresher: false },
  family_details: { father_name: '', mother_name: '', marital_status: 'single', spouse_name: '', marriage_date: null, spouse_dob: null, children: [] },
  present_address: { address: '', country: null, state: null, city: '', pincode: '' },
  permanent_address: { address: '', country: null, state: null, city: '', pincode: '' },
  documents: [],
  deleted_documents: [],
  health_insurance: false,
  health_insurance_info: { insuree_name: '', relationship: 'Self', dob: null, gender: null, insurance_company: '', insurance_company_code: '', insurance_policy_number: '', insurance_phs_id: '', insurance_valid_from: null, insurance_valid_to: null, insurance_sum_assured: '' },
  emergency_contacts: [{ name: '', country_code: '', contact_number: '', relation: null }],
  deleted_emergency_contacts: [],
  social_media_links: [],
  deleted_social_media: [],
  timesheet_filling: false,
  source_of_hire: { source: null, remark: '' },
  employer_remarks: { employer_remarks: '' },
  invite_employee: true,
  account_status: true,
}

/**
 * Response envelope of POST /v1/employee/add-edit, and the file-upload step
 * that follows it. Read out of the bundle's own success handler, so no record
 * had to be created on staging to learn this.
 *
 * SAVING AN EMPLOYEE IS TWO STEPS, not one:
 *
 *   1. POST /v1/employee/add-edit  ->  meta carries PRESIGNED UPLOAD URLS
 *   2. for each file the user attached, PUT it straight to its presigned URL:
 *        axios.put(presignedUrl, file, {
 *          headers: { 'content-type': file.type, ...headersFromMeta }
 *        })
 *
 * The app checks `meta.code === STATUS_CODE.FAIL` and, if so, shows
 * `meta.message` as a toast. On success it invalidates the "get-employees-list"
 * query, which is why the listing refreshes behind the form.
 */
export const STATUS_CODE = { SUCCESS: 1, FAIL: 0, WARNING: 2, SANDWICH_LEAVE: 7 }

export const ADD_EDIT_RESPONSE = {
  data: { /* the saved employee */ },
  meta: {
    code: 1,                    // STATUS_CODE
    message: '',                // surfaced as a toast when code === FAIL
    upload_url: null,           // presigned PUT target for the profile picture
    upload_file_headers: null,  // headers to send with that PUT
    documentsUrl: [],           // [{ document_type_id, url, headers }]
    custom_file_urls: {},       // { <customFieldKey>: { upload_url, headers } }
  },
}

/**
 * Validation, captured by submitting the Add form EMPTY against staging
 * (client-side validation rejected it, so nothing was created - 0 write
 * requests fired). These are the app's real messages, verbatim.
 */
export const VALIDATION = {
  required: 'This is a required field.',
  email: 'Please enter a valid email address.',
  /* class the app renders the message with */
  errorClass: 'text-error-500 2xl:text-sm 2xl-to-xl:text-xs text-xs font-normal mt-1.5',
  /* The fields that actually errored on an empty submit against staging,
     named by this prototype's form-state keys. Business Unit, Employee Code,
     Reporting to, Biometric ID, Active Shift, Date of Birth and State did NOT
     error - they are prefilled or optional. */
  requiredFields: [
    'first_name', 'last_name', 'gender', 'status', 'department_id', 'designation_id',
    'employee_type', 'role_id', 'company_email', 'personal_mobile', 'joined_date',
    'address', 'country_id', 'city', 'zipcode',
    'emergency_name', 'emergency_contact', 'emergency_relation',
  ],
  /* Previous experience errored too, but only because "Fresher" was unticked. */
  requiredUnlessFresher: ['prev_exp_year'],
}
