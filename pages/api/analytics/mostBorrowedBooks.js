import connectToDatabase from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Metoda nie dozwolona" });
  }

  try {
    const { db } = await connectToDatabase();

    const results = await db.collection("loans").aggregate([
      {
        $group: {
          _id: "$ksiazka_id",
          liczba_wypozyczen: { $count: {} }
        }
      },
      { $sort: { liczba_wypozyczen: -1 } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "ksiazka"
        }
      },
      { $unwind: "$ksiazka" },
      {
        $project: {
          _id: 0,
          tytul: "$ksiazka.tytul",
          autor: "$ksiazka.autor",
          liczba_wypozyczen: 1
        }
      }
    ]).toArray();

    res.status(200).json(results);
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error);
    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
}
