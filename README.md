# CollabCRM — Employee Module Prototype

A copy-fidelity prototype of **People → Employees** from CollabCRM staging, built so
developers can see exactly what to build.

```bash
npm install
npm run dev      # http://localhost:5173
```

Opening `/` redirects to the employee list.

## Screens

| Screen | Route |
|---|---|
| Employee listing (incl. filter/search, sort, pagination, empty state) | `/people/bluewhaletechnosoftpvtltd/employee` |
| Add Employee | `/people/bluewhaletechnosoftpvtltd/employee/add` |
| View Employee | `/people/bluewhaletechnosoftpvtltd/employee-detail/:id/general-info` |
| Edit Employee | `/people/bluewhaletechnosoftpvtltd/employee/:id/edit` |

Routes are the app's own, taken from its shipped route table.

## Read `GAPS.md` first

It lists exactly what is copied from the real system, what is **not captured**
(the create/update endpoints and all validation messages, among others), and the
known differences. Nothing in this prototype was invented without being named there.

## How the fidelity is achieved

- **CollabCRM's own compiled stylesheet** ships in `public/collabcrm/collabcrm-app.css`
  (crawled from staging 2026-09-21), with its real fonts — Inter var and the `icomoon`
  icon font — vendored alongside. Class strings in the JSX are pasted from the crawled
  DOM, so they resolve against the app's real CSS rather than an approximation.
- Tailwind is configured to match (`2xl` = 1536px, `3xl` = 1620px,
  `2xl-to-xl` = 1500–1680px) but is **glue only**, with preflight disabled.

## Layout scope

Per the brief: the main sidebar shows **only Employees**, and the sub-sidebar shows
**only Employee List**. The header is copied as-is.

## Swapping the mocks for real calls

```
src/api/endpoints.js   every real path, method and request shape, with each one
                       marked VERIFIED or NOT CAPTURED
src/api/mockApi.js     the mock implementation + a `request()` helper already
                       pointed at the real API base
src/fixtures/*.json    captured responses, personal data masked (GAPS.md §6)
```

`mockApi.js` is the only file that knows the data is fake. Every screen calls it
through functions named after the endpoints, so replacing the bodies with `request()`
calls is the whole migration.

## Project layout

```
src/
  api/        endpoints.js · mockApi.js
  fixtures/   employee-list.json · status-counts.json · detail-*.json
              editdata-*.json · dropdowns.json
  layout/     AppShell · Header · Sidebar (+ sub-sidebar) · Breadcrumb
  screens/    EmployeeListing · EmployeeView · EmployeeForm (add + edit)
  components/ StatCard · FilterBar · Pagination · primitives
  lib/        tenant.js
public/collabcrm/
  collabcrm-app.css     CollabCRM's compiled stylesheet
  assets/               Inter var, icomoon, Font Awesome, logo.svg
```

`EmployeeForm` serves both Add and Edit, because the real app renders the same form
for both routes.
