import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: () => import('@/view/Recommend'),
      children:[
        {
          path: ':id',
          component: () => import('@/view/Disc')
        }
      ]
    },
    {
      path: '/singer',
      component: () => import('@/view/Singer'),
      children:[
        {
          path: ':id',
          component: () => import('@/view/SingerDetail')
        }
      ]
    },
    {
      path: '/rank',
      component: () => import('@/view/Rank'),
      children:[
        {
          path: ':id',
          component: () => import('@/view/RankDetail')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('@/view/Search')
    },
  ]
})
