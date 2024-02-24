import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

router.get('/test', (req, res) => {
    try {

        res.send('Alert router testing is successful');

    } catch (error) {
        console.log(error);
    }
});

//* get all alerts
router.get('/', (req, res) => {
    try {

        Alert.find().exec((err, data) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(data);
            }
        });

    } catch (error) {
        console.log(error);
    }
});

//* delete all alerts
router.delete('/', (req, res) => {
    try {
        Alert.deleteMany({}, (err) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json({ message: 'All alerts deleted' });
            }
        });

    } catch (error) {
        console.log(error);
    }
});


export default router;

