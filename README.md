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

<Router router={router} [...options]></Router>
```

* **`router`** `[component]` A component class whose `props` include a **`router`** with  routing related properties/methods using which you can route/render your desired component.

  ```js
  ( props ) => { props.router.<…> }
  ```

  * **`path`** `[string]` Current path
  * **`link`** `[function]` Function to make links (instead of using `<a href>`)

    ```js
    router.link(href, text)
    ```

  * **`route`** `[function]` Function to immediately route to the specified path
    ```js
    router.route(path)
    ```

Options:

* **`publicPath`** `[string]` Base path appended to all routes.

**Note** `props` will also include any other properties passed to the `Router` class, so as to pass them down to the `router` component (filled with the special `router` prop described above)

### Example

```jsx
import React from 'react';
import Router from 'dynamic-router/react';

const router = props => {
  const {path, link, route} = props.router;

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

  // Route by matching, and handling nested routes:
  if (path.match('^/foo')) { // begins with /foo
    return <FooNested router={props.router}> // pass down the router prop
  }
}

const FooNested = props => {
  const {path, link, route} = props.router;
  return {
    '/foo/bar': <div> Foo Bar </div>,
    '/foo/baz': <div> Foo Baz </div>,
  }[path];
}

const App = <Router router={router}></Router>
```

## Differences to (p)react-router

* All operations (link, route, etc.) are done via top level `router` prop. So you need to pass it down to nested components if they need it. I.e. you must:

  * Use the provided `router.link` to create an `<a>` link for the path to be handled by router when user clicks it.

  * Use the provided `router.route` to change the path.

