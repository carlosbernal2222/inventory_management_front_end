import { useEffect, useState } from "react";
import './ProductForm.css';

// eslint-disable-next-line react/prop-types
const ProductForm = ({ onFormSubmit, initialFormState }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:8080/api/v1/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setIsLoading(false);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(formData);
        // Reset form to initial state after submission
        setFormData(initialFormState);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Product Code"
                required
            />
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                placeholder="SubCategory"
            />
            <label>
                Refrigerated:
                <input
                    type="checkbox"
                    name="refrigerated"
                    checked={formData.refrigerated}
                    onChange={handleChange}
                />
            </label>
            <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Weight"
                required
            />
            {/* Dropdown for categories */}
            <select
                name="categoryId"
                value={formData.categoryId || ''}
                onChange={handleChange}
                required
            >
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ProductForm;
