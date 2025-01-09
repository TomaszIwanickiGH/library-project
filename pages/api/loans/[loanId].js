import Loan from "../../../models/Loan";
import Book from "../../../models/Book";  // Dodajemy import modelu Book
import connectToDatabase from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { loanId } = req.query; // Pobranie ID wypożyczenia z URL

  if (req.method === "PATCH") {
    try {
      await connectToDatabase();

      const { action } = req.body;  // Oczekujemy, że akcja (approve lub reject) będzie przekazana w ciele zapytania
      const allowedActions = ["approve", "reject"];

      // Sprawdź, czy akcja jest poprawna
      if (!allowedActions.includes(action)) {
        return res.status(400).json({ message: "Niepoprawna akcja" });
      }

      // Zmieniamy status wypożyczenia na zatwierdzone lub odrzucone w zależności od akcji
      const status = action === "approve" ? "zatwierdzone" : "odrzucone";

      // Znalezienie wypożyczenia po ID
      const loan = await Loan.findById(loanId).populate("ksiazka_id");  // Zakładając, że ksiazka_id to referencja do kolekcji książek

      if (!loan) {
        return res.status(404).json({ message: "Nie znaleziono wypożyczenia" });
      }

      // Jeśli akcja to 'approve', zmniejszamy ilość książki o 1
      if (action === "approve") {
        const book = loan.ksiazka_id;  // Pobieramy książkę powiązaną z wypożyczeniem

        // Sprawdzamy, czy książka ma dostępne egzemplarze
        if (book.ilosc <= 0) {
          return res.status(400).json({ message: "Brak dostępnych książek do wypożyczenia" });
        }

        // Zmniejszamy ilość książki
        book.ilosc -= 1;
        await book.save();  // Zapisujemy zmienioną książkę
      }

      // Zaktualizowanie statusu wypożyczenia
      const updatedLoan = await Loan.findByIdAndUpdate(
        loanId,
        { status },
        { new: true }  // Zwróć zaktualizowany dokument
      );

      if (!updatedLoan) {
        return res.status(404).json({ message: "Nie znaleziono wypożyczenia" });
      }

      return res.status(200).json({ message: `Wypożyczenie ${status}!`, loan: updatedLoan });
    } catch (error) {
      console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", error);
      return res.status(500).json({ message: "Błąd podczas zatwierdzania lub odrzucania wypożyczenia", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
