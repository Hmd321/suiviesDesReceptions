import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import GestionDesProduitsPage from './GestionDesProduitsPage';
import GestionDesReceptionsPage from './GestionDesReceptionsPage';
import ReceptionDetail from './ReceptionDetail';
import AjouterReception from './AjouterReception';
import GestionDesExpeditionsPage from './GestionDesExpeditionsPage ';
import ExpeditionDetail from './ExpeditionDetail ';
import AjouterExpedition from './AjouterExpedition ';
import StockList from './StockList ';
import GestionDesAnomaliesPage from './GestionDesAnomaliesPage';
import DynamicStockTable from './DynamicStockTable';
import DashboardPage from './DashboardPage'

const HomePage = () => {
    const { t } = useTranslation();
    const [selectedPage, setSelectedPage] = useState('dashboard');
    const [selectedReceptionId, setSelectedReceptionId] = useState(null);
    const [selectedExpeditionId, setSelectedExpeditionId] = useState(null);


    const handleReceptionSelected = (receptionId) => {
        setSelectedReceptionId(receptionId);
        setSelectedPage('reception-details');
    };
    const handleExpeditionSelected = (expeditionId) => {
        setSelectedExpeditionId(expeditionId);
        setSelectedPage('expedition-details');
    };

    const handleAddReception = ()=>{
        setSelectedPage('add-reception');
    }
    const handleAddExpedition = ()=>{
        setSelectedPage('add-expedition');
    }

    const renderPageContent = () => {
        switch (selectedPage) {
            case 'produits':
                return <GestionDesProduitsPage />;
            case 'receptions':
                return <GestionDesReceptionsPage onReceptionSelected={handleReceptionSelected} handleAddReception={handleAddReception} />;
            case 'reception-details':
                return <ReceptionDetail receptionId={selectedReceptionId} />;
            case 'expeditions':
                return <GestionDesExpeditionsPage onExpeditionSelected ={handleExpeditionSelected} handleAddExpedition={handleAddExpedition}/>;
            case 'expedition-details':
                return <ExpeditionDetail expeditionId={selectedExpeditionId} />;
            case 'stocks':
                return <StockList/>;
            case 'anomalies':
                return <GestionDesAnomaliesPage/>;
            case 'add-reception':
                return <AjouterReception/>;
            case 'add-expedition':
                return <AjouterExpedition/>;
            case 'DynamicStockTable':
                return <DynamicStockTable/>;
            case 'dashboard':
                return<DashboardPage/>;
            default:
                return <div>{t('sidebar.dashboard')}</div>;
        }
    };

    return (
        <div className="home-page">
            <div className="sidebar">
                <div className="languge-selector-container">
                    <LanguageSelector />
                </div>
                <button
                    onClick={() => setSelectedPage('dashboard')}
                    className={`nav-button ${selectedPage === 'dashboard' ? 'selected' : ''}`}
                >
                    {t('sidebar.dashboard')}
                </button>
                <button
                    onClick={() => setSelectedPage('produits')}
                    className={`nav-button ${selectedPage === 'produits' ? 'selected' : ''}`}
                >
                    {t('sidebar.gestionDesProduits')}
                </button>
                <button
                    onClick={() => setSelectedPage('receptions')}
                    className={`nav-button ${selectedPage === 'receptions' ? 'selected' : ''}`}
                >
                    {t('sidebar.gestionDesReceptions')}
                </button>
                <button
                    onClick={() => setSelectedPage('expeditions')}
                    className={`nav-button ${selectedPage === 'expeditions' ? 'selected' : ''}`}
                >
                    {t('sidebar.gestionDesExpeditions')}
                </button>
                <button
                    onClick={() => setSelectedPage('stocks')}
                    className={`nav-button ${selectedPage === 'stocks' ? 'selected' : ''}`}
                >
                    {t('sidebar.gestionDesStocks')}
                </button>
                <button
                    onClick={() => setSelectedPage('anomalies')}
                    className={`nav-button ${selectedPage === 'anomalies' ? 'selected' : ''}`}
                >
                    {t('sidebar.gestionDesAnomalies')}
                </button>
                <button
                    onClick={() => setSelectedPage('DynamicStockTable')}
                    className={`nav-button ${selectedPage === 'DynamicStockTable' ? 'selected' : ''}`}
                >
                    {t('DynamicStockTable')}
                </button>
            </div>
            <div className="content">
                {renderPageContent()}
            </div>
        </div>
    );
};

export default HomePage;
