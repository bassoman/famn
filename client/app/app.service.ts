const feathers = require('feathers/client')
const socketio = require('feathers-socketio/client')
const io = require('socket.io-client')
const hooks = require('feathers-hooks')
const localstorage = require('feathers-localstorage')

const authentication = require('feathers-authentication/client')

import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import helpers from '../config/helpers'
import config from '../config/config'

@Injectable()
/**
 * Feathers websocket service
 * @return {class}
 */
export class SocketService {
  public socket: any
  private _app: any

  constructor() {
    this.socket = io(helpers.getHost())
    this._app = feathers()
      .configure(socketio(this.socket))
      .configure(hooks())
      .configure(authentication({
        tokenKey: config.tokenKey,
        storage: window.localStorage
      }))
  }

  getService(service) {
    return this._app.service(service)
  }

  authenticate(option?: any) {
    return this._app.authenticate(option)
  }

  logout() {
    return this._app.logout()
  }

  getUser() {
    return this._app.get('user')
  }

  getToken() {
    return this._app.get('token')
  }

  isLogin() {
      return this.getUser() ? true : false
  }
}



@Injectable()
/**
 * AuthGuard service is to provide client side router authorization
 */
export class AuthGuard implements CanActivate {
    constructor(private _socketService: SocketService, private _router: Router) {}

    canActivate() {
        if (this._socketService.isLogin()) return true
        this._router.navigate(['/'])
        return false
    }
}

