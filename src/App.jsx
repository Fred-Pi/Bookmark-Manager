import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabase/config'
import { useAuth } from './contexts/AuthContext'
import BookmarkForm from './components/BookmarkForm'
import BookmarkGrid from './components/BookmarkGrid'
import SearchBar from './components/SearchBar'
import Login from './components/Login'

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  // Load bookmarks from Supabase when user is authenticated
  useEffect(() => {
    if (!user) {
      setBookmarks([])
      setLoading(false)
      return
    }

    // Fetch bookmarks
    fetchBookmarks()

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('bookmarks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refetch bookmarks when data changes
          fetchBookmarks()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get all unique tags from bookmarks
  const allTags = useMemo(() => {
    const tags = new Set()
    bookmarks.forEach(bookmark => {
      if (bookmark.tags && Array.isArray(bookmark.tags)) {
        bookmark.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [bookmarks])

  // Filter bookmarks based on search query and selected tags
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark =>
        bookmark.tags &&
        selectedTags.every(tag => bookmark.tags.includes(tag))
      )
    }

    return filtered
  }, [bookmarks, searchQuery, selectedTags])

  const handleAddBookmark = async (bookmarkData) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: user.id,
            url: bookmarkData.url,
            title: bookmarkData.title,
            tags: bookmarkData.tags,
            favicon: bookmarkData.favicon
          }
        ])

      if (error) throw error
      // Real-time subscription will update the UI automatically
    } catch (error) {
      console.error('Error adding bookmark:', error)
      alert('Failed to add bookmark. Please try again.')
    }
  }

  const handleDeleteBookmark = async (id) => {
    if (!user) return

    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      try {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id) // Security: ensure user owns the bookmark

        if (error) throw error
        // Real-time subscription will update the UI automatically
      } catch (error) {
        console.error('Error deleting bookmark:', error)
        alert('Failed to delete bookmark. Please try again.')
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleTagToggle = (tag) => {
    if (tag === null) {
      // Clear all filters
      setSelectedTags([])
    } else if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />
  }

  // Main app for authenticated users
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Bookmark Manager</h1>
              <p className="text-sm text-slate-400 mt-1">Save and organize your favorite links</p>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-200">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name}
                  className="w-10 h-10 rounded-full ring-2 ring-slate-700"
                />
              )}
              <button
                onClick={handleSignOut}
                className="text-sm text-slate-300 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Add Bookmark Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-white mb-4">Add Bookmark</h2>
              <BookmarkForm onAddBookmark={handleAddBookmark} />
            </div>
          </div>

          {/* Right Column - Search & Bookmarks Grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                allTags={allTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>

            {/* Bookmarks Grid */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  {searchQuery || selectedTags.length > 0 ? 'Filtered Bookmarks' : 'My Bookmarks'} ({filteredBookmarks.length})
                </h2>
                {(searchQuery || selectedTags.length > 0) && filteredBookmarks.length !== bookmarks.length && (
                  <p className="text-sm text-slate-400">
                    {filteredBookmarks.length} of {bookmarks.length} bookmarks
                  </p>
                )}
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-slate-400 mt-2">Loading bookmarks...</p>
                </div>
              ) : (
                <BookmarkGrid
                  bookmarks={filteredBookmarks}
                  onDeleteBookmark={handleDeleteBookmark}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
