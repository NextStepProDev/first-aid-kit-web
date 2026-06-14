import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'First Aid Kit';

/**
 * Sets a per-route <title>, meta description and a self-referencing canonical
 * link on public pages. The app is a CRA SPA: every route is served the same
 * index.html, so without per-route meta Google clusters the routes as
 * duplicates -> GSC "Duplicate without user-selected canonical". This hook
 * gives each public page distinct, self-canonical metadata that Googlebot
 * picks up after rendering the JS. Private/auth-walled routes are blocked in
 * robots.txt and don't need this.
 */
export function usePageMeta(title: string, description?: string): void {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${title} — ${SITE_NAME}`;

    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }

    const href = `${window.location.origin}${pathname}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
  }, [title, description, pathname]);
}
