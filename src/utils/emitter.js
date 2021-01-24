import { EventEmitter } from 'events'

class Emitter extends EventEmitter {
  $emit(eventName, cargo) {
    this.emit(eventName, cargo)
  }
  $on(eventName, callback) {
    this.on(eventName, callback)
  }
  $off(eventName, callback) {
    this.removeListener(eventName, callback)
  }
  $offAll(eventName) {
    if (typeof eventName === 'string') {
      this.removeAllListeners(eventName)
    } else {
      eventName.forEach(e => { this.removeAllListeners(e) })
    }
  }
}

export default new Emitter()
