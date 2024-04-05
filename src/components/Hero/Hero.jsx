import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Welcome to StockPulse</h1>
                <p>Streamline your inventory and warehouse operations with ease. Discover our platform's core functionalities:</p>
                <ul className="features-list">
                    <li><strong>Inventory Tracking:</strong> Always know what's in stock.</li>
                    <li><strong>Inventory Management:</strong> Easily add, edit, or remove products.</li>
                    <li><strong>Warehouse Management :</strong> Add your company's warehouse</li>
                    <li><strong>Product Variety :</strong> Choose from predifined products to store in your warehouse</li>
                </ul>
                <div className="button-container">
                    <Link to="/warehouses" className="hero-button">Warehouses</Link>
                    <Link to="/products" className="hero-button">Products</Link>
                </div>


            </div>
        </section>
    );
};

export default Hero;
