
"use client"; 
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: "https://b8f553978cdb9a450199efa76c181a94@o4508413719150592.ingest.us.sentry.io/4509175030874112",
    sendDefaultPii: true,

    integrations: [
      Sentry.feedbackIntegration({
        colorScheme: "system",
      }),
    ],
  
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

