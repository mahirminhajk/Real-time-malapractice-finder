import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;