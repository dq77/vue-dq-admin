import Cookies from 'js-cookie'
// import { validRange } from 'semver';

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRouterList(router) {
  return Cookies.set('routerlist', router)
}

export function getRouterList(router) {
  return Cookies.get('routerlist')
}

export function removeRouterList() {
  return Cookies.remove('routerlist')
}

export function getName() {
  return Cookies.get('username')
}

export function setName(token) {
  return Cookies.set('username', token)
}

export function removeName() {
  return Cookies.remove('username')
}
