import userHome from '../../../views/Admin/Users/Users'
import userList from '../../../views/Admin/Users/components/List'
import userDetail from '../../../views/Admin/Users/components/Detail'

export default {
  path: 'users',
  // name: 'adminUserHome',
  component: userHome,
  children: [
    {
      path: '',
      name: 'adminUser',
      component: userList,
    },
    // 사용자 관리 > 회원관리 > 회원목록
    {
      path: 'list',
      name: 'adminUserList',
      component: userList,
    },
    // 사용자 관리 > 회원관리 > 회원상세/수정 > 기본정보
    {
      path: 'add',
      name: 'adminUserAdd',
      component: userDetail,
    },
    {
      path: ':id',
      name: 'adminUserEdit',
      component: userDetail,
      meta: { tagview: 'user' }
    }
  ]
}
