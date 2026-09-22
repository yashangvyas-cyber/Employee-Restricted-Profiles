# Field map — Restricted Profile

**Check this before I write code.** Every row is either **COPIED** (verbatim from
a capture, with the file named) or **PROPOSED** (new — needs your approval).

---

## 1. Add/Edit form — the combined section

Replaces the `account_status` and `invite_employee` sections. `timesheet_filling`
stays separate, unchanged.

### Section shell

| Part | Value | Source |
|---|---|---|
| Section id | `employee_settings` | **PROPOSED** (pattern copied: ids are snake_case of the title) |
| Wrapper | `flex items-start 2xl:mt-4 mt-3` | **COPIED** `employee_add_2026-09-21.html` |
| Left gutter | `2xl:w-1/4 2xl-to-xl:w-[20%] w-[20%] pr-2` | **COPIED** |
| Card | `2xl:p-6 2xl:pb-4 p-4 pb-2.5 bg-white border border-gray-200 rounded-lg` | **COPIED** |
| Section title | **Access & Visibility** | **PROPOSED** *(your suggestion)* |
| Section description | *Login, invitation and visibility settings of the employee.* | **PROPOSED** (matches house style `…of the employee.`) |

### The three toggles

Layout copied from the **Timesheet Filling** card — toggle left, label beside,
helper line below. Note rows 1–2 need **no new copy**: their helper text is the
existing section description moved down.

| # | Toggle label | Helper line | Source of copy |
|---|---|---|---|
| 1 | **Account Status** | *If disabled, the employee will not be able to login to the portal.* | **COPIED** — was the `account_status` section description |
| 2 | **Invite Employee** | *If turned on, employee will receive a welcome email with the instructions to create their password for the portal.* | **COPIED** — was the `invite_employee` section description |
| 3 | **Restricted profile** | *Only visible in People and Payroll. Hidden from headcount, dropdowns and listings in other portals.* | **PROPOSED** *(your wording)* |

### Controls

| Field | Label | Type | name / key | Default | Source |
|---|---|---|---|---|---|
| Account status | Account Status | toggle (checkbox, hidden input + styled label) | `account_status` | on | **COPIED** |
| Invite | Invite Employee | toggle | `invite_employee` | on | **COPIED** |
| Restricted | Restricted profile | toggle | `restricted_profile` *(write)* / `is_restricted` *(read+filter)* | **off** | **PROPOSED** — naming split flagged for your API team |

Toggle markup (COPIED): outer `relative inline-block 2xl:w-[38px] … 2xl:h-[21px]`,
hidden `input`, label `flex items-center w-full h-full rounded-full transition-colors
duration-300` + `bg-indigo-600` on / `bg-gray-300` off, knob `translate-x-[20px]` /
`translate-x-[3px]`.

---

## 2. Confirm on enabling Restricted

Reuses the captured confirm from `modules/project-mgmt/dom/c2_row_action.html`.

| Part | Value | Source |
|---|---|---|
| Title | **Restricted profile** | **PROPOSED** |
| Body | *This employee will not be counted in Active Employees or headcount, and will be hidden from dropdowns and listings in other portals. They will still appear in People and Payroll.* | **PROPOSED** *(your copy)* |
| Remarks field | label `Remarks` + required `*` + `0/1000` counter | **COPIED** — already in the captured confirm |
| Cancel | `!bg-white border border-gray-300 !text-gray-700 … w-full` | **COPIED** |
| Confirm | `bg-indigo-600` (primary, non-destructive) | **COPIED** class; **the variant choice is PROPOSED** — captured original is `bg-error-600` |

Fires on **save**, only when the toggle went off → on.

---

## 3. Employee listing — stat card

