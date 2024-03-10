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
router.get('/', async (req, res) => {
    try {

        const alerts = await Alert.find();
        res.status(200).json(alerts);

    } catch (error) {
        console.log(error);
    }
});

//* delete all alerts
router.delete('/', async (req, res) => {
    try {
        await Alert.deleteMany();
        res.status(200).json({ message: "All alerts deleted successfully" });

    } catch (error) {
        console.log(error);
    }
});


export default router;

