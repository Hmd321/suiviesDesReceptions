import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const anomalyTypes = [
    { value: 'damaged', label: 'Damaged' },
    { value: 'quarantined', label: 'Quarantined' },
    { value: 'other', label: 'Other' }
];

const ReceptionForm = ({ onReceptionAdded, reception }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        numCommande: '',
        numTransfert: '',
        date: '',
        nomChauffeur: '',
        immatriculationCamion: '',
        depotDepart: '',
        products: []
    });

    useEffect(() => {
        if (reception) {
            setFormData({
                ...reception,
                date: new Date(reception.date).toISOString().split('T')[0],
                products: reception.products || []
            });
        }
    }, [reception]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [name]: value
        };
        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const handleAnomalyChange = (productIndex, anomalyIndex, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        const newAnomalies = [...newProducts[productIndex].anomalies];

        newAnomalies[anomalyIndex] = {
            ...newAnomalies[anomalyIndex],
            [name]: value
        };

        newProducts[productIndex] = {
            ...newProducts[productIndex],
            anomalies: newAnomalies
        };

        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { codeProduit: '', designation: '', quantiteLivree: '', anomalies: [] }]
        });
    };

    const addAnomaly = (index) => {
        const newProducts = [...formData.products];
        const newAnomalies = [...newProducts[index].anomalies, { type: '', quantity: '', description: '' }];

        newProducts[index] = {
            ...newProducts[index],
            anomalies: newAnomalies
        };

        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (formData.products.length === 0) {
            alert('Please add at least one product to the reception.');
            return;
        }
    
        try {
            if (reception) {
                await axios.put(`http://localhost:3000/receptions/${reception.id}`, formData);
            } else {
                await axios.post('http://localhost:3000/receptions', formData);
            }
            onReceptionAdded();
        } catch (error) {
            console.error('Error saving reception:', error);
        }
    };

    return (
        <form className="reception-form" onSubmit={handleSubmit}>
            {/* Form fields for numCommande, numTransfert, date, nomChauffeur, etc. */}
            <label>
                {t('receptionForm.numCommande')}
                <input
                    type="text"
                    name="numCommande"
                    value={formData.numCommande}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                {t('receptionForm.numTransfert')}
                <input
                    type="text"
                    name="numTransfert"
                    value={formData.numTransfert}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                {t('receptionForm.date')}
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                {t('receptionForm.nomChauffeur')}
                <input
                    type="text"
                    name="nomChauffeur"
                    value={formData.nomChauffeur}
                    onChange={handleChange}
                />
            </label>
            <label>
                {t('receptionForm.immatriculationCamion')}
                <input
                    type="text"
                    name="immatriculationCamion"
                    value={formData.immatriculationCamion}
                    onChange={handleChange}
                />
            </label>
            <label>
                {t('receptionForm.depotDepart')}
                <input
                    type="text"
                    name="depotDepart"
                    value={formData.depotDepart}
                    onChange={handleChange}
                />
            </label>
            <div className="product-container">
                <h3>{t('receptionForm.products')}</h3>
                {formData.products.map((product, index) => (
                    <div key={index}>
                        <label>
                            {t('receptionForm.codeProduit')}
                            <input
                                type="text"
                                name="codeProduit"
                                value={product.codeProduit}
                                onChange={(e) => handleProductChange(index, e)}
                                required
                            />
                        </label>
                        <label>
                            {t('receptionForm.designation')}
                            <input
                                type="text"
                                name="designation"
                                value={product.designation}
                                onChange={(e) => handleProductChange(index, e)}
                            />
                        </label>
                        <label>
                            {t('receptionForm.quantiteLivree')}
                            <input
                                type="number"
                                name="quantiteLivree"
                                value={product.quantiteLivree}
                                onChange={(e) => handleProductChange(index, e)}
                                required
                            />
                        </label>
                        <button type="button" onClick={() => addAnomaly(index)}>
                            {t('receptionForm.addAnomaly')}
                        </button>
                        {product.anomalies.map((anomaly, anomalyIndex) => (
                            <div key={anomalyIndex} className="anomaly-container">
                                <label>
                                    {t('receptionForm.anomalyType')}
                                    <select
                                        name="type"
                                        value={anomaly.type}
                                        onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                    >
                                        <option value="">{t('receptionForm.selectAnomalyType')}</option>
                                        {anomalyTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {t(`anomalyTypes.${type.value}`)}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    {t('receptionForm.anomalyQuantity')}
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={anomaly.quantity}
                                        onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                    />
                                </label>
                                <label>
                                    {t('receptionForm.anomalyDescription')}
                                    <input
                                        type="text"
                                        name="description"
                                        value={anomaly.description}
                                        onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
                <button type="button" onClick={addProduct}>
                    {t('receptionForm.addProduct')}
                </button>
            </div>
            <button type="submit">
                {reception ? t('receptionForm.update') : t('receptionForm.add')}
            </button>
        </form>
    );
};

export default ReceptionForm;
