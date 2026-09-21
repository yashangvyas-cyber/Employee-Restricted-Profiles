# GAPS — what is copied, what is not, what I could not verify

Crawl date: **2026-09-21**. Tenant: **bluewhaletechnosoftpvtltd** (staging).
Reference library: `~/.gemini/antigravity/scratch/CollabCrawl`.

Read this before you treat anything in the prototype as a specification.

---

## 1. NOT CAPTURED — do not treat these as real

| Thing | Why it is missing | What the prototype does instead |
|---|---|---|
| **Create employee endpoint** | The Add form was never submitted against staging — that would have written a real record. | `POST /v1/employee` in `src/api/endpoints.js` is a **placeholder path**, flagged `NOT_CAPTURED: true`. The mock writes to memory only. |
| **Update employee endpoint** | Same reason. | `PUT /v1/employee/{id}` — also a **placeholder**. |
| **Validation messages** | Never captured — requires a failed submit against staging. | The prototype has **no validation messages at all**. Required markers (`*`) are copied; the messages are not invented. |
| **Sub-sidebar flyout item markup** | The flyout will not open in headless Chrome (hover and click both fail — confirmed across 4 attempts). | The **panel wrapper, heading and `<ul>` are copied** from the DOM (it ships collapsed at `w-[0px]`). The single item label "Employee List" comes from the app's own route table (`_build/route_table.json`) and your screenshot. **The per-item classes are mine, not copied.** |
| **`field_name` for 11 of 18 filter fields** | Those filters would not apply headlessly, so the server-side name never appeared in the URL. | Marked `verified: false` and `field_name: null` in `endpoints.js`, and shown with a `?` in the filter dropdown. **Do not ship these names.** |
| **View Employee tab contents** | The five non-General-Info tabs were captured as *pages*, but their table contents were not extracted. | Each tab renders a placeholder that says so. Route + tab label + tab strip styling are real. |

### Filter `field_name` — verified vs not

