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
