// components/UserActions.js

import { useSession } from "next-auth/react"; // Importujemy hook useSession
import { useRouter } from "next/navigation";

const UserActions = () => {
  const { data: session, status } = useSession(); // Uzyskujemy dostęp do sesji użytkownika
  const router = useRouter(); // Hook do nawigacji

  return (
    <div className="flex justify mb-4">
      {status === "loading" ? (
        <p>Ładowanie...</p>
      ) : !session ? (
        <p>Musisz się zalogować, aby zobaczyć opcje.</p>
      ) : (
        <div className="flex gap-8">
          {session.user.email === "admin@admin.pl" ? (
            // Dla admina wyświetlamy "Dodaj książkę" oraz "Wypożyczenia"
            <>
              <button
                onClick={() => router.push("/add-book")}
                className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
              >
                Dodaj książkę
              </button>
              <button
                onClick={() => router.push("/wypozyczenia")}
                className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
              >
                Wypożyczenia do zatwierdzenia
              </button>
            </>
          ) : (
            // Dla zwykłych użytkowników wyświetlamy "Moje wypożyczenia"
            <button
              onClick={() => router.push("/moje-wypozyczenia")}
              className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
            >
              Moje Wypożyczenia
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserActions;
