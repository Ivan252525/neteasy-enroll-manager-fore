import request from '@/plugin/axios'
import util from '@/libs/util'

export function IndexBusinessListApi (data) {
  return request({
    url: '/manager/index/business/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function IndexBusinessGetApi (indexBusinessId) {
  return request({
    url: '/manager/index/business/get/' + indexBusinessId,
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function IndexBusinessAddOrUpdateApi (data) {
  return request({
    url: '/manager/index/business/addorupdate',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function IndexBusinessRemoveApi (indexBusinessId) {
  return request({
    url: '/manager/index/business/remove/' + indexBusinessId,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}
