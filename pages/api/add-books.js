import Book from "../../models/Book"; // Upewnij się, że masz odpowiedni model Book
import  connectToDatabase  from "../../lib/mongodb"; // Funkcja do łączenia się z bazą danych

async function addBooks() {
  await connectToDatabase(); // Połącz się z bazą danych

  const books = [
    {
      tytul: "1984",
      gatunek: "Dystopia",
      rok_wydania: 1949,
      autor: "George Orwell",
      opis: "Dystopijna powieść o totalitarnym reżimie.",
      obraz: "https://covers.openlibrary.org/b/id/8225260-M.jpg",
    },
    {
      tytul: "Brave New World",
      gatunek: "Science Fiction",
      rok_wydania: 1932,
      autor: "Aldous Huxley",
      opis: "Powieść o przyszłości, w której kontrola społeczeństwa odbywa się za pomocą technologii.",
      obraz: "https://covers.openlibrary.org/b/id/7318339-M.jpg",
    },
    {
      tytul: "To Kill a Mockingbird",
      gatunek: "Drama",
      rok_wydania: 1960,
      autor: "Harper Lee",
      opis: "Klasyczna powieść amerykańska o rasizmie i sprawiedliwości.",
      obraz: "https://covers.openlibrary.org/b/id/10632749-M.jpg",
    },
    {
      tytul: "Moby-Dick",
      gatunek: "Adventure",
      rok_wydania: 1851,
      autor: "Herman Melville",
      opis: "Epicka opowieść o obsesji kapitana Ahab na punkcie białego wieloryba.",
      obraz: "https://covers.openlibrary.org/b/id/10738622-M.jpg",
    },
    {
      tytul: "Pride and Prejudice",
      gatunek: "Romance",
      rok_wydania: 1813,
      autor: "Jane Austen",
      opis: "Klasyczna powieść o miłości, społecznych normach i uprzedzeniach.",
      obraz: "https://covers.openlibrary.org/b/id/7224675-M.jpg",
    },
    {
      tytul: "The Great Gatsby",
      gatunek: "Tragedy",
      rok_wydania: 1925,
      autor: "F. Scott Fitzgerald",
      opis: "Historia o miłości, marzeniach i upadku amerykańskiego snu w latach 20. XX wieku.",
      obraz: "https://covers.openlibrary.org/b/id/7257030-M.jpg",
    },
    {
      tytul: "The Catcher in the Rye",
      gatunek: "Literary Fiction",
      rok_wydania: 1951,
      autor: "J.D. Salinger",
      opis: "Powieść o dojrzewaniu, tożsamości i odrzuceniu społecznych norm.",
      obraz: "https://covers.openlibrary.org/b/id/10589732-M.jpg",
    },
    {
      tytul: "War and Peace",
      gatunek: "Historical Fiction",
      rok_wydania: 1869,
      autor: "Leo Tolstoy",
      opis: "Opowieść o wojnie napoleońskiej i jej wpływie na rosyjskie społeczeństwo.",
      obraz: "https://covers.openlibrary.org/b/id/10824333-M.jpg",
    },
    {
      tytul: "Les Misérables",
      gatunek: "Historical Fiction",
      rok_wydania: 1862,
      autor: "Victor Hugo",
      opis: "Historia o sprawiedliwości, miłości i odkupieniu w burzliwych czasach post-rewolucyjnej Francji.",
      obraz: "https://covers.openlibrary.org/b/id/10696762-M.jpg",
    },
    {
      tytul: "Crime and Punishment",
      gatunek: "Psychological Fiction",
      rok_wydania: 1866,
      autor: "Fyodor Dostoevsky",
      opis: "Powieść o moralności, winie i odkupieniu w Rosji carskiej.",
      obraz: "https://covers.openlibrary.org/b/id/10484098-M.jpg",
    }
  ];

  try {
    for (let book of books) {
      const newBook = new Book(book); // Tworzymy nową książkę
      await newBook.save(); // Zapisujemy książkę do bazy danych
    }
    console.log("Książki zostały pomyślnie dodane do bazy danych.");
  } catch (error) {
    console.error("Wystąpił błąd podczas dodawania książek:", error);
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Próbuję dodać książki...");
      await addBooks();
      res.status(200).json({ message: "Książki zostały dodane." });
    } catch (error) {
      console.error("Błąd w backendzie:", error);
      res.status(500).json({ message: "Wystąpił błąd podczas dodawania książek." });
    }
  } else {
    console.log("Metoda nieobsługiwana:", req.method);
    res.status(405).json({ message: "Metoda nie dozwolona." });
  }
}
