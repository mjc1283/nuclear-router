
/**
 * @param {RouterHandler[]} handlers
 * @param {Context} ctx
 */
function runHandlers(handlers, ctx, callback) {
  let len = handlers.length
  let i = 0;

  function next() {
    let fn = handlers[i]
    if (i < len) {
      let nextFn = (i < len - 1) ? next : () => {}
      i++
      fn(ctx, nextFn)
    } else {
      callback()
    }
  }

  next()
}


/**
 * @param {String} path
 * @return {String}
 */
function extractQueryString(path) {
  let i = path.indexOf('?');
  let isFound = i > -1

  return isFound ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
}

/**
 * @param {String} path
 * @return {Object<String, String[]|String>}
 */
function extractQueryParams(path) {
  // TODO

}

/**
 * @param {String} base
 * @param {String} canonicalPath
 * @return {String}
 */
function extractPath(base, canonicalPath) {
  let path = canonicalPath.replace(base, '') || '/'
  let qsIndex = path.indexOf('?')
  return (qsIndex > -1) ? path.slice(0, qsIndex) : path
}

/**
 * @param {Route[]} routes
 * @param {String} path
 * @return {{ route: Route, params: Object }}
 */
function matchRoute(routes, path) {
  let result = {
    params: {},
    route: null,
  }

  let decodedPath = decodeURIComponent(path)
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i]
    let matches = route.matchRegexp.exec(decodedPath)

    if (matches) {
      let params = {}

      for (let i = 1; i < matches.length; ++i) {
        let key = route.keys[i - 1];
        let val = decodeURLEncodedURIComponent(m[i]);
        if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
          params[key.name] = val;
        }
      }

      result = { route, params }
    }
  }

  return result
}

/**
 * Remove URL encoding from the given `str`.
 * Accommodates whitespace in both x-www-form-urlencoded
 * and regular percent-encoded form.
 *
 * @param {String} val
 * @return {String}
 */
function decodeURLEncodedURIComponent(val) {
  if (typeof val !== 'string') {
    return val
  }
  return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val
}

export default {
  runHandlers,
  extractQueryString,
  extractQueryParams,
  extractPath,
  matchRoute,
}
