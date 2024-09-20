import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ProductList = ({ products, onProductDeleted }) => {
    const { t } = useTranslation();

    const handleDelete = async (productId) => {
        try {
            await axios.delete(`http://localhost:3000/products/${productId}`);
            onProductDeleted(); // Notify parent component to refresh product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="product-list">
            <table>
                <thead>
                    <tr>
                        <th>{t('productList.codeProduit')}</th>
                        <th>{t('productList.designation')}</th>
                        <th>{t('productList.quantityPerPackage')}</th>
                        <th>{t('productList.packagesPerPallet')}</th>
                        <th>{t('productList.weightPerUnit')}</th>
                        <th>{t('productForm.categoryStorage')}</th>
                        <th>{t('productList.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.codeProduit}</td>
                            <td>{product.designation}</td>
                            <td>{product.quantiteUnitPerColis}</td>
                            <td>{product.quantiteColisPerPalet}</td>
                            <td>{product.poidsPerUnit}</td>
                            <td>{product.categoryStorage}</td>
                            <td>
                                <div className="actions">
                                    <Link to={`/edit-product/${product.id}`} className="edit-button">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="delete-button">
                                        <i className="fas fa-trash"></i> 
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
