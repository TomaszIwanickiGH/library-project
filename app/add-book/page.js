"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function AddBook() {
  const { data: session } = useSession();
  const [tytul, setTytul] = useState("");
  const [gatunek, setGatunek] = useState("");
  const [rok_wydania, setRokWydania] = useState("");
  const [opis, setOpis] = useState("");
  const [autor, setAutor] = useState("");
  const [obraz, setObraz] = useState("");
  const [ilosc, setIlosc] = useState(0);  // Dodajemy stan dla ilości książek
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Logowanie sesji
  console.log('Session:', session);

  // Sprawdzenie, czy użytkownik jest administratorem
  if (!session || session.user.email !== "admin@admin.pl") {
    return <p>Nie masz uprawnień do dodawania książek. Zaloguj się jako administrator.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Sprawdzenie poprawności formularza
    if (!tytul || !gatunek || !rok_wydania || !autor || ilosc < 1) {
      setError("Wszystkie pola są wymagane, a ilość książek musi być większa niż 0.");
      return;
    }

    try {
      const response = await fetch("/api/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tytul,
          gatunek,
          rok_wydania,
          opis,
          autor,
          obraz,
          ilosc,  // Przesyłamy ilość książek do API
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Książka została pomyślnie dodana!");
        setError(null);
        // Możesz również zresetować pola formularza, jeśli chcesz
        setTytul("");
        setGatunek("");
        setRokWydania("");
        setOpis("");
        setAutor("");
        setObraz("");
        setIlosc(0);  // Resetowanie ilości
      } else {
        setError(data.message || "Wystąpił błąd podczas dodawania książki.");
      }
    } catch (error) {
      setError("Błąd połączenia. Spróbuj ponownie.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Dodaj książkę</h1>
      
      {/* Wyświetlanie komunikatu o błędzie */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Wyświetlanie komunikatu o sukcesie */}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="tytul" className="block font-medium">Tytuł</label>
          <input
            type="text"
            id="tytul"
            value={tytul}
            onChange={(e) => setTytul(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="gatunek" className="block font-medium">Gatunek</label>
          <input
            type="text"
            id="gatunek"
            value={gatunek}
            onChange={(e) => setGatunek(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="rok_wydania" className="block font-medium">Rok wydania</label>
          <input
            type="number"
            id="rok_wydania"
            value={rok_wydania}
            onChange={(e) => setRokWydania(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="autor" className="block font-medium">Autor</label>
          <input
            type="text"
            id="autor"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="opis" className="block font-medium">Opis</label>
          <textarea
            id="opis"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="obraz" className="block font-medium">Link do obrazu (opcjonalnie)</label>
          <input
            type="text"
            id="obraz"
            value={obraz}
            onChange={(e) => setObraz(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="ilosc" className="block font-medium">Ilość książek</label>
          <input
            type="number"
            id="ilosc"
            value={ilosc}
            onChange={(e) => setIlosc(e.target.value)}
            required
            min="1"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Dodaj książkę
        </button>
      </form>
    </div>
  );
}
