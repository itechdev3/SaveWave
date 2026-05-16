import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageTools from './pages/ImageTools';
import AudioTools from './pages/AudioTools';
import PdfTools from './pages/PdfTools';
import Downloader from './pages/Downloader';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-tools" element={<ImageTools />} />
          <Route path="/audio-tools" element={<AudioTools />} />
          <Route path="/pdf-tools" element={<PdfTools />} />
          <Route path="/downloader" element={<Downloader />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
