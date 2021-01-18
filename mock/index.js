const Mock = require('mockjs')
const { param2Obj } = require('./utils')

const user = require('./user/index')
const organization = require('./organization')
const permissionTemplate = require('./permission-template')
const application = require('./application')
const group = require('./group/index')
const groupUser = require('./group-user')
const action = require('./action')
const operation = require('./operation')
const role = require('./role')
const roleGroup = require('./role-group')
const rolePermission = require('./role-permission/index')

const mocks = [
  ...user,
  ...organization,
  ...permissionTemplate,
  ...application,
  ...group,
  ...groupUser,
  ...action,
  ...operation,
  ...role,
  ...roleGroup,
  ...rolePermission
]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

module.exports = {
  mocks,
  mockXHR
}

