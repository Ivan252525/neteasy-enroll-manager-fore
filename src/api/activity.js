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
