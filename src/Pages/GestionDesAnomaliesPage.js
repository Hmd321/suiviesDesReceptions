import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnomalieList from '../Components/AnomalieList';
import SearchBar from '../Components/SearchBar';
import { useTranslation } from 'react-i18next';

const GestionDesAnomaliesPage = () => {
    const { t } = useTranslation();
    const [anomalies, setAnomalies] = useState([]);
    const [filteredAnomalies, setFilteredAnomalies] = useState([]);

    useEffect(() => {
        fetchAnomalies();
    }, []);

    const fetchAnomalies = async () => {
        try {
            const response = await axios.get('http://localhost:3000/anomalies');
            setAnomalies(response.data);
            setFilteredAnomalies(response.data); // Initially, show all anomalies
        } catch (error) {
            console.error('Error fetching anomalies:', error);
        }
    };

    const handleAnomalieDeleted = async () => {
        await fetchAnomalies(); // Refresh anomaly list after deleting an anomaly
    };

    const handleSearch = (query) => {
        const filtered = anomalies.filter((anomalie) => 
            anomalie.Product.codeProduit.toLowerCase().includes(query.toLowerCase()) ||
            anomalie.Product.designation.toLowerCase().includes(query.toLowerCase()) ||
            anomalie.createdAt.toLowerCase().includes(query.toLowerCase()) ||
            (anomalie.reception && (
                anomalie.reception.numCommande.toLowerCase().includes(query.toLowerCase()) ||
                anomalie.reception.numTransfert.toLowerCase().includes(query.toLowerCase())
            )) ||
            (anomalie.expedition && (
                anomalie.expedition.numCommande.toLowerCase().includes(query.toLowerCase()) ||
                anomalie.expedition.numTransfert.toLowerCase().includes(query.toLowerCase())
            )) ||
            anomalie.description.toLowerCase().includes(query.toLowerCase()) ||
            anomalie.type.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAnomalies(filtered);
    };
    

    // const handleSearch = (query) => {
    //     const filtered = anomalies.filter((anomalie) => 
    //         anomalie.Product.codeProduit.toLowerCase().includes(query.toLowerCase()) ||
    //         anomalie.Product.designation.toLowerCase().includes(query.toLowerCase()) ||
    //         anomalie.Product.designation.toLowerCase().includes(query.toLowerCase()) ||
    //         anomalie.description.toLowerCase().includes(query.toLowerCase()) ||
    //         anomalie.type.toLowerCase().includes(query.toLowerCase())
    //     );
    //     setFilteredAnomalies(filtered);
    // };

    return (
        <div className="gestion-anomalies-wrapper">
            <div className="header-actions">
                <h1 className="page-title">{t('anomalieList.header')}</h1>
                <div className='search-container'>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <div className="anomalie-list-container">
                <AnomalieList 
                    anomalies={filteredAnomalies} 
                    onAnomalieDeleted={handleAnomalieDeleted} 
                />
            </div>
        </div>
    );
};

export default GestionDesAnomaliesPage;
