import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wypozyczenia: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan',  // Odniesienie do kolekcji Loan
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
