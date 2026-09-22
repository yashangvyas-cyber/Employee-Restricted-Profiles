# Competitive research — hidden / payroll-only employee records

Phase 1 of the Restricted Profile ticket. **No prototype code written yet.**
First written 2026-09-21. **Corrected 2026-09-22.**

---

## ⚠️ Correction — the original headline was wrong

The first version of this file claimed:

> ~~**No major HR product ships a "hide this employee" toggle.**~~

**That is false.** Keka ships almost exactly this feature, called **Private
Profiles**. My searches used generic terms ("confidential employee", "exclude
from headcount") and returned generic answers; Keka's help centre also blocks
automated fetching (HTTP 403), so it never surfaced.

**The BA found it by searching properly.** The competitor findings below are
theirs, not mine. I have kept only the parts of my original research that
survive — the classification pattern in Workday/SAP, and the fraud risk.

---

## Keka — "Private Profiles" (the closest match to this ticket)

| | |
|---|---|
| **What it does** | Admins mark certain employee profiles private. They are hidden from all employees **except privileged users** — Global Admin, HR Executives, Managers. |
| **Where the control lives** | **NOT a toggle on the Add Employee form.** A separate list page: **Org → Employees → Private Profiles** |
| **How you add someone** | Search their name under **"Add employee to hide"** |
| **How you remove someone** | A delete icon beside the name, **or** multi-select several and remove together, then a **Confirm** popup |
| **Related capability** | Keka can also restrict who sees whom by **Legal Entity** or **Business Unit** |

**This matters for our design.** Keka's control is a *managed list*, not a field
on the employee record. That is a real alternative to the ticket's approach, and
it is also the natural home for **bulk** marking.

Source: [How to Add or remove an employee from private profile — Keka](https://help.keka.com/hc/en-us/articles/39946617176977-How-to-Add-or-remove-an-employee-from-private-profile)

---

## The rest of the market

| Product | How it's done | Where the control is | Bulk? | Payroll indicator? |
|---|---|---|---|---|
| **Keka** | Private Profiles — hidden except privileged roles | Separate list page | Bulk remove | Not found |
| **greytHR** | **Disable Portal Access** — stops login without deleting the record, so data stays for payroll, statutory compliance and audit. Independent of termination (extended leave, suspension) | Separate action page | Not found | Not found |
| **Zoho Payroll (India)** | Two checkboxes **on the Add Employee form**: *Director/Employee with substantial interest* (≥20% voting power, feeds Form 12BA) and *Enable Portal Access* | On the form | Yes | Not found |
| **Personio** | No real feature. Admins can hide org-chart cards only for employees with no supervisors or reports. Personio's own answer to "hide someone on payroll but not working": make them inactive. Customers build custom permission rules or move people to dummy departments as workarounds | — | — | — |
| **Google Workspace** | Per-user **Directory sharing** off → no autocomplete in Gmail/Calendar, absent from Contacts and search | User profile | Yes (API) | N/A |
| **Workday** | Worker object splits **Employee** vs **Contingent Worker**; the `All Active Employees` data source excludes contingent workers by design | Classification on the record | — | — |
| **SAP SuccessFactors** | `IsContingentWorker` on the `employmentInfo` HRIS element | Classification field | — | — |

### Two patterns worth separating

1. **Hide the person** — Keka Private Profiles, Google Directory sharing.
2. **Separate "can log in" from "exists in payroll"** — greytHR's *Disable Portal Access*, Zoho's *Enable Portal Access*.

CollabCRM already has the second one: `Account Status` ("If disabled, the
employee will not be able to login to the portal"). **Restricted must not be
conflated with it** — greytHR and Zoho both keep these as separate controls, and
so should we.

---

## Where CollabCRM would be ahead

The BA's research found **no competitor with a stat box for hidden profiles, and
none with a visual badge in payroll.** Those two ideas in this ticket are genuinely
ahead of the market.

(Darwinbox, BambooHR and Rippling could not be checked — their public docs do not
cover this.)

---

## The risk — independently reached by both of us

An employee record that is **paid by payroll** but **hidden from headcount and
every listing** is the textbook **ghost employee** pattern, the most common
payroll fraud, and exactly what forensic auditors hunt for.

- It thrives on *"weak internal controls, poor oversight, lack of duty segregation"*.
- The standard detection control is *"reconciling headcounts with departmental managers"* — the very control this feature weakens.

The legitimate cases are real: directors and founders taking a salary, family
members on payroll, people on garden leave or notice, dormant accounts kept so
salary/PF/TDS keep running. So the answer is controls, not refusal:

| Control | Why |
|---|---|
| **Permission-gated** — only a named role can set it | Blocks the "insider with payroll access" path |
| **Audit trail** — who, when, off→on, and a reason | Makes the flag accountable rather than silent |
| **Never invisible to everyone** — Payroll + Admin always see them | An invisible-to-all record *is* the fraud pattern |
| **At least one report still counts them** | Preserves the reconciliation control |
| **Payroll run shows the count** | e.g. "Includes 3 restricted profiles" |

---

## Naming

Across these products **"restricted" generally means access-restricted** — who
may *see* the record — which risks being read as a permission setting rather than
a headcount exclusion.

| Option | Pros | Cons |
|---|---|---|
| **Restricted profile** | Matches the brief | Reads as "restricted access" or "blocked" |
| **Private profile** | Keka users recognise it | Sounds like a privacy setting the employee controls |
| **Payroll-only profile** | Says exactly what it is | Longer |

**BA's decision:** *Restricted profile*, plus helper text — *"Only visible in
People and Payroll. Hidden from headcount, dropdowns and listings in other
portals."* The helper text carries the meaning the label alone does not.

---

## What this changes in the plan

| Item | Status |
|---|---|
| Toggle on the Add/Edit form | **Keep** — Zoho does put this class of control on the form |
| Bulk marking from the People list | **Add** — this is Keka's model, and the natural home for bulk |
| Keep Restricted separate from Account Status | **Confirmed** by greytHR and Zoho |
| Permission gate + audit trail + reason | **Add to the spec** |
| Stat box + payroll badge | **Keep** — no competitor has these |

---

## Sources

Competitor findings: the BA's research, 2026-09-22.

- [How to Add or remove an employee from private profile — Keka](https://help.keka.com/hc/en-us/articles/39946617176977-How-to-Add-or-remove-an-employee-from-private-profile)
- [Disable Portal Access — greytHR](https://www.greythr.com/)
- [Zoho Payroll — adding employees](https://www.zoho.com/in/payroll/help/adding-employees.html)
- [Personio — hiding employees from the org chart](https://support.personio.de/)
- [Google Workspace — Directory sharing](https://support.google.com/a/answer/60218)
- [The Workday Worker object](https://irvineanalytics.ai/catalog/workday/objects/worker.html)
- [SAP SuccessFactors and Contingent Workers](https://community.sap.com/t5/human-capital-management-blog-posts-by-members/sap-successfactors-and-contingent-workers/ba-p/13573055)
- [What is a Ghost Employee? — Safeguard Global](https://www.safeguardglobal.com/resources/what-is-a-ghost-employee/)
- [Ghost Employee Fraud — Papaya Global](https://www.papayaglobal.com/blog/ghost-employee-fraud-detection-and-strategies/)
