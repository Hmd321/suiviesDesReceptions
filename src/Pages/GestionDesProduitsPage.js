// src/pages/GestionDesProduitsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../Components/ProductForm';
import ProductList from '../Components/ProductList';
import SearchBar from '../Components/SearchBar';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';


const GestionDesProduitsPage = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch products from the server
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products');
            setProducts(response.data);
            setFilteredProducts(response.data); // Initially, show all products
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleProductAdded = async () => {
        await fetchProducts(); // Refresh product list after adding a new product
        setIsDialogOpen(false); // Close dialog after adding product
    };

    const handleProductDeleted = async () => {
        await fetchProducts(); // Refresh product list after deleting a product
    };

    const handleSearch = (query) => {
        const filtered = products.filter((product) => 
            product.codeProduit.toLowerCase().includes(query.toLowerCase()) ||
            product.designation.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    return (
            <div className="content-wrapper">
                <div className="header-actions">
                <h1>{t('productList.header')}</h1>
                   <div className='right-side'>
                   <button 
                        onClick={() => setIsDialogOpen(true)} 
                        className="open-dialog-button">
                        Add Product
                    </button>
                    <SearchBar onSearch={handleSearch} />
                   </div>
                </div>
                <ProductList 
                    products={filteredProducts} 
                    onProductDeleted={handleProductDeleted} 
                />
                <div className={`dialog ${isDialogOpen ? 'open' : ''}`}>
                    <ProductForm onProductAdded={handleProductAdded} />
                    <div className="dialog-footer">
                        <button 
                            className="close-button" 
                            onClick={() => setIsDialogOpen(false)}>
                            Close
                        </button>
                    </div>
                </div>

            </div>

    );
};

export default GestionDesProduitsPage;
