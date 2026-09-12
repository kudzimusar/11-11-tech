(function redirectGitHubPagesRoute(location) {
  const pathSegmentsToKeep = 1
  const base = location.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/')
  const route = location.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~')
  const query = location.search ? `&${location.search.slice(1).replace(/&/g, '~and~')}` : ''
  location.replace(`${location.protocol}//${location.host}${base}/?/${route}${query}${location.hash}`)
})(window.location)
