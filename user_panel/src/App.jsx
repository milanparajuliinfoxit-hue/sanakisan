import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { NoticesPage, NoticeSinglePage } from './pages/NoticesPage';
import { BlogsPage, BlogSinglePage } from './pages/BlogsPage';
import GalleryPage from './pages/GalleryPage';
import DairyPage from './pages/DairyPage';
import FinancialPage from './pages/FinancialPage';
import ContactPage from './pages/ContactPage';
import CalendarModule from './pages/CalendarModule';
import EventSinglePage from './pages/EventSinglePage';
import { useAnchorNavigation } from './hooks/useAnchorNavigation';

/** Scrolls to top on every route change EXCEPT when a hash is present (anchor links handle their own scroll). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

/** Mounts the global anchor navigation hook inside the Router context. */
function GlobalAnchorNavigation() {
  useAnchorNavigation();
  return null;
}


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalAnchorNavigation />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/notices/:id" element={<NoticeSinglePage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:id" element={<BlogSinglePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/dairy" element={<DairyPage />} />
            <Route path="/financial" element={<FinancialPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/events" element={<CalendarModule />} /> 
            <Route path='/events/:id' element={<EventSinglePage/>}/>
            <Route path="*" element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-4xl">🌿</div>
                <h1 className="mb-2 font-display text-3xl font-semibold text-emerald-950">Page Not Found</h1>
                <p className="mb-6 max-w-md text-base leading-8 text-slate-600">The page you are looking for may have moved or no longer exists.</p>
                <a href="/" className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-6 py-2.5 font-semibold text-white transition hover:bg-emerald-700">
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
