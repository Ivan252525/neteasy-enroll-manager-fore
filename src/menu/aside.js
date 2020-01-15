// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '商家管理',
    icon: 'folder-o',
    children: [
      { path: '/businessList', title: '商家列表' }
    ]
  },
  {
    title: '活动管理',
    icon: 'folder-o',
    children: [
      { path: '/activityList', title: '活动列表' }
    ]
  },
  {
    title: '首页管理',
    icon: 'folder-o',
    children: [
      { path: '/indexBannerManager', title: 'banner管理' },
      { path: '/indexActivityManager', title: '首页活动管理' },
      { path: '/indexBusinessManager', title: '首页商家管理' }
    ]
  }
]
