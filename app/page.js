"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserActions from "./components/UserActions";
import useSearchStore from "../stores/searchStore"; // Importujemy store do zarządzania stanem wyszukiwania

const BooksSection = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // Zmienna do przechowywania przefiltrowanych książek
  const [genres, setGenres] = useState([]); // Lista dostępnych gatunków
  const [authors, setAuthors] = useState([]); // Lista dostępnych autorów
  const [selectedGenre, setSelectedGenre] = useState("all"); // Wybrany gatunek
  const [selectedAuthor, setSelectedAuthor] = useState("all"); // Wybrany autor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(12); // Limit książek do załadowania
  const { searchQuery, setSearchQuery } = useSearchStore(); // Dostęp do stanu wyszukiwania i funkcji

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`/api/books?limit=${limit}`);
        if (!response.ok) {
          throw new Error("Błąd podczas ładowania danych");
        }

        const data = await response.json();
        console.log("Odpowiedź z API:", data);
        setBooks(data.books || []);
        setFilteredBooks(data.books || []); // Początkowo pokazujemy wszystkie książki

        // Pobieramy unikalne gatunki i autorów
        const allGenres = data.books.map((book) => book.gatunek).flat();
        const allAuthors = data.books.map((book) => book.autor).flat();
        setGenres(["all", ...new Set(allGenres)]);
        setAuthors(["all", ...new Set(allAuthors)]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [limit]);

  // Funkcja do ładowania więcej książek
  const loadMoreBooks = () => {
    setLimit(limit + 4);
  };

  // Funkcja do filtrowania książek na podstawie tytułu, gatunku i autora
  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter((book) =>
        book.tytul.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((book) => book.gatunek === selectedGenre);
    }

    if (selectedAuthor !== "all") {
      filtered = filtered.filter((book) => book.autor === selectedAuthor);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedGenre, selectedAuthor, books]);

  if (loading) return <div>Ładowanie książek...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <UserActions />
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Książki</h2>

      {/* Menu gatunków i autorów */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          onChange={(e) => setSelectedGenre(e.target.value)}
          value={selectedGenre}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "Wszystkie gatunki" : genre}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedAuthor(e.target.value)}
          value={selectedAuthor}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700"
        >
          {authors.map((author) => (
            <option key={author} value={author}>
              {author === "all" ? "Wszyscy autorzy" : author}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredBooks.map((book) => (
          <Link
            href={`/book/${book._id}`}
            key={book._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={book.obraz || "/default-image.jpg"}
              alt={book.tytul}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-[#5b3d44]">{book.tytul}</h3>
            <p className="text-[#6b4f33]">{book.autor || "Nieznany autor"}</p>
          </Link>
        ))}
      </div>

      {filteredBooks.length > 0 && (
        <button
          onClick={loadMoreBooks}
          className="mt-8 px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition"
        >
          Załaduj więcej
        </button>
      )}
    </div>
  );
};

export default BooksSection;
