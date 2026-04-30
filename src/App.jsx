import { HashRouter, Route, Routes } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import ExplorePage from './pages/ExplorePage'
import BookmarksPage from './pages/BookmarksPage'
import SubmitPage from './pages/SubmitPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <HashRouter>
      {/* Skip to content link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <NavigationBar />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </HashRouter>
  )
}