'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SettingsPanel from '@/components/SettingsPanel.jsx';
import BookTable from '@/components/BookTable';
import BookGallery from '@/components/BookGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CsvExport from '@/components/CsvExport';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSeed = useMemo(() => searchParams.get('seed') || 'default-seed', [searchParams]);
  const initialRegion = useMemo(() => searchParams.get('region') || 'en_US', [searchParams]);
  const initialAvgLikes = useMemo(() => parseFloat(searchParams.get('avgLikes') || '3.5'), [searchParams]);
  const initialAvgReviews = useMemo(() => parseFloat(searchParams.get('avgReviews') || '2.0'), [searchParams]);

  const [seed, setSeed] = useState(initialSeed);
  const [region, setRegion] = useState(initialRegion);
  const [avgLikes, setAvgLikes] = useState(initialAvgLikes);
  const [avgReviews, setAvgReviews] = useState(initialAvgReviews);
  const [viewMode, setViewMode] = useState('table');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!searchParams.get('seed')) {
      setSeed(Math.random().toString(36).substring(7));
    }
  }, [searchParams]);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set('seed', seed);
    params.set('region', region);
    params.set('avgLikes', avgLikes.toString());
    params.set('avgReviews', avgReviews.toString());
    router.replace(`?${params.toString()}`);
  }, [searchParams, seed, region, avgLikes, avgReviews, router]);

  const fetchBooks = useCallback(async (pageToFetch, reset = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        seed,
        region,
        avgLikes,
        avgReviews,
        page: pageToFetch,
        pageSize: pageToFetch === 1 ? 20 : 10
      });

      const response = await fetch(`/api/book?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch books');

      const data = await response.json();

      setBooks(prev => (reset ? data.books : [...prev, ...data.books]));
      setPage(pageToFetch);
      setHasMore(data.books.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [seed, region, avgLikes, avgReviews]);

  useEffect(() => {
    updateUrl();
    fetchBooks(1, true);
  }, [updateUrl, fetchBooks]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchBooks(page + 1);
    }
  };

  const handleSettingsChange = (newSettings) => {
    if (newSettings.seed !== undefined) setSeed(newSettings.seed);
    if (newSettings.region !== undefined) setRegion(newSettings.region);
    if (newSettings.avgLikes !== undefined) setAvgLikes(newSettings.avgLikes);
    if (newSettings.avgReviews !== undefined) setAvgReviews(newSettings.avgReviews);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Book Data Generator</h1>

      <SettingsPanel
        seed={seed}
        region={region}
        avgLikes={avgLikes}
        avgReviews={avgReviews}
        onSettingsChange={handleSettingsChange}
      />

      <div className="flex justify-between items-center mt-8 mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="gallery">Gallery View</TabsTrigger>
            </TabsList>

            <CsvExport books={books} />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}

          <TabsContent value="table" className="w-full">
            <BookTable
              books={books}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          </TabsContent>

          <TabsContent value="gallery" className="w-full">
            <BookGallery
              books={books}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
              hasMore={hasMore}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
