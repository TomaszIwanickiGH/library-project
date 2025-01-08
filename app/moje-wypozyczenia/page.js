"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function MyLoans() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Ładowanie wypożyczeń...</div>;
  if (error) return <div>Błąd: {error}</div>;
  if (!loans.length) return <div>Nie masz żadnych wypożyczeń</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Moje wypożyczenia</h2>
      <ul className="space-y-4">
        {loans.map((loan) => (
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
          </li>
        ))}
      </ul>
    </div>
  );
};