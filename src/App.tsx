import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ImageConverter from './pages/image/ImageConverter';
import ImageCompressor from './pages/image/ImageCompressor';
import ImageResizer from './pages/image/ImageResizer';
import ImageCropper from './pages/image/ImageCropper';
import AudioConverter from './pages/audio/AudioConverter';
import AudioCompressor from './pages/audio/AudioCompressor';
import PdfConverter from './pages/pdf/PdfConverter';
import PdfCompressor from './pages/pdf/PdfCompressor';
import PdfMerge from './pages/pdf/PdfMerge';
import Downloader from './pages/Downloader';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/audio-converter" element={<AudioConverter />} />
          <Route path="/audio-compressor" element={<AudioCompressor />} />
          <Route path="/pdf-converter" element={<PdfConverter />} />
          <Route path="/pdf-compressor" element={<PdfCompressor />} />
          <Route path="/pdf-merge" element={<PdfMerge />} />
          <Route path="/downloader" element={<Downloader />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
