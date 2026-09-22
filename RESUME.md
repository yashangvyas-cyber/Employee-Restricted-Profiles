# RESUME — read this first after a /compact or a new session

Everything needed to continue is on disk. **Do not rebuild from memory.**
Three screens were hallucinated in this project by starting from remembered
labels instead of a spec. The fix is mechanical and below.

---

## The rule

1. **Read the spec for the screen.** Never open the DOM dump — they are 75–150 KB and will eat the context.
2. **Build by pasting** class strings from that spec.
3. **Run the gate.** Paste its output before saying a screen is done.

A build that was not gated is an unverified build. Say so plainly.

---

## Where things stand

- **People — COMPLETE** (Add/Edit, Listing, View). All gated. See `PROGRESS.md`.
- **Payroll — NOT STARTED.** Specs are generated and waiting (below).
- **Impact Brief module — NOT STARTED.**

Pushed to `git@github.com:yashangvyas-cyber/Employee-Restricted-Profiles.git`

---

## Payroll: the six screens and their specs

Specs are already generated. Each lists stat cards, toolbar, filter fields,
table headers in order, sticky cells, a sample row cell-by-cell, and pagination
— every string copied from the capture.

| # | Screen | Spec file (`CollabCrawl/modules/payroll/specs/`) | Headers |
|---|---|---|---|
| 1 | Salary Register `/run-payroll/:id/edit` | `run_payroll_salary_register.listing.md` | 21 |
| 2 | Payroll Runs `/run-payroll` | `run_payroll_2026-09-22.listing.md` | 13 |
| 3 | Employees Compensation | `employees_compensation.listing.md` | 14 |
| 4 | Loans & Advances | `loans_advances.listing.md` | 12 |
| 5 | Expense & Reimbursement | `expense_management.listing.md` | 9 |
| 6 | Tax Declarations | `tax_declarations.listing.md` | 9 |

Regenerate any of them (static, no browser, no login, cheap):

```bash
cd ~/.gemini/antigravity/scratch/CollabCrawl
python3 _tools/listing_fieldmap.py payroll <screen>
```

---

## What to do on each screen

Same treatment as People — **tint + hover tooltip, no badge**:

- row gets `bg-warning-25`, deepening to `hover:bg-warning-50`
- hover message `This profile is restricted.` on every cell except Actions
- reuse `ROW_TINT` from `src/components/primitives.jsx`

### Traps, already verified

**Sticky cells do not inherit a row tint** — they paint their own background, so
the frozen column stays white against a tinted row. Tint them explicitly.

| Screen | Sticky |
|---|---|
| Salary Register | `sticky left-0` — the **employee cell** |
| All other five | `sticky right-0` — the **Actions cell** (solved already in `EmployeeListing.jsx`, copy that approach) |

**Payroll Runs has no employee rows** — it has two *counts* instead:
`Total Employees on Payroll` (stat card) and a per-run `Employees` column. Both
**include** restricted. This is where the *"Includes N restricted profiles"*
disclosure belongs.

**Employees Compensation has its own `Active Employees` card.** Includes
restricted, matching People, so the label means the same number in both portals.

**Tax Declarations feeds statutory output (PF/ESI/24Q).** Those are legally
employees — the exclusion must NOT propagate there. Two code paths, deliberately.

---

## Gates

```bash
cd ~/.gemini/antigravity/scratch/CollabCrawl

# Add/Edit form — must stay MATCHES ✅
node    _tools/emp_fieldmap.cjs http://localhost:5173 built_fieldmap.json
python3 _tools/diff_fieldmaps.py _tools/emp_out2/add_fieldmap.json \
                                 _tools/emp_out2/built_fieldmap.json

# View screen
node    _tools/view_fieldmap.cjs http://localhost:5173 view_built.json
```

Dev server: `cd <prototype> && npm run dev` → http://localhost:5173

---

## Decisions already made — do not reopen

| | |
|---|---|
| Counting | Restricted is a **subset** of Active Employees. `Restricted ≤ Active`. |
| Listing marker | **No badge.** Row tint + hover, mirroring how the app marks inactive. |
| View marker | LinkedIn `#OpenToWork` ring: photo shrinks, **complete** ring around it, label curved along the bottom via SVG `textPath`. `src/components/RestrictedAvatar.jsx` |
| Stat grid | **7 columns** (`?grid=7` toggles). |
| Listing avatars | **No ring** — at 35px it cannot hold text. |
| Toggle default | **OFF**, so no count moves on release day. |
| Field name | `is_restricted`. Rename to *Payroll only* is a pending PM question, not a build item. |

---

## Open, needs the BA

- **`(Inactive)` sub-label markup — NOT CAPTURED.** Our tenant has 0 employees with `account_status = inactive`. Needs a DOM snippet or a tenant that has one.
- **`Export Salary Register`** — does the exported file mark restricted rows? Not captured.
