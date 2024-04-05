import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InventoryForm from "../../components/Forms/InventoryForm.jsx";
import './InventoryPage.css'
import Popup from "../../components/Popup/Popup.jsx";


const initialInventoryState = {
    productId: '',
    quantityAvailable: 0,
};

const InventoryPage = () => {

    const { warehouseId } = useParams();
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    /**
     * Function that fetches a list of inventories associated with a warehouse
     * fetches all the inventories of current warehouse
     */
    console.log(inventoryItems)
    useEffect(() => {
        // Fetch inventory for the warehouse
        const fetchInventory = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/inventory/warehouse/${warehouseId}`);
                const data = await response.json();
                setInventoryItems(data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            }
        };

        fetchInventory();
    }, [warehouseId]);

    //Function to create a new inventory
    const addInventoryItem = (inventoryData) => {

        // Construct the query parameters
        const queryParams = new URLSearchParams({
            productId: inventoryData.productId,
            warehouseId, // This comes from useParams
            quantity: inventoryData.quantityAvailable,
        }).toString();

        // Define the API endpoint with the query parameters
        const endpoint = `http://localhost:8080/api/v1/inventory/addProduct?${queryParams}`;

        fetch(endpoint, {
            method: 'POST',
        })
            .then(response => {
                if (!response.ok) {

                    return response.text().then(text => { throw new Error(text || 'Error adding product to inventory'); });
                }
                return response.json();
            })
            .then(data => {

                setInventoryItems(prev => [...prev, data]);
                setIsFormVisible(false);
                setShowError(false); // Ensure error message is not displayed
            })
            .catch(error => {
                console.error('Error adding inventory item:', error);
                setErrorMessage(error.message); // Set the error message to display in the popup
                setShowError(true); // Show the error popup
            });
    };


    //Function to update the Quantity of already existing inventory
    function updateQuantity(item) {
        const newQuantity = prompt('Enter the new quantity:', item.quantityAvailable);
        if (newQuantity !== null && newQuantity !== '') {
            const queryParams = new URLSearchParams({
                warehouseId: warehouseId, // This comes from useParams()
                productId: item.product.id,
                newQuantity: newQuantity,
            }).toString();

            const endpoint = `http://localhost:8080/api/v1/inventory/updateQuantity?${queryParams}`;

            fetch(endpoint, {
                method: 'PUT',
            })
                .then(response => {
                    if (!response.ok) {

                        return response.text().then(text => { throw new Error(text || 'Error updating product quantity in inventory'); });
                    }
                    // Update the inventory item in the state to reflect the new quantity
                    setInventoryItems(prevItems => prevItems.map(invItem => {
                        if (invItem.id === item.id) {
                            return { ...invItem, quantityAvailable: parseInt(newQuantity) };
                        }
                        return invItem;
                    }));
                })
                .catch(error => {
                    console.error('Error updating inventory quantity:', error);
                    setErrorMessage(error.message); // Set the error message to display in the popup
                    setShowError(true); // Show the error popup
                });
        }
    }

    //Function to access Delete endpoint on inventory controller
    function deleteInventory(item) {
        const queryParams = new URLSearchParams({
            warehouseId: warehouseId, // Assuming this comes from useParams()
            productId: item.product.id,
        }).toString();

        const endpoint = `http://localhost:8080/api/v1/inventory/removeProduct?${queryParams}`;

        fetch(endpoint, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {

                    return response.text().then(text => { throw new Error(text || 'Error removing product from inventory'); });
                }
                // Filter out the deleted item from the inventoryItems state
                setInventoryItems(prevItems => prevItems.filter(invItem => invItem.id !== item.id));
            })
            .catch(error => {
                console.error('Error removing inventory item:', error);
                setErrorMessage(error.message); // Set the error message to display in the popup
                setShowError(true); // Show the error popup
            });
    }


    // Function to close the Error popup
    const handleClosePopup = () => {
        setShowError(false);
        setErrorMessage('');
    };

    return (
        <div className="inventory-page">
            <h2>Warehouse Inventory</h2>
            <button className="create-button" onClick={() => setIsFormVisible(true)}>Add Product</button>
            {isFormVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
                        <InventoryForm onFormSubmit={addInventoryItem} initialFormState={initialInventoryState} />
                    </div>
                </div>
            )}
            {showError && (
                <Popup message={errorMessage} onClose={handleClosePopup} />
            )}
            <table className="inventory-table">
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Weight</th>
                    <th>Refrigerated</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {inventoryItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.product.category.name}</td>
                        <td>{item.product.subCategory}</td>
                        <td>{`${item.product.weight} lb`}</td>
                        <td className={item.product.refrigerated ? 'refrigerated-yes' : 'refrigerated-no'}>
                            {item.product.refrigerated ? 'Yes' : 'No'}
                        </td>
                        <td>{item.quantityAvailable}</td>
                        <td>
                            <button className="action-button update-button" onClick={() => updateQuantity(item)}>Update Quantity</button>
                            <button className="action-button delete-button" onClick={() => deleteInventory(item)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryPage;