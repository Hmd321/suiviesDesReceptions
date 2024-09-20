import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ReceptionForm from '../Components/ReceptionForm';
import ReceptionList from '../Components/ReceptionList';
import SearchBar from '../Components/SearchBar';

const GestionDesReceptionsPage = ({ onReceptionSelected,handleAddReception}) => {
    const { t } = useTranslation();
    const [receptions, setReceptions] = useState([]);
    const [filteredReceptions, setFilteredReceptions] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReception, setEditingReception] = useState(null);

    useEffect(() => {
        fetchReceptions();
    }, []);

    const fetchReceptions = async () => {
        try {
            const response = await axios.get('http://localhost:3000/receptions');
            setReceptions(response.data);
            setFilteredReceptions(response.data);
        } catch (error) {
            console.error('Error fetching receptions:', error);
        }
    };

    const handleReceptionAdded = async () => {
        await fetchReceptions();
        setIsDialogOpen(false);
        setEditingReception(null);
    };

    const handleReceptionDeleted = async () => {
        await fetchReceptions();
    };
    

    const handleSearch = (query) => {
        const filtered = receptions.filter((reception) =>
            reception.numCommande.toLowerCase().includes(query.toLowerCase()) ||
            reception.numTransfert.toLowerCase().includes(query.toLowerCase()) ||
            reception.date.toLowerCase().includes(query.toLowerCase()) ||
            reception.nomChauffeur.toLowerCase().includes(query.toLowerCase()) ||
            reception.depotDepart.toLowerCase().includes(query.toLowerCase()) ||
            reception.immatriculationCamion.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredReceptions(filtered);
    };

    const handleViewReception = (receptionId) => {
        onReceptionSelected(receptionId);
    };


    const handleEditReception = (reception) => {
        setEditingReception(reception);
        setIsDialogOpen(true);
    };

    return (
        <div className="content-wrapper">
            <div className="header-actions">
                <h1>{t('receptionList.header')}</h1>
                <div className="right-side">
                    <button
                        onClick={handleAddReception}
                        className="open-dialog-button"
                    >
                        {t('receptionList.addReception')}
                    </button>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </div>
            <ReceptionList
                receptions={filteredReceptions}
                onReceptionDeleted={handleReceptionDeleted}
                onReceptionEdit={handleEditReception}
                onViewReception={handleViewReception}
            />
            <div className={`dialog ${isDialogOpen ? 'open' : ''}`}>
                <ReceptionForm onReceptionAdded={handleReceptionAdded} reception={editingReception}  />
                <div className="dialog-footer">
                    <button className="close-button" onClick={() => setIsDialogOpen(false)}>
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GestionDesReceptionsPage;
