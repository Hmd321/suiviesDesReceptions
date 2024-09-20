import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AnomalieList = ({ anomalies, onAnomalieDeleted }) => {
    const { t } = useTranslation();

    const handleDelete = async (anomalieId) => {
        try {
            await axios.delete(`http://localhost:3000/anomalies/${anomalieId}`);
            onAnomalieDeleted(); // Notify parent component to refresh the anomalies list
        } catch (error) {
            console.error('Error deleting anomalie:', error);
        }
    };

    return (
        <div className="anomalie-list">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>{t('anomalieList.productCode')}</th>
                        <th>{t('anomalieList.productDesignation')}</th>
                        <th>{t('anomalieList.receptionCommandNumber')}</th>
                        <th>{t('anomalieList.receptionTransferNumber')}</th>
                        <th>{t('anomalieList.receptionDate')}</th>
                        <th>{t('anomalieList.quantity')}</th>
                        <th>{t('anomalieList.type')}</th>
                        <th>{t('anomalieList.description')}</th>
                        <th>{t('anomalieList.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {anomalies.map((anomalie) => (
                        <tr key={anomalie.id}>
                            <td>{anomalie.Product.codeProduit}</td>
                            <td>{anomalie.Product.designation}</td>
                            <td>{anomalie.reception?.numCommande || anomalie.expedition?.numCommande}</td>
                            <td>{anomalie.reception?.numTransfert || anomalie.expedition?.numTransfert}</td>
                            <td>{anomalie.reception?.date || anomalie.expedition?.date}</td>
                            <td>{anomalie.quantite}</td>
                            <td>{t(`anomalieList.${anomalie.type}`)}</td>
                            <td>{anomalie.description}</td>
                            <td>
                                <div className="actions">
                                    <Link to={`/edit-anomalie/${anomalie.id}`} className="edit-button">
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <button onClick={() => handleDelete(anomalie.id)} className="delete-button">
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

export default AnomalieList;
