/*
 * @Description: 
 * @Version: 2.0
 * @Autor: yifang
 * @Date: 2022-05-29 15:07:16
 * @LastEditors: yifang
 * @LastEditTime: 2022-05-29 18:42:09
 * @Author: laptop-fpejg53f
 */
import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/navigation/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/navigation/user/info',
    method: 'get',
    params: { token }
  })
}