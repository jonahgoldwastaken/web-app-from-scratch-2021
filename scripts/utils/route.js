export { route }

function route(path, page) {
  return {
    path,
    buildComponent: async updateFunc => {
      const component = await page(updateFunc)
      return component
    },
  }
}
