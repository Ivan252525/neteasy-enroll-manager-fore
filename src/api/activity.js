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

export function ActivityAddApi (data) {
  return request({
    url: '/manager/activity/activity/add',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function ActivityGetApi (activityId) {
  return request({
    url: '/manager/activity/activity/get/' + activityId,
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function ActivityEditApi (data) {
  return request({
    url: '/manager/activity/activity/edit',
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    },
    data
  })
}

export function ActivityRemoveApi (activityId) {
  return request({
    url: '/manager/activity/activity/remove/' + activityId,
    method: 'post',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}

export function ActivityAllApi () {
  return request({
    url: '/manager/activity/activity/all',
    method: 'get',
    headers: {
      'token': util.cookies.get('token')
    }
  })
}
