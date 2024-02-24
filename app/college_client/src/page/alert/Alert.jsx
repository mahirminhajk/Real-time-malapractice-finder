import axios from "axios"
import { useState } from "react"
import './alert.css'


function Alert() {

    const [alertData, setAlertData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDeleteAllAlerts = async () => {
        try {
            setLoading(true);
            await axios.delete('http://localhost:3000/api/alert');
            setAlertData([]);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }


    return (
        <div className="alert-container">
            <h2>Alerts</h2>
            {loading && <p>Loading...</p>}
            {!loading && alertData.length === 0 && <p>No alerts available.</p>}
            {!loading && alertData.length > 0 && (
                <>
                    <div className="alert-actions">
                        <button onClick={handleDeleteAllAlerts}>Delete All Alerts</button>
                    </div>
                    {alertData.map((alert) => (
                        <div key={alert._id} className="alert-card">
                            <p className="alert-timestamp">{new Date(alert.timestamp).toLocaleString()}</p>
                            <p className="alert-content">{alert.content}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}

export default Alert