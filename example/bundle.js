(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var component, h, merge, ref;

ref = require('../src'), h = ref.h, component = ref.component;

merge = (function(_this) {
  return function(a, b) {
    return Object.assign({}, a, b);
  };
})(this);

component({
  name: 'my-child',
  view: (function(_this) {
    return function(dispatch, arg) {
      var props, state;
      state = arg.state, props = arg.props;
      return h('h1', {}, [props.title]);
    };
  })(this),
  update: (function(_this) {
    return function(model, action) {
      return model;
    };
  })(this)
});

component({
  name: 'my-parent',
  view: (function(_this) {
    return function(dispatch, arg) {
      var props, state;
      state = arg.state, props = arg.props;
      return h('div', {}, h('input', {
        type: 'text',
        onInput: function(arg1) {
          var target;
          target = arg1.target;
          return dispatch(['SET_TITLE', target.value]);
        }
      }), h('my-child', {
        'data-title': state.title
      }));
    };
  })(this),
  update: (function(_this) {
    return function(state, arg) {
      var payload, type;
      if (state == null) {
        state = {};
      }
      type = arg[0], payload = arg[1];
      switch (type) {
        case 'SET_TITLE':
          return merge(state, {
            title: payload
          });
        default:
          return state;
      }
    };
  })(this)
});


},{"../src":3}],2:[function(require,module,exports){
!function(global, factory) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = factory() : 'function' == typeof define && define.amd ? define(factory) : global.preact = factory();
}(this, function() {
    'use strict';
    function VNode(nodeName, attributes, children) {
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.children = children;
    }
    function extend(obj, props) {
        for (var i in props) if (hasOwnProperty.call(props, i)) obj[i] = props[i];
        return obj;
    }
    function clone(obj) {
        var out = {};
        for (var i in obj) out[i] = obj[i];
        return out;
    }
    function memoize(fn, mem) {
        mem = mem || {};
        return function(k) {
            return hasOwnProperty.call(mem, k) ? mem[k] : mem[k] = fn(k);
        };
    }
    function delve(obj, key) {
        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
        return obj;
    }
    function toArray(obj) {
        var arr = [], i = obj.length;
        for (;i--; ) arr[i] = obj[i];
        return arr;
    }
    function styleObjToCss(s) {
        var str = '';
        for (var prop in s) {
            var val = s[prop];
            if (!empty(val)) {
                if (str) str += ' ';
                str += jsToCss(prop);
                str += ': ';
                str += val;
                if ('number' == typeof val && !NON_DIMENSION_PROPS[prop]) str += 'px';
                str += ';';
            }
        }
        return str;
    }
    function hashToClassName(c) {
        var str = '';
        for (var prop in c) if (c[prop]) {
            if (str) str += ' ';
            str += prop;
        }
        return str;
    }
    function normalize(obj, prop, fn) {
        var v = obj[prop];
        if (v && !isString(v)) obj[prop] = fn(v);
    }
    function optionsHook(name, a, b) {
        return hook(options, name, a, b);
    }
    function hook(obj, name, a, b, c) {
        if (obj[name]) return obj[name](a, b, c); else ;
    }
    function deepHook(obj, type) {
        do hook(obj, type); while (obj = obj._component);
    }
    function h(nodeName, attributes) {
        var len = arguments.length, attributeChildren = attributes && attributes.children, children = void 0, arr = void 0, lastSimple = void 0;
        if (attributeChildren) {
            delete attributes.children;
            if (3 > len) return h(nodeName, attributes, attributeChildren);
        }
        for (var i = 2; len > i; i++) {
            var _p = arguments[i];
            if (!falsey(_p)) {
                if (!children) children = [];
                if (_p.join) arr = _p; else {
                    arr = SHARED_TEMP_ARRAY;
                    arr[0] = _p;
                }
                for (var j = 0; j < arr.length; j++) {
                    var child = arr[j], simple = !(falsey(child) || child instanceof VNode);
                    if (simple) child = String(child);
                    if (simple && lastSimple) children[children.length - 1] += child; else if (!falsey(child)) children.push(child);
                    lastSimple = simple;
                }
            } else ;
        }
        var p = new VNode(nodeName, attributes || void 0, children || void 0);
        optionsHook('vnode', p);
        return p;
    }
    function createLinkedState(component, key, eventPath) {
        var path = key.split('.'), p0 = path[0], len = path.length;
        return function(e) {
            var _component$setState;
            var t = this, s = component.state, obj = s, v = void 0, i = void 0;
            if (isString(eventPath)) {
                v = delve(e, eventPath);
                if (empty(v) && (t = t._component)) v = delve(t, eventPath);
            } else v = (t.nodeName + t.type).match(/^input(check|rad)/i) ? t.checked : t.value;
            if (isFunction(v)) v = v.call(t);
            if (len > 1) {
                for (i = 0; len - 1 > i; i++) obj = obj[path[i]] || (obj[path[i]] = {});
                obj[path[i]] = v;
                v = s[p0];
            }
            component.setState((_component$setState = {}, _component$setState[p0] = v, _component$setState));
        };
    }
    function enqueueRender(component) {
        if (1 === items.push(component)) (options.debounceRendering || setImmediate)(rerender);
    }
    function rerender() {
        if (items.length) {
            var currentItems = items, p = void 0;
            items = itemsOffline;
            itemsOffline = currentItems;
            for (;p = currentItems.pop(); ) if (p._dirty) renderComponent(p);
        }
    }
    function isFunctionalComponent(_ref) {
        var nodeName = _ref.nodeName;
        return isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
    }
    function buildFunctionalComponent(vnode, context) {
        return vnode.nodeName(getNodeProps(vnode), context || EMPTY) || EMPTY_BASE;
    }
    function ensureNodeData(node) {
        return node[ATTR_KEY] || (node[ATTR_KEY] = {});
    }
    function getNodeType(node) {
        return node.nodeType;
    }
    function appendChildren(parent, children) {
        var len = children.length, many = len > 2, into = many ? document.createDocumentFragment() : parent;
        for (var i = 0; len > i; i++) into.appendChild(children[i]);
        if (many) parent.appendChild(into);
    }
    function removeNode(node) {
        var p = node.parentNode;
        if (p) p.removeChild(node);
    }
    function getAccessor(node, name, value, cache) {
        if ('type' !== name && 'style' !== name && name in node) return node[name];
        var attrs = node[ATTR_KEY];
        if (cache !== !1 && attrs && hasOwnProperty.call(attrs, name)) return attrs[name];
        if ('class' === name) return node.className;
        if ('style' === name) return node.style.cssText; else return value;
    }
    function setAccessor(node, name, value) {
        if ('class' === name) node.className = value || ''; else if ('style' === name) node.style.cssText = value || ''; else if ('dangerouslySetInnerHTML' === name) {
            if (value && value.__html) node.innerHTML = value.__html;
        } else if ('key' === name || name in node && 'type' !== name) {
            node[name] = value;
            if (falsey(value)) node.removeAttribute(name);
        } else setComplexAccessor(node, name, value);
        ensureNodeData(node)[name] = value;
    }
    function setComplexAccessor(node, name, value) {
        if ('on' !== name.substring(0, 2)) {
            var type = typeof value;
            if (falsey(value)) node.removeAttribute(name); else if ('function' !== type && 'object' !== type) node.setAttribute(name, value);
        } else {
            var _type = normalizeEventName(name), l = node._listeners || (node._listeners = {}), fn = !l[_type] ? 'add' : !value ? 'remove' : null;
            if (fn) node[fn + 'EventListener'](_type, eventProxy);
            l[_type] = value;
        }
    }
    function eventProxy(e) {
        var fn = this._listeners[normalizeEventName(e.type)];
        if (fn) return fn.call(this, optionsHook('event', e) || e); else ;
    }
    function getNodeAttributes(node) {
        return node[ATTR_KEY] || getRawNodeAttributes(node) || EMPTY;
    }
    function getRawNodeAttributes(node) {
        var list = node.attributes;
        if (!list || !list.getNamedItem) return list; else return getAttributesAsObject(list);
    }
    function getAttributesAsObject(list) {
        var attrs = void 0;
        for (var i = list.length; i--; ) {
            var item = list[i];
            if (!attrs) attrs = {};
            attrs[item.name] = item.value;
        }
        return attrs;
    }
    function isSameNodeType(node, vnode) {
        if (isFunctionalComponent(vnode)) return !0;
        var nodeName = vnode.nodeName;
        if (isFunction(nodeName)) return node._componentConstructor === nodeName;
        if (3 === getNodeType(node)) return isString(vnode); else return toLowerCase(node.nodeName) === nodeName;
    }
    function getNodeProps(vnode) {
        var props = clone(vnode.attributes), c = vnode.children;
        if (c) props.children = c;
        var defaultProps = vnode.nodeName.defaultProps;
        if (defaultProps) for (var i in defaultProps) if (hasOwnProperty.call(defaultProps, i) && !(i in props)) props[i] = defaultProps[i];
        return props;
    }
    function collectNode(node) {
        cleanNode(node);
        var name = normalizeName(node.nodeName), list = nodes[name];
        if (list) list.push(node); else nodes[name] = [ node ];
    }
    function createNode(nodeName) {
        var name = normalizeName(nodeName), list = nodes[name], node = list && list.pop() || document.createElement(nodeName);
        ensureNodeData(node);
        return node;
    }
    function cleanNode(node) {
        removeNode(node);
        if (3 !== getNodeType(node)) {
            if (!node[ATTR_KEY]) node[ATTR_KEY] = getRawNodeAttributes(node);
            node._component = node._componentConstructor = null;
        }
    }
    function diff(dom, vnode, context) {
        var originalAttributes = vnode.attributes;
        for (;isFunctionalComponent(vnode); ) vnode = buildFunctionalComponent(vnode, context);
        if (isFunction(vnode.nodeName)) return buildComponentFromVNode(dom, vnode, context);
        if (isString(vnode)) {
            if (dom) {
                var type = getNodeType(dom);
                if (3 === type) {
                    dom[TEXT_CONTENT] = vnode;
                    return dom;
                } else if (1 === type) collectNode(dom);
            }
            return document.createTextNode(vnode);
        }
        var out = dom, nodeName = vnode.nodeName || UNDEFINED_ELEMENT;
        if (!dom) out = createNode(nodeName); else if (toLowerCase(dom.nodeName) !== nodeName) {
            out = createNode(nodeName);
            appendChildren(out, toArray(dom.childNodes));
            recollectNodeTree(dom);
        }
        innerDiffNode(out, vnode, context);
        diffAttributes(out, vnode);
        if (originalAttributes && originalAttributes.ref) (out[ATTR_KEY].ref = originalAttributes.ref)(out);
        return out;
    }
    function innerDiffNode(dom, vnode, context) {
        var children = void 0, keyed = void 0, keyedLen = 0, len = dom.childNodes.length, childrenLen = 0;
        if (len) {
            children = [];
            for (var i = 0; len > i; i++) {
                var child = dom.childNodes[i], key = child._component ? child._component.__key : getAccessor(child, 'key');
                if (!empty(key)) {
                    if (!keyed) keyed = {};
                    keyed[key] = child;
                    keyedLen++;
                } else children[childrenLen++] = child;
            }
        }
        var vchildren = vnode.children, vlen = vchildren && vchildren.length, min = 0;
        if (vlen) for (var i = 0; vlen > i; i++) {
            var vchild = vchildren[i], child = void 0;
            if (keyedLen) {
                var attrs = vchild.attributes, key = attrs && attrs.key;
                if (!empty(key) && hasOwnProperty.call(keyed, key)) {
                    child = keyed[key];
                    keyed[key] = null;
                    keyedLen--;
                }
            }
            if (!child && childrenLen > min) for (var j = min; childrenLen > j; j++) {
                var c = children[j];
                if (c && isSameNodeType(c, vchild)) {
                    child = c;
                    children[j] = null;
                    if (j === childrenLen - 1) childrenLen--;
                    if (j === min) min++;
                    break;
                }
            }
            child = diff(child, vchild, context);
            if (dom.childNodes[i] !== child) {
                var c = child.parentNode !== dom && child._component, next = dom.childNodes[i + 1];
                if (c) deepHook(c, 'componentWillMount');
                if (next) dom.insertBefore(child, next); else dom.appendChild(child);
                if (c) deepHook(c, 'componentDidMount');
            }
        }
        if (keyedLen) for (var i in keyed) if (hasOwnProperty.call(keyed, i) && keyed[i]) children[min = childrenLen++] = keyed[i];
        if (childrenLen > min) removeOrphanedChildren(children);
    }
    function removeOrphanedChildren(children, unmountOnly) {
        for (var i = children.length; i--; ) {
            var child = children[i];
            if (child) recollectNodeTree(child, unmountOnly);
        }
    }
    function recollectNodeTree(node, unmountOnly) {
        var attrs = node[ATTR_KEY];
        if (attrs) hook(attrs, 'ref', null);
        var component = node._component;
        if (component) unmountComponent(component, !unmountOnly); else {
            if (!unmountOnly) {
                if (1 !== getNodeType(node)) {
                    removeNode(node);
                    return;
                }
                collectNode(node);
            }
            var c = node.childNodes;
            if (c && c.length) removeOrphanedChildren(c, unmountOnly);
        }
    }
    function diffAttributes(dom, vnode) {
        var old = getNodeAttributes(dom) || EMPTY, attrs = vnode.attributes || EMPTY, name = void 0, value = void 0;
        for (name in old) if (empty(attrs[name])) setAccessor(dom, name, null);
        if (attrs !== EMPTY) for (name in attrs) if (hasOwnProperty.call(attrs, name)) {
            value = attrs[name];
            if (!empty(value) && value != getAccessor(dom, name)) setAccessor(dom, name, value);
        }
    }
    function collectComponent(component) {
        var name = component.constructor.name, list = components[name];
        if (list) list.push(component); else components[name] = [ component ];
    }
    function createComponent(Ctor, props, context) {
        var list = components[Ctor.name], len = list && list.length, c = void 0;
        for (var i = 0; len > i; i++) {
            c = list[i];
            if (c.constructor === Ctor) {
                list.splice(i, 1);
                var inst = new Ctor(props, context);
                inst.nextBase = c.base;
                return inst;
            }
        }
        return new Ctor(props, context);
    }
    function triggerComponentRender(component) {
        if (!component._dirty) {
            component._dirty = !0;
            enqueueRender(component);
        }
    }
    function setComponentProps(component, props, opts, context) {
        var d = component._disableRendering;
        component.__ref = props.ref;
        component.__key = props.key;
        delete props.ref;
        delete props.key;
        component._disableRendering = !0;
        if (context) {
            if (!component.prevContext) component.prevContext = component.context;
            component.context = context;
        }
        if (component.base) hook(component, 'componentWillReceiveProps', props, component.context);
        if (!component.prevProps) component.prevProps = component.props;
        component.props = props;
        component._disableRendering = d;
        if (!opts || opts.render !== !1) if (opts && opts.renderSync || options.syncComponentUpdates !== !1) renderComponent(component); else triggerComponentRender(component);
        hook(component, '__ref', component);
    }
    function renderComponent(component, opts) {
        if (!component._disableRendering) {
            var skip = void 0, rendered = void 0, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, initialBase = isUpdate || component.nextBase;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (hook(component, 'shouldComponentUpdate', props, state, context) === !1) skip = !0; else hook(component, 'componentWillUpdate', props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
            component._dirty = !1;
            if (!skip) {
                rendered = hook(component, 'render', props, state, context);
                var childComponent = rendered && rendered.nodeName, childContext = component.getChildContext ? component.getChildContext() : context, toUnmount = void 0, base = void 0;
                if (isFunction(childComponent) && childComponent.prototype.render) {
                    var inst = component._component;
                    if (inst && inst.constructor !== childComponent) {
                        toUnmount = inst;
                        inst = null;
                    }
                    var childProps = getNodeProps(rendered);
                    if (inst) setComponentProps(inst, childProps, SYNC_RENDER, childContext); else {
                        inst = createComponent(childComponent, childProps, childContext);
                        inst._parentComponent = component;
                        component._component = inst;
                        if (isUpdate) deepHook(inst, 'componentWillMount');
                        setComponentProps(inst, childProps, NO_RENDER, childContext);
                        renderComponent(inst, DOM_RENDER);
                        if (isUpdate) deepHook(inst, 'componentDidMount');
                    }
                    base = inst.base;
                } else {
                    var cbase = initialBase;
                    toUnmount = component._component;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || opts && opts.build) base = diff(cbase, rendered || EMPTY_BASE, childContext);
                }
                if (initialBase && base !== initialBase) {
                    var p = initialBase.parentNode;
                    if (p && base !== p) p.replaceChild(base, initialBase);
                }
                if (toUnmount) unmountComponent(toUnmount, !0);
                component.base = base;
                if (base) {
                    var componentRef = component, t = component;
                    for (;t = t._parentComponent; ) componentRef = t;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
                if (isUpdate) hook(component, 'componentDidUpdate', previousProps, previousState, previousContext);
            }
            var cb = component._renderCallbacks, fn = void 0;
            if (cb) for (;fn = cb.pop(); ) fn.call(component);
            return rendered;
        }
    }
    function buildComponentFromVNode(dom, vnode, context) {
        var c = dom && dom._component, oldDom = dom;
        var isOwner = c && dom._componentConstructor === vnode.nodeName;
        for (;c && !isOwner && (c = c._parentComponent); ) isOwner = c.constructor === vnode.nodeName;
        if (isOwner) {
            setComponentProps(c, getNodeProps(vnode), SYNC_RENDER, context);
            dom = c.base;
        } else {
            if (c) {
                unmountComponent(c, !0);
                dom = oldDom = null;
            }
            dom = createComponentFromVNode(vnode, dom, context);
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom);
            }
        }
        return dom;
    }
    function createComponentFromVNode(vnode, dom, context) {
        var props = getNodeProps(vnode);
        var component = createComponent(vnode.nodeName, props, context);
        if (dom && !component.base) component.base = dom;
        setComponentProps(component, props, NO_RENDER, context);
        renderComponent(component, DOM_RENDER);
        return component.base;
    }
    function unmountComponent(component, remove) {
        hook(component, '__ref', null);
        hook(component, 'componentWillUnmount');
        var inner = component._component;
        if (inner) {
            unmountComponent(inner, remove);
            remove = !1;
        }
        var base = component.base;
        if (base) {
            if (remove !== !1) removeNode(base);
            removeOrphanedChildren(base.childNodes, !0);
        }
        if (remove) {
            component._parentComponent = null;
            collectComponent(component);
        }
        hook(component, 'componentDidUnmount');
    }
    function Component(props, context) {
        this._dirty = this._disableRendering = !1;
        this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
        this.context = context || {};
        this.props = props;
        this.state = hook(this, 'getInitialState') || {};
    }
    function render(vnode, parent, merge) {
        var existing = merge && merge._component && merge._componentConstructor === vnode.nodeName, built = diff(merge, vnode), c = !existing && built._component;
        if (c) deepHook(c, 'componentWillMount');
        if (built.parentNode !== parent) parent.appendChild(built);
        if (c) deepHook(c, 'componentDidMount');
        return built;
    }
    var NO_RENDER = {
        render: !1
    };
    var SYNC_RENDER = {
        renderSync: !0
    };
    var DOM_RENDER = {
        build: !0
    };
    var EMPTY = {};
    var EMPTY_BASE = '';
    var HAS_DOM = 'undefined' != typeof document;
    var TEXT_CONTENT = !HAS_DOM || 'textContent' in document ? 'textContent' : 'nodeValue';
    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol['for']('preactattr') : '__preactattr_';
    var UNDEFINED_ELEMENT = 'undefined';
    var NON_DIMENSION_PROPS = {
        boxFlex: 1,
        boxFlexGroup: 1,
        columnCount: 1,
        fillOpacity: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        strokeOpacity: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1
    };
    var isFunction = function(obj) {
        return 'function' == typeof obj;
    };
    var isString = function(obj) {
        return 'string' == typeof obj;
    };
    var hasOwnProperty = {}.hasOwnProperty;
    var empty = function(x) {
        return null == x;
    };
    var falsey = function(value) {
        return value === !1 || null == value;
    };
    var jsToCss = memoize(function(s) {
        return s.replace(/([A-Z])/g, '-$1').toLowerCase();
    });
    var toLowerCase = memoize(function(s) {
        return s.toLowerCase();
    });
    var ch = void 0;
    try {
        ch = new MessageChannel();
    } catch (e) {}
    var setImmediate = ch ? function(f) {
        ch.port1.onmessage = f;
        ch.port2.postMessage('');
    } : setTimeout;
    var options = {
        vnode: function(n) {
            var attrs = n.attributes;
            if (attrs && !isFunction(n.nodeName)) {
                var p = attrs.className;
                if (p) {
                    attrs['class'] = p;
                    delete attrs.className;
                }
                if (attrs['class']) normalize(attrs, 'class', hashToClassName);
                if (attrs.style) normalize(attrs, 'style', styleObjToCss);
            }
        }
    };
    var SHARED_TEMP_ARRAY = [];
    var items = [];
    var itemsOffline = [];
    var normalizeEventName = memoize(function(t) {
        return t.replace(/^on/i, '').toLowerCase();
    });
    var nodes = {};
    var normalizeName = memoize(function(name) {
        return name.toUpperCase();
    });
    var components = {};
    extend(Component.prototype, {
        linkState: function(key, eventPath) {
            var c = this._linkedStates || (this._linkedStates = {}), cacheKey = key + '|' + (eventPath || '');
            return c[cacheKey] || (c[cacheKey] = createLinkedState(this, key, eventPath));
        },
        setState: function(state, callback) {
            var s = this.state;
            if (!this.prevState) this.prevState = clone(s);
            extend(s, isFunction(state) ? state(s, this.props) : state);
            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
            triggerComponentRender(this);
        },
        forceUpdate: function() {
            renderComponent(this);
        },
        render: function() {
            return null;
        }
    });
    var preact = {
        h: h,
        Component: Component,
        render: render,
        rerender: rerender,
        options: options,
        hooks: options
    };
    return preact;
});

},{}],3:[function(require,module,exports){
var h, redux, ref, registerElement, render,
  slice = [].slice;

ref = require('preact'), render = ref.render, h = ref.h;

registerElement = require('./register');

redux = require('./redux');

exports.h = h;

exports.component = (function(_this) {
  return function(arg) {
    var dispatch, getState, lifeCycle, name, ref1, renderView, subscribe, unMount, update, vdom, view;
    name = arg.name, view = arg.view, update = arg.update;
    vdom = null;
    ref1 = redux(update), dispatch = ref1.dispatch, subscribe = ref1.subscribe, getState = ref1.getState;
    renderView = function(state, props, parent) {
      return vdom = render(view(dispatch, {
        props: props,
        state: state
      }), parent, vdom);
    };
    unMount = null;
    lifeCycle = {
      createdCallback: function() {
        return console.log('created');
      },
      attachedCallback: function() {
        unMount = subscribe((function(_this) {
          return function(state) {
            return renderView(state, _this.dataset, _this);
          };
        })(this));
        return renderView(getState(), this.dataset, this);
      },
      detachedCallback: function() {
        return unMount();
      },
      attributeChangedCallback: function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return renderView(getState(), this.dataset, this);
      }
    };
    return registerElement(name, lifeCycle);
  };
})(this);


},{"./redux":4,"./register":5,"preact":2}],4:[function(require,module,exports){
var slice = [].slice;

module.exports = (function(_this) {
  return function(reducer) {
    var dispatch, getState, model, subscribe, subscribers;
    model = reducer(null, {});
    subscribers = [];
    dispatch = function(action) {
      model = reducer(model, action);
      subscribers.forEach(function(fn) {
        return fn(model);
      });
      return action;
    };
    getState = function() {
      return model;
    };
    subscribe = function(subscriber) {
      subscribers = slice.call(subscribers).concat([subscriber]);
      return function() {
        return subscribers = subscribers.filter(function(sub) {
          return sub !== subscriber;
        });
      };
    };
    return {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState
    };
  };
})(this);


},{}],5:[function(require,module,exports){
module.exports = (function(_this) {
  return function(name, options) {
    var proto;
    proto = Object.create(HTMLElement.prototype);
    return document.registerElement(name, {
      prototype: Object.assign(proto, options)
    });
  };
})(this);


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NjcmlwdC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwic3JjL2luZGV4LmNvZmZlZSIsInNyYy9yZWR1eC5jb2ZmZWUiLCJzcmMvcmVnaXN0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxNQUFpQixPQUFBLENBQVEsUUFBUixDQUFqQixFQUFDLFFBQUEsQ0FBRCxFQUFJLGdCQUFBOztBQUVKLEtBQUEsR0FBUSxDQUFBLFNBQUEsS0FBQTtTQUFBLFNBQUMsQ0FBRCxFQUFJLENBQUo7V0FBVSxNQUFNLENBQUMsTUFBUCxDQUFjLEVBQWQsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7RUFBVjtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7O0FBRVIsU0FBQSxDQUNFO0VBQUEsSUFBQSxFQUFNLFVBQU47RUFDQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQThCLFVBQUE7TUFBbEIsWUFBQSxPQUFPLFlBQUE7YUFBVyxDQUFBLENBQUUsSUFBRixFQUFRLEVBQVIsRUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFQLENBQVo7SUFBOUI7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE47RUFFQSxNQUFBLEVBQVEsQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFDLEtBQUQsRUFBUSxNQUFSO2FBQW1CO0lBQW5CO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZSO0NBREY7O0FBS0EsU0FBQSxDQUNFO0VBQUEsSUFBQSxFQUFNLFdBQU47RUFDQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUE7V0FBQSxTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ0osVUFBQTtNQURnQixZQUFBLE9BQU8sWUFBQTthQUN2QixDQUFBLENBQUUsS0FBRixFQUFTLEVBQVQsRUFDRSxDQUFBLENBQUUsT0FBRixFQUFXO1FBQUMsSUFBQSxFQUFNLE1BQVA7UUFBZSxPQUFBLEVBQVMsU0FBQyxJQUFEO0FBQWMsY0FBQTtVQUFaLFNBQUQsS0FBQztpQkFBWSxRQUFBLENBQVMsQ0FBQyxXQUFELEVBQWMsTUFBTSxDQUFDLEtBQXJCLENBQVQ7UUFBZCxDQUF4QjtPQUFYLENBREYsRUFFRSxDQUFBLENBQUUsVUFBRixFQUFjO1FBQUMsWUFBQSxFQUFjLEtBQUssQ0FBQyxLQUFyQjtPQUFkLENBRkY7SUFESTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETjtFQU1BLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQTtXQUFBLFNBQUMsS0FBRCxFQUFhLEdBQWI7QUFDTixVQUFBOztRQURPLFFBQVE7O01BQUssZUFBTTtBQUMxQixjQUFPLElBQVA7QUFBQSxhQUNPLFdBRFA7aUJBQ3dCLEtBQUEsQ0FBTSxLQUFOLEVBQWE7WUFBQSxLQUFBLEVBQU8sT0FBUDtXQUFiO0FBRHhCO2lCQUVPO0FBRlA7SUFETTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOUjtDQURGOzs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGxCQSxJQUFBLHNDQUFBO0VBQUE7O0FBQUEsTUFBYyxPQUFBLENBQVEsUUFBUixDQUFkLEVBQUMsYUFBQSxNQUFELEVBQVMsUUFBQTs7QUFDVCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxZQUFSOztBQUNsQixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVI7O0FBRVIsT0FBTyxDQUFDLENBQVIsR0FBWTs7QUFFWixPQUFPLENBQUMsU0FBUixHQUFvQixDQUFBLFNBQUEsS0FBQTtTQUFBLFNBQUMsR0FBRDtBQUNsQixRQUFBO0lBRG9CLFdBQUEsTUFBTSxXQUFBLE1BQU0sYUFBQTtJQUNoQyxJQUFBLEdBQU87SUFDUCxPQUFrQyxLQUFBLENBQU0sTUFBTixDQUFsQyxFQUFDLGdCQUFBLFFBQUQsRUFBVyxpQkFBQSxTQUFYLEVBQXNCLGdCQUFBO0lBQ3RCLFVBQUEsR0FBYSxTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsTUFBZjthQUNYLElBQUEsR0FBTyxNQUFBLENBQVEsSUFBQSxDQUFLLFFBQUwsRUFBZTtRQUFDLE9BQUEsS0FBRDtRQUFRLE9BQUEsS0FBUjtPQUFmLENBQVIsRUFBd0MsTUFBeEMsRUFBZ0QsSUFBaEQ7SUFESTtJQUViLE9BQUEsR0FBVTtJQUVWLFNBQUEsR0FDRTtNQUFBLGVBQUEsRUFBaUIsU0FBQTtlQUNmLE9BQU8sQ0FBQyxHQUFSLENBQVksU0FBWjtNQURlLENBQWpCO01BR0EsZ0JBQUEsRUFBa0IsU0FBQTtRQUNoQixPQUFBLEdBQVUsU0FBQSxDQUFVLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDttQkFDbEIsVUFBQSxDQUFXLEtBQVgsRUFBa0IsS0FBSSxDQUFDLE9BQXZCLEVBQWdDLEtBQWhDO1VBRGtCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFWO2VBR1YsVUFBQSxDQUFXLFFBQUEsQ0FBQSxDQUFYLEVBQXNCLElBQUksQ0FBQyxPQUEzQixFQUFvQyxJQUFwQztNQUpnQixDQUhsQjtNQVNBLGdCQUFBLEVBQWtCLFNBQUE7ZUFDaEIsT0FBQSxDQUFBO01BRGdCLENBVGxCO01BWUEsd0JBQUEsRUFBMEIsU0FBQTtBQUN4QixZQUFBO1FBRHlCO2VBQ3pCLFVBQUEsQ0FBVyxRQUFBLENBQUEsQ0FBWCxFQUF1QixJQUFJLENBQUMsT0FBNUIsRUFBcUMsSUFBckM7TUFEd0IsQ0FaMUI7O1dBZUYsZUFBQSxDQUFnQixJQUFoQixFQUFzQixTQUF0QjtFQXZCa0I7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBOzs7O0FDTHBCLElBQUE7O0FBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsQ0FBQSxTQUFBLEtBQUE7U0FBQSxTQUFDLE9BQUQ7QUFDZixRQUFBO0lBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxJQUFSLEVBQWMsRUFBZDtJQUNSLFdBQUEsR0FBYztJQUNkLFFBQUEsR0FBVyxTQUFDLE1BQUQ7TUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLEtBQVIsRUFBZSxNQUFmO01BQ1IsV0FBVyxDQUFDLE9BQVosQ0FBb0IsU0FBQyxFQUFEO2VBQVEsRUFBQSxDQUFHLEtBQUg7TUFBUixDQUFwQjthQUNBO0lBSFM7SUFLWCxRQUFBLEdBQVcsU0FBQTthQUFNO0lBQU47SUFFWCxTQUFBLEdBQVksU0FBQyxVQUFEO01BQ1YsV0FBQSxHQUFlLFdBQUEsV0FBQSxDQUFBLFFBQWdCLENBQUEsVUFBQSxDQUFoQjthQUNmLFNBQUE7ZUFDRSxXQUFBLEdBQWMsV0FBVyxDQUFDLE1BQVosQ0FBbUIsU0FBQyxHQUFEO2lCQUFTLEdBQUEsS0FBTztRQUFoQixDQUFuQjtNQURoQjtJQUZVO1dBS1o7TUFBQyxVQUFBLFFBQUQ7TUFBVyxXQUFBLFNBQVg7TUFBc0IsVUFBQSxRQUF0Qjs7RUFmZTtBQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7Ozs7QUNEakIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsQ0FBQSxTQUFBLEtBQUE7U0FBQSxTQUFDLElBQUQsRUFBTyxPQUFQO0FBQ2YsUUFBQTtJQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsTUFBUCxDQUFjLFdBQVcsQ0FBQyxTQUExQjtXQUNSLFFBQVEsQ0FBQyxlQUFULENBQXlCLElBQXpCLEVBQStCO01BQUEsU0FBQSxFQUFXLE1BQU0sQ0FBQyxNQUFQLENBQWMsS0FBZCxFQUFxQixPQUFyQixDQUFYO0tBQS9CO0VBRmU7QUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIntoLCBjb21wb25lbnR9ID0gcmVxdWlyZSAnLi4vc3JjJ1xuXG5tZXJnZSA9IChhLCBiKSA9PiBPYmplY3QuYXNzaWduIHt9LCBhLCBiXG5cbmNvbXBvbmVudFxuICBuYW1lOiAnbXktY2hpbGQnXG4gIHZpZXc6IChkaXNwYXRjaCwge3N0YXRlLCBwcm9wc30pID0+IGggJ2gxJywge30sIFtwcm9wcy50aXRsZV1cbiAgdXBkYXRlOiAobW9kZWwsIGFjdGlvbikgPT4gbW9kZWxcblxuY29tcG9uZW50XG4gIG5hbWU6ICdteS1wYXJlbnQnXG4gIHZpZXc6IChkaXNwYXRjaCwge3N0YXRlLCBwcm9wc30pID0+XG4gICAgaCAnZGl2Jywge30sXG4gICAgICBoICdpbnB1dCcsIHt0eXBlOiAndGV4dCcsIG9uSW5wdXQ6ICh7dGFyZ2V0fSkgPT4gZGlzcGF0Y2ggWydTRVRfVElUTEUnLCB0YXJnZXQudmFsdWVdfVxuICAgICAgaCAnbXktY2hpbGQnLCB7J2RhdGEtdGl0bGUnOiBzdGF0ZS50aXRsZX1cblxuICB1cGRhdGU6IChzdGF0ZSA9IHt9LCBbdHlwZSwgcGF5bG9hZF0pID0+XG4gICAgc3dpdGNoIHR5cGVcbiAgICAgIHdoZW4gJ1NFVF9USVRMRScgdGhlbiBtZXJnZSBzdGF0ZSwgdGl0bGU6IHBheWxvYWRcbiAgICAgIGVsc2Ugc3RhdGVcbiIsIiFmdW5jdGlvbihnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICAnb2JqZWN0JyA9PSB0eXBlb2YgZXhwb3J0cyAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgbW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOiAnZnVuY3Rpb24nID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6IGdsb2JhbC5wcmVhY3QgPSBmYWN0b3J5KCk7XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBWTm9kZShub2RlTmFtZSwgYXR0cmlidXRlcywgY2hpbGRyZW4pIHtcbiAgICAgICAgdGhpcy5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV4dGVuZChvYmosIHByb3BzKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHByb3BzLCBpKSkgb2JqW2ldID0gcHJvcHNbaV07XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb25lKG9iaikge1xuICAgICAgICB2YXIgb3V0ID0ge307XG4gICAgICAgIGZvciAodmFyIGkgaW4gb2JqKSBvdXRbaV0gPSBvYmpbaV07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1lbW9pemUoZm4sIG1lbSkge1xuICAgICAgICBtZW0gPSBtZW0gfHwge307XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChtZW0sIGspID8gbWVtW2tdIDogbWVtW2tdID0gZm4oayk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlbHZlKG9iaiwga2V5KSB7XG4gICAgICAgIGZvciAodmFyIHAgPSBrZXkuc3BsaXQoJy4nKSwgaSA9IDA7IGkgPCBwLmxlbmd0aCAmJiBvYmo7IGkrKykgb2JqID0gb2JqW3BbaV1dO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgICAgICB2YXIgYXJyID0gW10sIGkgPSBvYmoubGVuZ3RoO1xuICAgICAgICBmb3IgKDtpLS07ICkgYXJyW2ldID0gb2JqW2ldO1xuICAgICAgICByZXR1cm4gYXJyO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdHlsZU9ialRvQ3NzKHMpIHtcbiAgICAgICAgdmFyIHN0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHMpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBzW3Byb3BdO1xuICAgICAgICAgICAgaWYgKCFlbXB0eSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cikgc3RyICs9ICcgJztcbiAgICAgICAgICAgICAgICBzdHIgKz0ganNUb0Nzcyhwcm9wKTtcbiAgICAgICAgICAgICAgICBzdHIgKz0gJzogJztcbiAgICAgICAgICAgICAgICBzdHIgKz0gdmFsO1xuICAgICAgICAgICAgICAgIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgdmFsICYmICFOT05fRElNRU5TSU9OX1BST1BTW3Byb3BdKSBzdHIgKz0gJ3B4JztcbiAgICAgICAgICAgICAgICBzdHIgKz0gJzsnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhc2hUb0NsYXNzTmFtZShjKSB7XG4gICAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBjKSBpZiAoY1twcm9wXSkge1xuICAgICAgICAgICAgaWYgKHN0cikgc3RyICs9ICcgJztcbiAgICAgICAgICAgIHN0ciArPSBwcm9wO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShvYmosIHByb3AsIGZuKSB7XG4gICAgICAgIHZhciB2ID0gb2JqW3Byb3BdO1xuICAgICAgICBpZiAodiAmJiAhaXNTdHJpbmcodikpIG9ialtwcm9wXSA9IGZuKHYpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvcHRpb25zSG9vayhuYW1lLCBhLCBiKSB7XG4gICAgICAgIHJldHVybiBob29rKG9wdGlvbnMsIG5hbWUsIGEsIGIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBob29rKG9iaiwgbmFtZSwgYSwgYiwgYykge1xuICAgICAgICBpZiAob2JqW25hbWVdKSByZXR1cm4gb2JqW25hbWVdKGEsIGIsIGMpOyBlbHNlIDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZGVlcEhvb2sob2JqLCB0eXBlKSB7XG4gICAgICAgIGRvIGhvb2sob2JqLCB0eXBlKTsgd2hpbGUgKG9iaiA9IG9iai5fY29tcG9uZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuICAgICAgICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXR0cmlidXRlQ2hpbGRyZW4gPSBhdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMuY2hpbGRyZW4sIGNoaWxkcmVuID0gdm9pZCAwLCBhcnIgPSB2b2lkIDAsIGxhc3RTaW1wbGUgPSB2b2lkIDA7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVDaGlsZHJlbikge1xuICAgICAgICAgICAgZGVsZXRlIGF0dHJpYnV0ZXMuY2hpbGRyZW47XG4gICAgICAgICAgICBpZiAoMyA+IGxlbikgcmV0dXJuIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZUNoaWxkcmVuKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMjsgbGVuID4gaTsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX3AgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBpZiAoIWZhbHNleShfcCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChfcC5qb2luKSBhcnIgPSBfcDsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyciA9IFNIQVJFRF9URU1QX0FSUkFZO1xuICAgICAgICAgICAgICAgICAgICBhcnJbMF0gPSBfcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcnIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYXJyW2pdLCBzaW1wbGUgPSAhKGZhbHNleShjaGlsZCkgfHwgY2hpbGQgaW5zdGFuY2VvZiBWTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaW1wbGUpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbXBsZSAmJiBsYXN0U2ltcGxlKSBjaGlsZHJlbltjaGlsZHJlbi5sZW5ndGggLSAxXSArPSBjaGlsZDsgZWxzZSBpZiAoIWZhbHNleShjaGlsZCkpIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICBsYXN0U2ltcGxlID0gc2ltcGxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUobm9kZU5hbWUsIGF0dHJpYnV0ZXMgfHwgdm9pZCAwLCBjaGlsZHJlbiB8fCB2b2lkIDApO1xuICAgICAgICBvcHRpb25zSG9vaygndm5vZGUnLCBwKTtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxpbmtlZFN0YXRlKGNvbXBvbmVudCwga2V5LCBldmVudFBhdGgpIHtcbiAgICAgICAgdmFyIHBhdGggPSBrZXkuc3BsaXQoJy4nKSwgcDAgPSBwYXRoWzBdLCBsZW4gPSBwYXRoLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBfY29tcG9uZW50JHNldFN0YXRlO1xuICAgICAgICAgICAgdmFyIHQgPSB0aGlzLCBzID0gY29tcG9uZW50LnN0YXRlLCBvYmogPSBzLCB2ID0gdm9pZCAwLCBpID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGV2ZW50UGF0aCkpIHtcbiAgICAgICAgICAgICAgICB2ID0gZGVsdmUoZSwgZXZlbnRQYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAoZW1wdHkodikgJiYgKHQgPSB0Ll9jb21wb25lbnQpKSB2ID0gZGVsdmUodCwgZXZlbnRQYXRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB2ID0gKHQubm9kZU5hbWUgKyB0LnR5cGUpLm1hdGNoKC9eaW5wdXQoY2hlY2t8cmFkKS9pKSA/IHQuY2hlY2tlZCA6IHQudmFsdWU7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2KSkgdiA9IHYuY2FsbCh0KTtcbiAgICAgICAgICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgbGVuIC0gMSA+IGk7IGkrKykgb2JqID0gb2JqW3BhdGhbaV1dIHx8IChvYmpbcGF0aFtpXV0gPSB7fSk7XG4gICAgICAgICAgICAgICAgb2JqW3BhdGhbaV1dID0gdjtcbiAgICAgICAgICAgICAgICB2ID0gc1twMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb21wb25lbnQuc2V0U3RhdGUoKF9jb21wb25lbnQkc2V0U3RhdGUgPSB7fSwgX2NvbXBvbmVudCRzZXRTdGF0ZVtwMF0gPSB2LCBfY29tcG9uZW50JHNldFN0YXRlKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICgxID09PSBpdGVtcy5wdXNoKGNvbXBvbmVudCkpIChvcHRpb25zLmRlYm91bmNlUmVuZGVyaW5nIHx8IHNldEltbWVkaWF0ZSkocmVyZW5kZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXJlbmRlcigpIHtcbiAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRJdGVtcyA9IGl0ZW1zLCBwID0gdm9pZCAwO1xuICAgICAgICAgICAgaXRlbXMgPSBpdGVtc09mZmxpbmU7XG4gICAgICAgICAgICBpdGVtc09mZmxpbmUgPSBjdXJyZW50SXRlbXM7XG4gICAgICAgICAgICBmb3IgKDtwID0gY3VycmVudEl0ZW1zLnBvcCgpOyApIGlmIChwLl9kaXJ0eSkgcmVuZGVyQ29tcG9uZW50KHApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb25hbENvbXBvbmVudChfcmVmKSB7XG4gICAgICAgIHZhciBub2RlTmFtZSA9IF9yZWYubm9kZU5hbWU7XG4gICAgICAgIHJldHVybiBpc0Z1bmN0aW9uKG5vZGVOYW1lKSAmJiAhKG5vZGVOYW1lLnByb3RvdHlwZSAmJiBub2RlTmFtZS5wcm90b3R5cGUucmVuZGVyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYnVpbGRGdW5jdGlvbmFsQ29tcG9uZW50KHZub2RlLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiB2bm9kZS5ub2RlTmFtZShnZXROb2RlUHJvcHModm5vZGUpLCBjb250ZXh0IHx8IEVNUFRZKSB8fCBFTVBUWV9CQVNFO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbnN1cmVOb2RlRGF0YShub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlW0FUVFJfS0VZXSB8fCAobm9kZVtBVFRSX0tFWV0gPSB7fSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVUeXBlKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFwcGVuZENoaWxkcmVuKHBhcmVudCwgY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIGxlbiA9IGNoaWxkcmVuLmxlbmd0aCwgbWFueSA9IGxlbiA+IDIsIGludG8gPSBtYW55ID8gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpIDogcGFyZW50O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgbGVuID4gaTsgaSsrKSBpbnRvLmFwcGVuZENoaWxkKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgaWYgKG1hbnkpIHBhcmVudC5hcHBlbmRDaGlsZChpbnRvKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIHZhciBwID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocCkgcC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgdmFsdWUsIGNhY2hlKSB7XG4gICAgICAgIGlmICgndHlwZScgIT09IG5hbWUgJiYgJ3N0eWxlJyAhPT0gbmFtZSAmJiBuYW1lIGluIG5vZGUpIHJldHVybiBub2RlW25hbWVdO1xuICAgICAgICB2YXIgYXR0cnMgPSBub2RlW0FUVFJfS0VZXTtcbiAgICAgICAgaWYgKGNhY2hlICE9PSAhMSAmJiBhdHRycyAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJzLCBuYW1lKSkgcmV0dXJuIGF0dHJzW25hbWVdO1xuICAgICAgICBpZiAoJ2NsYXNzJyA9PT0gbmFtZSkgcmV0dXJuIG5vZGUuY2xhc3NOYW1lO1xuICAgICAgICBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkgcmV0dXJuIG5vZGUuc3R5bGUuY3NzVGV4dDsgZWxzZSByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldEFjY2Vzc29yKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmICgnY2xhc3MnID09PSBuYW1lKSBub2RlLmNsYXNzTmFtZSA9IHZhbHVlIHx8ICcnOyBlbHNlIGlmICgnc3R5bGUnID09PSBuYW1lKSBub2RlLnN0eWxlLmNzc1RleHQgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLl9faHRtbCkgbm9kZS5pbm5lckhUTUwgPSB2YWx1ZS5fX2h0bWw7XG4gICAgICAgIH0gZWxzZSBpZiAoJ2tleScgPT09IG5hbWUgfHwgbmFtZSBpbiBub2RlICYmICd0eXBlJyAhPT0gbmFtZSkge1xuICAgICAgICAgICAgbm9kZVtuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKGZhbHNleSh2YWx1ZSkpIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9IGVsc2Ugc2V0Q29tcGxleEFjY2Vzc29yKG5vZGUsIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgZW5zdXJlTm9kZURhdGEobm9kZSlbbmFtZV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0Q29tcGxleEFjY2Vzc29yKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmICgnb24nICE9PSBuYW1lLnN1YnN0cmluZygwLCAyKSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgICAgICAgICBpZiAoZmFsc2V5KHZhbHVlKSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7IGVsc2UgaWYgKCdmdW5jdGlvbicgIT09IHR5cGUgJiYgJ29iamVjdCcgIT09IHR5cGUpIG5vZGUuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBfdHlwZSA9IG5vcm1hbGl6ZUV2ZW50TmFtZShuYW1lKSwgbCA9IG5vZGUuX2xpc3RlbmVycyB8fCAobm9kZS5fbGlzdGVuZXJzID0ge30pLCBmbiA9ICFsW190eXBlXSA/ICdhZGQnIDogIXZhbHVlID8gJ3JlbW92ZScgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGZuKSBub2RlW2ZuICsgJ0V2ZW50TGlzdGVuZXInXShfdHlwZSwgZXZlbnRQcm94eSk7XG4gICAgICAgICAgICBsW190eXBlXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50UHJveHkoZSkge1xuICAgICAgICB2YXIgZm4gPSB0aGlzLl9saXN0ZW5lcnNbbm9ybWFsaXplRXZlbnROYW1lKGUudHlwZSldO1xuICAgICAgICBpZiAoZm4pIHJldHVybiBmbi5jYWxsKHRoaXMsIG9wdGlvbnNIb29rKCdldmVudCcsIGUpIHx8IGUpOyBlbHNlIDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0Tm9kZUF0dHJpYnV0ZXMobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZVtBVFRSX0tFWV0gfHwgZ2V0UmF3Tm9kZUF0dHJpYnV0ZXMobm9kZSkgfHwgRU1QVFk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFJhd05vZGVBdHRyaWJ1dGVzKG5vZGUpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBub2RlLmF0dHJpYnV0ZXM7XG4gICAgICAgIGlmICghbGlzdCB8fCAhbGlzdC5nZXROYW1lZEl0ZW0pIHJldHVybiBsaXN0OyBlbHNlIHJldHVybiBnZXRBdHRyaWJ1dGVzQXNPYmplY3QobGlzdCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZXNBc09iamVjdChsaXN0KSB7XG4gICAgICAgIHZhciBhdHRycyA9IHZvaWQgMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IGxpc3QubGVuZ3RoOyBpLS07ICkge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKCFhdHRycykgYXR0cnMgPSB7fTtcbiAgICAgICAgICAgIGF0dHJzW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRycztcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTYW1lTm9kZVR5cGUobm9kZSwgdm5vZGUpIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb25hbENvbXBvbmVudCh2bm9kZSkpIHJldHVybiAhMDtcbiAgICAgICAgdmFyIG5vZGVOYW1lID0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKG5vZGVOYW1lKSkgcmV0dXJuIG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSBub2RlTmFtZTtcbiAgICAgICAgaWYgKDMgPT09IGdldE5vZGVUeXBlKG5vZGUpKSByZXR1cm4gaXNTdHJpbmcodm5vZGUpOyBlbHNlIHJldHVybiB0b0xvd2VyQ2FzZShub2RlLm5vZGVOYW1lKSA9PT0gbm9kZU5hbWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE5vZGVQcm9wcyh2bm9kZSkge1xuICAgICAgICB2YXIgcHJvcHMgPSBjbG9uZSh2bm9kZS5hdHRyaWJ1dGVzKSwgYyA9IHZub2RlLmNoaWxkcmVuO1xuICAgICAgICBpZiAoYykgcHJvcHMuY2hpbGRyZW4gPSBjO1xuICAgICAgICB2YXIgZGVmYXVsdFByb3BzID0gdm5vZGUubm9kZU5hbWUuZGVmYXVsdFByb3BzO1xuICAgICAgICBpZiAoZGVmYXVsdFByb3BzKSBmb3IgKHZhciBpIGluIGRlZmF1bHRQcm9wcykgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZGVmYXVsdFByb3BzLCBpKSAmJiAhKGkgaW4gcHJvcHMpKSBwcm9wc1tpXSA9IGRlZmF1bHRQcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Tm9kZShub2RlKSB7XG4gICAgICAgIGNsZWFuTm9kZShub2RlKTtcbiAgICAgICAgdmFyIG5hbWUgPSBub3JtYWxpemVOYW1lKG5vZGUubm9kZU5hbWUpLCBsaXN0ID0gbm9kZXNbbmFtZV07XG4gICAgICAgIGlmIChsaXN0KSBsaXN0LnB1c2gobm9kZSk7IGVsc2Ugbm9kZXNbbmFtZV0gPSBbIG5vZGUgXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSkge1xuICAgICAgICB2YXIgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobm9kZU5hbWUpLCBsaXN0ID0gbm9kZXNbbmFtZV0sIG5vZGUgPSBsaXN0ICYmIGxpc3QucG9wKCkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlTmFtZSk7XG4gICAgICAgIGVuc3VyZU5vZGVEYXRhKG5vZGUpO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYW5Ob2RlKG5vZGUpIHtcbiAgICAgICAgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgaWYgKDMgIT09IGdldE5vZGVUeXBlKG5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoIW5vZGVbQVRUUl9LRVldKSBub2RlW0FUVFJfS0VZXSA9IGdldFJhd05vZGVBdHRyaWJ1dGVzKG5vZGUpO1xuICAgICAgICAgICAgbm9kZS5fY29tcG9uZW50ID0gbm9kZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCkge1xuICAgICAgICB2YXIgb3JpZ2luYWxBdHRyaWJ1dGVzID0gdm5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgZm9yICg7aXNGdW5jdGlvbmFsQ29tcG9uZW50KHZub2RlKTsgKSB2bm9kZSA9IGJ1aWxkRnVuY3Rpb25hbENvbXBvbmVudCh2bm9kZSwgY29udGV4dCk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZub2RlLm5vZGVOYW1lKSkgcmV0dXJuIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQpO1xuICAgICAgICBpZiAoaXNTdHJpbmcodm5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoZG9tKSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBnZXROb2RlVHlwZShkb20pO1xuICAgICAgICAgICAgICAgIGlmICgzID09PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbVtURVhUX0NPTlRFTlRdID0gdm5vZGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkb207XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgxID09PSB0eXBlKSBjb2xsZWN0Tm9kZShkb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3V0ID0gZG9tLCBub2RlTmFtZSA9IHZub2RlLm5vZGVOYW1lIHx8IFVOREVGSU5FRF9FTEVNRU5UO1xuICAgICAgICBpZiAoIWRvbSkgb3V0ID0gY3JlYXRlTm9kZShub2RlTmFtZSk7IGVsc2UgaWYgKHRvTG93ZXJDYXNlKGRvbS5ub2RlTmFtZSkgIT09IG5vZGVOYW1lKSB7XG4gICAgICAgICAgICBvdXQgPSBjcmVhdGVOb2RlKG5vZGVOYW1lKTtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkcmVuKG91dCwgdG9BcnJheShkb20uY2hpbGROb2RlcykpO1xuICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoZG9tKTtcbiAgICAgICAgfVxuICAgICAgICBpbm5lckRpZmZOb2RlKG91dCwgdm5vZGUsIGNvbnRleHQpO1xuICAgICAgICBkaWZmQXR0cmlidXRlcyhvdXQsIHZub2RlKTtcbiAgICAgICAgaWYgKG9yaWdpbmFsQXR0cmlidXRlcyAmJiBvcmlnaW5hbEF0dHJpYnV0ZXMucmVmKSAob3V0W0FUVFJfS0VZXS5yZWYgPSBvcmlnaW5hbEF0dHJpYnV0ZXMucmVmKShvdXQpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdm9pZCAwLCBrZXllZCA9IHZvaWQgMCwga2V5ZWRMZW4gPSAwLCBsZW4gPSBkb20uY2hpbGROb2Rlcy5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMDtcbiAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBsZW4gPiBpOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBkb20uY2hpbGROb2Rlc1tpXSwga2V5ID0gY2hpbGQuX2NvbXBvbmVudCA/IGNoaWxkLl9jb21wb25lbnQuX19rZXkgOiBnZXRBY2Nlc3NvcihjaGlsZCwgJ2tleScpO1xuICAgICAgICAgICAgICAgIGlmICghZW1wdHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtleWVkKSBrZXllZCA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBrZXllZFtrZXldID0gY2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGNoaWxkcmVuW2NoaWxkcmVuTGVuKytdID0gY2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuLCB2bGVuID0gdmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGgsIG1pbiA9IDA7XG4gICAgICAgIGlmICh2bGVuKSBmb3IgKHZhciBpID0gMDsgdmxlbiA+IGk7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZjaGlsZCA9IHZjaGlsZHJlbltpXSwgY2hpbGQgPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoa2V5ZWRMZW4pIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSB2Y2hpbGQuYXR0cmlidXRlcywga2V5ID0gYXR0cnMgJiYgYXR0cnMua2V5O1xuICAgICAgICAgICAgICAgIGlmICghZW1wdHkoa2V5KSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGtleWVkLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkID0ga2V5ZWRba2V5XTtcbiAgICAgICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjaGlsZCAmJiBjaGlsZHJlbkxlbiA+IG1pbikgZm9yICh2YXIgaiA9IG1pbjsgY2hpbGRyZW5MZW4gPiBqOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgIGlmIChjICYmIGlzU2FtZU5vZGVUeXBlKGMsIHZjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBjO1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbltqXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBjaGlsZHJlbkxlbiAtIDEpIGNoaWxkcmVuTGVuLS07XG4gICAgICAgICAgICAgICAgICAgIGlmIChqID09PSBtaW4pIG1pbisrO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaGlsZCA9IGRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAoZG9tLmNoaWxkTm9kZXNbaV0gIT09IGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBjaGlsZC5wYXJlbnROb2RlICE9PSBkb20gJiYgY2hpbGQuX2NvbXBvbmVudCwgbmV4dCA9IGRvbS5jaGlsZE5vZGVzW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoYykgZGVlcEhvb2soYywgJ2NvbXBvbmVudFdpbGxNb3VudCcpO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0KSBkb20uaW5zZXJ0QmVmb3JlKGNoaWxkLCBuZXh0KTsgZWxzZSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChjKSBkZWVwSG9vayhjLCAnY29tcG9uZW50RGlkTW91bnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGtleWVkLCBpKSAmJiBrZXllZFtpXSkgY2hpbGRyZW5bbWluID0gY2hpbGRyZW5MZW4rK10gPSBrZXllZFtpXTtcbiAgICAgICAgaWYgKGNoaWxkcmVuTGVuID4gbWluKSByZW1vdmVPcnBoYW5lZENoaWxkcmVuKGNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlT3JwaGFuZWRDaGlsZHJlbihjaGlsZHJlbiwgdW5tb3VudE9ubHkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aDsgaS0tOyApIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgdW5tb3VudE9ubHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG4gICAgICAgIHZhciBhdHRycyA9IG5vZGVbQVRUUl9LRVldO1xuICAgICAgICBpZiAoYXR0cnMpIGhvb2soYXR0cnMsICdyZWYnLCBudWxsKTtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkgdW5tb3VudENvbXBvbmVudChjb21wb25lbnQsICF1bm1vdW50T25seSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF1bm1vdW50T25seSkge1xuICAgICAgICAgICAgICAgIGlmICgxICE9PSBnZXROb2RlVHlwZShub2RlKSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbGxlY3ROb2RlKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGMgPSBub2RlLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBpZiAoYyAmJiBjLmxlbmd0aCkgcmVtb3ZlT3JwaGFuZWRDaGlsZHJlbihjLCB1bm1vdW50T25seSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZkF0dHJpYnV0ZXMoZG9tLCB2bm9kZSkge1xuICAgICAgICB2YXIgb2xkID0gZ2V0Tm9kZUF0dHJpYnV0ZXMoZG9tKSB8fCBFTVBUWSwgYXR0cnMgPSB2bm9kZS5hdHRyaWJ1dGVzIHx8IEVNUFRZLCBuYW1lID0gdm9pZCAwLCB2YWx1ZSA9IHZvaWQgMDtcbiAgICAgICAgZm9yIChuYW1lIGluIG9sZCkgaWYgKGVtcHR5KGF0dHJzW25hbWVdKSkgc2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBudWxsKTtcbiAgICAgICAgaWYgKGF0dHJzICE9PSBFTVBUWSkgZm9yIChuYW1lIGluIGF0dHJzKSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChhdHRycywgbmFtZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gYXR0cnNbbmFtZV07XG4gICAgICAgICAgICBpZiAoIWVtcHR5KHZhbHVlKSAmJiB2YWx1ZSAhPSBnZXRBY2Nlc3Nvcihkb20sIG5hbWUpKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0Q29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5uYW1lLCBsaXN0ID0gY29tcG9uZW50c1tuYW1lXTtcbiAgICAgICAgaWYgKGxpc3QpIGxpc3QucHVzaChjb21wb25lbnQpOyBlbHNlIGNvbXBvbmVudHNbbmFtZV0gPSBbIGNvbXBvbmVudCBdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVDb21wb25lbnQoQ3RvciwgcHJvcHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBjb21wb25lbnRzW0N0b3IubmFtZV0sIGxlbiA9IGxpc3QgJiYgbGlzdC5sZW5ndGgsIGMgPSB2b2lkIDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBsZW4gPiBpOyBpKyspIHtcbiAgICAgICAgICAgIGMgPSBsaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGMuY29uc3RydWN0b3IgPT09IEN0b3IpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB2YXIgaW5zdCA9IG5ldyBDdG9yKHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgICAgICBpbnN0Lm5leHRCYXNlID0gYy5iYXNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRyaWdnZXJDb21wb25lbnRSZW5kZXIoY29tcG9uZW50KSB7XG4gICAgICAgIGlmICghY29tcG9uZW50Ll9kaXJ0eSkge1xuICAgICAgICAgICAgY29tcG9uZW50Ll9kaXJ0eSA9ICEwO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNldENvbXBvbmVudFByb3BzKGNvbXBvbmVudCwgcHJvcHMsIG9wdHMsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGQgPSBjb21wb25lbnQuX2Rpc2FibGVSZW5kZXJpbmc7XG4gICAgICAgIGNvbXBvbmVudC5fX3JlZiA9IHByb3BzLnJlZjtcbiAgICAgICAgY29tcG9uZW50Ll9fa2V5ID0gcHJvcHMua2V5O1xuICAgICAgICBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICBkZWxldGUgcHJvcHMua2V5O1xuICAgICAgICBjb21wb25lbnQuX2Rpc2FibGVSZW5kZXJpbmcgPSAhMDtcbiAgICAgICAgaWYgKGNvbnRleHQpIHtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LnByZXZDb250ZXh0KSBjb21wb25lbnQucHJldkNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50LmJhc2UpIGhvb2soY29tcG9uZW50LCAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsIHByb3BzLCBjb21wb25lbnQuY29udGV4dCk7XG4gICAgICAgIGlmICghY29tcG9uZW50LnByZXZQcm9wcykgY29tcG9uZW50LnByZXZQcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcbiAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgIGNvbXBvbmVudC5fZGlzYWJsZVJlbmRlcmluZyA9IGQ7XG4gICAgICAgIGlmICghb3B0cyB8fCBvcHRzLnJlbmRlciAhPT0gITEpIGlmIChvcHRzICYmIG9wdHMucmVuZGVyU3luYyB8fCBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzICE9PSAhMSkgcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCk7IGVsc2UgdHJpZ2dlckNvbXBvbmVudFJlbmRlcihjb21wb25lbnQpO1xuICAgICAgICBob29rKGNvbXBvbmVudCwgJ19fcmVmJywgY29tcG9uZW50KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVuZGVyQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0cykge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fZGlzYWJsZVJlbmRlcmluZykge1xuICAgICAgICAgICAgdmFyIHNraXAgPSB2b2lkIDAsIHJlbmRlcmVkID0gdm9pZCAwLCBwcm9wcyA9IGNvbXBvbmVudC5wcm9wcywgc3RhdGUgPSBjb21wb25lbnQuc3RhdGUsIGNvbnRleHQgPSBjb21wb25lbnQuY29udGV4dCwgcHJldmlvdXNQcm9wcyA9IGNvbXBvbmVudC5wcmV2UHJvcHMgfHwgcHJvcHMsIHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQucHJldlN0YXRlIHx8IHN0YXRlLCBwcmV2aW91c0NvbnRleHQgPSBjb21wb25lbnQucHJldkNvbnRleHQgfHwgY29udGV4dCwgaXNVcGRhdGUgPSBjb21wb25lbnQuYmFzZSwgaW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBjb21wb25lbnQubmV4dEJhc2U7XG4gICAgICAgICAgICBpZiAoaXNVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQucHJvcHMgPSBwcmV2aW91c1Byb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBwcmV2aW91c0NvbnRleHQ7XG4gICAgICAgICAgICAgICAgaWYgKGhvb2soY29tcG9uZW50LCAnc2hvdWxkQ29tcG9uZW50VXBkYXRlJywgcHJvcHMsIHN0YXRlLCBjb250ZXh0KSA9PT0gITEpIHNraXAgPSAhMDsgZWxzZSBob29rKGNvbXBvbmVudCwgJ2NvbXBvbmVudFdpbGxVcGRhdGUnLCBwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByb3BzO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbXBvbmVudC5wcmV2UHJvcHMgPSBjb21wb25lbnQucHJldlN0YXRlID0gY29tcG9uZW50LnByZXZDb250ZXh0ID0gY29tcG9uZW50Lm5leHRCYXNlID0gbnVsbDtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fZGlydHkgPSAhMTtcbiAgICAgICAgICAgIGlmICghc2tpcCkge1xuICAgICAgICAgICAgICAgIHJlbmRlcmVkID0gaG9vayhjb21wb25lbnQsICdyZW5kZXInLCBwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lLCBjaGlsZENvbnRleHQgPSBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0ID8gY29tcG9uZW50LmdldENoaWxkQ29udGV4dCgpIDogY29udGV4dCwgdG9Vbm1vdW50ID0gdm9pZCAwLCBiYXNlID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkQ29tcG9uZW50KSAmJiBjaGlsZENvbXBvbmVudC5wcm90b3R5cGUucmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbnN0ID0gY29tcG9uZW50Ll9jb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3IgIT09IGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSBnZXROb2RlUHJvcHMocmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdCkgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgU1lOQ19SRU5ERVIsIGNoaWxkQ29udGV4dCk7IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY2hpbGRDb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX3BhcmVudENvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkgZGVlcEhvb2soaW5zdCwgJ2NvbXBvbmVudFdpbGxNb3VudCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgTk9fUkVOREVSLCBjaGlsZENvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGluc3QsIERPTV9SRU5ERVIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSBkZWVwSG9vayhpbnN0LCAnY29tcG9uZW50RGlkTW91bnQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gaW5zdC5iYXNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYmFzZSA9IGluaXRpYWxCYXNlO1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvVW5tb3VudCkgY2Jhc2UgPSBjb21wb25lbnQuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsQmFzZSB8fCBvcHRzICYmIG9wdHMuYnVpbGQpIGJhc2UgPSBkaWZmKGNiYXNlLCByZW5kZXJlZCB8fCBFTVBUWV9CQVNFLCBjaGlsZENvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgJiYgYmFzZSAhPT0gaW5pdGlhbEJhc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBpbml0aWFsQmFzZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocCAmJiBiYXNlICE9PSBwKSBwLnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50LCAhMCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnQsIHQgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoO3QgPSB0Ll9wYXJlbnRDb21wb25lbnQ7ICkgY29tcG9uZW50UmVmID0gdDtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50ID0gY29tcG9uZW50UmVmO1xuICAgICAgICAgICAgICAgICAgICBiYXNlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9IGNvbXBvbmVudFJlZi5jb25zdHJ1Y3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzVXBkYXRlKSBob29rKGNvbXBvbmVudCwgJ2NvbXBvbmVudERpZFVwZGF0ZScsIHByZXZpb3VzUHJvcHMsIHByZXZpb3VzU3RhdGUsIHByZXZpb3VzQ29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2IgPSBjb21wb25lbnQuX3JlbmRlckNhbGxiYWNrcywgZm4gPSB2b2lkIDA7XG4gICAgICAgICAgICBpZiAoY2IpIGZvciAoO2ZuID0gY2IucG9wKCk7ICkgZm4uY2FsbChjb21wb25lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlbmRlcmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIGMgPSBkb20gJiYgZG9tLl9jb21wb25lbnQsIG9sZERvbSA9IGRvbTtcbiAgICAgICAgdmFyIGlzT3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lO1xuICAgICAgICBmb3IgKDtjICYmICFpc093bmVyICYmIChjID0gYy5fcGFyZW50Q29tcG9uZW50KTsgKSBpc093bmVyID0gYy5jb25zdHJ1Y3RvciA9PT0gdm5vZGUubm9kZU5hbWU7XG4gICAgICAgIGlmIChpc093bmVyKSB7XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBnZXROb2RlUHJvcHModm5vZGUpLCBTWU5DX1JFTkRFUiwgY29udGV4dCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQoYywgITApO1xuICAgICAgICAgICAgICAgIGRvbSA9IG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb20gPSBjcmVhdGVDb21wb25lbnRGcm9tVk5vZGUodm5vZGUsIGRvbSwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAob2xkRG9tICYmIGRvbSAhPT0gb2xkRG9tKSB7XG4gICAgICAgICAgICAgICAgb2xkRG9tLl9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJlY29sbGVjdE5vZGVUcmVlKG9sZERvbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRvbTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50RnJvbVZOb2RlKHZub2RlLCBkb20sIGNvbnRleHQpIHtcbiAgICAgICAgdmFyIHByb3BzID0gZ2V0Tm9kZVByb3BzKHZub2RlKTtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGNyZWF0ZUNvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSwgcHJvcHMsIGNvbnRleHQpO1xuICAgICAgICBpZiAoZG9tICYmICFjb21wb25lbnQuYmFzZSkgY29tcG9uZW50LmJhc2UgPSBkb207XG4gICAgICAgIHNldENvbXBvbmVudFByb3BzKGNvbXBvbmVudCwgcHJvcHMsIE5PX1JFTkRFUiwgY29udGV4dCk7XG4gICAgICAgIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIERPTV9SRU5ERVIpO1xuICAgICAgICByZXR1cm4gY29tcG9uZW50LmJhc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50LCByZW1vdmUpIHtcbiAgICAgICAgaG9vayhjb21wb25lbnQsICdfX3JlZicsIG51bGwpO1xuICAgICAgICBob29rKGNvbXBvbmVudCwgJ2NvbXBvbmVudFdpbGxVbm1vdW50Jyk7XG4gICAgICAgIHZhciBpbm5lciA9IGNvbXBvbmVudC5fY29tcG9uZW50O1xuICAgICAgICBpZiAoaW5uZXIpIHtcbiAgICAgICAgICAgIHVubW91bnRDb21wb25lbnQoaW5uZXIsIHJlbW92ZSk7XG4gICAgICAgICAgICByZW1vdmUgPSAhMTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYmFzZSA9IGNvbXBvbmVudC5iYXNlO1xuICAgICAgICBpZiAoYmFzZSkge1xuICAgICAgICAgICAgaWYgKHJlbW92ZSAhPT0gITEpIHJlbW92ZU5vZGUoYmFzZSk7XG4gICAgICAgICAgICByZW1vdmVPcnBoYW5lZENoaWxkcmVuKGJhc2UuY2hpbGROb2RlcywgITApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudC5fcGFyZW50Q29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgICBob29rKGNvbXBvbmVudCwgJ2NvbXBvbmVudERpZFVubW91bnQnKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdGhpcy5fZGlzYWJsZVJlbmRlcmluZyA9ICExO1xuICAgICAgICB0aGlzLnByZXZTdGF0ZSA9IHRoaXMucHJldlByb3BzID0gdGhpcy5wcmV2Q29udGV4dCA9IHRoaXMuYmFzZSA9IHRoaXMubmV4dEJhc2UgPSB0aGlzLl9wYXJlbnRDb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnQgPSB0aGlzLl9fcmVmID0gdGhpcy5fX2tleSA9IHRoaXMuX2xpbmtlZFN0YXRlcyA9IHRoaXMuX3JlbmRlckNhbGxiYWNrcyA9IG51bGw7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQgfHwge307XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5zdGF0ZSA9IGhvb2sodGhpcywgJ2dldEluaXRpYWxTdGF0ZScpIHx8IHt9O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXIodm5vZGUsIHBhcmVudCwgbWVyZ2UpIHtcbiAgICAgICAgdmFyIGV4aXN0aW5nID0gbWVyZ2UgJiYgbWVyZ2UuX2NvbXBvbmVudCAmJiBtZXJnZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBidWlsdCA9IGRpZmYobWVyZ2UsIHZub2RlKSwgYyA9ICFleGlzdGluZyAmJiBidWlsdC5fY29tcG9uZW50O1xuICAgICAgICBpZiAoYykgZGVlcEhvb2soYywgJ2NvbXBvbmVudFdpbGxNb3VudCcpO1xuICAgICAgICBpZiAoYnVpbHQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQoYnVpbHQpO1xuICAgICAgICBpZiAoYykgZGVlcEhvb2soYywgJ2NvbXBvbmVudERpZE1vdW50Jyk7XG4gICAgICAgIHJldHVybiBidWlsdDtcbiAgICB9XG4gICAgdmFyIE5PX1JFTkRFUiA9IHtcbiAgICAgICAgcmVuZGVyOiAhMVxuICAgIH07XG4gICAgdmFyIFNZTkNfUkVOREVSID0ge1xuICAgICAgICByZW5kZXJTeW5jOiAhMFxuICAgIH07XG4gICAgdmFyIERPTV9SRU5ERVIgPSB7XG4gICAgICAgIGJ1aWxkOiAhMFxuICAgIH07XG4gICAgdmFyIEVNUFRZID0ge307XG4gICAgdmFyIEVNUFRZX0JBU0UgPSAnJztcbiAgICB2YXIgSEFTX0RPTSA9ICd1bmRlZmluZWQnICE9IHR5cGVvZiBkb2N1bWVudDtcbiAgICB2YXIgVEVYVF9DT05URU5UID0gIUhBU19ET00gfHwgJ3RleHRDb250ZW50JyBpbiBkb2N1bWVudCA/ICd0ZXh0Q29udGVudCcgOiAnbm9kZVZhbHVlJztcbiAgICB2YXIgQVRUUl9LRVkgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgU3ltYm9sID8gU3ltYm9sWydmb3InXSgncHJlYWN0YXR0cicpIDogJ19fcHJlYWN0YXR0cl8nO1xuICAgIHZhciBVTkRFRklORURfRUxFTUVOVCA9ICd1bmRlZmluZWQnO1xuICAgIHZhciBOT05fRElNRU5TSU9OX1BST1BTID0ge1xuICAgICAgICBib3hGbGV4OiAxLFxuICAgICAgICBib3hGbGV4R3JvdXA6IDEsXG4gICAgICAgIGNvbHVtbkNvdW50OiAxLFxuICAgICAgICBmaWxsT3BhY2l0eTogMSxcbiAgICAgICAgZmxleDogMSxcbiAgICAgICAgZmxleEdyb3c6IDEsXG4gICAgICAgIGZsZXhQb3NpdGl2ZTogMSxcbiAgICAgICAgZmxleFNocmluazogMSxcbiAgICAgICAgZmxleE5lZ2F0aXZlOiAxLFxuICAgICAgICBmb250V2VpZ2h0OiAxLFxuICAgICAgICBsaW5lQ2xhbXA6IDEsXG4gICAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIG9yZGVyOiAxLFxuICAgICAgICBvcnBoYW5zOiAxLFxuICAgICAgICBzdHJva2VPcGFjaXR5OiAxLFxuICAgICAgICB3aWRvd3M6IDEsXG4gICAgICAgIHpJbmRleDogMSxcbiAgICAgICAgem9vbTogMVxuICAgIH07XG4gICAgdmFyIGlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgcmV0dXJuICdmdW5jdGlvbicgPT0gdHlwZW9mIG9iajtcbiAgICB9O1xuICAgIHZhciBpc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJ3N0cmluZycgPT0gdHlwZW9mIG9iajtcbiAgICB9O1xuICAgIHZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuICAgIHZhciBlbXB0eSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIG51bGwgPT0geDtcbiAgICB9O1xuICAgIHZhciBmYWxzZXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09ICExIHx8IG51bGwgPT0gdmFsdWU7XG4gICAgfTtcbiAgICB2YXIganNUb0NzcyA9IG1lbW9pemUoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC8oW0EtWl0pL2csICctJDEnKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuICAgIHZhciB0b0xvd2VyQ2FzZSA9IG1lbW9pemUoZnVuY3Rpb24ocykge1xuICAgICAgICByZXR1cm4gcy50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuICAgIHZhciBjaCA9IHZvaWQgMDtcbiAgICB0cnkge1xuICAgICAgICBjaCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdmFyIHNldEltbWVkaWF0ZSA9IGNoID8gZnVuY3Rpb24oZikge1xuICAgICAgICBjaC5wb3J0MS5vbm1lc3NhZ2UgPSBmO1xuICAgICAgICBjaC5wb3J0Mi5wb3N0TWVzc2FnZSgnJyk7XG4gICAgfSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHZub2RlOiBmdW5jdGlvbihuKSB7XG4gICAgICAgICAgICB2YXIgYXR0cnMgPSBuLmF0dHJpYnV0ZXM7XG4gICAgICAgICAgICBpZiAoYXR0cnMgJiYgIWlzRnVuY3Rpb24obi5ub2RlTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcCA9IGF0dHJzLmNsYXNzTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAocCkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyc1snY2xhc3MnXSA9IHA7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBhdHRycy5jbGFzc05hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhdHRyc1snY2xhc3MnXSkgbm9ybWFsaXplKGF0dHJzLCAnY2xhc3MnLCBoYXNoVG9DbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChhdHRycy5zdHlsZSkgbm9ybWFsaXplKGF0dHJzLCAnc3R5bGUnLCBzdHlsZU9ialRvQ3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdmFyIFNIQVJFRF9URU1QX0FSUkFZID0gW107XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgdmFyIGl0ZW1zT2ZmbGluZSA9IFtdO1xuICAgIHZhciBub3JtYWxpemVFdmVudE5hbWUgPSBtZW1vaXplKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHQucmVwbGFjZSgvXm9uL2ksICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIH0pO1xuICAgIHZhciBub2RlcyA9IHt9O1xuICAgIHZhciBub3JtYWxpemVOYW1lID0gbWVtb2l6ZShmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHJldHVybiBuYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSk7XG4gICAgdmFyIGNvbXBvbmVudHMgPSB7fTtcbiAgICBleHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuICAgICAgICBsaW5rU3RhdGU6IGZ1bmN0aW9uKGtleSwgZXZlbnRQYXRoKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuX2xpbmtlZFN0YXRlcyB8fCAodGhpcy5fbGlua2VkU3RhdGVzID0ge30pLCBjYWNoZUtleSA9IGtleSArICd8JyArIChldmVudFBhdGggfHwgJycpO1xuICAgICAgICAgICAgcmV0dXJuIGNbY2FjaGVLZXldIHx8IChjW2NhY2hlS2V5XSA9IGNyZWF0ZUxpbmtlZFN0YXRlKHRoaXMsIGtleSwgZXZlbnRQYXRoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFN0YXRlOiBmdW5jdGlvbihzdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgICAgIGlmICghdGhpcy5wcmV2U3RhdGUpIHRoaXMucHJldlN0YXRlID0gY2xvbmUocyk7XG4gICAgICAgICAgICBleHRlbmQocywgaXNGdW5jdGlvbihzdGF0ZSkgPyBzdGF0ZShzLCB0aGlzLnByb3BzKSA6IHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykgKHRoaXMuX3JlbmRlckNhbGxiYWNrcyA9IHRoaXMuX3JlbmRlckNhbGxiYWNrcyB8fCBbXSkucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB0cmlnZ2VyQ29tcG9uZW50UmVuZGVyKHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBmb3JjZVVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZW5kZXJDb21wb25lbnQodGhpcyk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBwcmVhY3QgPSB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIENvbXBvbmVudDogQ29tcG9uZW50LFxuICAgICAgICByZW5kZXI6IHJlbmRlcixcbiAgICAgICAgcmVyZW5kZXI6IHJlcmVuZGVyLFxuICAgICAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgICAgICBob29rczogb3B0aW9uc1xuICAgIH07XG4gICAgcmV0dXJuIHByZWFjdDtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LmpzLm1hcCIsIntyZW5kZXIsIGh9ID0gcmVxdWlyZSAncHJlYWN0J1xucmVnaXN0ZXJFbGVtZW50ID0gcmVxdWlyZSAnLi9yZWdpc3RlcidcbnJlZHV4ID0gcmVxdWlyZSAnLi9yZWR1eCdcblxuZXhwb3J0cy5oID0gaFxuXG5leHBvcnRzLmNvbXBvbmVudCA9ICh7bmFtZSwgdmlldywgdXBkYXRlfSkgPT5cbiAgdmRvbSA9IG51bGxcbiAge2Rpc3BhdGNoLCBzdWJzY3JpYmUsIGdldFN0YXRlfSA9IHJlZHV4KHVwZGF0ZSlcbiAgcmVuZGVyVmlldyA9IChzdGF0ZSwgcHJvcHMsIHBhcmVudCkgPT5cbiAgICB2ZG9tID0gcmVuZGVyICh2aWV3IGRpc3BhdGNoLCB7cHJvcHMsIHN0YXRlfSksIHBhcmVudCwgdmRvbVxuICB1bk1vdW50ID0gbnVsbFxuXG4gIGxpZmVDeWNsZSA9XG4gICAgY3JlYXRlZENhbGxiYWNrOiAoKSAtPlxuICAgICAgY29uc29sZS5sb2cgJ2NyZWF0ZWQnXG5cbiAgICBhdHRhY2hlZENhbGxiYWNrOiAoKSAtPlxuICAgICAgdW5Nb3VudCA9IHN1YnNjcmliZSAoc3RhdGUpID0+XG4gICAgICAgIHJlbmRlclZpZXcgc3RhdGUsIHRoaXMuZGF0YXNldCwgdGhpc1xuXG4gICAgICByZW5kZXJWaWV3IGdldFN0YXRlKCksdGhpcy5kYXRhc2V0LCB0aGlzXG5cbiAgICBkZXRhY2hlZENhbGxiYWNrOiAoKSAtPlxuICAgICAgdW5Nb3VudCgpXG5cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2s6IChhcmdzLi4uKSAtPlxuICAgICAgcmVuZGVyVmlldyBnZXRTdGF0ZSgpLCB0aGlzLmRhdGFzZXQsIHRoaXNcblxuICByZWdpc3RlckVsZW1lbnQgbmFtZSwgbGlmZUN5Y2xlXG4iLCJcbm1vZHVsZS5leHBvcnRzID0gKHJlZHVjZXIpID0+XG4gIG1vZGVsID0gcmVkdWNlcihudWxsLCB7fSlcbiAgc3Vic2NyaWJlcnMgPSBbXVxuICBkaXNwYXRjaCA9IChhY3Rpb24pID0+XG4gICAgbW9kZWwgPSByZWR1Y2VyKG1vZGVsLCBhY3Rpb24pXG4gICAgc3Vic2NyaWJlcnMuZm9yRWFjaCAoZm4pID0+IGZuIG1vZGVsXG4gICAgYWN0aW9uXG5cbiAgZ2V0U3RhdGUgPSAoKSA9PiBtb2RlbFxuXG4gIHN1YnNjcmliZSA9IChzdWJzY3JpYmVyKSA9PlxuICAgIHN1YnNjcmliZXJzID0gW3N1YnNjcmliZXJzLi4uLCBzdWJzY3JpYmVyXVxuICAgICgpID0+XG4gICAgICBzdWJzY3JpYmVycyA9IHN1YnNjcmliZXJzLmZpbHRlciAoc3ViKSA9PiBzdWIgIT0gc3Vic2NyaWJlclxuXG4gIHtkaXNwYXRjaCwgc3Vic2NyaWJlLCBnZXRTdGF0ZX1cbiIsIm1vZHVsZS5leHBvcnRzID0gKG5hbWUsIG9wdGlvbnMpID0+XG4gIHByb3RvID0gT2JqZWN0LmNyZWF0ZSBIVE1MRWxlbWVudC5wcm90b3R5cGVcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50IG5hbWUsIHByb3RvdHlwZTogT2JqZWN0LmFzc2lnbiBwcm90bywgb3B0aW9uc1xuIl19
