# Where should a "Restricted profile" indicator go on this screen?

I need a UI/UX recommendation for placing a **permanent record-level flag** on an
HR system's employee detail screen. Attached is a screenshot of the left panel.

## The feature

An employee can be marked **Restricted** — a permanent property of the record,
not a status that changes. Restricted people are hidden from headcount reports,
from employee dropdowns and from listings in other portals, but stay visible in
the People and Payroll modules. Typical cases: directors on payroll, people on
garden leave, dormant accounts kept so salary/PF/TDS keep running.

Anyone opening the record must realise within about a second that it is
restricted. It must not be mistaken for a transient status.

## Screen structure (fixed, cannot be redesigned)

A **fixed-width left profile panel** — `326px` on large screens, `208px` below —
beside a scrolling right column.

**Left panel, top to bottom:**

| Zone | Contents | Notes |
|---|---|---|
| 1. Status badge row | `IN` (green) / `OUT` (red) / `YET TO CHECK-IN` (grey), plus leave tags `SH`, `SH-WFH`, `Leave` | `flex justify-between`, **no wrap**, two groups pushed to opposite ends. Up to 3 badges seen at once. All **transient** — they change during the day. |
| 2. Identity block | 120–160px round avatar · name · designation · department chip · **Send Password to Employee** button | Already 5 stacked elements, centred |
| 3. Property blocks | About Me · Business Unit · Experience (Previous / At company) · Skills · Badges Received · Seating Location + Extension Number | Each is a small grey label with a value beneath. Full panel width. These are **record properties**. |
| 4. Footer | **Give Feedback** button | |

**Right column:** tab strip (General Info · Timeline · Assets Allocated ·
Performance) with an `Edit Employee` button at the right; then a 3-up header card
(Email Address · Employee Code · Reporting Manager) in a fixed 3-column grid;
then detail sections (Personal Information, Employee Information, …).

## What has been tried and rejected

1. **In the status badge row (zone 1)** — rejected twice. No room: three badges already fill a 208px panel, and it does not wrap. Worse, it is semantically wrong — those badges are *today's* state, this flag is permanent.
2. **In the identity block (zone 2), under the department chip** — this is what the screenshot shows. Rejected by the reviewer: the block already holds five elements and a sixth makes it cramped.
3. **A text badge in the listing table** — separately rejected; there the row is simply tinted and a hover tooltip explains it.

## Constraints

- Cannot widen the panel or restructure the right column's 3-up card.
- Must not read as a transient/daily status.
- Must not rely on colour alone.
- The detail (including a free-text *Reason*) already appears lower down in an "Access & Visibility" section — so this indicator is for **recognition at a glance**, not explanation.

## Question

Where should the Restricted indicator go, and in what form — chip, icon,
tinted zone, label in a property block, something in the right column, or
something else? Please give a first choice with the reasoning, plus one
alternative, and say explicitly what each costs.
