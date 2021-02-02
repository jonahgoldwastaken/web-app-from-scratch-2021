export { parseQueryString }

function parseQueryString() {
  return window.location.search
    .slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr[0]]: curr[1],
      }),
      {}
    )
}
