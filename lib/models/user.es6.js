import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	active: Boolean
});

export default mongoose.model('user', UserSchema);