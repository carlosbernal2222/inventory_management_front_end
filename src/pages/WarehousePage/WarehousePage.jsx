// src/components/WarehousePage.jsx
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import WarehouseForm from '../../components/Forms/WarehouseForm.jsx';
import './WarehousePage.css'


const initialFormState = {
    name: '',
    companyId: '', // Assuming you will handle company and category selection within the form
    categoryId: '',
    address: '',
    capacity: 0,
    environmentControl: false,
}
const WarehousePage = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    console.log(selectedWarehouse)
    console.log(warehouses)

    // Fetching warehouses data from the backend on component mount
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/warehouses')
            .then((response) => response.json())
            .then((data) => setWarehouses(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Example function for deleting a warehouse
    const deleteWarehouse = (id) => {
        fetch(`http://localhost:8080/api/v1/warehouses/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
                }
            })
            .catch((error) => console.error('Error deleting warehouse:', error));
    };

    // Placeholder functions for adding and updating a warehouse
    // You need to implement these functions based on your backend API
    const addWarehouse = (warehouseData) => {
        fetch('http://localhost:8080/api/v1/warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(warehouseData),
        })
            .then((response) => response.json())
            .then((data) => {
                // Add the new warehouse to the local state to update UI
                setWarehouses([...warehouses, data]);
                setIsFormVisible(false);
            })
            .catch((error) => console.error('Error adding warehouse:', error));
    };
    const updateWarehouse = (warehouseData) => {
        fetch(`http://localhost:8080/api/v1/warehouses/${warehouseData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(warehouseData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update warehouse');
                }
                return response.json();
            })
            .then(updatedWarehouse => {
                // Update the state with the updated warehouse info
                setWarehouses(warehouses.map(warehouse => warehouse.id === updatedWarehouse.id ? updatedWarehouse : warehouse));
                setIsFormVisible(false); // Optionally close the form modal
            })
            .catch(error => {
                console.error('Error updating warehouse:', error);
                // Handle error (e.g., show error message)
            });
    };

    const renderFormModal = () => {
        const formState = selectedWarehouse || initialFormState;
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={() => { setIsFormVisible(false); setSelectedWarehouse(null); }}>&times;</span>
                    <WarehouseForm onFormSubmit={selectedWarehouse ? updateWarehouse : addWarehouse} initialFormState={formState} />
                </div>
            </div>
        );
    };
    const handleUpdateClick = (warehouse) => {
        setSelectedWarehouse(warehouse); // Set the selected warehouse
        setIsFormVisible(true); // Show the form
    };
    return (
        <div className="warehouse-page">
            <div>
                <h1>Warehouses</h1>
            </div>
            <button className="create-button" onClick={() => setIsFormVisible(true)}>Create Warehouse</button>
            {isFormVisible && renderFormModal(
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
                        <WarehouseForm onFormSubmit={addWarehouse} initialFormState={initialFormState} />
                    </div>
                </div>
            )}
            <div>
                {warehouses.map((warehouse) => (
                    <div key={warehouse.id} className="warehouse-container">
                        <Link to={`/warehouses/${warehouse.id}/inventory`} style={{ textDecoration: 'none' }}>
                            <div className="warehouse-details-container">
                                <h2>{warehouse.name}</h2>
                                <p>Address: {warehouse.address}</p>
                                <p>Total capacity: {warehouse.capacity}</p>
                                <p>Category: {warehouse.category}</p>
                                <p>Company: {warehouse.company.name === undefined ? warehouse.company : warehouse.company.name}</p>
                            </div>
                        </Link>
                        <div className="warehouse-button-container">
                            <button className="delete-button" onClick={(event) => deleteWarehouse(warehouse.id, event)}>Delete</button>
                            <button className="update-button" onClick={() => handleUpdateClick(warehouse)}>Update</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default WarehousePage;
