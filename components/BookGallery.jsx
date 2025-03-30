'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Star, ThumbsUp, BookOpen } from 'lucide-react';
import BookCover from '@/components/BookCover';

export default function BookGallery({ books, onLoadMore, isLoading, hasMore }) {
  const [expandedBookId, setExpandedBookId] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      onLoadMore();
    }
  }, [inView, isLoading, hasMore, onLoadMore]);

  const toggleBookExpand = (bookId) => {
    setExpandedBookId(expandedBookId === bookId ? null : bookId);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative aspect-[2/3] w-full">
              <BookCover book={book} className="absolute inset-0" />
            </div>

            <CardHeader className="px-4 py-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{book.authors.join(', ')}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{book.publishYear}</Badge>
              </div>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-grow">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  <span>{book.likes}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>{book.pages} p.</span>
                </div>
                <div>
                  <span>${book.price}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => toggleBookExpand(book.id)}
              >
                {expandedBookId === book.id ? "Hide Details" : "View Details"}
              </Button>
            </CardFooter>
            {expandedBookId === book.id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <Card className="w-full max-w-3xl max-h-screen overflow-auto">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold">{book.title}</h2>
                      <p className="text-muted-foreground">by {book.authors.join(', ')}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedBookId(null)}>
                      ✕
                    </Button>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex justify-center">
                        <BookCover book={book} className="w-48 h-64" />
                      </div>
                      <div className="space-y-4 col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Publisher</p>
                            <p className="text-sm text-muted-foreground">{book.publisher}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Published</p>
                            <p className="text-sm text-muted-foreground">{book.publishYear}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Genre</p>
                            <Badge variant="outline">{book.genre}</Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Pages</p>
                            <p className="text-sm text-muted-foreground">{book.pages}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Language</p>
                            <p className="text-sm text-muted-foreground">{book.language}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Price</p>
                            <p className="text-sm text-muted-foreground">${book.price}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Likes</p>
                            <p className="text-sm text-muted-foreground">{book.likes}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">ISBN</p>
                            <p className="text-sm font-mono text-muted-foreground">{book.isbn}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Summary</p>
                          <p className="text-sm text-muted-foreground">{book.summary}</p>
                        </div>
                      </div>
                    </div>
                    {book.reviews && book.reviews.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-4">Reviews ({book.reviews.length})</h4>
                        <ScrollArea className="h-64">
                          <div className="space-y-4">
                            {book.reviews.map((review, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium text-sm">{review.reviewer}</div>
                                  <div className="flex items-center">
                                    {Array.from({ length: review.rating }, (_, i) => (
                                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                    <span className="text-sm text-muted-foreground ml-2">{review.date}</span>
                                  </div>
                                </div>
                                <p className="text-sm">{review.text}</p>
                                {index < book.reviews.length - 1 && <Separator className="my-2" />}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="justify-end">
                    <Button variant="outline" onClick={() => setExpandedBookId(null)}>Close</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </Card>
        ))}
      </div>
      {hasMore && (
        <div ref={ref} className="flex justify-center py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[2/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
              Load more books
            </Button>
          )}
        </div>
      )}

      {books.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <h3 className="text-lg font-medium">No books found</h3>
          <p className="text-muted-foreground">Try changing your settings to generate different books.</p>
        </div>
      )}
    </div>
  );
};