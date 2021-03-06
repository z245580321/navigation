import router from "./router"
import store from "./store"
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from "@/utils/get-page-title"
import { getToken } from "@/utils/auth"
import nprogress from "nprogress"

NProgress.configure({ showSpinner: false }) // NProgress 配置参数

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 设置标题
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (hasToken)
  {
    if (to.path === '/login')
    {
      next({ path: '/' })
      NProgress.done()
    } else
    {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles)
      {
        next()
      } else
      {
        try
        {
          // 获取角色权限
          const { roles } = await store.dispatch('user/getInfo')
          // 获取角色路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 添加路由
          for (let i = 0, length = accessRoutes.length; i < length; i += 1)
          {
            const element = accessRoutes[i]
            router.addRoute(element)
          }

          /* 已弃置 */
          // router.addRoute(accessRoutes)

          /*  */
          // next({ ...to, replace: true })
          router.push({ path: '/' }, () => { })
        } catch (error)
        {
          // 删除令牌，跳转登录页
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          nprogress.done()
        }
      }
    }

  } else
  {
    // 如果没有令牌
    if (whiteList.indexOf(to.path) !== -1)
    {
      // 白名单直接进入
      next()
    } else
    {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})