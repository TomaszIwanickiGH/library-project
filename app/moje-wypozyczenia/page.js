"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MyLoans() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchLoans = async () => {
      if (!session || !session.user) return;

      try {
        const response = await fetch(`/api/my-loans?email=${session.user.email}`);

        if (!response.ok) {
          throw new Error("Błąd podczas pobierania wypożyczeń");
        }

        const data = await response.json();
        setLoans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [session]);

  // Filtrowanie wypożyczeń na podstawie statusu
  const filteredLoans = loans.filter((loan) => {
    if (statusFilter === "all") return true;
    return loan.status.toLowerCase() === statusFilter;
  });

  // Funkcja obsługująca usuwanie wypożyczenia
  const handleReturnBook = async (loanId) => {
    try {
      const response = await fetch(`/api/my-loans/${loanId}`, {
        method: "DELETE", // DELETE służy do zwrotu wypożyczenia
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd podczas oddawania książki:", errorData);
        alert(`Błąd: ${errorData.message}`);
        return;
      }

      // Usuwamy wypożyczenie z lokalnego stanu
      setLoans((prevLoans) => prevLoans.filter((loan) => loan._id !== loanId));
      alert("Książka została zwrócona i usunięta.");
    } catch (err) {
      console.error("Błąd podczas oddawania książki:", err);
      alert("Wystąpił błąd podczas oddawania książki.");
    }
  };

  // Funkcja obsługująca anulowanie wypożyczenia
  const handleCancelLoan = async (loanId) => {
    try {
      const response = await fetch(`/api/my-loans/${loanId}`, {
        method: "DELETE", // DELETE służy również do anulowania wypożyczenia
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd podczas anulowania wypożyczenia:", errorData);
        alert(`Błąd: ${errorData.message}`);
        return;
      }

      // Usuwamy wypożyczenie z lokalnego stanu
      setLoans((prevLoans) => prevLoans.filter((loan) => loan._id !== loanId));
      alert("Wypożyczenie zostało anulowane.");
    } catch (err) {
      console.error("Błąd podczas anulowania wypożyczenia:", err);
      alert("Wystąpił błąd podczas anulowania wypożyczenia.");
    }
  };

  if (loading) return <div>Ładowanie wypożyczeń...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Moje wypożyczenia</h2>

      {/* Zakładki do filtrowania */}
      <div className="mb-6">
        <button
          onClick={() => setStatusFilter("all")}
          className={`mr-4 px-4 py-2 rounded ${statusFilter === "all" ? "bg-[#4e9a73] text-white" : "bg-white text-[#4e9a73] border border-[#4e9a73]"}`}
        >
          Wszystkie
        </button>
        <button
          onClick={() => setStatusFilter("zatwierdzone")}
          className={`mr-4 px-4 py-2 rounded ${statusFilter === "zatwierdzone" ? "bg-[#4e9a73] text-white" : "bg-white text-[#4e9a73] border border-[#4e9a73]"}`}
        >
          Zatwierdzone
        </button>
        <button
          onClick={() => setStatusFilter("odrzucone")}
          className={`mr-4 px-4 py-2 rounded ${statusFilter === "odrzucone" ? "bg-[#4e9a73] text-white" : "bg-white text-[#4e9a73] border border-[#4e9a73]"}`}
        >
          Odrzucone
        </button>
        <button
          onClick={() => setStatusFilter("czeka na zatwierdzenie")}
          className={`mr-4 px-4 py-2 rounded ${statusFilter === "czeka na zatwierdzenie" ? "bg-[#4e9a73] text-white" : "bg-white text-[#4e9a73] border border-[#4e9a73]"}`}
        >
          Czeka na zatwierdzenie
        </button>
      </div>

      {/* Lista wypożyczeń */}
      <ul className="space-y-4">
        {filteredLoans.length === 0 ? (
          <div>Nie masz żadnych wypożyczeń w tej kategorii.</div>
        ) : (
          filteredLoans.map((loan) => (
            <li
              key={loan._id}
              className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-[#5b3d44]">{loan.ksiazka_id.tytul}</h3>
                <p className="text-[#6b4f33] italic">Autor: {loan.ksiazka_id.autor}</p>
                <p className="text-[#6b4f33]">Status: {loan.status}</p>
                <p className="text-[#6b4f33]">
                  Data wypożyczenia: {new Date(loan.data_wypozyczenia).toLocaleDateString()}
                </p>
              </div>

              {/* Przyciski do akcji */}
              {loan.status === "zatwierdzone" && (
                <button
                  onClick={() => handleReturnBook(loan._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Oddaj
                </button>
              )}
              {loan.status === "czeka na zatwierdzenie" && (
                <button
                  onClick={() => handleCancelLoan(loan._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Anuluj
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
