# dynamic-router

Route any path dynamically in react/preact. Handle nested and relatives paths with ease.

In contrast to existing router solution which require you **declare** your routes, this gives you ***dynamic*** control over "path" property for all routing needs.


## Install

```sh
npm i dynamic-router
```

## Usage


### API

```js
// Currently supports react and preact.
// Import the appropriate subdir:
import Router from 'dynamic-router/react';
// After that both work the same way

<Router router={router}></Router>
```

* **`router`** `[component]` A component class that takes `path` and `link` as props using which you can render your desired component.

  ```js
  ({path, link}) => <...>
  ```

  * **`path`** `[string]` Current path
  * **`link`** `[function]` Function to make links (instead of using `<a href>`)

    ```js
    link(href, text)
    ```



### Example

```js
import React from 'react';
import Router from 'dynamic-router/react';

const router = props => {
  const {path, link} = props;

  // Route by if/else
  if (path === '/') {
    return <div> Home </div>
  } else if (path === '/foo') {
    return <div> Foo </div>
  }

  // Route by object properties
  return {
    '/': <div> Home </div>,
    '/foo': <div> Foo </div>
  }[path];

  // Route by switch statements
  switch(path) {
    case '/': return <div> Home </div>
    case '/foo': return <div> Foo </div>
    case '/bar-even':
    case '/bar-multiple':
    case '/bar-routes':
      return <div> Bar </div>
  }

  // Nested routes
  if (path === '/') {
    return <div> Home </div>
  } else if (path.match('^/foo')) {
    // begins with /foo
    // could be /foo, /foo/bar
    return (
      <div path={path}> // pass the path down
        // handle in nested component(s)
        {if (path.match('/foo/bar')) {
          return <div> Foo Bar </div>
        } else if (path.match('/foo/baz')) {
          return <div> Foo Baz </div>
        }}
      </div>
    )
  }
}

const App = <Router router={router}></Router>
```
