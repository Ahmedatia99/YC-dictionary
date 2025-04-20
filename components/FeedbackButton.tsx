"use client";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';

export default function FeedbackButton() {
  const handleClick = () => {
    // First capture a message or error to get an eventId
    const eventId = Sentry.captureMessage('User Feedback');
    
    // Then show the report dialog with that eventId
    Sentry.showReportDialog({
      eventId: eventId,
      dsn: "b8f553978cdb9a450199efa76c181a94@o4508413719150592.ingest.us.sentry.io/4509175030874112",
    });
  };

  return <Button onClick={handleClick} className="text-white cursor-pointer"> <Mail /> Feedback</Button>;
}