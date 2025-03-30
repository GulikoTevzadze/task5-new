'use client';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card, CardContent,
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Star } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import BookCover from '@/components/BookCover';
import { useInView } from 'react-intersection-observer';
import React from 'react';

export default function BookTable({ books, onLoadMore, isLoading, hasMore }) {
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
    <div className="rounded-md border">
      <Table>
        <TableCaption>
          {books.length > 0 ?
            `Showing ${books.length} book${books.length !== 1 ? 's' : ''}` :
            'No books to display'}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead className="w-44">ISBN</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author(s)</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead className="w-16">Year</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <React.Fragment key={book.id}>
              <TableRow
                className={expandedBookId === book.id ? 'bg-muted' : 'hover:bg-muted/50 transition-colors'}
              >
                <TableCell className="font-medium">{book.id}</TableCell>
                <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authors.join(', ')}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publishYear}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookExpand(book.id)}
                    aria-label={expandedBookId === book.id ? "Collapse details" : "Expand details"}
                  >
                    {expandedBookId === book.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedBookId === book.id && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <Card className="m-2 border-0 shadow-none">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex justify-center">
                            <BookCover book={book} className="w-48 h-64" />
                          </div>
                          <div className="space-y-4 col-span-2">
                            <div>
                              <h3 className="text-lg font-semibold">{book.title}</h3>
                              <p className="text-sm text-muted-foreground">by {book.authors.join(', ')}</p>
                            </div>

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
                    </Card>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          {hasMore && (
            <TableRow ref={ref}>
              <TableCell colSpan={7} className="h-24 text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ) : (
                  <Button variant="ghost" onClick={onLoadMore} disabled={isLoading}>
                    Load more books
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )}
          {books.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No books found. Try changing your settings.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};