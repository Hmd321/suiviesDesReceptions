import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel, Button
} from '@mui/material';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';


const DynamicStockTable = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [capacities, setCapacities] = useState({
    sec: 2500,
    sas: 106,
    chambreFroid: 200,
    total: 2806
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/occupation-rates/${selectedMonth}`);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching stock data", error);
      }
    };
    fetchStock();
  }, [selectedMonth]);

  useEffect(() => {
    sendOccupationRequest()
  },[])

  const handleCapacityChange = (zone, value) => {
    setCapacities(prev => ({ ...prev, [zone]: value }));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

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
  
    // Tri des données par date
    return Object.entries(aggregatedData)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB)) // tri croissant par date
      .map(([date, zones]) => {
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
    // Aggregating by date to calculate the total quantity for each date
    const aggregatedData = aggregateDataByDate();
  
    // Find the maximum values for sec, sas, chambreFroid, and totalQuantity
    const peakValues = aggregatedData.reduce(
      (peaks, entry) => {
        peaks.sec = Math.max(peaks.sec, entry.sec);
        peaks.sas = Math.max(peaks.sas, entry.sas);
        peaks.chambreFroid = Math.max(peaks.chambreFroid, entry.chambreFroid);
        peaks.totalQuantity = Math.max(peaks.totalQuantity, entry.totalQuantity);
        return peaks;
      },
      { sec: 0, sas: 0, chambreFroid: 0, totalQuantity: 0 }
    );
  
    return {
      sec: peakValues.sec,
      sas: peakValues.sas,
      chambreFroid: peakValues.chambreFroid,
      totalQuantity: peakValues.totalQuantity, // The largest totalQuantity across all entries
      totalPercentage: (peakValues.totalQuantity / capacities.total) * 100,
      secPercentage: (peakValues.sec / capacities.sec) * 100,
      sasPercentage: (peakValues.sas / capacities.sas) * 100,
      chambreFroidPercentage: (peakValues.chambreFroid / capacities.chambreFroid) * 100,
    };
  };
  
  
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(aggregateDataByDate());
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Taux d\'occupation');
    XLSX.writeFile(workbook, 'taux_occupation.xlsx');
  };
  const  calculerTOC = async ()=>{
    await axios.get('http://localhost:3000/occupation-rates/');
    setSelectedMonth(new Date().getMonth() -1);
    setSelectedMonth(new Date().getMonth() +1);
  }

  const sendOccupationRequest = async () => {
    try {
        const response = await fetch('http://localhost:3000/occupation-rates/occupation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ capacities }), // Send capacities to the backend
        });

        const data = await response.json();
        if (response.ok) {
            setSelectedMonth(new Date().getMonth() -1);
            setSelectedMonth(new Date().getMonth() +1);
        } else {
            console.error('Error calculating occupation rate:', data.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};

  const aggregatedData = aggregateDataByDate();
  const peakValues = findPeakValues();

  const cellStyle = {
    borderRight: '1px solid #dcdfe3',
    borderBottom: '1px solid #dcdfe3',
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" gutterBottom>
          {t('title')}
        </Typography>
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          {t('export')}
        </Button>
        <Button variant="contained" color="primary" onClick={sendOccupationRequest}>
          {t('calculate')}
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl>
          <InputLabel>{t('month')}</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(12).keys()].map((month) => (
              <MenuItem key={month + 1} value={month + 1}>{month + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField 
          label={t('capacitySec')}
          type="number"
          value={capacities.sec}
          onChange={(e) => handleCapacityChange('sec', e.target.value)}
        />
        <TextField 
          label={t('capacitySAS')}
          type="number"
          value={capacities.sas}
          onChange={(e) => handleCapacityChange('sas', e.target.value)}
        />
        <TextField 
          label={t('capacityChambreFroid')}
          type="number"
          value={capacities.chambreFroid}
          onChange={(e) => handleCapacityChange('chambreFroid', e.target.value)}
        />
        <TextField 
          label={t('capacityTotal')}
          type="number"
          value={capacities.total}
          onChange={(e) => handleCapacityChange('total', e.target.value)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#007bff'}}>
            <TableRow>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{t('date')}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{t('secQtyPercentage')}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{t('sasQtyPercentage')}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{t('chambreFroidQtyPercentage')}</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>{t('totalQtyPercentage')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aggregatedData.length > 0 ? (
              aggregatedData.map((entry, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: parseFloat(entry.totalPercentage) > 80 ? '#f44336' : '#e3fcee',
                    color: '#fff',
                  }}
                >
                  <TableCell style={cellStyle}>{entry.date}</TableCell>
                  <TableCell style={cellStyle}>{`${entry.sec} / ${entry.secPercentage.toFixed(2)}%`}</TableCell>
                  <TableCell style={cellStyle}>{`${entry.sas} / ${entry.sasPercentage.toFixed(2)}%`}</TableCell>
                  <TableCell style={cellStyle}>{`${entry.chambreFroid} / ${entry.chambreFroidPercentage.toFixed(2)}%`}</TableCell>
                  <TableCell style={{ ...cellStyle, fontWeight: 'bold' }}>{`${entry.totalQuantity} / ${entry.totalPercentage.toFixed(2)}%`}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell  style={{ backgroundColor: '#c5dafa'}} colSpan={5}>{t('noData')}</TableCell>
              </TableRow>
            )}
            {/* Peak of the Month Row */}
            <TableRow style={{ backgroundColor: '#007bff'}}>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{t('peakOfMonth')}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{`${peakValues.sec} / ${peakValues.secPercentage.toFixed(2)}%`}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{`${peakValues.sas} / ${peakValues.sasPercentage.toFixed(2)}%`}</TableCell>
              <TableCell style={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{`${peakValues.chambreFroid} / ${peakValues.chambreFroidPercentage.toFixed(2)}%`}</TableCell>
              <TableCell style={{ color: '#fff', fontWeight: 'bold' }}>{`${peakValues.totalQuantity} / ${peakValues.totalPercentage.toFixed(2)}%`}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DynamicStockTable;
