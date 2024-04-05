import './Popup.css'
const Popup = ({message, onClose}) => {
    return (
        <div className="popup-background">
            <div className="popup">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );

}

export default Popup;