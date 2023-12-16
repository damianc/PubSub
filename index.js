function PubSub(
  cachedItemsNumber = 0,
  cachedInitItems = [],
  pubCachedOnSub = false
) {
  const STOP = Symbol('[PubSub] STOP');
  const subscribers = [];
  const cache = Array.isArray(cachedInitItems)
    ? cachedInitItems.slice(-cachedItemsNumber)
    : [];
	
  function putInCache(value) {
    if (cache.length === cachedItemsNumber) {
      cache.shift();
    }
    
    cache.push(value);
  }
	
  let _pubCounter = 0;
	
  const meta = {
    pubOnSubCall: false,
    stop: STOP
  };
	
  const api = {
    get subscribers() {
      return subscribers.length;
    },
		
    get isCached() {
      return cachedItemsNumber > 0;
    },
		
    get cacheSize() {
      return cachedItemsNumber;
    },
		
    get valuesEmitted() {
      return _pubCounter;
    },
		
    sub(subscriber) {
      if (api.isCached && pubCachedOnSub) {
        subscriber(cache, {
          ...meta,
          pubOnSubCall: true
        });
      }
      
      subscribers.push(subscriber);
      return subscriber;
    },
		
    unsub(subscriber) {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index,1);
        return subscriber;
      }
    },
		
    unsubAll() {
      subscribers.length = 0;
    },
		
    pub(value) {
      _pubCounter += 1;
      
      let cached;
      if (api.isCached) {
        cached = true;
        putInCache(value);
      }
      
      for (const subscriber of subscribers) {
        const res = subscriber(
          cached ? cache : value,
          meta
        );
        if (res === STOP) break;
      }
    }
  };
	
  return api;
}
