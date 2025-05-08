import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { PostHogClient } = await import('~/lib/posthog');
    const posthog = PostHogClient();

    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie.toString();
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/
      );

      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error('Error parsing PostHog cookie:', e);
        }
      }
    }

    posthog.captureException(err, distinctId || undefined);

    await posthog.shutdown();
  }
};
