export { createState }

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
