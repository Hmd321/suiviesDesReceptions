import React from 'react';
import { useTranslation } from 'react-i18next';

const OccupancyRate = ({ avgOccupancyRate, totalUmInStock }) => {
    const { t } = useTranslation();

    return (
        <div className="card">
            <h3>Taux d'Occupation</h3>
            <p style={{ fontSize: '12px', color: '#333' }}>
                {t('avgOccupancyRate')}: <span style={{ color: '#007bff', fontWeight: 'bold' }}>{avgOccupancyRate}%</span>
            </p>
            <p style={{ fontSize: '12px', color: '#333' }}>{t('totalUmInStock')}: <span style={{ color: '#007bff', fontWeight: 'bold' }}>{totalUmInStock} PLT</span></p>

        </div>
    );
};

export default OccupancyRate;
