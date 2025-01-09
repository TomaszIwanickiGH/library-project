const mongoose = require('mongoose');

// Definicja schematu książki
const bookSchema = new mongoose.Schema({
  tytul: {
    type: String,
    required: true, // Tytuł książki jest wymagany
    maxlength: 255, // Maksymalna długość tytułu
  },
  gatunek: {
    type: String,
    required: true, // Gatunek książki jest wymagany
    maxlength: 100, // Maksymalna długość gatunku
  },
  rok_wydania: {
    type: Number,
    required: true, // Rok wydania książki jest wymagany
  },
  opis: {
    type: String,
    required: false, // Opis książki jest opcjonalny
  },
  autor: {
    type: String,
    required: true, // Autor książki jest wymagany
    maxlength: 255, // Maksymalna długość dla autora
  },
  obraz: {
    type: String, // Link do obrazu książki
    required: false, // Opcjonalne pole
  },
  ilosc: {
    type: Number, // Liczba dostępnych egzemplarzy
    required: true, // Ilość książek jest wymagana
    min: 0, // Minimalna wartość to 0
  }
});

// Tworzymy model na podstawie schematu
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
