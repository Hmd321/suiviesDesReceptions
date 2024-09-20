import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ReceptionList = ({ receptions, onReceptionDeleted, onViewReception }) => {
    const { t } = useTranslation();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to no filtering
    const [filteredReceptions, setFilteredReceptions] = useState(receptions);

    useEffect(() => {
        // Filter receptions based on selected month
        const filtered = selectedMonth === null
            ? receptions
            : receptions.filter(reception => {
                const receptionMonth = new Date(reception.date).getMonth();
                return receptionMonth === selectedMonth;
            });
        setFilteredReceptions(filtered);
    }, [selectedMonth, receptions]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value === "all" ? null : parseInt(event.target.value));
    };

    const handleDelete = async (receptionId) => {
        try {
            await axios.delete(`http://localhost:3000/receptions/${receptionId}`);
            onReceptionDeleted(); // Notify parent component to refresh reception list
        } catch (error) {
            console.error('Error deleting reception:', error);
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
        <div className="reception-list">
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
                        <th>{t('receptionList.numCommande')}</th>
                        <th>{t('receptionList.numTransfert')}</th>
                        <th>{t('receptionList.date')}</th>
                        <th>{t('receptionList.nomChauffeur')}</th>
                        <th>{t('receptionList.immatriculationCamion')}</th>
                        <th>{t('receptionList.depotDepart')}</th>
                        <th>{t('productList.codeProduit')}</th>
                        <th>{t('productList.designation')}</th>
                        <th>{t('receptionList.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReceptions.map((reception) => (
                        <tr key={reception.id}>
                            <td>{reception.numCommande}</td>
                            <td>{reception.numTransfert}</td>
                            <td>{new Date(reception.date).toLocaleDateString()}</td>
                            <td>{reception.nomChauffeur}</td>
                            <td>{reception.immatriculationCamion}</td>
                            <td>{reception.depotDepart}</td>
                            {/* Display products here */}
                            <td>
                                {reception.products.map((product, index) => (
                                    <div key={index}>
                                        <span>{product.codeProduit}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                {reception.products.map((product, index) => (
                                    <div key={index}>
                                        <span>{product.designation}</span>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => onViewReception(reception.id)} className="view-button">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <Link to={`/edit-reception/${reception.id}`} className="edit-button">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button onClick={() => handleDelete(reception.id)} className="delete-button">
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

export default ReceptionList;
