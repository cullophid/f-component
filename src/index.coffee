{render, h} = require 'preact'
registerElement = require './register'
redux = require './redux'

exports.h = h

exports.component = ({name, view, update}) =>
  vdom = null
  {dispatch, subscribe, getState} = redux(update)
  renderView = (state, props, parent) =>
    vdom = render (view dispatch, {props, state}), parent, vdom
  unMount = null

  lifeCycle =
    createdCallback: () ->
      console.log 'created'

    attachedCallback: () ->
      unMount = subscribe (state) =>
        renderView state, this.dataset, this

      renderView getState(),this.dataset, this

    detachedCallback: () ->
      unMount()

    attributeChangedCallback: (args...) ->
      renderView getState(), this.dataset, this

  registerElement name, lifeCycle
