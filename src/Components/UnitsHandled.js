import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UnitsHandled = () => {
    const { t } = useTranslation();
    const [unitsHandled, setUnitsHandled] = useState({
        receptionUnitsToday: 0,
        receptionUnitsThisWeek: 0,
        receptionUnitsThisMonth: 0,
        expeditionUnitsToday: 0,
        expeditionUnitsThisWeek: 0,
        expeditionUnitsThisMonth: 0
    });

    // Fetch data from the API
    useEffect(() => {
        const fetchUnitsHandled = async () => {
            try {
                const response = await fetch('http://localhost:3000/calculations/units-handled');
                const data = await response.json();
                setUnitsHandled(data); // Set the received data in the state
            } catch (error) {
                console.error('Error fetching units handled:', error);
            }
        };

        fetchUnitsHandled();
    }, []);

    return (
        <div className="card-handled">
            <h3>{t('unitsHandled')}</h3>
            <div className="results-Container">
                <div>
                    <p>{t('receptions')}</p>
                    <p>{t('receptionUnitsToday')}: <span>{unitsHandled.receptionUnitsToday}</span></p>
                    <p>{t('receptionUnitsThisWeek')}: <span>{unitsHandled.receptionUnitsThisWeek}</span></p>
                    <p>{t('receptionUnitsThisMonth')}: <span>{unitsHandled.receptionUnitsThisMonth}</span></p>
                </div>
                <div>
                    <p>{t('expeditions')}</p>
                    <p>{t('expeditionUnitsToday')}: <span>{unitsHandled.expeditionUnitsToday}</span></p>
                    <p>{t('expeditionUnitsThisWeek')}: <span>{unitsHandled.expeditionUnitsThisWeek}</span></p>
                    <p>{t('expeditionUnitsThisMonth')}: <span>{unitsHandled.expeditionUnitsThisMonth}</span></p>
                </div>
                <div>
                    <p>{t('total')}</p>
                    <p><span>{unitsHandled.expeditionUnitsToday+unitsHandled.receptionUnitsToday}</span></p>
                    <p><span>{unitsHandled.expeditionUnitsThisWeek+unitsHandled.receptionUnitsThisWeek}</span></p>
                    <p><span>{unitsHandled.expeditionUnitsThisMonth+unitsHandled.receptionUnitsThisMonth}</span></p>
                </div>
            </div>
        </div>
    );
};

export default UnitsHandled;
