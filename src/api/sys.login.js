import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/manager/sys/sys/login',
    method: 'post',
    data
  })
}
