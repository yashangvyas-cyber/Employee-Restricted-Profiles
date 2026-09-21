# Prototype notes — Restricted Profile

Decisions, risks and things that must reach a release note. Kept separate from
`GAPS.md` (what is/isn't captured) and `PROGRESS.md` (build status).

---

## Q3 — counting: DECIDED

**Active Employees EXCLUDES restricted profiles.**
Flag: `excludeRestrictedFromOtherStatBoxes = true`.

**No migration needed.** The Restricted toggle defaults **OFF**, so no customer's
count changes on release day. A count only moves when HR marks someone
restricted — a deliberate act, by a person, with a confirm step.

**Definition parity (acceptance test):** the Restricted stat box uses the *same*
base definition as Active Employees — **non-relieved only**. Therefore:

```
Active Employees + Restricted Employees = total non-relieved
```

This must be an assertion in the test suite, not a comment.

### Today's baseline, for the test
Tenant `bluewhaletechnosoftpvtltd`: 53 employees — 47 relieved, 5 confirmed,
1 probation. `total_employees` = **6** = non-relieved. With 2 marked restricted
the cards must read Active **4** / Restricted **2**, summing to 6.

---

## Confirm on enabling Restricted — component IS captured

Source: `modules/project-mgmt/dom/c2_row_action.html` (a Delete Resource confirm).
Reusable as-is. Structure:

| Part | Class |
|---|---|
| Title | `text-gray-900 font-semibold 2xl:text-lg 2xl-to-xl:text-base text-base pt-1` |
| Body | `mt-1 text-gray-600 font-normal text-sm` wrapping `<div class="mb-3">` |
| **Remarks field** | `label` + `text-error-500 pe-1` required marker + `0/1000` counter |
| Footer | `w-full gap-x-3 flex pt-4 justify-between` |
| Cancel | `…!bg-white border border-gray-300 !text-gray-700…w-full` |
| Confirm | `…w-full font-semibold…bg-error-600` (destructive) / `bg-indigo-600` (primary) |

**Notable:** the captured confirm already carries a **required Remarks textarea
with a character counter**. That is precisely the audit "reason" field the
research recommended — so it is a copy, not an invention. Strongly suggests
reusing it verbatim for the Restricted confirm.

**One choice to make:** the captured confirm button is `bg-error-600`
(destructive). Marking someone restricted is not destructive, so the primary
`bg-indigo-600` variant is more appropriate — both classes are captured. Flagged
rather than chosen silently.

### Confirm copy  `[PROPOSED]`
> This employee will not be counted in Active Employees or headcount, and will be
> hidden from dropdowns and listings in other portals. They will still appear in
> People and Payroll.

---

## Active Employees card — no change

The captured card contains **only** an `<h3>` label and the value `<div>`. There
is no subtext pattern anywhere in the stat cards; the sole `data-tooltip-id`
sits on the `+` icon, not the card. **No subtext or tooltip is being added.**

---

## For the release note

> **Active Employees now excludes restricted profiles.** Employees marked as a
> restricted profile are counted in the new Restricted Employees box instead.
> Existing counts are unaffected until someone is marked restricted.

---

## Developer risks

### 1. Historical headcount may be retroactively rewritten
If headcount reports are computed **live** from the current `restricted` flag,
marking someone restricted today will change **past months'** numbers — a report
run in January would produce a different answer if re-run in March.

**Decision needed:** does exclusion apply

- **(a)** from the date the profile was marked restricted (point-in-time, needs an effective-dated flag or an audit-trail lookup), or
- **(b)** globally and retroactively (simpler, but past reports silently change)?

**(a)** is correct for anything anyone has already filed or presented. **(b)** is
what a naive implementation will do by default. This must be settled before the
backend work starts — it is a schema decision, not a UI one.

### 2. Statutory reporting must NOT inherit the exclusion
PF / ESI / TDS-24Q are legally employees. If exclusion is implemented at the
query layer (the obvious approach), statutory output will silently drop these
people and create a compliance defect.

*Management* headcount excludes them. *Statutory* reporting includes them. Two
code paths, deliberately.

### 3. Celebration feeds can leak a hidden person
Birthday / anniversary / new-joiner posts would expose a restricted profile.
CollabCRM's People dashboard has such a feed — captured in
`modules/people/dom/dashboard_post_rte_slash.html` — so this is a real surface.

---

## Naming still open

Research found **"restricted" means access-restricted** across every product
surveyed, which risks being read as a permission setting rather than a headcount
exclusion. Alternatives considered: *Private Profile* (Keka's term), *Payroll
Only*. Current direction is **Restricted profile + helper text**, per the BA.
