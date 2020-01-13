import request from '@/plugin/axios'
import util from '@/libs/util'

export function ActivityListApi (data) {
  return request({
    url: '/manager/activity/activity/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}
