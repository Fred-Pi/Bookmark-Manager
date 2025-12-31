/**
 * Export bookmarks to HTML format (Netscape Bookmark File Format)
 * This format is compatible with all major browsers (Chrome, Firefox, Edge, Safari)
 */
export function exportBookmarksToHTML(bookmarks) {
  const timestamp = Math.floor(Date.now() / 1000)

  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
`

  // Group bookmarks by tag (optional organization)
  const untagged = []
  const tagged = {}

  bookmarks.forEach(bookmark => {
    if (!bookmark.tags || bookmark.tags.length === 0) {
      untagged.push(bookmark)
    } else {
      bookmark.tags.forEach(tag => {
        if (!tagged[tag]) {
          tagged[tag] = []
        }
        tagged[tag].push(bookmark)
      })
    }
  })

  // Add tagged bookmarks in folders
  Object.keys(tagged).sort().forEach(tag => {
    html += `    <DT><H3 ADD_DATE="${timestamp}" LAST_MODIFIED="${timestamp}">${escapeHtml(tag)}</H3>\n`
    html += `    <DL><p>\n`

    tagged[tag].forEach(bookmark => {
      const addDate = bookmark.created_at
        ? Math.floor(new Date(bookmark.created_at).getTime() / 1000)
        : timestamp

      html += `        <DT><A HREF="${escapeHtml(bookmark.url)}" ADD_DATE="${addDate}">${escapeHtml(bookmark.title)}</A>\n`
    })

    html += `    </DL><p>\n`
  })

  // Add untagged bookmarks
  if (untagged.length > 0) {
    untagged.forEach(bookmark => {
      const addDate = bookmark.created_at
        ? Math.floor(new Date(bookmark.created_at).getTime() / 1000)
        : timestamp

      html += `    <DT><A HREF="${escapeHtml(bookmark.url)}" ADD_DATE="${addDate}">${escapeHtml(bookmark.title)}</A>\n`
    })
  }

  html += `</DL><p>\n`

  return html
}

/**
 * Trigger download of bookmarks HTML file
 */
export function downloadBookmarksHTML(bookmarks) {
  const html = exportBookmarksToHTML(bookmarks)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  const timestamp = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `bookmarks_${timestamp}.html`
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * Parse HTML bookmark file (Netscape format or Chrome format)
 */
export async function parseBookmarksHTML(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const html = e.target.result
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        const bookmarks = []
        const links = doc.querySelectorAll('a')

        links.forEach(link => {
          const url = link.getAttribute('href')
          const title = link.textContent.trim()

          if (url && title) {
            // Try to extract tags from parent folder names
            const tags = []
            let parent = link.parentElement

            while (parent) {
              const h3 = parent.querySelector('h3')
              if (h3 && h3.textContent.trim()) {
                tags.push(h3.textContent.trim())
                break // Only get immediate parent folder
              }
              parent = parent.parentElement
            }

            bookmarks.push({
              url,
              title,
              tags: tags.filter(t => t)
            })
          }
        })

        resolve(bookmarks)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
