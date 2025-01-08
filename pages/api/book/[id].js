import Book from "../../../models/Book";
import connectToDatabase from "../../../lib/mongodb"; // Zakładając, że masz tę funkcję do połączenia z bazą

export default async function handler(req, res) {
  const { id } = req.query;  // Odczytujemy parametr 'id' z zapytania
  
  // Łączenie z bazą danych
  try {
    await connectToDatabase();  // Upewnij się, że łączymy się przed zapytaniem
  } catch (error) {
    return res.status(500).json({ message: "Błąd połączenia z bazą danych" });
  }

  if (req.method === "GET") {
    try {
      // Sprawdzamy, czy książka o danym 'id' istnieje
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Książka nie znaleziona" });
      }

      res.status(200).json(book);  // Zwracamy dane książki
    } catch (error) {
      console.error(error);  // Zapisujemy szczegóły błędu w konsoli
      res.status(500).json({ message: "Błąd podczas pobierania książki" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Sprawdzamy, czy książka o danym 'id' istnieje
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Książka nie znaleziona" });
      }

      // Usuwamy książkę z bazy danych
      await Book.findByIdAndDelete(id);

      return res.status(200).json({ message: "Książka została usunięta" });
    } catch (error) {
      console.error(error);  // Zapisujemy szczegóły błędu w konsoli
      return res.status(500).json({ message: "Błąd podczas usuwania książki" });
    }
  } else {
    res.status(405).json({ message: "Metoda nie dozwolona" });  // Obsługujemy tylko metody GET i DELETE
  }
}
