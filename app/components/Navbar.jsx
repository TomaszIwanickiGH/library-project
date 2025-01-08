"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react"; // Importujemy useSession oraz signOut
import useLoginModal from '../hooks/useLoginModal';
import useRegisterModal from '../hooks/useRegisterModal';
import { useRouter } from 'next/navigation';
import useSearchStore from "../../stores/searchStore"; 

const Navbar = () => {
  const { data: session, status } = useSession(); // Używamy hooka useSession
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter(); // Hook do nawigacji

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stan do kontrolowania widoczności menu
  const { searchQuery, setSearchQuery } = useSearchStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Przełączanie widoczności menu
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); // Zamykanie menu, jeśli szerokość okna przekracza 768px
      }
    };

    window.addEventListener('resize', handleResize);

    // Sprzątanie po odłączeniu komponentu
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Dodajemy callbackUrl do wylogowania, aby przekierować na stronę główną
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // Ustawiamy wartość wyszukiwania
  };

  return (
    <nav className="bg-[#f4f1e1] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-3xl font-semibold text-[#5b3d44]">
            <a href="/" className="text-2xl text-[#6b4f33]">
              BookNest
            </a>
          </div>

          {/* Pasek wyszukiwania */}
          <div className="flex flex-1 justify-center mx-4">
            <input
              type="text"
              value={searchQuery}  // Przypisujemy stan wyszukiwania do wartości inputa
              onChange={handleSearchChange}  // Funkcja do zmiany zapytania
              placeholder="Wyszukaj książkę..."
              className="w-full max-w-md px-4 py-2 rounded-lg border border-[#d6cfc7] focus:outline-none focus:ring-2 focus:ring-[#6b4f33]"
            />
          </div>

          {/* Menu na dużych ekranach */}
          <div className="hidden md:flex text-[#6b4f33] gap-2">
            {status === "loading" ? (
              <p>Ładowanie...</p>
            ) : !session ? (
              <>
                <button onClick={loginModal.onOpen} className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300">
                  Zaloguj się
                </button>
                <button onClick={registerModal.onOpen} className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300">
                  Zarejestruj się
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <p>Witaj, {session.user.name || "Użytkowniku"}!</p>
                <button 
                  onClick={handleSignOut}  // Używamy funkcji handleSignOut
                  className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
                >
                  Wyloguj
                </button>
              </div>
            )}
          </div>

          {/* Ikona hamburgera, widoczna na wszystkich ekranach */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#6b4f33] focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Panel z przyciskami w menu hamburgerowym */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#f4f1e1] shadow-md z-10">
          <div className="flex flex-col items-center py-4">
            {status === "loading" ? (
              <p>Ładowanie...</p>
            ) : !session ? (
              <>
                <button onClick={() => { toggleMenu(); loginModal.onOpen(); }} className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300 mb-2">
                  Zaloguj się
                </button>
                <button onClick={() => { toggleMenu(); registerModal.onOpen(); }} className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300">
                  Zarejestruj się
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="mb-4">Witaj, {session.user.name || "Użytkowniku"}!</p>
                <button 
                  onClick={() => { toggleMenu(); handleSignOut(); }}  // Używamy funkcji handleSignOut
                  className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300 mb-2"
                >
                  Wyloguj
                </button>

                {/* Sprawdzamy, czy użytkownik jest adminem */}
                {session.user.email === "admin@admin.pl" ? (
                  <>
                    <button
                      onClick={() => { router.push("/add-book"); toggleMenu(); }} 
                      className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300 mb-2"
                    >
                      Dodaj książkę
                    </button>
                    <button
                      onClick={() => { router.push("/wypozyczenia"); toggleMenu(); }} 
                      className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
                    >
                      Wypożyczenia
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { router.push("/moje-wypozyczenia"); toggleMenu(); }} 
                    className="px-4 py-2 rounded-lg bg-[#4e9a73] text-white hover:bg-[#38745b] transition duration-300"
                  >
                    Moje Wypożyczenia
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
