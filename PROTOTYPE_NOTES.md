# Prototype notes — Restricted Profile

Decisions, risks and things that must reach a release note. Kept separate from
`GAPS.md` (what is/isn't captured) and `PROGRESS.md` (build status).

---

## Q3 — counting: DECIDED (revised 2026-09-22)

**Active Employees INCLUDES restricted profiles.**
Flag `excludeRestrictedFromOtherStatBoxes` is **dropped** — it was added under
the earlier reading and no longer applies.

Restricted is a **subset** of Active, not a sibling of it:

```
Restricted  ⊆  Active Employees
```

The earlier assertion `Active + Restricted = total non-relieved` is **void** —
it only held while the two were mutually exclusive. The acceptance test becomes:

```
every restricted employee also appears in the Active Employees count
Restricted count  <=  Active Employees count
```

### What this resolves
The **Active Employees label collision** between People and Payroll disappears.
Payroll's Employees Compensation has its own `Active Employees` card; under the
previous decision the same label would have shown two different numbers in two
portals. Both now count the same way. That was the open item from the Payroll
field map — closed by this decision.

### The distinction a developer must not blur
"Hidden from headcount" in the ticket does **not** mean the People stat card:

| Surface | Counts restricted? |
|---|---|
| People → Active Employees card | **Yes** — operational count inside the portal where HR can see them anyway |
| Payroll → Active Employees card | **Yes** |
| Payroll → Total Employees on Payroll, per-run Employees | **Yes** |
| Reports → Headcount & Diversity | **No** |
| Any other portal's listing or dropdown | **No** |

`Active Employees` is an in-portal operational count. *Headcount* is the
reporting surface. They are different numbers with different rules, and a
developer implementing a single global exclusion will get this wrong.

### Still no migration
The toggle defaults **OFF**, and nothing is excluded from Active Employees
anyway, so **no count moves on release day** under this reading either.

### Consequence worth noting
Because the number silently contains restricted profiles, the disclosure you
proposed — *"Includes N restricted profiles"* — matters **more**, not less. It is
the only thing telling a viewer the total is not purely regular staff.

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
> This employee will be hidden from headcount reports, and from dropdowns and
> listings in other portals. They will still be counted in Active Employees and
> remain visible in People and Payroll.

---

## Active Employees card — no change

The captured card contains **only** an `<h3>` label and the value `<div>`. There
is no subtext pattern anywhere in the stat cards; the sole `data-tooltip-id`
sits on the `+` icon, not the card. **No subtext or tooltip is being added.**

---

## For the release note

> **New: Restricted profiles.** Employees can be marked as a restricted profile —
> they remain counted in Active Employees and remain visible in People and
> Payroll, but are hidden from headcount reports, employee dropdowns and
> listings in other portals.

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

## Pending PM questions (not build blockers)

**Rename to "Payroll only"?**
Risk: *"Restricted"* may be read as an access setting rather than a headcount
exclusion — that is how the word is used across the products surveyed.
Keka's equivalent is *Private Profiles*.

**Decided for now:** the prototype uses **Restricted profile**, as the brief
says. Field name stays **`isRestricted`** (or the captured API naming style)
until the PM decides. The helper text carries the meaning.

---

## Reason field `[PROPOSED]`

An **optional, single-line Reason** input sits below the Restricted toggle and is
**shown only when the toggle is ON**. Reuses the form's captured text input
class. Its value goes into the audit trail alongside who and when.

---

## Scope decision — 2026-09-22 (from the PM discussion)

**Build order is now fixed:**

1. **People prototype screens — finish these first.** Impacts are handled on the People side.
2. **Payroll** — needed, but after People.
3. **Everything else is fine as-is** — those modules only need the person hidden, no screen work.

### New module to build later — "Impact Brief"  `[NOT STARTED]`

A module inside the prototype aimed at **non-technical readers**. For every
screen and sub-screen it states:

| Screen | Is the person shown? | If shown, who sees them? | Who does not? |
|---|---|---|---|

Rationale from the PM: there are too many modules, screens and sub-screens for
anyone to hold the impact in their head, and the question people actually ask is
*"will this person appear here, and to whom?"* — not *"which endpoint changed."*

This is a **deliverable of its own**, not a section of an existing screen. Do not
start it until the People screens are finished.

Raw material already on hand: the route table (438 named paths), the shared
`/v1/common/employees` dropdown usage counts (People 15, Recruitment 22, CRM 5,
Projects 2, Reports 4), and the six Payroll screens that carry an employee.
