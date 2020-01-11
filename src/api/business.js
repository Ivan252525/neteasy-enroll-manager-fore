import request from '@/plugin/axios'
import util from '@/libs/util'

export function BusinessListApi (data) {
  return request({
    url: '/manager/business/business/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}
