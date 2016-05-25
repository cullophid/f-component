## f-component

*Tiny (4Kb gzipped) framework for building webcomponents using (p)react/redux*


## defining components

```js
import 'document-register-element' // Needed in all browsers other than chrome
import {h, component} from 'f-component'

component({
  name: 'my-component',
  update: (state, [type, payload]) => {
    switch (type) {
      case 'SET_TITLE':
        return {...state, title: payload}
      default:
        return state
    }
  },
  view: (dispatch, {state, props}) => {
    return h('div',
      h('input', {type: 'text', onInput: ({target}) => dispatch(['SET_TITLE', target.value])}),
      h('h1', props.title)
    )
  },
})


```

## Using components

```html
<html>
<body>
  <my-component></my-component>
  <script src="/path/to/component-bundle.js"></script>
</body>
</html>
```
