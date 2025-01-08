"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/works/${bookId}.json`);
        if (!response.ok) {
          throw new Error("Coś poszło nie tak podczas ładowania szczegółów książki.");
        }
        const data = await response.json();

        if (data.edition_key && data.edition_key.length > 0) {
          const editionResponse = await fetch(
            `https://openlibrary.org/books/${data.edition_key[0]}.json`
          );
          if (editionResponse.ok) {
            const editionData = await editionResponse.json();
            data.publish_year = editionData.publish_date || "Nieznany rok";
            data.publisher = editionData.publishers ? editionData.publishers[0] : "Nieznane wydawnictwo";
          }
        }

        setBook(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleBorrowBook = () => {
    alert(`Wypożyczono książkę: ${book.title}`);
    // Możesz tutaj dodać logikę dla wypożyczania książki np. wywołanie API
  };

  if (loading) {
    return <div>Ładowanie szczegółów książki...</div>;
  }

  if (error) {
    return <div>Wystąpił błąd: {error}</div>;
  }

  const coverUrl = book?.covers
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : "https://via.placeholder.com/150";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Szczegóły książki</h2>

      {book && (
        <div className="bg-white shadow-md rounded-lg p-8">
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-semibold text-[#5b3d44] mb-2">{book.title}</h3>
          <p className="text-[#6b4f33] italic mb-4">
            Autor: {book.authors ? book.authors.map((author) => author.name).join(", ") : "Nieznany autor"}
          </p>
          <p className="text-[#6b4f33] italic mb-4">
            Rok wydania: {book.publish_year || "Nieznany rok"}
          </p>
          <p className="text-[#6b4f33] italic mb-4">
            Wydawnictwo: {book.publisher || "Nieznane wydawnictwo"}
          </p>
          <p className="text-[#4e9a73] font-medium mb-4">
            Gatunki: {book.subjects ? book.subjects.slice(0, 5).join(", ") : "Brak gatunku"}
          </p>
          <p className="mb-8">{book.description?.value || book.description || "Brak opisu"}</p>
          <button
            onClick={handleBorrowBook}
            className="w-full py-3 bg-[#4e9a73] text-white text-lg font-semibold rounded-lg hover:bg-[#38745b] transition duration-300"
          >
            Wypożycz książkę
          </button>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
