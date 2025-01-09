import connectToDatabase from "../../../lib/mongodb";
import Loan from "../../../models/Loan";
import Book from "../../../models/Book"; // Załóżmy, że masz model "Book" dla książek

export default async function handler(req, res) {
  const { method, query } = req;
  const { loanId } = query;

  await connectToDatabase();

  if (method === "DELETE") {
    try {
      // Znajdź wypożyczenie
      const loan = await Loan.findById(loanId);

      if (!loan) {
        return res.status(404).json({ message: "Wypożyczenie nie znalezione" });
      }

      // Zwiększ ilość książki w bazie danych
      const book = await Book.findById(loan.ksiazka_id); // zakładamy, że masz pole ksiazka_id w Loan, które odnosi się do książki
      if (book) {
        book.ilosc += 1;  // Zwiększamy ilość książki o 1
        await book.save(); // Zapisujemy zmiany w książce
      }

      // Usuń wypożyczenie z bazy danych
      await Loan.findByIdAndDelete(loanId);

      return res.status(200).json({ message: "Wypożyczenie zostało usunięte, książka zwrócona." });
    } catch (error) {
      console.error("Błąd podczas usuwania wypożyczenia:", error);
      return res.status(500).json({ message: "Wystąpił błąd podczas usuwania wypożyczenia." });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
