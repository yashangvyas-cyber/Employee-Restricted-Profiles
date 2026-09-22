# GAPS — what is copied, what is not, what I could not verify

Crawl date: **2026-09-21**. Tenant: **bluewhaletechnosoftpvtltd** (staging).
Reference library: `~/.gemini/antigravity/scratch/CollabCrawl`.

Read this before you treat anything in the prototype as a specification.

---

## 1. Gaps CLOSED on 2026-09-21 (second pass)

Four of the six original gaps are closed. None of it required writing to staging.
The method was to read the app's **own JS bundle** (it ships its filter config,
its form payload and its API calls in plain minified source) and to drive the
real UI in ways that cannot create records.

| Was missing | How it was closed | Result |
|---|---|---|
| Create/update endpoints | Read out of the bundle: `rn.post("/employee/add-edit", e)` | **One** endpoint, `POST /v1/employee/add-edit`, serves both Add and Edit |
| Create/update request body | The form's initial-values object in the bundle | Full nested payload — `EMPLOYEE_FORM_PAYLOAD` in `endpoints.js` |
| Create/update **response** | The bundle's own `onSuccess` handler for that call | `ADD_EDIT_RESPONSE` — and it revealed that saving is **two steps** (see below) |
| Validation messages | Submitted the Add form **empty** against staging — validation rejected it, **0 write requests fired**, nothing created | `"This is a required field."` and `"Please enter a valid email address."`, plus the 19 fields that error and the message's class |
| `field_name` for 11 of 18 filter fields | The bundle's filter config (`{id, label, operator, options, type}`) | **All 18** now real, with type and operators |
| Sub-sidebar flyout markup | Opened it by invoking the `<li>`'s own React `onClick` through the fiber — synthetic mouse events never worked | Panel, close button, heading, `<ul>`, `<li>`, item link and the trailing "add" link, all copied |

### My earlier placeholders were wrong in every dimension

I had guessed `POST /v1/employee` and `PUT /v1/employee/{id}`. The truth is a
single `POST /v1/employee/add-edit` — wrong path, wrong method, wrong count.
This is why they were flagged rather than quietly used.

### Two field names that would have been wrong

`Business Unit` → **`business_unit_id`** (not `business_unit`).
`Mobile Number` → **`personal_mobile`** (not `mobile_number`).

The seven field names I had confirmed live all matched the bundle exactly, which
is what makes the other eleven trustworthy.

### Saving an employee is TWO steps — easy to miss

The response's `meta` hands back **presigned upload URLs**. The client then PUTs
each attached file straight to storage:

```
1.  POST /v1/employee/add-edit   ->  meta: {
        code, message,
        upload_url, upload_file_headers,     // profile picture
        documentsUrl: [{ document_type_id, url, headers }],
        custom_file_urls: { <fieldKey>: { upload_url, headers } }
    }

2.  for each file:
      PUT <that url>  body: the file
          headers: { 'content-type': file.type, ...headers from meta }
```

`meta.code` uses `STATUS_CODE = {SUCCESS:1, FAIL:0, WARNING:2, SANDWICH_LEAVE:7}`.
On `FAIL` the app shows `meta.message` as a toast. On success it invalidates the
`get-employees-list` query, which is why the listing is already refreshed when
the form closes.

**A developer who implements only step 1 will ship a form that silently drops
every uploaded file.** That is the single most useful thing this pass found.

### The default filter — this explains your first screenshot

The flyout's "Employee List" link is not a bare route. It carries:

```
?filterQuery=[{"field_name":"status","operator":"Is not","value":"relieved"},
              {"field_name":"account_status","operator":"Is","value":"active"}]
```

So the two chips you saw on the real screen (`Status Is not Relieved`,
`Account Status Is Active`) are the **product's default**, applied whenever you
reach the listing from the sub-sidebar — not something a user had set. The
prototype reproduces this: entering via the flyout narrows 53 rows to 6.

---

## 1b. STILL NOT CAPTURED

| Thing | Why | What the prototype does |
|---|---|---|
| **Server-side validation / error envelope** | Only client-side validation was reachable without writing. | No server error handling. A failure surfaces as plain text. |
| **View Employee tab contents** | The five non-General-Info tabs were captured as *pages*; their table contents were not extracted. | Each renders a placeholder saying so. Route, tab label and tab-strip styling are real. |
| **Dropdown option values for 4 filter types** | `multi-dropdown` fields load their options from endpoints not yet traced. | The filter accepts free text for those. Field name, type and operators are real. |

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
| 4b | `name` added to the Address / About / Employer Remarks textareas | The real DOM leaves these unnamed. Added so developers and tests have a handle; it adds field names rather than changing any. |
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


