import Users from './modules/users'
import adminHome from '../../views/Admin/Admin'

export default {
  path: '/admin',
  name: 'admin',
  component: adminHome,
  children: [
    Users
  ]
}