| Field | Value | Source |
|---|---|---|
| Card label | **Restricted** | **PROPOSED** |
| Value | `total_restricted` | **PROPOSED** key — 9th on `GET /v1/employee/status-counts` |
| Card shell | `2xl:py-5 … bg-white rounded-xl border … hover:border-indigo-200 hover:bg-indigo-50/60` | **COPIED** |
| Icon | `icon-eye` in `… rounded-lg border border-gray-300 cursor-pointer text-gray-700` | **COPIED** (the enabled "view" variant) |
| On click | applies `{field_name: is_restricted, operator: Is, value: true}` | **PROPOSED** — behaviour copied from the other cards |
| Subtext | **none** | **COPIED** — no stat card in the app has subtext |
| Grid | `grid-cols-7` **or** wrapped 2nd row | **OPEN — you pick from screenshots.** No 7-card row exists anywhere in CollabCRM |

**Counting (decided 2026-09-22):** Active Employees **includes** restricted.
Restricted is a **subset**, so `Restricted <= Active Employees`. The earlier
`Active + Restricted = total non-relieved` assertion is void.

---

## 4. Filter — 19th field

| Property | Value | Source |
|---|---|---|
| Label | **Restricted** | **PROPOSED** |
| `field_name` | `is_restricted` | **PROPOSED** (matches `is_2fa_enabled`, `is_external_email`) |
| `type` | `dropdown` | **COPIED** pattern from `is_2fa_enabled` |
| Operators | `["Is"]` | **COPIED** pattern |
| Values | `true` / `false` | **PROPOSED** |
| Icon | `icon-lock-01` | **COPIED** — exists in the icon font |

**Default `filterQuery`** on the sub-sidebar link gains
`{field_name: is_restricted, operator: Is, value: false}`, joining the existing
`status Is not relieved` + `account_status Is active`. **COPIED** mechanism.

---

## 5. Row treatment — People list and Payroll

| Part | Value | Source |
|---|---|---|
| Row tint | `bg-warning-25` → `rgb(255 252 245)` | token **COPIED** from app CSS; **using it on a row is PROPOSED** — no row-tint pattern exists in CollabCRM |
| Badge | `rounded-md border flex font-medium items-center w-max py-0.5 px-2 text-xs` + warning variant | **COPIED** pattern |
| Badge icon | `icon-lock-01` | **COPIED** |
| Badge text | **Restricted** | **PROPOSED** |
| Placement | inside the **Name** cell (People) / **Employee** cell (Payroll) | **PROPOSED** — avoids a new column; the table already scrolls at 11 columns |

---

## 6. View Employee

| Part | Value | Source |
|---|---|---|
| Header pill | second pill beside the existing status pill | **COPIED** pill class |
| Settings row | `Restricted profile` / `Yes`–`No`, beside the existing Timesheet Filling row | **COPIED** label/value pattern |

---

## Everything PROPOSED, in one list

1. Section id `employee_settings`, title **Access & Visibility**, description
2. Restricted toggle label + helper line
3. Field naming: `restricted_profile` (write) vs `is_restricted` (read/filter)
4. Confirm modal title + body; using the **primary** not destructive button
5. Stat card label **Restricted**; key `total_restricted`
6. Filter label/values
7. Badge text **Restricted**; badge placement in the name cell
8. **Row tint as a pattern** — the only genuinely new visual idiom
9. **Stat grid: 7 columns vs wrapped row — you pick from screenshots**

---

## Not built, specified only

`POST /v1/common/employees` exclusion (the shared dropdown — **People 15,
Recruitment 22, CRM 5, Projects 2, Reports 4**), Reports → Headcount & Diversity,
celebration feeds, statutory-report inclusion, permission gating, audit trail,
bulk action from the People list.

---

# PAYROLL field map  (added 2026-09-22)

The earlier version of this file had **one line** for Payroll. That was not a
field map. This section replaces it, from captures taken 2026-09-22.

## Screens in Payroll that carry an employee — all need the indicator

