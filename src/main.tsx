import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import './index.css';
import { APP_URL } from './utils/constants.ts';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path={`${APP_URL}/list/:id`} element={<App />} />
      <Route path={`${APP_URL}/`} element={<App />} />
    </Routes>
  </BrowserRouter>
);
