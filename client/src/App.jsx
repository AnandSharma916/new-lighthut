import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';
import { ProductDetail } from './pages/public/ProductDetail';
import { Projects } from './pages/public/Projects';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { NotFound } from './pages/public/NotFound';

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

// Helper: Old links carried the "e27" label (e.g. ?category=e27-wall-lamp); send them to the current URLs
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

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { ProductList } from './pages/admin/ProductList';
import { ProductForm } from './pages/admin/ProductForm';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { HomepageCms } from './pages/admin/HomepageCms';
import { InquiryList } from './pages/admin/InquiryList';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <SettingsProvider>
          <AuthProvider>
            <BrowserRouter>
            <LegacySlugRedirect />
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
          </BrowserRouter>
        </AuthProvider>
      </SettingsProvider>
    </ToastProvider>
  </ErrorBoundary>
  );
}

export default App;
