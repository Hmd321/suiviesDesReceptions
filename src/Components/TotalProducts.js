import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TotalProducts = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [stocks, setStocks] = useState([]);
    const [produitEnRupture, setProduitEnRupture] = useState([]);
    const [produitAvecAvarie, setProduitAvecAvarie] = useState([]);
    const [isRuptureDialogOpen, setIsRuptureDialogOpen] = useState(false);
    const [isAvarieDialogOpen, setIsAvarieDialogOpen] = useState(false);

    const { t } = useTranslation(); // Use translation hook

    useEffect(() => {
        fetchProducts();
        fetchStocks();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/products');
            setTotalProducts(response.data.length - 1); // Update total products count
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchStocks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/stocks');
            const stockData = response.data;

            // Filter products that are out of stock (quantiteTotale === 0)
            const enRupture = stockData.filter(item => (item.quantiteTotale - item.quantiteQuarantaine - item.quantiteAvariee) === 0);
            setProduitEnRupture(enRupture);

            // Filter products with stock avarié (custom condition: example if quantiteTotale < 0 or custom field)
            const avecAvarie = stockData.filter(item => item.quantiteAvariee > 0 || item.isAvarie === true);
            setProduitAvecAvarie(avecAvarie);

            setStocks(stockData);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    // Functions to open and close the dialog
    const openRuptureDialog = () => setIsRuptureDialogOpen(true);
    const closeRuptureDialog = () => setIsRuptureDialogOpen(false);

    const openAvarieDialog = () => setIsAvarieDialogOpen(true);
    const closeAvarieDialog = () => setIsAvarieDialogOpen(false);

    return (
        <div className="card">
            <h3>{t('products')}</h3>
            <p><span>{t('totalProducts')}:</span> {totalProducts}</p>
            <p style={{cursor:'pointer'}} onClick={openRuptureDialog}>
                <span>{t('produitEnRupture')}: </span>
                <span>{produitEnRupture.length}</span>
            </p>
            <p style={{cursor:'pointer'}} onClick={openAvarieDialog}>
                <span>{t('produitAvecAvarie')}: </span>
                <span>{produitAvecAvarie.length}</span>
            </p>

            {/* Dialog for produit en rupture */}
            {isRuptureDialogOpen && (
                <div className="dialog-1">
                    <div className="dialog-content-1">
                        <h4>{t('listeProduitsEnRupture')}:</h4>
                        <ul>
                            {produitEnRupture.map((product, index) => (
                                <li key={index}>{product.designation}</li>
                            ))}
                        </ul>
                        <button onClick={closeRuptureDialog}>{t('close')}</button>
                    </div>
                </div>
            )}

            {/* Dialog for produit avec stock avarié */}
            {isAvarieDialogOpen && (
                <div className="dialog-1">
                    <div className="dialog-content-1">
                        <h4>{t('listeProduitsAvecAvarie')}:</h4>
                        <ul>
                            {produitAvecAvarie.map((product, index) => (
                                <li key={index}>{product.designation} ----- {product.quantiteAvariee} {t('unit')}</li>
                            ))}
                        </ul>
                        <button onClick={closeAvarieDialog}>{t('close')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TotalProducts;
