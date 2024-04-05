import {useEffect, useState} from "react";
import './WarehouseForm.css'
// eslint-disable-next-line react/prop-types
const WarehouseForm = ({ onFormSubmit, initialFormState }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch companies and categories
    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetch('http://localhost:8080/api/v1/companies'),
            fetch('http://localhost:8080/api/v1/categories')
        ])
            .then(async ([companiesRes, categoriesRes]) => {
                const companiesData = await companiesRes.json();
                const categoriesData = await categoriesRes.json();
                setCompanies(companiesData);
                setCategories(categoriesData);
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => setIsLoading(false));
    }, []);

    // Update formData state when initialFormState changes
    useEffect(() => {
        setFormData(initialFormState);
    }, [initialFormState]);

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
        setFormData(initialFormState);
    };


    return(
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Warehouse Name"
                required
            />
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Warehouse address"
                required
            />

            {/* Dropdown for companies */}
            <select
                name="companyId"
                value={formData.companyId || ''}
                onChange={handleChange}
                required
            >
                <option value="">Select Company</option>
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                ))}
            </select>

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

            <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity"
                required
            />
            <label>
                Environment Control:
                <input
                    type="checkbox"
                    name="environmentControl"
                    checked={formData.environmentControl}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default WarehouseForm;