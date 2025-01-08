import Book from "../../models/Book";
import  connectToDatabase  from "../../lib/mongodb"; 

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { tytul, gatunek, rok_wydania, opis, autor, obraz } = req.body;

    // Jeśli użytkownik nie podał obrazu, ustawiamy uniwersalny obraz
    const defaultImage = "https://via.placeholder.com/300x450.png?text=Book+Cover";
    const bookImage = obraz || defaultImage;  // Jeśli 'obraz' jest pusty, przypisujemy 'defaultImage'

    try {
      await connectToDatabase();  // Łączenie z bazą danych

      const newBook = new Book({
        tytul,
        gatunek,
        rok_wydania,
        opis,
        autor,
        obraz: bookImage,  // Używamy obrazka, który może być domyślny
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