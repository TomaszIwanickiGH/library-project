"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import useLoginModal from "../hooks/useLoginModal";

const LoginModal = () => {
  const { isOpen, onClose } = useLoginModal();
  const [showModal, setShowModal] = useState(isOpen);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);  // Dodane do obsługi błędów

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);  // Wyświetlanie błędu
    } else if (result?.ok) {
      onClose();  // Zamknięcie modala po udanym logowaniu
      window.location.href = "/";  // Przekierowanie po udanym logowaniu
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative w-full sm:w-4/6 md:w-3/6 lg:w-2/5 xl:w-1/4 my-6 mx-auto lg:h-auto md:h-auto">
        <div className={`translate duration-300 h-full ${showModal ? "translate-y-0" : "translate-y-full"} ${showModal ? "opacity-100" : "opacity-0"}`}>
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-center p-6 rounded-t justify-between border-b-[1px]">
              <div className="text-lg font-semibold">Zaloguj się</div>
              <button onClick={onClose} className="p-1 border-0 hover:opacity-70 transition">
                ✕
              </button>
            </div>
            {/* Body */}
            <div className="relative p-6 flex-auto">
              <div className="flex flex-col gap-4">
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
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>} {/* Wyświetlanie błędu */}
            </div>
            {/* Footer */}
            <div className="flex p-6 gap-4">
              <button onClick={onClose} className="w-full px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition">
                Anuluj
              </button>
              <button onClick={handleSubmit} className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                Zaloguj się
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
