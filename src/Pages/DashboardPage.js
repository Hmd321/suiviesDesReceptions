import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TotalProducts from '../Components/TotalProducts';
import StockStatusChart from '../Components/StockStatusChart';
import { useTranslation } from 'react-i18next';
import OccupancyRate from '../Components/OccupancyRate';
import CamionStats from '../Components/CamionStats';
import UnitsHandled from '../Components/UnitsHandled';
import UnitsHandledChart from '../Components/UnitsHandledChart';


const DashboardPage = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [avgOccupancyRate, setAvgOccupancyRate] = useState(0);
    const [totalUmInStock, setTotalUmInStock] = useState(0);
    const [capacities, setCapacities] = useState({
        sec: 2500,
        sas: 106,
        chambreFroid: 200,
        total: 2806
    });
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const aggregateDataByDate = () => {
        const aggregatedData = data.reduce((acc, entry) => {
          const existing = acc[entry.date] || { sec: 0, sas: 0, chambreFroid: 0 };
    
          if (entry.zone === 'sec') {
            existing.sec = entry.quantiteOccupee;
          } else if (entry.zone === 'sas') {
            existing.sas = entry.quantiteOccupee;
          } else if (entry.zone === 'chambre froid') {
            existing.chambreFroid = entry.quantiteOccupee;
          }
    
          acc[entry.date] = existing;
          return acc;
        }, {});
    
        return Object.entries(aggregatedData).map(([date, zones]) => {
          const totalQuantity = zones.sec + zones.sas + zones.chambreFroid;
          return {
            date,
            sec: zones.sec,
            sas: zones.sas,
            chambreFroid: zones.chambreFroid,
            totalQuantity,
            totalPercentage: (totalQuantity / capacities.total) * 100,
            secPercentage: (zones.sec / capacities.sec) * 100,
            sasPercentage: (zones.sas / capacities.sas) * 100,
            chambreFroidPercentage: (zones.chambreFroid / capacities.chambreFroid) * 100
          };
        });
      };

    const findPeakValues = () => {
        const peakValues = data.reduce(
          (peaks, entry) => {
            if (entry.zone === 'sec' && entry.quantiteOccupee > peaks.sec) {
              peaks.sec = entry.quantiteOccupee;
            }
            if (entry.zone === 'sas' && entry.quantiteOccupee > peaks.sas) {
              peaks.sas = entry.quantiteOccupee;
            }
            if (entry.zone === 'chambre froid' && entry.quantiteOccupee > peaks.chambreFroid) {
              peaks.chambreFroid = entry.quantiteOccupee;
            }
            return peaks;
          },
          { sec: 0, sas: 0, chambreFroid: 0 }
        );
    
        const totalQuantity = peakValues.sec + peakValues.sas + peakValues.chambreFroid;
    
        return {
          sec: peakValues.sec,
          sas: peakValues.sas,
          chambreFroid: peakValues.chambreFroid,
          totalQuantity,
          totalPercentage: (totalQuantity / capacities.total) * 100,
          secPercentage: (peakValues.sec / capacities.sec) * 100,
          sasPercentage: (peakValues.sas / capacities.sas) * 100,
          chambreFroidPercentage: (peakValues.chambreFroid / capacities.chambreFroid) * 100,
        };
      };

    const aggregatedData = aggregateDataByDate();
    const peakValues = findPeakValues();
    

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/occupation-rates/${selectedMonth}`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching stock data", error);
            }
        };
        fetchStock();
    }, [selectedMonth]);

    useEffect(() => {
        if (aggregatedData && aggregatedData.length > 0) {
            // Sort the data by date in descending order
            const sortedData = [...aggregatedData].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Get the latest entry
            const latestData = sortedData[0];
            
            // Set state with the latest data, rounding the numbers to remove decimals
            setTotalUmInStock(Math.round(latestData.totalQuantity));
            setAvgOccupancyRate(Math.round(latestData.totalPercentage));
        }
    }, [aggregatedData]);

    const downloadExcel = async () => {
        try {
            const response = await axios.get('http://localhost:3000/generate-excel/thismounth', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'stocks.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };

    return (
        <div className="dashboard">
            <div className='dash-header' >
                <h3>{t('translation.InventoryDashboard')}</h3>
                <button className="download-button" onClick={downloadExcel}>{t('DownloadExcel')}</button>
            </div>
            <div className="card-container">
                <TotalProducts />
                <UnitsHandled/>
                <CamionStats/>
                <OccupancyRate avgOccupancyRate={avgOccupancyRate} totalUmInStock={totalUmInStock}/>
            </div>

            <div className="chart">
                <StockStatusChart aggregatedData={aggregatedData} peakValues={peakValues} />
            </div>
            <div className="chart">
                <UnitsHandledChart/>
            </div>

            {/* <div className="tbles">
                <div>
                    <h2>Product List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PRD001</td>
                                <td>Tablet PC</td>
                                <td>50</td>
                                <td>$299.99</td>
                            </tr>
                            <tr>
                                <td>PRD002</td>
                                <td>Smartphone</td>
                                <td>100</td>
                                <td>$599.99</td>
                            </tr>
                            <tr>
                                <td>PRD003</td>
                                <td>Laptop</td>
                                <td>30</td>
                                <td>$999.99</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h2>Recent Expeditions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>EXP001</td>
                                <td>2023-09-10</td>
                                <td>Delivered</td>
                            </tr>
                            <tr>
                                <td>EXP002</td>
                                <td>2023-09-11</td>
                                <td>In Transit</td>
                            </tr>
                            <tr>
                                <td>EXP003</td>
                                <td>2023-09-12</td>
                                <td>Processing</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> */}
            
        </div>
    );
};

export default DashboardPage;
