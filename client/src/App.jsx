import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';

// Core Public Pages (Eagerly loaded for instant initial render)
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';

// Lazy-Loaded Public Secondary Pages
const ProductDetail = lazy(() => import('./pages/public/ProductDetail').then((m) => ({ default: m.ProductDetail })));
const Projects = lazy(() => import('./pages/public/Projects').then((m) => ({ default: m.Projects })));
const About = lazy(() => import('./pages/public/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('./pages/public/Contact').then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import('./pages/public/NotFound').then((m) => ({ default: m.NotFound })));

// Lazy-Loaded Admin Suite (Keeps public initial bundle ultra-lightweight)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const ProductList = lazy(() => import('./pages/admin/ProductList').then((m) => ({ default: m.ProductList })));
const ProductForm = lazy(() => import('./pages/admin/ProductForm').then((m) => ({ default: m.ProductForm })));

// Helper: Seamlessly redirect category URLs to the main catalog page with query parameters
function CategoryRedirect() {
  const { slug, subSlug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  if (slug) searchParams.set('category', slug);
  if (subSlug) searchParams.set('sub', subSlug);
  const query = searchParams.toString();
  return <Navigate to={`/catalog${query ? `?${query}` : ''}`} replace />;
}

// Helper: Old links carried the "e27" label (e.g. ?category=e27-wall-lamp); send them to current URLs
function LegacySlugRedirect() {
  const { pathname, search, hash } = useLocation();
  const url = `${pathname}${search}`;
  if (!url.includes('e27')) return null;
  const next = url
    .replace(/e27-(wall|hanging)-lamp/g, 'classic-$1-lamp')
    .replace(/(^|[-/=])e27-/g, '$1')
    .replace(/-e27(?=$|[-/?&#])/g, '');
  return <Navigate to={`${next}${hash}`} replace />;
}

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#DC2626] animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <BrowserRouter>
              <LegacySlugRedirect />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Public Storefront Layout */}
                  <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="products" element={<Navigate to="/catalog" replace />} />
                    <Route path="categories" element={<Navigate to="/catalog" replace />} />
                    <Route path="category/:slug" element={<CategoryRedirect />} />
                    <Route path="category/:slug/:subSlug" element={<CategoryRedirect />} />
                    <Route path="product/:slug" element={<ProductDetail />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Admin Portal Authentication */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Protected Admin Console - Dedicated Catalog Backend */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/products" replace />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="catalog" element={<Navigate to="/admin/products" replace />} />
                    <Route path="dashboard" element={<Navigate to="/admin/products" replace />} />
                    <Route path="*" element={<Navigate to="/admin/products" replace />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </SettingsProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
