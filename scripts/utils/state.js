export { createState, createReadableStore, createWritableStore }

function createState(initialState, updateFn) {
  let _state = { ...initialState }
  let publicState = { ...initialState }
  for (const key in initialState) {
    Object.defineProperty(publicState, key, {
      get() {
        return _state[key]
      },
      set(value) {
        _state[key] = value
        updateFn(_state)
      },
    })
  }
  return publicState
}

function createReadableStore(initialValue, func) {
  return {
    subscribe: createWritableStore(initialValue, func).subscribe,
  }
}

function createWritableStore(initialValue, func) {
  let _store = initialValue
  const subscribers = []

  if (func) func(set)

  function set(value) {
    _store = value
    subscribers.forEach(func => func(_store))
  }

  function update(func) {
    const oldValue = _store
    set(func(oldValue))
  }

  function subscribe(func) {
    const index = subscribers.indexOf(func)
    if (index < 0) subscribers.push(func)
    func(value)

    return function unsubscribe() {
      const index = subscribers.indexOf(func)
      if (index > 0) {
        subscribers = [
          ...subscribers.slice(0, index),
          ...subscribers.slice(index + 1),
        ]
      } else if (index === 0) {
        subscribers = [...subscribers.slice(index + 1)]
      }
    }
  }

  return {
    subscribe,
    set,
    update,
  }
}
