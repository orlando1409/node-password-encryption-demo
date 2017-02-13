import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
	name: String,
	completed: Boolean,
	note: String
});

export default mongoose.model('todo', TodoSchema);