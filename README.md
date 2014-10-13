# angular-stash

> A `$cacheFactory` alternative

## Why?

To allow for the removal of data after an arbitrary amount of time.

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

By default angular-stash is lazy and will only remove a cached item if it has
been requested after its expiration date. You can set `lazy` to false which will
remove any expired data it finds anytime new data is introduced to the cache.

```javascript
stashFactory('hawrdcoore', { lazy: false });
```

## License

MIT license
