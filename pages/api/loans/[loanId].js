import Loan from "../../../models/Loan";
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

      const updatedLoan = await Loan.findByIdAndUpdate(
        loanId,
        { status },
        { new: true }  // Zwróć zaktualizowany dokument
      );

      if (!updatedLoan) {
        return res.status(404).json({ message: "Nie znaleziono wypożyczenia" });
      }

      return res.status(200).json({ message: `Wypożyczenie ${status}d!`, loan: updatedLoan });
    } catch (error) {
      console.error("Błąd podczas zatwierdzania lub odrzucania wypożyczenia:", error);
      return res.status(500).json({ message: "Błąd podczas zatwierdzania lub odrzucania wypożyczenia", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
