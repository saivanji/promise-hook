# promise-hook

## Installation

Install it with yarn:

```
yarn add promise-hook
```

Or with npm:

```
npm i promise-hook --save
```

## Demo

The simplest way to start playing around with `promise-hook` is with this CodeSandbox snippet:
https://codesandbox.io/s/ykmklm6m21

## Simple data fetching

In order to fetch the data, you need to pass a Promise returning function as a first argument to `usePromise` hook. It will return you back response related payload such as resolved data, request status or the error if it exists.

`resolve` option is used to initiate data fetching when component mounts.

```javascript
import React from "react";
import { usePromise } from "promise-hook";

const Movies = () => {
  const { isLoading, data } = usePromise(fetchMovies, { resolve: true });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {data.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};

const fetchMovies = () =>
  fetch(`http://your-amazing-api.com/movies`).then(res => res.json());
```

## Passing arguments

In order to pass some arguments to the Promise function, you need to use arrow function wrapper and pass needed argument from a closure.

By default, when `resolve` option is enabled, data fetching is initiated only on the first render. But you can control it with `resolveCondition` setting. If an array of variables passed will be changed - data fetching will be initiated again.

```javascript
import React from "react";
import { usePromise } from "promise-hook";

const Movies = ({ category }) => {
  const { isLoading, data } = usePromise(() => fetchMovies(category), {
    resolve: true,
    resolveCondition: [category]
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>
      {data.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};

const fetchMovies = category =>
  fetch(`http://your-amazing-api.com/movies/${category}`).then(res =>
    res.json()
  );
```

## Fetching on demand

When you need to send any request on demand instead of component mount, you can use `request` function returned from the `usePromise` hook.

After that function is called, data fetching will be started and payload variables such as `isLoading` etc will be updated accordingly.

```javascript
import React from "react";
import { usePromise } from "promise-hook";
import { Form, Input, Button } from "./Form";

const SignUp = () => {
  const { isLoading, request } = usePromise(signUp);

  return (
    <Form onSubmit={data => request(data)}>
      <Input type="text" name="full_name" />
      <Input type="text" name="email" />
      <Input type="password" name="password" />
      <Button>{isLoading ? "Signing up..." : "Sign up"}</Button>
    </Form>
  );
};

const signUp = data =>
  fetch(`http://your-amazing-api.com/users`, {
    method: "POST",
    body: data
  }).then(res => res.json());
```

## Error handling

Once the error was happened during the request, an `error` variable will be populated with the corresponding error object. You can use it afterwards for displaying apropriate error message in the UI.

```javascript
import React from "react";
import { usePromise } from "promise-hook";

const Movies = () => {
  const { isLoading, data, error } = usePromise(fetchMovies, {
    resolve: true
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error loading movies - {error.message}</div>
  ) : (
    <div>
      {data.map(movie => (
        <div key={movie.id}>{movie.title}</div>
      ))}
    </div>
  );
};

const fetchMovies = () =>
  fetch(`http://your-amazing-api.com/movies`).then(res => res.json());
```

## Promise status

Sometimes, exact promise status is required. It can be handy, for example, if your API doesn't return any data.
Possible statuses are `pending`, `fulfilled`, `rejected`.

```javascript
import React from "react";
import { usePromise } from "promise-hook";

const DeleteMovile = () => {
  const { isLoading, request, status, error } = usePromise(() => deleteMovie());

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (status === 'fulfilled') {
    return <b>Movie has been removed</b>
  }

  return <button onClick={request}>Remove movie</button>
};

const deleteMovie = () =>
  fetch(`http://your-amazing-api.com/movie/remove`);
```

## TODO

- Promise cancelling.
- Caching.
- Resetting / Updating response state.
- Middleware support.
