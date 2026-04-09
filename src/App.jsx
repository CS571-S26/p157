import { HashRouter, Route, Routes } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import ExplorePage from './pages/ExplorePage'
import BookmarksPage from './pages/BookmarksPage'
import SubmitPage from './pages/SubmitPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <HashRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </HashRouter>
  )
}