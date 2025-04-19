"use client";
import * as Sentry from '@sentry/nextjs';

export default function FeedbackButton() {
  return (
    <button
      onClick={() => Sentry.showReportDialog()}
      className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
    >
      Send Feedback
    </button>
  );
}