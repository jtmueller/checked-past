This is a to-do application inspired by Carolyn Foreman. It is built using:

- [React](http://facebook.github.io/react/)
- [Redux](https://github.com/rackt/redux)
- [TypeScript](http://www.typescriptlang.org/)

It is adapted from the [redux TodoMVC example](https://github.com/rackt/redux/tree/master/examples/todomvc).

This application has weekly recurring tasks that reset to incomplete every week at midnight on the indicated day.
It also has monthly recurring tasks that reset to incomplete at midnight on the first of every month, and standard to-do and shopping lists.

## Getting Started

Requirement:

- NodeJS 0.12+

Start application:

```
npm start
```

Visit [http://localhost:8000/](http://localhost:8000/).

Install dependencies for development:

```
npm install
```

---

## Running development server

Run webpack dev server (for assets):

```
npm run dev-server
```

Run server:

```
npm run start-dev
```

## Running production server

Build assets:

```
npm run build
```

Run server:

```
npm start
```

### Testing

To run tests, use:

```
npm test
```
