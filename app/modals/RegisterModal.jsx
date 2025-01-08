"use client";

import React, { useState, useEffect } from "react";
import useRegisterModal from "../hooks/useRegisterModal";

const RegisterModal = () => {
  const { isOpen, onClose } = useRegisterModal();
  const [showModal, setShowModal] = useState(isOpen);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");  // Dodane pole na nazwisko
  const [error, setError] = useState(null);  // Dodano obsługę błędów

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Sprawdzamy, czy hasła się zgadzają
    if (password !== confirmPassword) {
      alert("Hasła się nie zgadzają");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Rejestracja udana:", data);
        onClose(); // Zamknięcie modala po udanej rejestracji
        setTimeout(() => {
          alert("Rejestracja zakończona pomyślnie!")
        }, 500);
      } else {
        console.error("Błąd rejestracji:", data);
        setError(data.message || "Coś poszło nie tak");  // Wyświetlanie błędu
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
      setError("Błąd połączenia. Spróbuj ponownie.");
    }
    
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 my-6 mx-auto h-auto">
        <div
          className={`translate duration-300 ${
            showModal ? "translate-y-0" : "translate-y-full"
          } ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-center p-6 rounded-t justify-between border-b-[1px]">
              <div className="text-lg font-semibold">Zarejestruj się</div>
              <button
                onClick={onClose}
                className="p-1 border-0 hover:opacity-70 transition"
              >
                ✕
              </button>
            </div>
            {/* Body */}
            <div className="relative p-6 flex-auto">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Imię i Nazwisko"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Powtórz hasło"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>} {/* Wyświetlanie błędu */}
            </div>
            {/* Footer */}
            <div className="flex p-6 gap-4">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
              >
                Anuluj
              </button>
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Zarejestruj się
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
