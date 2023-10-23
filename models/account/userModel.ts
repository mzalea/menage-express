import mongoose, { Document, Model } from 'mongoose';

interface UserAttributes {
  email: string;
  passwordHash: string;
  displayName: string;
}

interface UserModel extends Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, required: true }
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
