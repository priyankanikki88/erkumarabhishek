import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ChatWidget from './components/ChatWidget';
import useAnalytics from './hooks/useAnalytics';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ContentListPage from './pages/ContentListPage';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ContentManager from './admin/ContentManager';
import ContentEditor from './admin/ContentEditor';
import ProductManager from './admin/ProductManager';
import ProductEditor from './admin/ProductEditor';
import MediaLibrary from './admin/MediaLibrary';
import LeadsManager from './admin/LeadsManager';
import LeadDetail from './admin/LeadDetail';
import MessagesManager from './admin/MessagesManager';
import AnalyticsDashboard from './admin/AnalyticsDashboard';
import ChatbotSettings from './admin/ChatbotSettings';
import Conversations from './admin/Conversations';
import AuditLog from './admin/AuditLog';
import ProtectedRoute from './admin/ProtectedRoute';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>{children}</main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </>
  );
}

export default function App() {
  useAnalytics();
  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><ContentListPage type="about" title="About" /></PublicLayout>} />
      <Route path="/journey" element={<PublicLayout><ContentListPage type="journey" title="Journey" /></PublicLayout>} />
      <Route path="/education" element={<PublicLayout><ContentListPage type="education" title="Education" /></PublicLayout>} />
      <Route path="/experience" element={<PublicLayout><ContentListPage type="experience" title="Experience" /></PublicLayout>} />
      <Route path="/skills" element={<PublicLayout><ContentListPage type="skills" title="Skills" /></PublicLayout>} />
      <Route path="/certifications" element={<PublicLayout><ContentListPage type="certifications" title="Certifications" /></PublicLayout>} />
      <Route path="/projects" element={<PublicLayout><ContentListPage type="project" title="Projects" /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ContentListPage type="service" title="Services" /></PublicLayout>} />
      <Route path="/articles" element={<PublicLayout><ContentListPage type="article" title="Articles" /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><ContentListPage type="blog" title="Blog" /></PublicLayout>} />
      <Route path="/marketing" element={<PublicLayout><ContentListPage type="marketing" title="Marketing" /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><ContentListPage type="gallery" title="Gallery" /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<ContentManager />} />
        <Route path="content/new" element={<ContentEditor />} />
        <Route path="content/:id" element={<ContentEditor />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="products/new" element={<ProductEditor />} />
        <Route path="products/:id" element={<ProductEditor />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="leads" element={<LeadsManager />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="chatbot" element={<ChatbotSettings />} />
        <Route path="conversations" element={<Conversations />} />
        <Route path="audit" element={<AuditLog />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
