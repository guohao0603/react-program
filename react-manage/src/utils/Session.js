const LOGIN_SESSION_NAME = 'sessionId'

export function isAuthenticated () {
  return _getUser(LOGIN_SESSION_NAME)
}

export function authenticateSuccess (value) {
  _setUser(value)
}

export function logout () {
  _setUser('')
}

function _getUser () {
  return sessionStorage.getItem(LOGIN_SESSION_NAME) || ''
}

function _setUser (value) {
  sessionStorage.setItem(LOGIN_SESSION_NAME, value)
}