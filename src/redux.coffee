
module.exports = (reducer) =>
  model = reducer(null, {})
  subscribers = []
  dispatch = (action) =>
    model = reducer(model, action)
    subscribers.forEach (fn) => fn model
    action

  getState = () => model

  subscribe = (subscriber) =>
    subscribers = [subscribers..., subscriber]
    () =>
      subscribers = subscribers.filter (sub) => sub != subscriber

  {dispatch, subscribe, getState}
