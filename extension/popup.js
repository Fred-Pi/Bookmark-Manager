// Import Supabase (using CDN)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

let supabase = null
let currentUser = null

// DOM Elements
const configSection = document.getElementById('config-section')
const loginSection = document.getElementById('login-section')
const saveSection = document.getElementById('save-section')
const statusEl = document.getElementById('status')

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await init()
})

async function init() {
  // Load saved configuration
  const config = await chrome.storage.local.get(['supabaseUrl', 'supabaseKey', 'session'])

  if (!config.supabaseUrl || !config.supabaseKey) {
    // Show configuration section
    showSection('config')
    setupConfigListeners()
  } else {
    // Initialize Supabase client
    supabase = createClient(config.supabaseUrl, config.supabaseKey)

    // Check if user has a session
    if (config.session) {
      const { data, error } = await supabase.auth.setSession(config.session)
      if (!error && data.session) {
        currentUser = data.session.user
        await showSaveForm()
      } else {
        showSection('login')
        setupLoginListeners()
      }
    } else {
      showSection('login')
      setupLoginListeners()
    }
  }

  // Footer link
  document.getElementById('open-app').addEventListener('click', (e) => {
    e.preventDefault()
    chrome.storage.local.get(['supabaseUrl'], (data) => {
      // Open the deployed app (you'll need to set this after deployment)
      const appUrl = 'http://localhost:5173' // Change to your Vercel URL after deployment
      chrome.tabs.create({ url: appUrl })
    })
  })
}

function setupConfigListeners() {
  document.getElementById('save-config').addEventListener('click', async () => {
    const url = document.getElementById('supabase-url').value.trim()
    const key = document.getElementById('supabase-key').value.trim()

    if (!url || !key) {
      showStatus('Please fill in all fields', 'error')
      return
    }

    // Save configuration
    await chrome.storage.local.set({ supabaseUrl: url, supabaseKey: key })

    showStatus('Configuration saved! Please sign in.', 'success')

    // Reinitialize
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

function setupLoginListeners() {
  document.getElementById('send-magic-link').addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim()

    if (!email) {
      showStatus('Please enter your email', 'error')
      return
    }

    const btn = document.getElementById('send-magic-link')
    btn.classList.add('loading')
    btn.disabled = true

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      })

      if (error) throw error

      showStatus('Magic link sent! Check your email and click the link to sign in.', 'success')
      document.querySelector('.help-text').textContent = 'After clicking the link, reopen this extension.'
    } catch (error) {
      showStatus(error.message, 'error')
    } finally {
      btn.classList.remove('loading')
      btn.disabled = false
    }
  })

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      // Save session
      await chrome.storage.local.set({ session })
      currentUser = session.user
      await showSaveForm()
    }
  })
}

async function showSaveForm() {
  showSection('save')

  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  // Pre-fill form
  document.getElementById('title').value = tab.title || ''
  document.getElementById('url').value = tab.url || ''

  // Form submission
  document.getElementById('bookmark-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = document.getElementById('title').value.trim()
    const url = document.getElementById('url').value.trim()
    const tags = document.getElementById('tags').value.trim()
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag)

    const btn = document.getElementById('save-btn')
    btn.classList.add('loading')
    btn.disabled = true

    try {
      // Get favicon
      const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`

      const { error } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: currentUser.id,
            url,
            title,
            tags,
            favicon
          }
        ])

      if (error) throw error

      showStatus('Bookmark saved successfully!', 'success')

      // Clear form
      document.getElementById('tags').value = ''

      // Close popup after short delay
      setTimeout(() => {
        window.close()
      }, 1000)
    } catch (error) {
      showStatus(error.message, 'error')
    } finally {
      btn.classList.remove('loading')
      btn.disabled = false
    }
  })

  // Sign out
  document.getElementById('sign-out-btn').addEventListener('click', async () => {
    await supabase.auth.signOut()
    await chrome.storage.local.remove('session')
    location.reload()
  })
}

function showSection(sectionName) {
  configSection.classList.add('hidden')
  loginSection.classList.add('hidden')
  saveSection.classList.add('hidden')

  switch (sectionName) {
    case 'config':
      configSection.classList.remove('hidden')
      break
    case 'login':
      loginSection.classList.remove('hidden')
      break
    case 'save':
      saveSection.classList.remove('hidden')
      break
  }
}

function showStatus(message, type) {
  statusEl.textContent = message
  statusEl.className = `status ${type}`
  statusEl.classList.remove('hidden')

  setTimeout(() => {
    statusEl.classList.add('hidden')
  }, 5000)
}
