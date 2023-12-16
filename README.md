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

## Examples

### Use of the `unsub()` method

```
const ps = PubSub();

const subA$ = ps.sub(val => console.log('A: ' + val));
const subB$ = ps.sub(val => console.log('B: ' + val));

ps.pub(1);
// A: 1
// B: 1

ps.unsub(subA$);

ps.pub(2);
// B: 2
```

### Use of the `stop` symbol

```
let i = 0;
const ps = PubSub();

ps.sub((val, meta) => {
  i++;
  console.log('A: ' + val);
  if (i === 2) return meta.stop;
});

ps.sub(val => {
  console.log('B: ' + val);
});

ps.pub(1);
// A: 1
// B: 1

ps.pub(2);
// A: 2

ps.pub(3);
// A: 3
// B: 3
```

### Cache

```
const ps = PubSub(2, [10,20], true);

ps.sub(val => console.log('A: ' + val));
// A: 10,20

ps.pub(1);
// A: 20,1

ps.sub(val => console.log('B: ' + val));
// B: 20,1

ps.pub(2);
// A: 1,2
// B: 1,2

/*
exceptionally, do not emit cached items
on sub in this subscriber
*/
ps.sub((val, meta) => {
  if (!meta.pubOnSubCall) {
    console.log('C: ' + val);
  }
});

ps.pub(3);
// A: 2,3
// B: 2,3
// C: 2,3
```