**VERIFIED** (read back from the live URL's `filterQuery` after applying the filter):

| Label | `field_name` | Operators |
|---|---|---|
| Name | `name` | Contains, Is |
| Email Type | `is_external_email` | Is |
| Timesheet Filling | `timesheet_filling` | Is |
| Employee Type | `employee_type` | Is |
| Status | `status` | Is, Is not |
| Account Status | `account_status` | Is |
| 2FA | `is_2fa_enabled` | Is |

**NOT VERIFIED** — label, icon and operator list are copied; the `field_name` is unknown:
Code, Business Unit, Department, Designation, Reporting To, Email, Mobile Number,
Gender, Joining Date, Confirmation Date, Blood Group.

> Note the two that would have been guessed wrong: `Email Type` is **`is_external_email`**,
> not `email_type`; `2FA` is **`is_2fa_enabled`**, not `two_fa`.

---

## 2. VERIFIED — captured from the wire, safe to build on

**`POST /v1/employee/list`** — one endpoint serves list, search, sort and pagination:

```jsonc
{ "page": 1, "per_page": 10 }                                  // plain load
{ "page": 2, "per_page": 10 }                                  // pagination
{ "page": 1, "per_page": 10, "sort_by": "name", "order": "DESC" }   // column sort
{ "page": 1, "per_page": 10,
  "filters": [{ "field_name": "name", "operator": "Contains", "value": "Bhu" }] }
```

Response envelope: `{ data: [...], meta: { code, message, total, page, per_page } }`.
Applied filters are also written to the URL as `?filterQuery=<the same array, url-encoded>`.

**`GET /v1/employee/status-counts`** — eight keys:
`total_employees, total_probation, total_notice_period, total_confirmed,
total_intern, total_yet_to_join, total_active_pip, total_flagged_pip`.

Also verified: `GET /v1/employee/{id}`, `GET /v1/employee/employee-details/{id}`,
and the 12 reference-data endpoints listed in `src/api/endpoints.js`.

---

## 3. How search actually works (this surprised me — check it)

**There is no free-text employee search on the listing.** The only text input is
`placeholder="Filter Results..."`, and it **searches the field list, not the employees**.

The real flow is: click the box → pick a field → pick an operator → type a value →
press **Filter**.

- **No request is sent until "Filter" is pressed** — there is no debounce and no
  search-as-you-type. I typed into the box and watched the network: **0 calls**.
- Global search is the magnifier in the header (Ctrl/Cmd K), a **separate feature
  that was not captured**.
- The `filter_00_closed.html` … `filter_06_value_typed.html` files in the library are
  from the **Skill Matrix** screen, not Employees. I did not use them and neither should you.

---

## 4. Known differences from the real screen

| # | Difference | Why |
|---|---|---|
| 1 | Main sidebar shows only **Employees**; sub-sidebar only **Employee List** | You asked for exactly this. |
| 2 | No portal switcher panel, notification modal, offline overlay, user menu, reCAPTCHA | Out of scope. This is most of the fidelity-score gap (see §5). |
| 3 | All personal data is **fake** | Masked for GitHub. Field names and types are unchanged. See §6. |
| 4 | Avatar colour per person | The **ten colour classes are copied**; the rule that picks one per person is mine — the app's rule was not captured. |
| 5 | `bg-orange` omitted from avatar colours | It appears on rows in the crawled DOM but **has no rule in the app's compiled CSS**, so it renders transparent there too. |
| 6 | Mock store persists to `sessionStorage` | Demo convenience so a refresh does not wipe an added employee. No counterpart in CollabCRM. Call `resetStore()` to clear. |
| 7 | Detail records exist for only **3** of 53 employees | Only 3 were captured. Others are synthesised from their list row, flagged `_synthesised: true` in the response meta. |
| 8 | "Experience" column = **tenure since `joined_date`**, computed client-side | Verified against real rows (joined 01-Jul-2026 → `2M`; 01-Apr-2020 → `6Y 5M`). The API does not return it. |

---

## 5. Fidelity scores — read these honestly

`_tools/verify_fidelity.py` diffs a build against the **whole crawled page**, including
all the chrome §4.2 says is deliberately absent. Against that baseline this prototype
scores **62% / 31% / 30%** (listing / view / edit) and reports FAIL. That number is
real but it is **not** a measure of whether the four screens are copies.

`_tools/verify_scoped.py` (written for this job) strips shared chrome from both sides:

| Screen | Table headers | Field names | Headings | Overall (scoped) |
|---|---|---|---|---|
| Listing | **100%** (11/11) | n/a | **100%** (6/6) | 64% |
| View | n/a | n/a | **100%** (1/1) | 41% |
| Edit | n/a | **100%** (11/11) | 0/1 † | 40% |

† The Edit `<h1>` is `"Edit Employee - <name>"`. The name differs because the data is
masked, so the string can never match. Structure and class string do match.

**The checks that can pass, pass at 100%.** The remaining "Design classes" and
"Icon classes" gap is dominated by chrome this prototype does not build — the portal
switcher, ten other sidebar modules, the header **New** menu (Add Asset, Add Department,
Add Designation, Add Holiday, …), the right-hand quick-link rail, the notification
modal and the offline overlay.

**I have not proven every remaining class difference is chrome.** If you need a
region-by-region diff of the content area alone, say so and I will do it.

---

## 6. Data masking

`_tools/emp_mask.py` in the crawl library. Names, emails, phone numbers, PAN, Aadhaar,
PF, UAN, addresses and the business-unit email domain / signing authority are replaced
with deterministic fakes — the same real person maps to the same fake person everywhere.
**Field names, nesting and value types are untouched.** Verified: zero occurrences of
any real staging name or `maildrop.cc` remain in `src/fixtures/`.

Employee codes (`TM-002`), departments, designations, dates and status values are **real**
— they are reference data, not personal data.

---

## 7. Things I did not do

- Did not push to GitHub, did not add a remote.
- Did not submit either form against staging.
- Did not build any screen outside the five you listed.
- Did not invent a validation message, an error state, or a success toast.
