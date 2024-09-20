import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Alert, Card, CardContent, Grid, Button, TextField } from '@mui/material';

const ReceptionDetail = ({ receptionId }) => {
    const { t } = useTranslation();
    const [reception, setReception] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [productEditIndex, setProductEditIndex] = useState(null);
    const [products, setProducts] = useState([]);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        const fetchReception = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/receptions/${receptionId}`);
                setReception(response.data);
                setFormData({
                    numCommande: response.data.numCommande,
                    numTransfert: response.data.numTransfert,
                    date: response.data.date,
                    nomChauffeur: response.data.nomChauffeur,
                    immatriculationCamion: response.data.immatriculationCamion,
                    depotDepart: response.data.depotDepart
                });
                setProducts(response.data.products);
            } catch (error) {
                setError('Error fetching reception data');
            } finally {
                setLoading(false);
            }
        };

        fetchReception();
    }, [receptionId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({
            numCommande: reception.numCommande,
            numTransfert: reception.numTransfert,
            date: reception.date,
            nomChauffeur: reception.nomChauffeur,
            immatriculationCamion: reception.immatriculationCamion,
            depotDepart: reception.depotDepart
        });
        setProducts(reception.products);
        setValidationError(null);
    };

    const handleSaveClick = async () => {
        let isValid = true;
        products.forEach((product) => {
            if (product.quantityReceived < 0 || product.quantityAnomaly < 0) {
                isValid = false;
                setValidationError('Quantities must be non-negative numbers');
            }
        });

        if (!isValid) return;

        try {
            await axios.put(`http://localhost:3000/receptions/${receptionId}`, {
                ...formData,
                products
            });
            setReception({
                ...reception,
                ...formData,
                products
            });
            setIsEditing(false);
            setValidationError(null);
        } catch (error) {
            setError('Error updating reception data');
        }
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setProducts(updatedProducts);
    };

    const handleEditProductClick = (index) => {
        setProductEditIndex(index);
    };

    const handleSaveProductClick = (index) => {
        setProductEditIndex(null);
    };

    const handleProductInputChange = (e, index, field) => {
        const { value } = e.target;
        handleProductChange(index, field, value);
    };

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box my={4} textAlign="center">
                    <CircularProgress />
                    <Typography variant="h6" mt={2}>
                        {t('loading')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Container>
        );
    }

    if (!reception) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h6" align="center">
                        {t('noReceptionFound')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" gutterBottom align="center">
                    {t('receptionDetails')}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined">
                            <CardContent>
                                {isEditing ? (
                                    <>
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('commandeNumber')}
                                            name="numCommande"
                                            value={formData.numCommande}
                                            onChange={(e) => setFormData({ ...formData, numCommande: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('transfertNumber')}
                                            name="numTransfert"
                                            value={formData.numTransfert}
                                            onChange={(e) => setFormData({ ...formData, numTransfert: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('date')}
                                            type="date"
                                            name="date"
                                            value={formData.date.slice(0, 10)}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('chauffeurName')}
                                            name="nomChauffeur"
                                            value={formData.nomChauffeur}
                                            onChange={(e) => setFormData({ ...formData, nomChauffeur: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('camionRegistration')}
                                            name="immatriculationCamion"
                                            value={formData.immatriculationCamion}
                                            onChange={(e) => setFormData({ ...formData, immatriculationCamion: e.target.value })}
                                        />
                                        <TextField
                                            fullWidth
                                            margin="normal"
                                            label={t('depotDepart')}
                                            name="depotDepart"
                                            value={formData.depotDepart}
                                            onChange={(e) => setFormData({ ...formData, depotDepart: e.target.value })}
                                        />
                                        <Box mt={2}>
                                            <Button variant="contained" color="primary" onClick={handleSaveClick}>
                                                {t('save')}
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={handleCancelClick} style={{ marginLeft: '8px' }}>
                                                {t('cancel')}
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h6" gutterBottom>
                                            <strong>{t('commandeNumber')}:</strong> {reception.numCommande}
                                        </Typography>
                                        <Typography variant="h6">
                                            <strong>{t('transfertNumber')}:</strong> {reception.numTransfert}
                                        </Typography>
                                        <Typography variant="h6">
                                            <strong>{t('date')}:</strong> {new Date(reception.date).toLocaleDateString()}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={handleEditClick}>
                                            {t('edit')}
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    <strong>{t('chauffeurName')}:</strong> {reception.nomChauffeur}
                                </Typography>
                                <Typography variant="h6">
                                    <strong>{t('camionRegistration')}:</strong> {reception.immatriculationCamion}
                                </Typography>
                                <Typography variant="h6">
                                    <strong>{t('depotDepart')}:</strong> {reception.depotDepart}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        {t('products')}
                    </Typography>
                    {validationError && (
                        <Alert severity="error" style={{ marginBottom: '16px' }}>
                            {validationError}
                        </Alert>
                    )}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>{t('codeProduct')}</strong></TableCell>
                                    <TableCell><strong>{t('designation')}</strong></TableCell>
                                    <TableCell><strong>{t('quantityReceived')}</strong></TableCell>
                                    <TableCell><strong>{t('quantityAnomaly')}</strong></TableCell>
                                    {isEditing && <TableCell><strong>{t('actions')}</strong></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.codeProduit}</TableCell>
                                        <TableCell>{product.designation}</TableCell>
                                        <TableCell>
                                            {productEditIndex === index ? (
                                                <TextField
                                                    type="number"
                                                    value={product.quantiteRecept}
                                                    onChange={(e) => handleProductInputChange(e, index, 'quantityReceived')}
                                                />
                                            ) : (
                                                product.quantiteRecept
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {productEditIndex === index ? (
                                                <TextField
                                                    type="number"
                                                    value={product.quantiteAnomalie}
                                                    onChange={(e) => handleProductInputChange(e, index, 'quantityAnomaly')}
                                                />
                                            ) : (
                                                product.quantiteAnomalie
                                            )}
                                        </TableCell>
                                        {isEditing && (
                                            <TableCell>
                                                {productEditIndex === index ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleSaveProductClick(index)}
                                                    >
                                                        {t('save')}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        onClick={() => handleEditProductClick(index)}
                                                    >
                                                        {t('edit')}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Container>
    );
};

export default ReceptionDetail;
