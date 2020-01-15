import request from '@/plugin/axios'
import util from '@/libs/util'

export function IndexActivityListApi (data) {
  return request({
    url: '/manager/index/activity/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function IndexActivityGetApi (indexActivityId) {
  return request({
    url: '/manager/index/activity/get/' + indexActivityId,
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function IndexActivityAddOrUpdateApi (data) {
  return request({
    url: '/manager/index/activity/addorupdate',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function IndexActivityRemoveApi (indexActivityId) {
  return request({
    url: '/manager/index/activity/remove/' + indexActivityId,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}
