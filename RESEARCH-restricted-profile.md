# Competitive research — hidden / payroll-only employee records

Phase 1 of the Restricted Profile ticket. **No code written yet.**
Research date: 2026-09-21.

---

## The headline

**No major HR product ships a "hide this employee" toggle.**

Every system I looked at solves this with **worker classification**, not a
visibility flag. The record is marked as *what the person is* — contingent
worker, contractor, non-employee — and then **each report decides whether that
class counts**. Visibility is handled separately, by permissions.

That is a meaningfully different design from the one in the ticket, and the
difference matters. More below.

---

## What each product actually does

| Product | Mechanism | Notes |
|---|---|---|
| **SAP SuccessFactors** | `IsContingentWorker` — a standard field on the `employmentInfo` HRIS element | A **classification flag**, not a hide flag. Downstream processes read it. |
| **Workday** | Worker object splits **Employee** vs **Contingent Worker** | The `All Active Employees` data source **excludes contingent workers by design**. Exclusion is a property of the data source, not of the person. |
| **BambooHR** | **Access Levels** + **directory sharing settings** | Who sees what is a permission question. Directory fields are governed centrally, not per-record. |
| **Keka** | Field-level profile privacy | Hides *fields* from other users, not the *person*. |

Two patterns, consistently:

1. **Classification, not concealment.** The record says what the person is; reports filter on it.
2. **Visibility via permissions, not via a per-record flag.** Nobody makes a single record invisible to everyone.

---

## The finding I'd want you to read twice

An employee record that is **paid by payroll** but **hidden from headcount and
from every listing** is the textbook definition of a **ghost employee** — the
single most common payroll fraud pattern, and exactly what forensic auditors
hunt for.

From the fraud literature:

- Ghost employee fraud is *"fictitious or inactive personnel remaining on payroll, collecting wages"* — an insider creates a record with a name, tax ID and a bank account they control.
- It thrives on *"weak internal controls, poor oversight, lack of duty segregation"*.
- The standard detection control is precisely *"reconciling headcounts with departmental managers"* and *"cross-checking payroll disbursements against active headcount"*.

**The ticket as written would build the concealment mechanism and remove the
detection control in the same change.** Restricted profiles are paid, invisible
in headcount, and absent from every listing outside Payroll.

I am **not** saying don't build it. The legitimate cases are real — directors on
payroll, retainers, consultants, dormant records kept for statutory reasons. But
a spec that ships this without controls is one an auditor will fail, and it is
the kind of thing that surfaces a year later as a finding.

### Controls the spec should carry

| Control | Why |
|---|---|
| **Permission-gated** — only a named role can set Restricted | Prevents the "insider with payroll access" path. Segregation of duties is the #1 recommended preventive control. |
| **Audit trail** — who set it, when, and why (a reason field) | Makes the flag accountable rather than silent. |
| **Never invisible to everyone** — Payroll + an Admin/Auditor role always see them | An "invisible to all" record is the fraud pattern itself. |
| **At least one report still counts them** | Preserves the headcount-reconciliation control that detection depends on. |

---

## Vocabulary — "Restricted" is the wrong word

Across these products **"restricted" consistently means access-restricted** —
*who is allowed to see this record*. It does not mean *this person is not a real
headcount employee*.

Calling the toggle **Restricted Profile** invites exactly the wrong reading: an
HR user will assume it controls permissions, not headcount. That misreading is
expensive on a payroll screen.

Better-aligned options, in order of my preference:

1. **Payroll Only** — says precisely what it is, matches the actual use case, and no one will misread it.
2. **Non-Employee** — the Workday/SAP framing; accurate but sounds harsh on a profile.
3. **Excluded from Headcount** — describes the effect rather than the thing; verbose but unambiguous.
4. ~~Restricted Profile~~ — collides with the established meaning of "restricted".

---

## My recommendation

**Keep the toggle, change the framing.**

A full worker-classification model is the "right" answer but it is a much larger
change — it would touch employment type, headcount reporting and every module's
data source. That is not what this ticket is, and I would not quietly expand it.

So: build the toggle as specced, but

1. **Rename it `Payroll Only`** (or your preferred alternative above) so it is not misread as an access control.
2. **Add a reason field** beside the toggle — one line, captured in the audit trail. Costs almost nothing and converts a silent flag into an accountable one.
3. **Permission-gate it** in the spec, even if the prototype does not enforce it.
4. **Keep them visible to Payroll and Admin** — already in the ticket for Payroll; extend to an admin/audit view.
5. **State in the spec that one report must still count them**, so the reconciliation control survives.

Points 2–5 are spec additions, not prototype work. They cost you nothing now and
save an audit conversation later.

---

## What this changes in the approved plan

| Plan item | Change |
|---|---|
| Toggle label | Was **Restricted Profile** → recommend **Payroll Only** *(your call)* |
| Combined section | Unchanged — still three toggles |
| Toggle description | Rewrite to match the new label |
| New | A **reason** field beside the toggle |
| New | Spec section on permissions, audit trail and the retained headcount report |
| Field naming | `is_payroll_only` / `payroll_only` if renamed |

Everything else in the approved plan stands.

---

## Sources

- [What Is A Headcount Report In HR? — Workday](https://www.workday.com/en-us/topics/hr/headcount-report.html)
- [The Workday Worker object — employees, contingent workers, data sources](https://irvineanalytics.ai/catalog/workday/objects/worker.html)
- [Managing Contingent Workers in Workday](https://www.cloudapper.ai/workday-help/workday-contingent-worker-management/)
- [SAP SuccessFactors and Contingent Workers — SAP Community](https://community.sap.com/t5/human-capital-management-blog-posts-by-members/sap-successfactors-and-contingent-workers/ba-p/13573055)
- [Selecting SAP SuccessFactors Employee Central HRIS Elements and Fields](https://learning.sap.com/learning-journeys/configuring-sap-successfactors-onboarding/selecting-sap-successfactors-employee-central-hris-elements-and-fields_db0f97c1-9d4c-407d-bdae-3cbe1799c319)
- [Access Levels in HR Software — BambooHR](https://www.bamboohr.com/blog/access-levels-bamboohr)
- [Employee Access Manual — BambooHR](https://help.bamboohr.com/s/article/639584)
- [How to hide certain details in the employee profile from other users — Keka](https://help.keka.com/hc/en-us/articles/39946688026385-How-to-hide-certain-details-in-the-employee-profile-from-other-users)
- [What is a Ghost Employee? — Safeguard Global](https://www.safeguardglobal.com/resources/what-is-a-ghost-employee/)
- [Ghost Employee Fraud: Strategies For Detection And Prevention — Papaya Global](https://www.papayaglobal.com/blog/ghost-employee-fraud-detection-and-strategies/)
- [Unmasking Ghost Employees — Aprio](https://www.aprio.com/insights-events/unmasking-ghost-employees-ins-article/)
- [Tightening Controls on Ghost Employees and Vendor Fraud — Moore Colson](https://moorecolson.com/news-insights/the-cost-of-the-unseen-tightening-controls-on-ghost-employees-and-vendor-fraud/)
- [Safeguarding Your Payroll by Detecting and Preventing Ghost Employees — Gloroots](https://www.gloroots.com/blog/payroll-detecting-and-preventing-ghost-employees)
