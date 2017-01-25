import mongoose from 'mongoose';
import diffHistory from 'mongoose-diff-history/diffHistory';
import uuid from 'uuid';

let ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roles: [String],
  other: mongoose.Schema.Types.Mixed,
});

UserSchema.plugin(diffHistory.plugin);

const User = mongoose.model('User', UserSchema);

export default User;
