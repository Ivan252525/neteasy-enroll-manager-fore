import request from '@/plugin/axios'
import util from '@/libs/util'

export function BannerListApi (data) {
  return request({
    url: '/manager/index/banner/list',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function BannerGetApi (indexBannerId) {
  return request({
    url: '/manager/index/banner/get/' + indexBannerId,
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function BannerAddOrUpdateApi (data) {
  return request({
    url: '/manager/index/banner/addorupdate',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function BannerRemoveApi (indexBannerId) {
  return request({
    url: '/manager/index/banner/remove/' + indexBannerId,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}
