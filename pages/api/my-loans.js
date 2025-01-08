import Loan from "../../models/Loan";
import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();

      const { email } = req.query; // Pobierz email z zapytania

      if (!email) {
        return res.status(400).json({ message: "Brak emaila użytkownika" });
      }

      // Pobierz wszystkie wypożyczenia powiązane z podanym emailem
      const loans = await Loan.find({ wypozyczajacy: email })
        .populate("ksiazka_id") // Pobierz szczegóły książki
        .exec();

      return res.status(200).json(loans);
    } catch (error) {
      console.error("Błąd w API My Loans:", error);
      return res.status(500).json({ message: "Błąd serwera" });
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}
