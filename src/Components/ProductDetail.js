import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                setError('Error fetching product');
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <div className="container">
            <h1>Product Details</h1>
            {error && <div>{error}</div>}
            {product ? (
                <div>
                    <h3>{product.designation}</h3>
                    <p>Code: {product.codeProduit}</p>
                    <p>Quantity per Package: {product.quantiteUnitPerColis}</p>
                    <p>Packages per Pallet: {product.quantiteColisPerPalet}</p>
                    <p>Weight per Unit: {product.poidsPerUnit}</p>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default ProductDetails;