| # | Screen | Route | Employee-bearing column | Captured |
|---|---|---|---|---|
| 1 | **Salary Register** (per-run pay list) | `/run-payroll/:id/edit` | `No. / Employee Name` | ✅ `run_payroll_salary_register.html` |
| 2 | Payroll Runs | `/run-payroll` | `Employees` (a **count**) | ✅ `run_payroll_2026-09-22.html` |
| 3 | Employees Compensation | `/employees-compensation` | `Employee` | ✅ `employees_compensation_2026-09-22.html` |
| 4 | Loans & Advances | `/loans-advances` | `Employee Name` | ✅ `loans_advances.html` |
| 5 | Expense & Reimbursement | `/expense-management` | `Employee Name` | ✅ `expense_management.html` |
| 6 | Tax Declarations | — | `Employee Name & ID` | ✅ `tax_declarations.html` |

**Six screens, not one.** The ticket says "visible in Payroll with a different
visual indication" — that indication has to be applied on all six, or the flag
is inconsistent inside the same portal.

## 1. Salary Register — the screen that matters most

This is the actual pay list: 21 columns, 4 rows, inside a Back/Next wizard.

| Part | Value | Source |
|---|---|---|
| Badge slot | the `No. / Employee Name` cell | **COPIED** |
| Cell classes | `… min-w-[200px] sticky left-0 bg-white group-hover:bg-gray-50 drop-shadow-md border-r` | **COPIED** |
| Export button | `Export Salary Register` | **COPIED** — an export surface; restricted rows will land in the file |
| APIs | `/v1/payroll/run-payroll/:id/view`, `/:id/steps`, `/statistics` | **COPIED** |

### ⚠️ Implementation gotcha — the tint will break here
The employee cell is **`sticky left-0` with its own `bg-white`**. A row tint set
on `<tr>` will **not** reach it — the frozen column will stay white while the
rest of the row is tinted, leaving a visible gap.

This is the same class of bug as the sticky Actions header in the People listing
that we already had to fix. The tint must be applied to the sticky cell
explicitly, not only to the row.

## 2. Payroll Runs — the counting problem

Stat cards captured, with live values:

| Card | Value |
|---|---|
| Upcoming Payroll | October 2026 |
| **Total Employees on Payroll** | 0 |
| Total Payroll Cost (All Payroll cycles) | ₹ 3,46,543 |
| Payroll On-Hold | 0 |

Plus a per-run **`Employees`** count column.

**RESOLVED 2026-09-22.** Both **include** restricted, consistent with People.
The disclosure you proposed ("Includes 3 restricted profiles") belongs on this
screen, because the totals silently contain them.

## 3. Employees Compensation — a name collision

Its stat cards are: **Active Employees**, Salary Structure Unassigned,
Statutory Applicability.

**RESOLVED 2026-09-22** by the decision that Active Employees includes
restricted. Both portals now count the same way, so the label means the same
number in both. No rename needed.

## Capture status — NOT blocked

An earlier version of this section said "blocked on the yopmail tenant". That
was wrong and is retracted. The `bluewhaletechnosoftpvtltd` account we already
have captured everything the build needs:

| Screen | Data rows | Columns |
|---|---|---|
| **Salary Register** (the per-run pay list) | **4** | **22** |
| Payroll Runs | 3 | 14 |
| Tax Declarations | 9 | 10 |
| Loans & Advances | 6 | 13 |
| Expense & Reimbursement | 1 | 10 |
| Employees Compensation | 0 | columns present in the earlier `employees_compensation.html` |

Five of six screens are populated, including the one that matters most. The
prototype uses masked fixtures anyway, so another tenant's real data adds
nothing — structure is what the build needs, and structure is captured.

**Minor, not blocking:** Employees Compensation returned 0 rows on the 2026-09-22
pass. Its column set is already known from the earlier capture, so only a
populated row sample is missing. Re-runnable any time with
`_tools/payroll_crawl.cjs`.

**Wrong route, unrelated:** `/people/attendance-data-for-payroll` 404s. The
route table lists it, so the real path differs. Not needed for this ticket.

## Still PROPOSED for Payroll

1. Badge text and placement in each of the six screens' employee cells
2. Row tint — **plus** the sticky-cell fix above
3. Whether `Total Employees on Payroll` and the per-run `Employees` count include restricted
4. The "Includes N restricted profiles" disclosure — which screen, what wording
5. Whether `Export Salary Register` marks restricted rows in the exported file
