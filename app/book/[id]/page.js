"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";  // Używamy 'useParams' do dynamicznych tras w app directory
import { useSession } from "next-auth/react";

const BookDetails = () => {
  const { data: session, status } = useSession();
  const { id } = useParams();  // Odczytujemy parametr 'id' z URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/${id}`);  // Używamy dynamicznego id w zapytaniu
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania książki");
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);  // Ustawiamy błąd, jeśli wystąpi
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć tę książkę?");
    if (confirmed) {
      try {
        const response = await fetch(`/api/book/${id}`, {
          method: "DELETE",  // Usuwamy książkę za pomocą metody DELETE
        });

        if (!response.ok) {
          throw new Error("Błąd podczas usuwania książki");
        }

        alert("Książka została usunięta");
        window.location.href = "/";  // Przekierowanie na stronę główną lub listę książek
      } catch (err) {
        alert("Wystąpił błąd: " + err.message);
      }
    }
  };

  const handleBorrowBook = async () => {
    try {
      console.log("Rozpoczęto wypożyczanie...");
      console.log("Książka ID:", book._id);
      console.log("Wypożyczający:", session.user.email);

      const response = await fetch("/api/loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ksiazka_id: book._id,           // ID książki
          wypozyczajacy: session.user.email, // E-mail użytkownika
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd serwera:", errorData);
        alert(`Błąd podczas wypożyczania książki: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      alert("Książka została wypożyczona!");
    } catch (error) {
      console.error("Nie udało się połączyć z serwerem:", error);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  if (loading) return <div>Ładowanie książki...</div>;
  if (error) return <div>Błąd: {error}</div>;

  if (!book) return <div>Nie znaleziono książki</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Szczegóły książki</h2>

      <div className="bg-white shadow-md rounded-lg p-8">
        {/* Wyświetlanie obrazu książki */}
        <img
          src={book.obraz || "/default-image.jpg"}  // Jeśli obraz jest pusty, pokazujemy domyślny
          alt={book.tytul}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />

        {/* Wyświetlanie ilości książek */}
        <p className="text-[#6b4f33] italic mb-4">
          Ilość dostępnych książek: {book.ilosc}
        </p>

        {/* Tytuł książki */}
        <h3 className="text-2xl font-semibold text-[#5b3d44] mb-2">{book.tytul}</h3>

        {/* Autor książki */}
        <p className="text-[#6b4f33] italic mb-4">
          Autor: {book.autor || "Nieznany autor"}
        </p>

        {/* Rok wydania książki */}
        <p className="text-[#6b4f33] italic mb-4">
          Rok wydania: {book.rok_wydania || "Nieznany rok"}
        </p>

        {/* Gatunek książki */}
        <p className="text-[#6b4f33] italic mb-4">
          Gatunek: {book.gatunek || "Nieznany gatunek"}
        </p>

        {/* Opis książki */}
        <p className="mb-8">{book.opis || "Brak opisu"}</p>

        {/* Komunikat o braku książek i zablokowanie przycisku */}
        {book.ilosc > 0 ? (
          <button
            onClick={handleBorrowBook}
            className="w-full py-3 bg-[#4e9a73] text-white text-lg font-semibold rounded-lg hover:bg-[#38745b] transition duration-300"
          >
            Wypożycz książkę
          </button>
        ) : (
          <div className="w-full py-3 bg-gray-300 text-white text-lg font-semibold rounded-lg text-center">
            Brak dostępnych książek
          </div>
        )}

        {/* Przycisk do usunięcia książki, widoczny tylko dla admina */}
        {session && session.user.email === "admin@admin.pl" && (
          <button
            onClick={handleDelete}
            className="w-full mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Usuń książkę
          </button>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
