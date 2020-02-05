import request from '@/plugin/axios'
import util from '@/libs/util'

export function CheckUserListApi (data) {
  return request({
    url: '/manager/activity/check/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function CheckUserRemoveApi (id) {
  return request({
    url: '/manager/activity/check/remove/' + id,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function SearchUserApi (userCode) {
  return request({
    url: '/manager/activity/check/search/' + userCode,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function CheckUserAddApi (data) {
  return request({
    url: '/manager/activity/check/add',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}
