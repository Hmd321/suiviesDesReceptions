import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const EditProductPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        codeProduit: '',
        designation: '',
        quantiteUnitPerColis: 0,
        quantiteColisPerPalet: 0,
        poidsPerUnit: 0,
        categoryStorage:'sec'
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:3000/products/${id}`, product);
            navigate('/');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="edit-product-page">
            <div className="form-container">
                <h1>Edit Product</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="codeProduit">Product Code:</label>
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
                        <label htmlFor="designation">Designation:</label>
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
                        <label htmlFor="quantiteUnitPerColis">Quantity per Package:</label>
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
                        <label htmlFor="quantiteColisPerPalet">Packages per Pallet:</label>
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
                        <label htmlFor="poidsPerUnit">Weight per Unit:</label>
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
                    <button type="submit" className="submit-button">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProductPage;
