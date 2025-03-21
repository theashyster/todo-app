import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/todo-app/list/:id" element={<App />} />
      <Route path="/todo-app/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
