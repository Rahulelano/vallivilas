import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await fetch("/api/announcements");
      return response.json();
    }
  });

  useEffect(() => {
    if (announcements && announcements.length > 0) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % announcements.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [announcements]);

  if (isLoading || !announcements || announcements.length === 0) return null;

  return (
    <div className="announcement-bar announcement-section flex items-center justify-center gap-4 relative">
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + announcements.length) % announcements.length)}
        className="absolute left-4 text-primary-foreground/70 hover:text-primary-foreground"
        aria-label="Previous announcement"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="font-medium text-center px-8">{announcements[current].text}</span>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % announcements.length)}
        className="absolute right-4 text-primary-foreground/70 hover:text-primary-foreground"
        aria-label="Next announcement"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
