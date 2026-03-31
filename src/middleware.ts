import { defineMiddleware } from 'astro:middleware';
import { getCollection } from 'astro:content';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only gate /work/[slug] routes
  const workSlugMatch = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (!workSlugMatch) return next();

  const slug = workSlugMatch[1];

  // Look up the project to check if it's protected
  let isProtected = false;
  try {
    const projects = await getCollection('projects');
    const project = projects.find((p) => p.id === slug);
    isProtected = project?.data.protected ?? false;
  } catch {
    // Collection not found or error — fail open
    return next();
  }

  if (!isProtected) return next();

  // Check auth cookie
  const cookie = context.cookies.get('portfolio_auth');
  const expected = import.meta.env.PORTFOLIO_PASSWORD;

  if (!expected) {
    // No password configured — fail open in dev
    return next();
  }

  if (cookie?.value === expected) return next();

  // Redirect to login
  const redirectTo = encodeURIComponent(pathname);
  return context.redirect(`/login?redirect=${redirectTo}`);
});
