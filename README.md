# angular-stash

> A `$cacheFactory` alternative

## Why?

Because sometimes I need to kill a cached response after *x* amount of time has passed.

## Example

```javascript
angular
  .module('myApp', ['stash'])
  .run(function ($http, stashFactory) {
    $http.defaults.cache = stashFactory('yee-haw', {
      expireTime: 30000 // default is 30 minutes
    });
  });
```

## License

MIT license
