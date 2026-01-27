'use client';

import { useEffect, useState } from 'react';

interface TimelineItem {
  id: string;
  label: string;
  date: string;
  year: number;
}

interface CustomTimelineProps {
  collectionUrl: string;
}

export default function CustomTimeline({ collectionUrl }: CustomTimelineProps) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        // Fetch the collection
        const collectionResponse = await fetch(collectionUrl);
        const collection = await collectionResponse.json();

        // Get all manifest IDs from the collection
        const manifestIds = collection.items?.map((item: any) => item.id) || [];

        // Fetch each manifest and extract dates
        const timelineData: TimelineItem[] = [];

        for (const manifestId of manifestIds) {
          try {
            const manifestResponse = await fetch(manifestId);
            const manifest = await manifestResponse.json();

            // Extract date from metadata
            const dateMetadata = manifest.metadata?.find(
              (m: any) => m.label?.none?.[0]?.toLowerCase() === 'date'
            );

            if (dateMetadata) {
              const dateValue = dateMetadata.value?.none?.[0];
              const year = parseInt(dateValue?.match(/\d{4}/)?.[0] || '0');

              if (year > 0) {
                timelineData.push({
                  id: manifest.id,
                  label: manifest.label?.none?.[0] || 'Untitled',
                  date: dateValue,
                  year: year,
                });
              }
            }
          } catch (err) {
            console.error(`Error fetching manifest ${manifestId}:`, err);
          }
        }

        // Sort by year
        timelineData.sort((a, b) => a.year - b.year);
        setItems(timelineData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load timeline data');
        setLoading(false);
        console.error(err);
      }
    }

    fetchTimeline();
  }, [collectionUrl]);

  if (loading) {
    return <div className="text-center py-8">Loading timeline...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8">No dated items found in collection.</div>;
  }

  return (
    <div className="timeline-container my-8">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {/* Timeline items */}
        {items.map((item, index) => (
          <div key={item.id} className="relative pl-20 pb-8">
            {/* Year dot */}
            <div className="absolute left-6 top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>

            {/* Content */}
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="font-bold text-lg text-blue-600">{item.year}</div>
              <div className="text-gray-800 mt-1">
                
                  href={`/work/${item.id.split('/').pop()}`}
                  className="hover:underline"
                >
                  {item.label}
                </a>
              </div>
              <div className="text-sm text-gray-500 mt-1">{item.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
