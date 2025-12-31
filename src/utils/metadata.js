/**
 * Fetch metadata (title and favicon) from a URL
 * Uses a CORS proxy to avoid CORS issues
 */
export async function fetchUrlMetadata(url) {
  try {
    // Validate URL format
    const urlObj = new URL(url)

    // Extract domain for favicon
    const domain = `${urlObj.protocol}//${urlObj.hostname}`

    // Try multiple favicon sources
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`

    // For title, we'll use a simple fetch with a CORS proxy
    // In production, you'd want your own backend endpoint for this
    const corsProxy = 'https://api.allorigins.win/get?url='

    try {
      const response = await fetch(corsProxy + encodeURIComponent(url), {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (!response.ok) {
        throw new Error('Failed to fetch')
      }

      const data = await response.json()
      const html = data.contents

      // Extract title from HTML
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : urlObj.hostname

      return {
        title: decodeHtmlEntities(title),
        favicon: faviconUrl,
        success: true
      }
    } catch (error) {
      // If metadata fetch fails, return defaults
      return {
        title: urlObj.hostname,
        favicon: faviconUrl,
        success: false
      }
    }
  } catch (error) {
    console.error('Invalid URL:', error)
    return {
      title: '',
      favicon: '',
      success: false
    }
  }
}

/**
 * Decode HTML entities in title
 */
function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
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
