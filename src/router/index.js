import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/boards',
    children: [
      {
        path: '/boards',
        name: 'Boards',
        component: () => import('@/views/boards/index'),
        meta: { title: '應用程式看板', icon: 'dashboard' }
      },
      {
        path: '/boards/process',
        name: 'Process',
        component: () => import('@/views/boards/process'),
        meta: { title: '新增應用程式', noCache: true, roles: ['admin', 'developer']},
        hidden: true
      }
    ]
  },
  {
    path: '/actions',
    component: Layout,
    children: [
      {
        path: '/actions',
        name: 'Actions',
        component: () => import('@/views/actions/index'),
        meta: { title: '功能管理', icon: 'menu', roles: ['admin', 'developer'] }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    children: [
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: '/permission',
        name: 'RolePermission',
        component: () => import('@/views/permission/index'),
        meta: { title: '權限管理', icon: 'el-icon-key' }
      }
    ]
  },
  {
    path: '/group',
    component: Layout,
    children: [
      {
        path: '/group',
        name: 'Group',
        component: () => import('@/views/group/index'),
        meta: { title: '群組管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/backend-platform',
    component: Layout,
    name: '後台管理',
    meta: { title: '後臺管理', icon: 'el-icon-monitor', roles: ['admin', 'developer']},
    children: [
      {
        path: 'organization-setting',
        name: '組織設定',
        component: () => import('@/views/organization-setting/index'),
        meta: { title: '組織設定', roles: ['admin', 'developer']  }
      },
      {
        path: 'operation-template-setting',
        name: '操作功能範本設定',
        component: () => import('@/views/operation-template-setting/index'),
        meta: { title: '操作功能範本設定', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
