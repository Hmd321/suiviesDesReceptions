import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ExpeditionList from '../Components/ExpeditionList '; // You'll need to create this component
import SearchBar from '../Components/SearchBar';

const GestionDesExpeditionsPage = ({ onExpeditionSelected, handleAddExpedition }) => {
    const { t } = useTranslation();
    const [expeditions, setExpeditions] = useState([]);
    const [filteredExpeditions, setFilteredExpeditions] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpedition, setEditingExpedition] = useState(null);

    useEffect(() => {
        fetchExpeditions();
    }, []);

    const fetchExpeditions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/expeditions');
            setExpeditions(response.data);
            setFilteredExpeditions(response.data);
        } catch (error) {
            console.error('Error fetching expeditions:', error);
        }
    };

    const handleExpeditionAdded = async () => {
        await fetchExpeditions();
        setIsDialogOpen(false);
        setEditingExpedition(null);
    };

    const handleExpeditionDeleted = async () => {
        await fetchExpeditions();
    };

    const handleSearch = (query) => {
        const filtered = expeditions.filter((expedition) =>
            expedition.numCommande.toLowerCase().includes(query.toLowerCase()) ||
            expedition.numTransfert.toLowerCase().includes(query.toLowerCase()) ||
            expedition.date.toLowerCase().includes(query.toLowerCase()) ||
            expedition.nomChauffeur.toLowerCase().includes(query.toLowerCase()) ||
            expedition.depotDestination.toLowerCase().includes(query.toLowerCase()) ||
            expedition.immatriculationCamion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredExpeditions(filtered);
    };

    const handleViewExpedition = (expeditionId) => {
        onExpeditionSelected(expeditionId);
    };

    const handleEditExpedition = (expedition) => {
        setEditingExpedition(expedition);
        setIsDialogOpen(true);
    };

    return (
        <div className="content-wrapper">
            <div className="header-actions">
                <h1>{t('expeditionList.header')}</h1>
                <div className="right-side">
                    <button
                        onClick={handleAddExpedition}
                        className="open-dialog-button"
                    >
                        {t('expeditionList.addExpedition')}
                    </button>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <ExpeditionList
                expeditions={filteredExpeditions}
                onExpeditionDeleted={handleExpeditionDeleted}
                onExpeditionEdit={handleEditExpedition}
                onViewExpedition={handleViewExpedition}
            />
        </div>
    );
};

export default GestionDesExpeditionsPage;
