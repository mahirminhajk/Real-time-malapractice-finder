import axios from "axios"
import { useEffect, useState } from "react"
import './alert.css'


function Alert() {

    const [alertData, setAlertData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const getAlerts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/alert');
            console.log(response.data);
            setAlertData(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        getAlerts();
    }, []);

    const handleDeleteAllAlerts = () => {
        setShowConfirmation(true);
    }

    const confirmDeleteAllAlerts = async () => {
        try {
            setLoading(true);
            await axios.delete('http://localhost:3000/api/alert');
            setAlertData([]);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
        setShowConfirmation(false);
    }

    const cancelDeleteAllAlerts = () => {
        setShowConfirmation(false);
    }



    return (
        <div className="alert-container">
            <h2>Alerts</h2>
            {loading && <p>Loading...</p>}
            {!loading && alertData.length === 0 && <p>No alerts available.</p>}
            {!loading && alertData.length > 0 && (
                <>
                    <div className="content-container">
                        {alertData.map((alert) => (
                            <div key={alert._id} className="alert-card">
                                <img src={`data:image/png;base64,${alert.image}`} alt="Person detected" width="300px" />
                                <p className="alert-timestamp">{new Date(alert.timestamp).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="alert-actions">
                        <button onClick={handleDeleteAllAlerts}>Delete All Alerts</button>
                    </div>
                    {showConfirmation && (
                        <div className="confirmation-popup">
                            <p>Are you sure you want to delete all alerts?</p>
                            <button onClick={confirmDeleteAllAlerts}>Yes</button>
                            <button onClick={cancelDeleteAllAlerts}>No</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Alert