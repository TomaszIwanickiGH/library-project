import Loan from "../../models/Loan";  // Importujemy model Loan
import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
      try {
        await connectToDatabase();
  
        console.log("Request body:", req.body);
        const { ksiazka_id, wypozyczajacy } = req.body;
  
        if (!ksiazka_id || !wypozyczajacy) {
          return res.status(400).json({ message: "Brak wymaganych danych" });
        }
  
        const uzytkownik_id = "677eaaea913fdbeef30f49b7"; // Ustaw ID admina (możesz uzyskać z bazy, jeśli potrzebne)
  
        const newLoan = new Loan({
          uzytkownik_id,
          ksiazka_id,
          wypozyczajacy,
          data_wypozyczenia: new Date(),
          status: "czeka na zatwierdzenie",
        });
  
        await newLoan.save();
        return res.status(201).json({ message: "Wypożyczenie zostało zapisane" });
      } catch (error) {
        console.error("Błąd w API Loan:", error);
        return res.status(500).send("Internal Server Error");
      }
    } else {
      return res.status(405).json({ message: "Metoda nie dozwolona" });
    }
  }
  
