module.exports = (name, options) =>
  proto = Object.create HTMLElement.prototype
  document.registerElement name, prototype: Object.assign proto, options
