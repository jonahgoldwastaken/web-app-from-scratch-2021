export { createState, createReadableStore, createWritableStore }

/**
 * Creates a dynamic state object that runs update function when it's updated
 * @param {Object} initialState Initial state object
 * @param {Function} updateFn Function that is run when the state updates
 * @returns {Object} State object
 */
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

/**
 * Creates a read-only store, that can only be set with the supplied function
 * @param {*} initialValue Any initial value
 * @param {Function} setFunction Function that is run to set the real store value if necessary
 * @returns {Object} ReadableStore object with subscribe function
 */
function createReadableStore(initialValue, func) {
  return {
    subscribe: createWritableStore(initialValue, func).subscribe,
  }
}

/**
 *
 * @param {*} initialValue Any initial value
 * @param {Function} func Function that can be run to set another value immediately after initialisation
 * @returns {Object} WritableStore object containing subscribe, set and update function
 */
function createWritableStore(initialValue, func) {
  let _store = initialValue
  let subscribers = []

  if (func) func(set)

  function set(value) {
    _store = value
    subscribers.forEach(func => func(_store))
  }

  /**
   * Updates the value based on a passed function
   * @param {Function} func Function that gets the old value passed to change and return
   */
  function update(func) {
    const oldValue = _store
    set(func(oldValue))
  }

  /**
   * Adds a function to the store subscriptions, running it when the value of the store changes
   * @param {Function} func Function that gets run every time the store value changes
   * @returns {Function} Unsubscribe function to run when no more updates are needed
   */
  function subscribe(func) {
    const index = subscribers.indexOf(func)
    if (index < 0) subscribers.push(func)
    func(_store)

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
