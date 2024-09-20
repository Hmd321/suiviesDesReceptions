import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ExpeditionList = ({ expeditions, onExpeditionDeleted, onViewExpedition }) => {
    const { t } = useTranslation();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to no filtering
    const [filteredExpeditions, setFilteredExpeditions] = useState(expeditions);

    useEffect(() => {
        // Filter expeditions based on selected month
        const filtered = selectedMonth === null
            ? expeditions
            : expeditions.filter(expedition => {
                const expeditionMonth = new Date(expedition.date).getMonth();
                return expeditionMonth === selectedMonth;
            });
        setFilteredExpeditions(filtered);
    }, [selectedMonth, expeditions]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value === "all" ? null : parseInt(event.target.value));
    };

    const handleDelete = async (expeditionId) => {
        try {
            await axios.delete(`http://localhost:3000/expeditions/${expeditionId}`);
            onExpeditionDeleted(); // Notify parent component to refresh expedition list
        } catch (error) {
            console.error('Error deleting expedition:', error);
        }
    };

    const monthOptions = [
        { value: "all", label: t('allMonths') },
        ...Array.from({ length: 12 }, (_, i) => ({
            value: i,
            label: new Date(0, i).toLocaleString('default', { month: 'long' })
        }))
    ];

    return (
        <div className="expedition-list">
            <div className="month-selector">
                <label htmlFor="month-select">{t('selectMonth')}</label>
                <select id="month-select" value={selectedMonth === null ? "all" : selectedMonth} onChange={handleMonthChange}>
                    {monthOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>{t('expeditionList.numCommande')}</th>
                        <th>{t('expeditionList.numTransfert')}</th>
                        <th>{t('expeditionList.date')}</th>
                        <th>{t('expeditionList.nomChauffeur')}</th>
                        <th>{t('expeditionList.immatriculationCamion')}</th>
                        <th>{t('expeditionList.depotDestination')}</th>
                        <th>{t('productList.codeProduit')}</th>
                        <th>{t('productList.designation')}</th>
                        <th>{t('expeditionList.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpeditions.map((expedition) => (
                        <tr key={expedition.id}>
                            <td>{expedition.numCommande}</td>
                            <td>{expedition.numTransfert}</td>
                            <td>{new Date(expedition.date).toLocaleDateString()}</td>
                            <td>{expedition.nomChauffeur}</td>
                            <td>{expedition.immatriculationCamion}</td>
                            <td>{expedition.depotDestination}</td>
                            {/* Display products here */}
                            <td>
                                {expedition.products.map((product, index) => (
                                    <div key={index}>
                                        <span>{product.codeProduit}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {expedition.products.map((product, index) => (
                                    <div key={index}>
                                        <span>{product.designation}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => onViewExpedition(expedition.id)} className="view-button">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <Link to={`/edit-expedition/${expedition.id}`} className="edit-button">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button onClick={() => handleDelete(expedition.id)} className="delete-button">
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

export default ExpeditionList;
