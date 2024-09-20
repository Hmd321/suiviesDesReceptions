import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CamionStats = () => {
    const [stats, setStats] = useState({
        day: { receptions: 0, expeditions: 0 },
        week: { receptions: 0, expeditions: 0 },
        month: { receptions: 0, expeditions: 0 }
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { t } = useTranslation(); // Use translation hook

    useEffect(() => {
        fetchCamionStats();
    }, []);

    const fetchCamionStats = async () => {
        try {
            const response = await axios.get('http://localhost:3000/calculations/camion-stats');
            setStats(response.data); // Update stats with the response data
        } catch (error) {
            console.error('Error fetching camion stats:', error);
        }
    };

    // Functions to open and close the dialog
    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    return (
        <div className="card">
            <h3>{t('camionStats')}</h3>
            <div className="stat-item">
                <p><strong>{t('today')}:</strong> {t('receptions')}: <span>{stats.day.receptions}</span> | {t('expeditions')}: <span>{stats.day.expeditions}</span></p>
            </div>
            <div className="stat-item">
                <p><strong>{t('thisWeek')}:</strong> {t('receptions')}: <span>{stats.week.receptions}</span> | {t('expeditions')}: <span>{stats.week.expeditions}</span></p>
            </div>
            <div className="stat-item">
                <p><strong>{t('thisMonth')}:</strong> {t('receptions')}: <span>{stats.month.receptions}</span> | {t('expeditions')}: <span>{stats.month.expeditions}</span></p>
            </div>


        </div>
    );
};

export default CamionStats;
