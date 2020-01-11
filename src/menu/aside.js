// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '商家管理',
    icon: 'folder-o',
    children: [
      { path: '/businessList', title: '商家列表' }
    ]
  }
]
