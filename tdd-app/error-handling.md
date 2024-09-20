## Express error-handling

```js
const express = require('express');
const app = express();

/**
 * 해당 미들웨어에서 에러가 발생하면 Express는 이 에러를 에러 처리기(Error Handler)로 보내준다
*/
app.get('*', (req, res, next) => {
  // This middleware throws an error, so Express will go straight to
  // the next error handler
  throw new Error('woops');
});

/**
 * 위에 에러가 발생했고 에러 처리기로 바로 가야하기 때문에 이 미들웨어는 생략된다
 * 이 미들웨어는 에러 처리기(Error Handler)가 아니기 때문이다
*/
app.get('*', (req, res, next) => {
  // This middleware is not an error handler (only 3 arguments),
  // Express will skip it because there was an error in the previous middleware
  console.log('this will not print');
});

/**
 * 에러 처리기는 이렇게 4개의 인자가 들어간다
 * 그래서 첫번째 미들웨어에서 발생한 에러 메시지를 이곳에서 처리해준다
*/
app.use((error, req, res, next) => {
  // Any request to this server will get here, and will send an HTTP
  // response with the error message 'woops'
  res.json({ message: error.message });
});

app.listen(4000);
```

- 원래는 위에서처럼 에러 처리를 해주면 되지만 비동기 요청으로 인한 에러를 이렇게 처리해주면, 에러 처리기(Error Handler)에서 에러 메시지를 받지 못하기 때문에 서버가 다운된다

```js
const express = require('express');
const app = express();

app.get('*', (req, res, next) => {
  // Will crash the server on every HTTP request
  setImmediate(() => { throw new Error('woops'); });
});

app.use((error, req, res, next) => {
  // Won't get here, because Express doesn't catch the above error
  res.json({ message: error.message });
});

app.listen(4000);
```

### How to solve?

- 에러를 next 함수의 인자로 넣어주면, Express는 해당 에러를 에러 핸들러로 보내주게 된다

```js
const express = require('express');
const app = express();

app.get('*', (req, res, next) => {
  // Reporting async errors *must* go through `next()`
  setImmediate(() => { next(new Error('woops')); });
});

app.use((error, req, res, next) => {
  // Will get here
  res.json({ message: error.message });
});

app.listen(4000);
```

### References

- http://thecodebarbarian.com/80-20-guide-to-express-error-handling.html