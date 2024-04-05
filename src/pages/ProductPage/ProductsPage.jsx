import {useState, useEffect} from "react";
import './ProductPage.css'
import ProductForm from "../../components/Forms/ProductForm.jsx";


const initialFormState = {
    code: '',
    name: '',
    description: '',
    subCategory: '',
    refrigerated: false,
    weight: 0,
    categoryId: '',

}
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    console.log(products)
    console.log(selectedProduct)

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/products')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const deleteProduct = (id) => {
        fetch(`http://localhost:8080/api/v1/products/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setProducts(products.filter((product) => product.id !== id));
                }
            })
            .catch((error) => console.error('Error deleting product:', error));
    };

    const addProduct = (productData) => {
        fetch('http://localhost:8080/api/v1/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
            .then((response) => response.json())
            .then((data) => {
                setProducts([...products, data]);
                setIsFormVisible(false);
            })
            .catch((error) => console.error('Error adding product:', error));
    };

    const updateProduct = (productData) => {
        fetch(`http://localhost:8080/api/v1/products/${productData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
                return response.json();
            })
            .then(updatedProduct => {
                setProducts(products.map(product => product.id === updatedProduct.id ? updatedProduct : product));
                setIsFormVisible(false);
                 // Clear the selected product after updating
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    const handleFormSubmit = (productData) => {
        if (selectedProduct) {
            updateProduct({...selectedProduct, ...productData});
        } else {
            addProduct(productData);
        }
    };

    const handleUpdateClick = (product) => {
        setSelectedProduct(product);
        setIsFormVisible(true);
    };

    const renderFormModal = () => {
        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={() => { setIsFormVisible(false); setSelectedProduct(null); }}>&times;</span>
                    <ProductForm onFormSubmit={handleFormSubmit} initialFormState={selectedProduct || initialFormState} />
                </div>
            </div>
        );
    };


    return(
        <main className="product-page">
            <h1>Products</h1>
            <div className="button-container">
                <button className="create-button" onClick={() => setIsFormVisible(true)}>Create Product</button>
            </div>

            {isFormVisible && renderFormModal (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
                        <ProductForm onFormSubmit={addProduct} initialFormState={initialFormState} />
                    </div>
                </div>
            )}
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>SubCategory</th>
                    <th>Weight</th>
                    <th>Category</th>
                    <th>Refrigerated</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.subCategory}</td>
                        <td>{product.weight} lb</td>
                        <td>{product.category.name === undefined ? product.category : product.category.name}</td>
                        <td>{product.refrigerated ? 'Yes' : 'No'}</td>
                        <td>
                            <button className="delete-button" onClick={() => deleteProduct(product.id)}>Delete</button>
                            <button className="update-button" onClick={() => handleUpdateClick(product)}>Update</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );

}

export default ProductsPage;