const PORTFOLIO_ORIGINS = new Set([
  "https://www.joanramosrefusta.com",
  "https://joanramosrefusta.com",
]);

function isPortfolioOrigin(origin) {
  if (PORTFOLIO_ORIGINS.has(origin)) {
    return true;
  }

  // The local Webpack server uses a loopback address and may choose another port.
  return /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
}

export function postToPortfolio(message) {
  if (window.parent === window || !document.referrer) {
    return;
  }

  const { origin } = new URL(document.referrer);
  if (isPortfolioOrigin(origin)) {
    window.parent.postMessage(message, origin);
  }
}
