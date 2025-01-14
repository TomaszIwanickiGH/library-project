import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Brak e-maila użytkownika w zapytaniu" });
  }

  try {
    const { db } = await connectToDatabase();

    const results = await db.collection("loans").aggregate([
      { $match: { wypozyczajacy: email } },
      {
        $group: {
          _id: "$wypozyczajacy",
          liczba_wypozyczen: { $count: {} },
          aktywne_wypozyczenia: {
            $sum: { $cond: [{ $eq: ["$status", "zatwierdzone"] }, 1, 0] }
          }
        }
      }
    ]).toArray();

    res.status(200).json(results[0] || { liczba_wypozyczen: 0, aktywne_wypozyczenia: 0 });
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
