# PubSub

Implementation of the PubSub pattern.

```
const ps = PubSub();
ps.sub(val => console.log('value: ' + val));

ps.pub(1);
// value: 1

ps.pub(2);
// value: 2
```

## Overview

```
PubSub(
  cachedItemsNumber = 0,
  cachedInitItems = [],
  pubCachedOnSub = false
)
```

**Parameters**  

- `cachedItemsNumber: number` - a number of items to cache
- `cachedInitItems: any[]` - initial content of cache; if it's an array whose length exceeds the `cachedItemsNumber` value, only last elements are taken
- `pubCachedOnSub: boolean` - if `true`, newly added subscriber will be fired immediately with cached values

**Return value**  
  
Returns object with following members:

- `subscribers: number` - a number of subscribers
- `isCached: boolean` - whether values are cached
- `cacheSize: number` - a number of items being cached
- `valuesEmitted: number` - a number of times any value was emitted
- `sub(subscriber: Function): Function` - adds a subscriber and returns it
- `unsub(subscriber: Function): Function` - removes the subscriber and returns it
- `unsubAll(): void` - removes all subscribers
- `pub(value: any): void` - emits a value to subscribers

`subscriber` is a function that takes two arguments - `(value, meta)`:
- `value` - emitted value
- `meta` - object with following members:
  - `pubOnSubCall: boolean` - if `pubCachedOnSub` parameter of the `PubSub()` constructor was set to `true`, it states whether a current call of a subscriber is automatic and takes place due to addition of the subscriber
  - `stop: Symbol` - return it from a subscriber to stop the flow of a value and prevent remaining subscribers from handling the value
