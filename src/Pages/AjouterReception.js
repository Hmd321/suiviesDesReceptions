import React, { useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Button, TextField, Grid, Card, CardContent, Select, MenuItem, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

const anomalyTypes = [
    { value: 'damaged', label: 'Damaged' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'other', label: 'Other' }
];

const livraisonTypes = [
    { value: 'palettes', label: 'Palettes' },
    { value: 'colis', label: 'colis' },
    { value: 'units', label: 'units' }
];

const AjouterReception = () => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        numCommande: '',
        numTransfert: '',
        date: '',
        nomChauffeur: '',
        immatriculationCamion: '',
        depotDepart: '',
        depotArriver: '',
        products: []
    });

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const fetchPdfInformation = async () => {
        if (!selectedFile) {
            alert('Please select a PDF file.');
            return;
        }
    
        const formData = new FormData();
        formData.append('pdf', selectedFile);
    
        try {
            const response = await axios.post('http://localhost:3000/pdf/process-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            const pdfData = response.data;
    
            // Format the date
            if (pdfData.date) {
                const [day, month, year] = pdfData.date.split('/');
                const formattedDate = `${year}-${month}-${day}`;
                pdfData.date = formattedDate;  // Update date to formatted version
            }
    
            // Update formData with formatted date and products
            setFormData(prevData => ({
                ...prevData,
                ...pdfData,
                products: pdfData.products.map(product => ({
                    ...product,
                    anomalies: product.anomalies || []  // Ensure anomalies is an empty array if not present
                }))
            }));
    
            alert('PDF processed successfully!');
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Error processing PDF. Please check the file and try again.');
        }
    };
    

    // const fetchPdfInformation = async () => {
    //     if (!selectedFile) {
    //         alert('Please select a PDF file.');
    //         return;
    //     }
    
    //     const formData = new FormData();
    //     formData.append('pdf', selectedFile);

    //     try {
    //         const response = await axios.post('http://localhost:3000/pdf/process-pdf', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });
    //         const pdfData = response.data;
    //         setFormData(prevData => ({
    //             ...prevData,
    //             ...pdfData,
    //             products: pdfData.products.map(product => ({
    //                 ...product,
    //                 anomalies: product.anomalies || []
    //             }))
    //         }));
    //         alert('PDF processed successfully!');
    //     } catch (error) {
    //         console.error('Error processing PDF:', error);
    //         alert('Error processing PDF. Please check the file and try again.');
    //     }
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [name]: value
        };
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };

    const handleAnomalyChange = (productIndex, anomalyIndex, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        newProducts[productIndex].anomalies[anomalyIndex] = {
            ...newProducts[productIndex].anomalies[anomalyIndex],
            [name]: value
        };
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };

    const addProduct = () => {
        setFormData(prevData => ({
            ...prevData,
            products: [...prevData.products, { codeProduit: '', designation: '', quantiteLivree: '', typeLivraison: '', anomalies: [] }]
        }));
    };


    const addAnomaly = (productIndex) => {
        const newProducts = [...formData.products];
        newProducts[productIndex].anomalies.push({ type: '', quantity: '', description: '', typeUnite: '' });
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };

    const deleteProduct = (productIndex) => {
        // Filter out the product at the specified index
        const newProducts = formData.products.filter((_, index) => index !== productIndex);
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };
    
    const deleteAnomaly = (productIndex, anomalyIndex) => {
        // Filter out the anomaly at the specified index for the specified product
        const newProducts = [...formData.products];
        newProducts[productIndex].anomalies = newProducts[productIndex].anomalies.filter((_, index) => index !== anomalyIndex);
        setFormData(prevData => ({
            ...prevData,
            products: newProducts
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.products.length === 0) {
            alert('Please add at least one product to the reception.');
            return;
        }

        const updatedFormData = {
            ...formData,
            products: formData.products.map(product => ({
                ...product,
                quantiteLivree: Number(product.quantiteLivree),
                anomalies: product.anomalies.map(anomaly => ({
                    ...anomaly,
                    quantity: Number(anomaly.quantity)
                }))
            }))
        };

        // try {
        //     const url = 'http://localhost:3000/receptions';
        //     const response = await axios.post(url, updatedFormData);
        //     console.log('Reception saved successfully:', response.data);
        //     alert('Reception saved successfully!');
        // } catch (error) {
        //     console.error('Error saving reception:', error);
        //     alert(`Error saving reception: ${error.message || 'Unknown error occurred'}`);
        // }
        try {
            const url = 'http://localhost:3000/receptions';
            const response = await axios.post(url, updatedFormData);
            console.log('Reception saved successfully:', response.data);
            alert('Reception saved successfully!');
        } catch (error) {
            if (error.response && error.response.data) {
                // Capture and log the error message from the backend
                const errorMessage = error.response.data.error || 'Unknown error occurred';
                console.error('Error saving reception:', errorMessage);
                alert(`Error saving reception: ${errorMessage}`);
            } else {
                // Handle network or other errors
                console.error('Error saving reception:', error.message);
                alert(`Error saving reception: ${error.message || 'Unknown error occurred'}`);
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Box my={0} p={1} bgcolor="#f9f9f9" borderRadius="8px" boxShadow={3}>
                <Typography variant="h4" gutterBottom align="center" color="#333">
                    {t('receptionForm.addReception')}
                </Typography>
                <Box mb={2} display="flex" alignItems="center">
                    <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            {t('receptionForm.selectPDF')}
                        </Button>
                    </label>
                    {selectedFile && (
                        <Typography variant="body2" sx={{ ml: 2 }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                    <Button 
                        onClick={fetchPdfInformation} 
                        variant="contained" 
                        color="primary" 
                        sx={{ ml: 2 }}
                        disabled={!selectedFile}
                    >
                        {t('receptionForm.fetchPdfInfo')}
                    </Button>
                </Box>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={5}>
                            <Box p={2} bgcolor="#ffffff" borderRadius="8px" boxShadow={2} sx={{ width: '100%' }}>
                                <Typography variant="h6" gutterBottom color="#333">
                                    {t('receptionForm.receptionInfo')}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.numCommande')}
                                            name="numCommande"
                                            value={formData.numCommande}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.numTransfert')}
                                            name="numTransfert"
                                            value={formData.numTransfert}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.date')}
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.nomChauffeur')}
                                            name="nomChauffeur"
                                            value={formData.nomChauffeur}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.immatriculationCamion')}
                                            name="immatriculationCamion"
                                            value={formData.immatriculationCamion}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.depotDepart')}
                                            name="depotDepart"
                                            value={formData.depotDepart}
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('receptionForm.depotArriver')}
                                            name="depotArriver"
                                            value={formData.depotArriver}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={7}>
                            <Box p={1} bgcolor="#ffffff" borderRadius="8px" boxShadow={2} sx={{ width: '95%' }}>
                                <Typography variant="h6" gutterBottom color="#333">
                                    {t('receptionForm.products')}
                                </Typography>
                                {formData.products.map((product, index) => (
                                    <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: '#e0e0e0', width: '100%' }}>
                                        <CardContent>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label={t('receptionForm.codeProduit')}
                                                        name="codeProduit"
                                                        value={product.codeProduit}
                                                        onChange={(e) => handleProductChange
                                                            (index, e)}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label={t('receptionForm.designation')}
                                                            name="designation"
                                                            value={product.designation}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            label={t('receptionForm.quantiteLivree')}
                                                            name="quantiteLivree"
                                                            type="number"
                                                            value={product.quantiteLivree}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Select
                                                            name="typeLivraison"
                                                            value={product.typeLivraison}
                                                            onChange={(e) => handleProductChange(index, e)}
                                                            fullWidth
                                                            required
                                                        >
                                                            {livraisonTypes.map((type) => (
                                                                <MenuItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <InputLabel>{t('receptionForm.typeLivraison')}</InputLabel>
                                                    </Grid>
                                                    <Grid item xs={12}>

                                                        {product.anomalies.map((anomaly, anomalyIndex) => (
                                                            <Card key={anomalyIndex} variant="outlined" sx={{ mb: 1 }}>
                                                                <CardContent>
                                                                    <Grid container spacing={1}>
                                                                        <Grid item xs={12} sm={6}>                                                                        
                                                                            <Select
                                                                                name="type"
                                                                                value={anomaly.type}
                                                                                onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                                fullWidth
                                                                                required
                                                                            >
                                                                                {anomalyTypes.map((type) => (
                                                                                    <MenuItem key={type.value} value={type.value}>
                                                                                        {type.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                            <InputLabel>{t('receptionForm.anomalyType')}</InputLabel>
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <TextField
                                                                                label={t('receptionForm.anomalyQuantity')}
                                                                                name="quantity"
                                                                                type="number"
                                                                                value={anomaly.quantity}
                                                                                onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                                fullWidth
                                                                                required
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>
                                                                            <TextField
                                                                                label={t('receptionForm.anomalyDescription')}
                                                                                name="description"
                                                                                value={anomaly.description}
                                                                                onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                                fullWidth
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={12} sm={6}>                                                                        
                                                                            <Select
                                                                                name="typeUnite"
                                                                                value={anomaly.typeUnite}
                                                                                onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                                fullWidth
                                                                                required
                                                                            >
                                                                                {livraisonTypes.map((type) => (
                                                                                    <MenuItem key={type.value} value={type.value}>
                                                                                        {type.label}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                            <InputLabel>{t('receptionForm.anomalyUnitType')}</InputLabel>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                <Button
                                                                    variant="outlined"
                                                                    onClick={() => deleteAnomaly(index, anomalyIndex)}
                                                                    color="error"
                                                                >
                                                                    {t('expeditionForm.deleteAnomaly')}
                                                                </Button>
                                                            </Grid>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                        <Grid item xs={12} display="flex" flexDirection="row" width="100%" justifyContent="space-between">
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => addAnomaly(index)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        {t('expeditionForm.addAnomaly')}
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => deleteProduct(index)}
                                                        color="error"
                                                        sx={{ mt: 2 }}
                                                        
                                                    >
                                                        {t('expeditionForm.deleteProduct')}
                                                    </Button>
                                                </Grid>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button onClick={addProduct} variant="outlined" color="primary">
                                        {t('receptionForm.addProduct')}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box mt={3} display="flex" justifyContent="center">
                            <Button type="submit" variant="contained" color="primary">
                                {t('receptionForm.save')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        );
    };
    
    export default AjouterReception;
    
