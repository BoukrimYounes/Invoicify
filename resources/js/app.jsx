import './bootstrap';
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx');
    const pagePath = `./Pages/${name}.jsx`;
    
    if (!pages[pagePath]) {
      throw new Error(`Page not found: ${pagePath}`);
    }

    const module = await pages[pagePath]();
    return module.default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});