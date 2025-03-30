'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { CSVLink } from 'react-csv';

export default function CsvExport({ books }) {
  const csvData = books.map(book => ({
    'ID': book.id,
    'ISBN': book.isbn,
    'Title': book.title,
    'Authors': book.authors.join(', '),
    'Publisher': book.publisher,
    'Year': book.publishYear,
    'Genre': book.genre,
    'Language': book.language,
    'Pages': book.pages,
    'Likes': book.likes,
    'Price': book.price,
    'Reviews': book.reviews ? book.reviews.length : 0
  }));

  const csvHeaders = [
    { label: 'ID', key: 'ID' },
    { label: 'ISBN', key: 'ISBN' },
    { label: 'Title', key: 'Title' },
    { label: 'Authors', key: 'Authors' },
    { label: 'Publisher', key: 'Publisher' },
    { label: 'Year', key: 'Year' },
    { label: 'Genre', key: 'Genre' },
    { label: 'Language', key: 'Language' },
    { label: 'Pages', key: 'Pages' },
    { label: 'Likes', key: 'Likes' },
    { label: 'Price', key: 'Price' },
    { label: 'Reviews', key: 'Reviews' }
  ];

  return (
    <CSVLink
      data={csvData}
      headers={csvHeaders}
      filename="book_data.csv"
      className="no-underline"
    >
      <Button variant="outline" size="sm" className="flex items-center gap-2">
        <Download size={16} />
        Export to CSV
      </Button>
    </CSVLink>
  );
};

