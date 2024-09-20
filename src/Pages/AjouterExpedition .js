import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Typography, TextField, Button, Box, Grid, Card, CardContent, MenuItem, Select, InputLabel } from '@mui/material';

const anomalyTypes = [
    { value: 'damaged', label: 'Damaged' },
    { value: 'quarantine', label: 'Quarantine' },
    { value: 'other', label: 'Other' }
];

const deliveryTypes = [
    { value: 'palettes', label: 'Palettes' },
    { value: 'colis', label: 'Colis' },
    { value: 'units', label: 'Units' }
];

const AjouterExpedition = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        numCommande: '',
        numTransfert: '',
        date: '',
        nomChauffeur: '',
        immatriculationCamion: '',
        depotArriver: '',
        products: []
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleDocumentTypeChange = (e) => {
        setDocumentType(e.target.value);
    };

    const fetchPdfInformation = async () => {
        const formDataFile = new FormData();
        formDataFile.append('pdf', selectedFile);

        let apiUrl = '';
        if (documentType === 'BL') {
            apiUrl = 'http://localhost:3000/pdf/bl-expdition-process-pdf';
        } else if (documentType === 'BTR') {
            apiUrl = 'http://localhost:3000/pdf/expdition-process-pdf';
        } else if (documentType === 'BA') {
            apiUrl = 'http://localhost:3000/pdf/ba-expdition-process-pdf';
        }else {
            alert('Please select a document type (BL or BTR).');
            return;
        }

        try {
            const response = await axios.post(apiUrl, formDataFile, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;
            console.log('PDF response data:', data);

            const [day, month, year] = data.date.split('/');
            const formattedDate = `${year}-${month}-${day}`;

            setFormData({
                ...data,
                date: formattedDate,
                products: data.products || []
            });
            alert('PDF processed successfully!');
        } catch (error) {
            console.error('Error processing PDF:', error);
            alert('Error processing PDF. Please check the file and try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProductChange = (index, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        newProducts[index] = {
            ...newProducts[index],
            [name]: value
        };
        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const handleAnomalyChange = (productIndex, anomalyIndex, e) => {
        const { name, value } = e.target;
        const newProducts = [...formData.products];
        const newAnomalies = [...newProducts[productIndex].Anomalie];

        newAnomalies[anomalyIndex] = {
            ...newAnomalies[anomalyIndex],
            [name]: value
        };

        newProducts[productIndex] = {
            ...newProducts[productIndex],
            Anomalie: newAnomalies
        };

        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const addProduct = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { codeProduit: '', designation: '', quantiteExpediee: '', typeLivraison: 'units', Anomalie: [] }]
        });
    };

    const addAnomaly = (index) => {
        const newProducts = [...formData.products];
        const newAnomalies = [...newProducts[index].Anomalie, { type: '', quantity: '', description: '' }];

        newProducts[index] = {
            ...newProducts[index],
            Anomalie: newAnomalies
        };

        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const deleteProduct = (index) => {
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const deleteAnomaly = (productIndex, anomalyIndex) => {
        const newProducts = [...formData.products];
        const newAnomalies = newProducts[productIndex].Anomalie.filter((_, i) => i !== anomalyIndex);

        newProducts[productIndex] = {
            ...newProducts[productIndex],
            Anomalie: newAnomalies
        };

        setFormData({
            ...formData,
            products: newProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.products.length === 0) {
            alert('Please add at least one product to the expedition.');
            return;
        }

        const updatedFormData = {
            ...formData,
            products: formData.products.map(product => ({
                ...product,
                quantiteExpediee: Number(product.quantiteExpediee),
                Anomalie: product.Anomalie.map(anomaly => ({
                    ...anomaly,
                    quantity: Number(anomaly.quantity)
                }))
            }))
        };

        try {
            const response = await axios.post('http://localhost:3000/expeditions', updatedFormData);
            console.log('Expedition created successfully:', response.data);
            alert('Reception saved successfully!');
        } catch (error) {
            const errorMessage = error.response.data.error || 'Unknown error occurred';
            console.error('Error saving reception:', errorMessage);
            alert(`Error saving reception: ${errorMessage}`);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ width: '100%' }}>
            <Box my={4} p={2} bgcolor="#f9f9f9" borderRadius="8px" boxShadow={3}>
                <Typography variant="h4" gutterBottom align="center" color="#333">
                    {t('expeditionForm.addExpedition')}
                </Typography>

                <Box mb={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
                    <InputLabel>{t('expeditionForm.documentType')}</InputLabel>
                    <Select
                        name="documentType"
                        value={documentType}
                        onChange={handleDocumentTypeChange}
                        sx={{
                            minWidth: 200,
                            height: '40px',
                            padding: '8px 14px',
                            fontSize: '0.875rem'
                        }}
                        required
                    >
                        <MenuItem value="BA">{t('expeditionForm.bonAffectation')}</MenuItem>
                        <MenuItem value="BL">{t('expeditionForm.bonDeLivraison')}</MenuItem>
                        <MenuItem value="BTR">{t('expeditionForm.bonDeTransfert')}</MenuItem>
                    </Select>

                    <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span" sx={{ height: '40px' }}>
                            {t('expeditionForm.selectPDF')}
                        </Button>
                    </label>

                    {selectedFile && (
                        <Typography variant="body2" sx={{ mx: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {selectedFile.name}
                        </Typography>
                    )}

                    <Button
                        onClick={fetchPdfInformation}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || !documentType}
                        sx={{ height: '40px' }}
                    >
                        {t('expeditionForm.fetchPdfInfo')}
                    </Button>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={5}>
                            <Box p={2} bgcolor="#ffffff" borderRadius="8px" boxShadow={2}>
                                <Typography variant="h6" gutterBottom color="#333">
                                    {t('expeditionForm.expeditionInfo')}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.numCommande')}
                                            name="numCommande"
                                            value={formData.numCommande}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.numTransfert')}
                                            name="numTransfert"
                                            value={formData.numTransfert}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.date')}
                                            name="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.nomChauffeur')}
                                            name="nomChauffeur"
                                            value={formData.nomChauffeur}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.immatriculationCamion')}
                                            name="immatriculationCamion"
                                            value={formData.immatriculationCamion}
                                            onChange={handleChange}
                                            fullWidth
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label={t('expeditionForm.depotArriver')}
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
                            <Box p={2} bgcolor="#ffffff" borderRadius="8px" boxShadow={2}>
                                <Typography variant="h6" gutterBottom color="#333">
                                    {t('expeditionForm.products')}
                                </Typography>
                                {formData.products.map((product, index) => (
                                    <Card key={index} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{`${t('expeditionForm.product')} ${index + 1}`}</Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        label={t('expeditionForm.codeProduit')}
                                                        name="codeProduit"
                                                        value={product.codeProduit}
                                                        onChange={(e) => handleProductChange(index, e)}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        label={t('expeditionForm.designation')}
                                                        name="designation"
                                                        value={product.designation}
                                                        onChange={(e) => handleProductChange(index, e)}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        label={t('expeditionForm.quantiteExpediee')}
                                                        name="quantiteExpediee"
                                                        type="number"
                                                        value={product.quantiteExpediee}
                                                        onChange={(e) => handleProductChange(index, e)}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <InputLabel>{t('expeditionForm.typeLivraison')}</InputLabel>
                                                    <Select
                                                        name="typeLivraison"
                                                        value={product.typeLivraison}
                                                        onChange={(e) => handleProductChange(index, e)}
                                                        fullWidth
                                                        required
                                                    >
                                                        {deliveryTypes.map((type) => (
                                                            <MenuItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {product.Anomalie.map((anomaly, anomalyIndex) => (
                                                        <Grid container spacing={2} key={anomalyIndex}>
                                                            <Grid item xs={12} sm={4}>
                                                                <Select
                                                                    label={t('expeditionForm.anomalyType')}
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
                                                                <InputLabel>{t('expeditionForm.anomalyType')}</InputLabel>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <TextField
                                                                    label={t('expeditionForm.anomalyQuantity')}
                                                                    name="quantity"
                                                                    type="number"
                                                                    value={anomaly.quantity}
                                                                    onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                    fullWidth
                                                                    required
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} sm={4}>
                                                                <TextField
                                                                    label={t('expeditionForm.anomalyDescription')}
                                                                    name="description"
                                                                    value={anomaly.description}
                                                                    onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
                                                                    fullWidth
                                                                />
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
                                                        </Grid>
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
                                <Button variant="contained" onClick={addProduct}>
                                    {t('expeditionForm.addProduct')}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={4}>
                        <Button type="submit" variant="contained" color="primary">
                            {t('expeditionForm.saveExpedition')}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default AjouterExpedition;
