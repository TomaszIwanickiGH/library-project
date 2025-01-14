import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }

  try {
    const { db } = await connectToDatabase();

    const results = await db.collection("books").aggregate([
      {
        $lookup: {
          from: "loans",
          localField: "_id",
          foreignField: "ksiazka_id",
          as: "wypozyczenia"
        }
      },
      { $match: { "wypozyczenia.0": { $exists: false } } },
      {
        $project: {
          _id: 0,
          tytul: 1,
          autor: 1,
          ilosc: 1
        }
      }
    ]).toArray();

    res.status(200).json(results);
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
