/**
 * Dropdown / radio option lists for the Add-Edit Employee form.
 *
 * These are react-select controls, so their options are NOT in the DOM dump —
 * they only exist in the app's JS bundle. Every array below is copied verbatim
 * from there (label AND value). Nothing here is written from memory.
 *
 * Source: staging bundle assets/index-fa222f60.js, fetched 2026-09-21.
 */

export const GENDER = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Not specified', value: 'other' },
]

export const BLOOD_GROUP = [
  { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' },
]

/** Note the value for Notice Period is hyphenated, not underscored. */
export const EMPLOYEE_STATUS = [
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Intern', value: 'intern' },
  { label: 'Notice Period', value: 'notice-period' },
  { label: 'Probation', value: 'probation' },
  { label: 'Relieved', value: 'relieved' },
]

/** The leading space on the second label is in the app's own source. */
export const EMPLOYEE_TYPE = [
  { label: 'Technical', value: 'technical' },
  { label: ' Non-Technical', value: 'non-technical' },
]

export const ACCOUNT_STATUS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

export const RELATION = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Spouse', value: 'spouse' },
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Others', value: 'others' },
]

/** Rendered as two radios in the form; values confirmed in the bundle. */
export const MARITAL_STATUS = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
]
