import {useEffect, useState} from "react";
import './InventoryForm.css'

// eslint-disable-next-line react/prop-types
const InventoryForm = ({onFormSubmit, initialFormState}) => {

    const [formData, setFormData] = useState(initialFormState);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        // Fetch all products and set to `products` state
        fetch('http://localhost:8080/api/v1/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(formData);
    };
    const handleProductNameChange = (e) => {
        const value = e.target.value;
        setFilteredProducts(products.filter(product => product.name.toLowerCase().includes(value.toLowerCase())));


        const exactMatch = products.find(product => product.name.toLowerCase() === value.toLowerCase());
        if (exactMatch) {
            setFormData(prevState => ({ ...prevState, productId: exactMatch.id.toString() }));
        }
    };

    const selectProduct = (productId) => {
        setFormData(prevState => ({ ...prevState, productId }));
        setFilteredProducts([]); // Clear filtered products after selection
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="quantityAvailable">Quantity:</label>
            <input
                type="number"
                id="quantityAvailable"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={handleChange}
            />

            <div className="input-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                    type="text"
                    id="productName"
                    name="productName"
                    onChange={handleProductNameChange}
                    autoComplete="on"
                />
                {filteredProducts.length > 0 && (
                    <ul className="suggestions-list">
                        {filteredProducts.map(product => (
                            <li key={product.id} onClick={() => selectProduct(product.id.toString())}>
                                {product.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button type="submit">Add to Inventory</button>
        </form>
    );
};

export default InventoryForm