---

## NOT CAPTURED — the inactive-profile row pattern (2026-09-22)

The Restricted row is meant to mirror how CollabCRM marks an **inactive**
profile: an `(Inactive)` sub-label under the employee code, plus a hover tooltip
*"This account is inactive."*

**It could not be captured.** The crawl tenant `bluewhaletechnosoftpvtltd` has
**0 employees with `account_status = inactive`**, so filtering the listing to
them returns an empty table. The pattern is visible only in the BA's screenshot
of the `yopmail` tenant, which our credentials cannot reach.

| Part | Status |
|---|---|
| Tooltip **mechanism** (`data-tooltip-id` + react-tooltip) | **COPIED** — 38 uses in the captured listing |
| Tooltip **wording** for restricted | **PROPOSED** — *"This profile is restricted."* |
| Tooltip **styling** (the dark box in the screenshot) | **NOT CAPTURED** — the prototype uses the native `title` so hover works |
| The `(Inactive)`-style **sub-label under the code** | **NOT CAPTURED** — not built; the BA asked for hover only |

To close this: either a DOM snippet of one inactive row, or credentials for a
tenant that has one.

---

## The attendance / leave badge row — a real constraint (2026-09-22)

The left profile panel's top row carries **today's transient state**, and the BA
confirmed it can hold three badges at once:

| Badge | Meaning |
|---|---|
| `SH` | leave tag (second half) |
| `SH-WFH` | second-half work from home |
| `YET TO CHECK-IN` | attendance — **turns green for In, red for Out** |

**Measured capacity** (`flex gap-x-1 items-center`, **no `flex-wrap`**, inside a
fixed `2xl:w-[326px] / w-[208px]` panel):

| Panel | Available | 3 badges | + a Restricted badge |
|---|---|---|---|
| 2xl (326px) | 278px | 240px ✓ | **336px ✗** |
| below 2xl (208px) | 184px | **240px — already overflows today** | 336px ✗ |

So a fourth badge is not viable, and the row is **already tight without us** at
the smaller breakpoint.

**Decision: Restricted does NOT go in that row.** Beyond the space, it is the
wrong place semantically — those three are *today's* state and change through
the day, while Restricted is a permanent property of the record. It now sits in
the identity block, under the department chip, with the full panel width.

### Correction after the BA's screenshots (2026-09-22)

Two things I had wrong above.

**1. The row is two groups, not one packed list.** The container is
`flex justify-between gap-x-1` — a LEFT group and a RIGHT group pushed to
opposite ends. Our capture contained only the left group, because the tenant had
no leave tag, so I measured the badges as if they all packed together. They do
not.

**2. The attendance badge has more states than we captured.** A screenshot shows
a green **`IN`** badge. So at minimum: `YET TO CHECK-IN` (grey), `IN` (green),
and presumably an `OUT` (red) that still has not been seen.

**Observed across two screenshots — and they do not agree on placement:**

| Screenshot | Left | Right |
|---|---|---|
| Employee A | `SH`, `SH-WFH`, `YET TO CHECK-IN` (packed together) | — |
| Employee B (Super User) | `IN` (green) | `Leave` (red) |

I cannot reconcile which group holds what from screenshots alone, and I am not
going to guess. **To close this properly: a DOM capture of one profile whose row
has BOTH groups populated.**

**What does not change:** Restricted still does not belong in this row. It is
today's state versus a permanent property of the record, and that argument is
independent of the layout. The badge stays in the identity block.

**Also unresolved:** whether three badges genuinely overflow at the 208px
breakpoint. My earlier arithmetic assumed a single packed group; with
`justify-between` the geometry differs. Flagged rather than restated as fact.

### Tab strip varies far more than we built

The same screenshot shows **6+ tabs** — General Info, Timeline, Assets
Allocated, Job Interviews, Client Interview Resource Allocation, Client
Interview… — plus **two** action buttons (`Edit Employee` **and** `Edit
Profile`) and a kebab menu.

The prototype builds the 4-tab variant captured for our tenant
(General Info, Timeline, Assets Allocated, Performance) with one button. The tab
set and the actions are clearly **per-employee / per-permission**; the richer
variant above is a user viewing their own profile. **Not built.**
