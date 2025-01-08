import connectToDatabase from "../../lib/mongodb";  // Importujemy funkcję do połączenia z MongoDB
import Book from "../../models/Book";  // Importujemy model Book

export default async function handler(req, res) {
  const { method } = req;
  const { limit = 12, search = "" } = req.query;  // Pobieramy limit i opcjonalne zapytanie 'search'

  if (method === "GET") {
    try {
      await connectToDatabase();  // Nawiązujemy połączenie z MongoDB

      // Jeśli istnieje zapytanie wyszukiwania, filtrujemy książki po tytule
      const query = search ? { tytul: { $regex: search, $options: "i" } } : {};  // Case-insensitive wyszukiwanie

      // Pobierz książki z bazy danych
      const books = await Book.find(query).limit(Number(limit));

      res.status(200).json({ books });
    } catch (error) {
      console.error("Błąd podczas pobierania książek:", error);  // Logowanie błędu
      res.status(500).json({ message: "Wystąpił błąd podczas pobierania książek." });
    }
  } else {
    res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
