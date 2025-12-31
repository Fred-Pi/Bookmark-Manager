/**
 * Get favicon URL for a given URL
 * Uses Google's favicon service (reliable and fast, no CORS issues)
 */
export function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
  } catch (error) {
    console.error('Invalid URL:', error)
    return ''
  }
}

/**
 * Check if URL is valid
 */
export function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}
