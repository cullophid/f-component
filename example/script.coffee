{h, component} = require '../src'

merge = (a, b) => Object.assign {}, a, b

component
  name: 'my-child'
  view: (dispatch, {state, props}) => h 'h1', {}, [props.title]
  update: (model, action) => model

component
  name: 'my-parent'
  view: (dispatch, {state, props}) =>
    h 'div', {},
      h 'input', {type: 'text', onInput: ({target}) => dispatch ['SET_TITLE', target.value]}
      h 'my-child', {'data-title': state.title}

  update: (state = {}, [type, payload]) =>
    switch type
      when 'SET_TITLE' then merge state, title: payload
      else state
