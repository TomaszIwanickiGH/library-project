"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const BooksSection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(12); // Limit książek do załadowania

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/subjects/science_fiction.json?limit=${limit}`
        );
        if (!response.ok) {
          throw new Error('Błąd podczas ładowania danych');
        }
        const data = await response.json();
        setBooks(data.works || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [limit]);

  const loadMoreBooks = () => {
    setLimit(limit + 4);
  };

  if (loading) return <div>Ładowanie książek...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Książki</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <Link
            href={`/book/works/${book.key.split('/').pop()}`}
            key={book.key}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-[#5b3d44]">{book.title}</h3>
            <p className="text-[#6b4f33]">{book.authors?.[0]?.name || 'Nieznany autor'}</p>
          </Link>
        ))}
      </div>
      <button
        onClick={loadMoreBooks}
        className="mt-8 px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition"
      >
        Załaduj więcej
      </button>
    </div>
  );
};

export default BooksSection;
