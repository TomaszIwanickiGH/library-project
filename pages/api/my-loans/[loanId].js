import connectToDatabase from "../../../lib/mongodb";
import Loan from "../../../models/Loan";

export default async function handler(req, res) {
  const { method, query } = req;
  const { loanId } = query;

  await connectToDatabase();

  if (method === "DELETE") {
    try {
      // Usuń wypożyczenie z bazy danych
      const deletedLoan = await Loan.findByIdAndDelete(loanId);

      if (!deletedLoan) {
        return res.status(404).json({ message: "Wypożyczenie nie znalezione" });
      }

      return res.status(200).json({ message: "Wypożyczenie zostało usunięte." });
    } catch (error) {
      console.error("Błąd podczas usuwania wypożyczenia:", error);
      return res.status(500).json({ message: "Wystąpił błąd podczas usuwania wypożyczenia." });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
