{forEach, without} = require 'ramda'

module.exports = (reducer) =>
  model = reducer(null, {})
  subscribers = []
  dispatch = (action) =>
    model = reducer(model, action)
    forEach ((fn) => fn model), subscribers
    action

  getState = () => model

  subscribe = (subscriber) =>
    subscribers = [subscribers..., subscriber]
    () =>
      subscribers = without subscriber, subscribers

  {dispatch, subscribe, getState}
