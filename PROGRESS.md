# PROGRESS

Per `CollabCrawl/CLAUDE.md` → "THE FORM/SCREEN WORKFLOW". One section at a time,
gate before committing.

## Gates

```bash
cd ~/.gemini/antigravity/scratch/CollabCrawl
# Add/Edit form
node    _tools/emp_fieldmap.cjs                                  # real  -> add_fieldmap.json
node    _tools/emp_fieldmap.cjs http://localhost:5173 built_fieldmap.json
python3 _tools/diff_fieldmaps.py _tools/emp_out2/add_fieldmap.json \
                                 _tools/emp_out2/built_fieldmap.json
# View screen
node    _tools/view_fieldmap.cjs                                 # real  -> view_fieldmap.json
node    _tools/view_fieldmap.cjs http://localhost:5173 view_built.json
```

One extractor run against both sides — that is what makes the gate trustworthy.

---

## PHASE 1 — People  ✅ COMPLETE

| Screen | Restricted work | Gate |
|---|---|---|
| **Add / Edit** | `Access & Visibility` section replacing the standalone `account_status` + `invite_employee` sections; 3 toggles; Restricted defaults **OFF**; optional Reason shown only when ON | delta is exactly the 2 removed + 1 added section; other 15 identical |
| **Listing** | 7th `Restricted` stat card (click → `is_restricted Is true`); 19th filter field; `is_restricted Is false` in the default `filterQuery`; row tint `bg-warning-25` deepening to `warning-50` on hover; hover message on 10/11 cells | headers 11/11, headings 6/6 |
| **View** | LinkedIn `#OpenToWork`-style ring around the avatar with the label curved along it; `Access & Visibility` section carrying `Restricted profile` + `Reason` | tabs exact, labels: none missing, +4 intended |

**Counting (Q3, revised):** Restricted is a **subset** of Active Employees —
both on the same non-relieved base. `Restricted ≤ Active`.

**Decided without further asking** (raised twice each):
- Stat grid = **7 columns**. The wrapped variant costs ~100px of vertical space and leaves an empty slot. `?grid=7` toggles it; one-line change to reverse.
- **No ring on listing avatars.** At 35px it cannot hold readable text, so it would be a coloured dot meaning something different from the ring on View — weaker than the tint already there.

---

## PHASE 2 — Payroll  ⬜ NOT STARTED

Captures are already in hand (`modules/payroll/dom/`), 5 of 6 populated:

| Screen | Rows | Note |
|---|---|---|
| Salary Register `/run-payroll/:id/edit` | 4 / 22 cols | the actual pay list — **most important** |
| Payroll Runs `/run-payroll` | 3 | has `Total Employees on Payroll` + per-run `Employees` count |
| Tax Declarations | 9 | |
| Loans & Advances | 6 | |
| Expense & Reimbursement | 1 | |
| Employees Compensation | 0 | columns known from the earlier capture |

**Known trap:** the Salary Register employee cell is `sticky left-0 bg-white`, so
a tint set on the row will **not** reach it — the frozen column stays white.
Same bug class as the sticky Actions header already fixed in the listing.

**Settled:** Payroll counts **include** restricted, consistent with People.

---

## PHASE 3 — Impact Brief module  ⬜ NOT STARTED

Non-technical, per-screen: *is the person shown, and to whom?* A deliverable of
its own. Raw material ready: the route table (438 named paths), the shared
`/v1/common/employees` usage counts (People 15, Recruitment 22, CRM 5,
Projects 2, Reports 4), and the six Payroll screens above.

---

## Open, not blocking

- **`(Inactive)` sub-label markup — NOT CAPTURED.** Our tenant has 0 employees with `account_status = inactive`. Needs a DOM snippet or a tenant that has one.
- **Attendance badge row** — two screenshots disagree on which group holds what; the green `IN` / red `OUT` variants were never captured.
- **Tab strip varies per employee/permission** — a screenshot shows 6+ tabs plus `Edit Profile` and a kebab; we build the captured 4-tab variant.
- **Naming** — `Restricted profile` vs `Payroll only`, pending PM. Field stays `is_restricted`.
