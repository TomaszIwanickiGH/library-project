import Loan from "../../../models/Loan";
import connectToDatabase from "../../../lib/mongodb";
import { getSession } from "next-auth/react";  // Dodaj import do sesji

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDatabase();

      // Pobierz sesję użytkownika (zakładając, że używasz next-auth)
      const session = await getSession({ req });

      // Sprawdź, czy użytkownik jest administratorem
      if (!session) {
        return res.status(403).json({ message: "Brak uprawnień" });
      }

      // Pobierz wszystkie wypożyczenia czekające na zatwierdzenie i wypełnij dane książek
      const loans = await Loan.find({ status: "czeka na zatwierdzenie" }).populate("ksiazka_id");

      return res.status(200).json(loans);  // Zwróć listę wypożyczeń
    } catch (error) {
      console.error("Błąd w API Loan:", error);
      return res.status(500).send("Błąd serwera");
    }
  } else {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }
}