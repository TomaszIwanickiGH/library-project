const mongoose = require('mongoose');

// Definicja schematu wypożyczenia
const loanSchema = new mongoose.Schema({
  uzytkownik_id: {
    type: mongoose.Schema.Types.ObjectId,  // Typ odniesienia do innego dokumentu (użytkownika)
    ref: 'User',  // Kolekcja, do której odnosi się to ID (tutaj: User)
    required: true  // Pole jest wymagane
  },
  ksiazka_id: {
    type: mongoose.Schema.Types.ObjectId,  // Typ odniesienia do innego dokumentu (książki)
    ref: 'Book',  // Kolekcja, do której odnosi się to ID (tutaj: Book)
    required: true  // Pole jest wymagane
  },
  data_wypozyczenia: {
    type: Date,
    required: true,  // Data wypożyczenia jest wymagana
    default: Date.now  // Domyślnie ustawiamy datę na czas obecny
  },
  data_zwrotu: {
    type: Date,  // Data zwrotu książki
    required: false  // Data zwrotu jest opcjonalna (może być pusta do momentu zwrotu książki)
  },
  status: {
    type: String,
    enum: ['czeka na zatwierdzenie', 'zaakceptowane', 'odrzucone'],
    default: 'czeka na zatwierdzenie',  // Domyślnie ustawiamy status na "czeka na zatwierdzenie"
  },
  wypozyczajacy: {
    type: String, // Zmieniamy na String, aby przechowywać e-mail
    required: true,
  },
});

// Tworzymy model z tego schematu
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
