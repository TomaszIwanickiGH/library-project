"use client"

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminLoans() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState([]);
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
        } catch (err) {
          console.error("Błąd:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchLoans();
    }
  }, [session]);

  const handleAction = async (loanId, action) => {
    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),  // Przesyłamy akcję (approve lub reject)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", errorData);
        alert(`Błąd: ${errorData.message}`);
        return;
      }
  
      const responseData = await response.json();
      alert(responseData.message);
  
      // Usuwamy wypożyczenie z listy po zatwierdzeniu lub odrzuceniu
      setLoans(loans.filter((loan) => loan._id !== loanId));
    } catch (err) {
      console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", err);
      alert("Wystąpił błąd podczas zatwierdzania lub odrzucania wypożyczenia.");
    }
  };

  if (loading) return <div>Ładowanie wypożyczeń...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-[#6b4f33] mb-8">Wypożyczenia czekające na zatwierdzenie</h2>
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

    {loan.status === "czeka na zatwierdzenie" && (
      <div className="flex gap-2">
        <button
          onClick={() => handleAction(loan._id, "approve")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Akceptuj
        </button>
        <button
          onClick={() => handleAction(loan._id, "reject")}
          className="bg-red-500 text-white px-4 py-2 rounded"
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
};

