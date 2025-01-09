// pages/api/add-book.js
import Book from "../../models/Book";
import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { tytul, gatunek, rok_wydania, opis, autor, obraz, ilosc } = req.body;  // Odbieramy 'ilosc' z requestu

    // Jeśli użytkownik nie podał obrazu, ustawiamy uniwersalny obraz
    const defaultImage = "https://via.placeholder.com/300x450.png?text=Book+Cover";
    const bookImage = obraz || defaultImage;  // Jeśli 'obraz' jest pusty, przypisujemy 'defaultImage'

    // Walidacja ilości książek
    if (!ilosc || ilosc < 1) {
      return res.status(400).json({ message: "Ilość książek musi być większa niż 0." });
    }

    try {
      await connectToDatabase();  // Łączenie z bazą danych

      const newBook = new Book({
        tytul,
        gatunek,
        rok_wydania,
        opis,
        autor,
        obraz: bookImage,  // Używamy obrazka, który może być domyślny
        ilosc,  // Dodajemy ilość książek
      });

      await newBook.save();  // Zapisanie książki do bazy danych
      return res.status(201).json({ message: "Książka została pomyślnie dodana!" });
    } catch (error) {
      console.error("Error saving book:", error);
      return res.status(500).json({ message: "Błąd serwera. Spróbuj ponownie." });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona." });
  }
}
