/* Routes copied from the app's own route table (_build/route_table.json):
 *   Employee List  /employee
 *   Add Employee   /employee/add
 *   Edit Employee  /employee/:employeeId/edit
 *   View Employee  /employee-detail/:employeeId/<tab>
 * all under /people/<tenant>. */
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AppShell from './layout/AppShell'
import EmployeeListing from './screens/EmployeeListing'
import EmployeeView from './screens/EmployeeView'
import EmployeeForm from './screens/EmployeeForm'
import { peoplePath, TENANT } from './lib/tenant'

const crumbs = {
  list: [{ label: 'Employees' }],
  add:  [{ label: 'Employees', to: peoplePath('/employee') }, { label: 'Add Employee' }],
  edit: [{ label: 'Employees', to: peoplePath('/employee') }, { label: 'Edit Employee' }],
}

function ViewCrumbs() {
  const { tab = 'general-info' } = useParams()
  const label = {
    'general-info': 'General Info', timeline: 'Timeline', 'assets-allocated': 'Assets Allocated',
    'job-interviews': 'Job Interviews', 'interview-intimation': 'Client Interview Resource Allocation',
    projects: 'Projects',
  }[tab]
  return (
    <AppShell breadcrumb={[{ label: 'Employees', to: peoplePath('/employee') }, { label: 'View Employee' }, { label }]}>
      <EmployeeView />
    </AppShell>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={peoplePath('/employee')} replace />} />
      <Route path={`/people/${TENANT}`} element={<Navigate to={peoplePath('/employee')} replace />} />
      <Route path={`/people/${TENANT}/employee`} element={<AppShell breadcrumb={crumbs.list}><EmployeeListing /></AppShell>} />
      <Route path={`/people/${TENANT}/employee/add`} element={<AppShell breadcrumb={crumbs.add}><EmployeeForm mode="add" /></AppShell>} />
      <Route path={`/people/${TENANT}/employee/:id/edit`} element={<AppShell breadcrumb={crumbs.edit}><EmployeeForm mode="edit" /></AppShell>} />
      <Route path={`/people/${TENANT}/employee-detail/:id/:tab`} element={<ViewCrumbs />} />
      <Route path={`/people/${TENANT}/employee-detail/:id`} element={<ViewCrumbs />} />
      <Route path="*" element={<Navigate to={peoplePath('/employee')} replace />} />
    </Routes>
  )
}
