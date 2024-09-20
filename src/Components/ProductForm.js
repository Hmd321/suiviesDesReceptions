import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ProductForm = ({ onProductAdded }) => {
    const { t } = useTranslation();
    const [product, setProduct] = useState({
        codeProduit: '',
        designation: '',
        quantiteUnitPerColis: 0,
        quantiteColisPerPalet: 0,
        poidsPerUnit: 0,
        categoryStorage: 'sec' // Default value for categoryStorage
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/products', product);
            setMessage(`${t('productForm.successMessage')}: ${response.data.message}`);
            setProduct({
                codeProduit: '',
                designation: '',
                quantiteUnitPerColis: 0,
                quantiteColisPerPalet: 0,
                poidsPerUnit: 0,
                categoryStorage: 'sec' // Reset to default after submission
            });
            onProductAdded(); // Notify parent component
        } catch (error) {
            setMessage(`${t('productForm.errorMessage')}: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <h1>{t('productForm.title')}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="codeProduit">{t('productForm.codeProduit')}</label>
                    <input
                        type="text"
                        id="codeProduit"
                        name="codeProduit"
                        value={product.codeProduit}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="designation">{t('productForm.designation')}</label>
                    <input
                        type="text"
                        id="designation"
                        name="designation"
                        value={product.designation}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantiteUnitPerColis">{t('productForm.quantityPerPackage')}</label>
                    <input
                        type="number"
                        id="quantiteUnitPerColis"
                        name="quantiteUnitPerColis"
                        value={product.quantiteUnitPerColis}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantiteColisPerPalet">{t('productForm.packagesPerPallet')}</label>
                    <input
                        type="number"
                        id="quantiteColisPerPalet"
                        name="quantiteColisPerPalet"
                        value={product.quantiteColisPerPalet}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="poidsPerUnit">{t('productForm.weightPerUnit')}</label>
                    <input
                        type="number"
                        id="poidsPerUnit"
                        name="poidsPerUnit"
                        step="0.01"
                        value={product.poidsPerUnit}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoryStorage">{t('productForm.categoryStorage')}</label>
                    <select
                        id="categoryStorage"
                        name="categoryStorage"
                        value={product.categoryStorage} // Bind the value to the state
                        onChange={handleChange}
                        required
                    >
                        <option value="sec">Sec (Dry Storage)</option>
                        <option value="chambre froid">Chambre Froid (Cold Storage)</option>
                        <option value="sas">SAS (Specific Storage)</option>
                    </select>
                </div>
                <button type="submit">{t('productForm.addProduct')}</button>
                <div id="message">{message}</div>
            </form>
        </div>
    );
};

export default ProductForm;
