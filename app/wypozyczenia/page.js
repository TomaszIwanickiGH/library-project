"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminLoans() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]); // Zmienna do filtrowania wypożyczeń
  const [borrowers, setBorrowers] = useState([]); // Lista unikalnych wypożyczających
  const [selectedBorrower, setSelectedBorrower] = useState("all"); // Wybrany wypożyczający
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && session.user.email === "admin@admin.pl") {
      const fetchLoans = async () => {
        try {
          const response = await fetch(`/api/loans?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error("Błąd podczas pobierania wypożyczeń");
          }
          const data = await response.json();
          setLoans(data);
          setFilteredLoans(data);

          // Pobieramy unikalnych wypożyczających
          const allBorrowers = data.map((loan) => loan.wypozyczajacy);
          setBorrowers(["all", ...new Set(allBorrowers)]);
        } catch (err) {
          console.error("Błąd:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchLoans();
    }
  }, [session]);

  // Filtrowanie na podstawie wybranego wypożyczającego
  useEffect(() => {
    if (selectedBorrower === "all") {
      setFilteredLoans(loans);
    } else {
      setFilteredLoans(loans.filter((loan) => loan.wypozyczajacy === selectedBorrower));
    }
  }, [selectedBorrower, loans]);

  const handleAction = async (loanId, action) => {
    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", errorData);
        alert(`Błąd: ${errorData.message}`);
        return;
      }

      const responseData = await response.json();
      alert(responseData.message);

      setLoans(loans.filter((loan) => loan._id !== loanId));
    } catch (err) {
      console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", err);
      alert("Wystąpił błąd podczas zatwierdzania lub odrzucania wypożyczenia.");
    }
  };

  if (loading) return <div>Ładowanie wypożyczeń...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8 text-center">
        Wypożyczenia czekające na zatwierdzenie
      </h2>

      {/* Dropdown do filtrowania wypożyczających */}
      <div className="mb-6">
        <select
          onChange={(e) => setSelectedBorrower(e.target.value)}
          value={selectedBorrower}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700"
        >
          {borrowers.map((borrower) => (
            <option key={borrower} value={borrower}>
              {borrower === "all" ? "Wszyscy wypożyczający" : borrower}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filteredLoans.map((loan) => (
          <li
            key={loan._id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h3 className="text-2xl sm:text-xl font-semibold text-[#5b3d44]">
                {loan.ksiazka_id.tytul}
              </h3>
              <p className="text-[#6b4f33] italic text-sm sm:text-base">
                Autor: {loan.ksiazka_id.autor}
              </p>
              <p className="text-[#6b4f33] text-sm sm:text-base">
                Status: {loan.status}
              </p>
              <p className="text-[#6b4f33] text-sm sm:text-base">
                Wypożyczający: {loan.wypozyczajacy}
              </p>
              <p className="text-[#6b4f33] text-sm sm:text-base">
                Data wypożyczenia:{" "}
                {new Date(loan.data_wypozyczenia).toLocaleDateString()}
              </p>
            </div>

            {loan.status === "czeka na zatwierdzenie" && (
              <div className="flex gap-2 sm:flex-row flex-col">
                <button
                  onClick={() => handleAction(loan._id, "approve")}
                  className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                >
                  Akceptuj
                </button>
                <button
                  onClick={() => handleAction(loan._id, "reject")}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm"
                >
                  Odrzuć
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
