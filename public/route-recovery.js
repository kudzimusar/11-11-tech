(function recoverGitHubPagesRoute(location) {
  if (location.search[1] !== '/') return
  const decoded = location.search
    .slice(1)
    .split('&')
    .map((segment) => segment.replace(/~and~/g, '&'))
    .join('?')
  window.history.replaceState(null, '', location.pathname.slice(0, -1) + decoded + location.hash)
})(window.location)
