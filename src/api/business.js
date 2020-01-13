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

export function BusinessAddApi (data) {
  return request({
    url: '/manager/business/business/add',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function BusinessGetApi (businessId) {
  return request({
    url: '/manager/business/business/info/' + businessId,
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function BusinessEditApi (data) {
  return request({
    url: '/manager/business/business/edit',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function BusinessRemoveApi (businessId) {
  return request({
    url: '/manager/business/business/remove/' + businessId,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function BusinessAllApi () {
  return request({
    url: '/manager/business/business/all',
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}
