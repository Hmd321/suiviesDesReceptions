// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';
// import { Container, Typography, TextField, Button, Box, Grid, Card, CardContent, MenuItem, Select, InputLabel } from '@mui/material';

// const anomalyTypes = [
//     { value: 'damaged', label: 'Damaged' },
//     { value: 'quarantine', label: 'Quarantine' },
//     { value: 'other', label: 'Other' }
// ];

// const livraisonTypes = [
//     { value: 'palettes', label: 'Palettes' },
//     { value: 'cartons', label: 'Cartons' },
//     { value: 'pièces', label: 'Pièces' }
// ];

// const AjouterReception = ({ receptionId }) => {
//     const { t } = useTranslation();
//     const [formData, setFormData] = useState({
//         numCommande: '',
//         numTransfert: '',
//         date: '',
//         nomChauffeur: '',
//         immatriculationCamion: '',
//         depotDepart: '',
//         depotArriver: '',
//         products: []
//     });

//     useEffect(() => {
//         if (receptionId) {
//             const fetchReception = async () => {
//                 try {
//                     const response = await axios.get(`http://localhost:3000/receptions/${receptionId}`);
//                     const data = response.data;
//                     setFormData({
//                         ...data,
//                         date: new Date(data.date).toISOString().split('T')[0],
//                         products: data.products || []
//                     });
//                 } catch (error) {
//                     console.error('Error fetching reception:', error);
//                 }
//             };
//             fetchReception();
//         }
//     }, [receptionId]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value
//         });
//     };

//     const handleProductChange = (index, e) => {
//         const { name, value } = e.target;
//         const newProducts = [...formData.products];
//         newProducts[index] = {
//             ...newProducts[index],
//             [name]: value
//         };
//         setFormData({
//             ...formData,
//             products: newProducts
//         });
//     };

//     const handleAnomalyChange = (productIndex, anomalyIndex, e) => {
//         const { name, value } = e.target;
//         const newProducts = [...formData.products];
//         const newAnomalies = [...newProducts[productIndex].anomalies];

//         newAnomalies[anomalyIndex] = {
//             ...newAnomalies[anomalyIndex],
//             [name]: value
//         };

//         newProducts[productIndex] = {
//             ...newProducts[productIndex],
//             anomalies: newAnomalies
//         };

//         setFormData({
//             ...formData,
//             products: newProducts
//         });
//     };

//     const addProduct = () => {
//         setFormData({
//             ...formData,
//             products: [...formData.products, { codeProduit: '', designation: '', quantiteLivree: '', typeLivraison: '', anomalies: [] }]
//         });
//     };

//     const addAnomaly = (index) => {
//         const newProducts = [...formData.products];
//         const newAnomalies = [...newProducts[index].anomalies, { type: '', quantity: '', description: '' }];

//         newProducts[index] = {
//             ...newProducts[index],
//             anomalies: newAnomalies
//         };

//         setFormData({
//             ...formData,
//             products: newProducts
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (formData.products.length === 0) {
//             alert('Please add at least one product to the reception.');
//             return;
//         }

//         const updatedFormData = {
//             ...formData,
//             products: formData.products.map(product => ({
//                 ...product,
//                 quantiteLivree: Number(product.quantiteLivree),
//                 anomalies: product.anomalies.map(anomaly => ({
//                     ...anomaly,
//                     quantity: Number(anomaly.quantity)
//                 }))
//             }))
//         };

//         try {
//             const url = receptionId 
//                 ? `http://localhost:3000/receptions/${receptionId}` 
//                 : 'http://localhost:3000/receptions';

//             const method = receptionId ? 'put' : 'post';

//             const response = await axios({
//                 method,
//                 url,
//                 data: updatedFormData
//             });

//             console.log('Reception saved successfully:', response.data);
//         } catch (error) {
//             if (error.response) {
//                 console.error('Error response data:', error.response.data);
//                 console.error('Error response status:', error.response.status);
//                 console.error('Error response headers:', error.response.headers);
//                 alert(`Error saving reception: ${error.response.data.error || 'Unknown error occurred'}`);
//             } else if (error.request) {
//                 console.error('Error request data:', error.request);
//                 alert('No response received from server.');
//             } else {
//                 console.error('Error message:', error.message);
//                 alert(`Error saving reception: ${error.message}`);
//             }
//         }
//     };

//     return (
//         <Container maxWidth="lg" sx={{ width: '100%' }}>
//             <Box my={0} p={1} bgcolor="#f9f9f9" borderRadius="8px" boxShadow={3}>
//                 <Typography variant="h4" gutterBottom align="center" color="#333">
//                     {receptionId ? 'Update Reception' : 'Add Reception'}
//                 </Typography>
//                 <Box component="form" onSubmit={handleSubmit} noValidate>
//                     <Grid container spacing={5}>
//                         <Grid item xs={12} md={5}>
//                             <Box p={2} bgcolor="#ffffff" borderRadius="8px" boxShadow={2} sx={{ width: '100%' }}>
//                                 <Typography variant="h6" gutterBottom color="#333">
//                                     {t('receptionForm.receptionInfo')}
//                                 </Typography>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.numCommande')}
//                                             name="numCommande"
//                                             value={formData.numCommande}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.numTransfert')}
//                                             name="numTransfert"
//                                             value={formData.numTransfert}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.date')}
//                                             name="date"
//                                             type="date"
//                                             value={formData.date}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             InputLabelProps={{ shrink: true }}
//                                             required
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.nomChauffeur')}
//                                             name="nomChauffeur"
//                                             value={formData.nomChauffeur}
//                                             onChange={handleChange}
//                                             fullWidth
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.immatriculationCamion')}
//                                             name="immatriculationCamion"
//                                             value={formData.immatriculationCamion}
//                                             onChange={handleChange}
//                                             fullWidth
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.depotDepart')}
//                                             name="depotDepart"
//                                             value={formData.depotDepart}
//                                             onChange={handleChange}
//                                             fullWidth
//                                         />
//                                     </Grid>
//                                     <Grid item xs={12}>
//                                         <TextField
//                                             label={t('receptionForm.depotArriver')}
//                                             name="depotArriver"
//                                             value={formData.depotArriver}
//                                             onChange={handleChange}
//                                             fullWidth
//                                             required
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             </Box>
//                         </Grid>
                        
//                         <Grid item xs={12} md={7}>
//                             <Box p={1} bgcolor="#ffffff" borderRadius="8px" boxShadow={2} sx={{ width: '95%' }}>
//                                 <Typography variant="h6" gutterBottom color="#333">
//                                     {t('receptionForm.products')}
//                                 </Typography>
//                                 {formData.products.map((product, index) => (
//                                     <Card key={index} variant="outlined" sx={{ mb: 2, borderColor: '#e0e0e0', width: '100%' }}>
//                                         <CardContent>
//                                             <Grid container spacing={1}>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <TextField
//                                                         label={t('receptionForm.codeProduit')}
//                                                         name="codeProduit"
//                                                         value={product.codeProduit}
//                                                         onChange={(e) => handleProductChange(index, e)}
//                                                         fullWidth
//                                                         required
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={6}>
//                                                     <TextField
//                                                         label={t('receptionForm.designation')}
//                                                         name="designation"
//                                                         value={product.designation}
//                                                         onChange={(e) => handleProductChange(index, e)}
//                                                         fullWidth
//                                                         required
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={4}>
//                                                     <TextField
//                                                         label={t('receptionForm.quantiteLivree')}
//                                                         name="quantiteLivree"
//                                                         value={product.quantiteLivree}
//                                                         onChange={(e) => handleProductChange(index, e)}
//                                                         fullWidth
//                                                         required
//                                                     />
//                                                 </Grid>
//                                                 <Grid item xs={12} sm={4}>
//                                                     <InputLabel>{t('receptionForm.typeLivraison')}</InputLabel>
//                                                     <Select
//                                                         name="typeLivraison"
//                                                         value={product.typeLivraison}
//                                                         onChange={(e) => handleProductChange(index, e)}
//                                                         fullWidth
//                                                     >
//                                                         {livraisonTypes.map(type => (
//                                                             <MenuItem key={type.value} value={type.value}>
//                                                                 {type.label}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </Grid>
//                                             </Grid>
                                            
//                                             <Box mt={2}>
//                                                 <Button variant="outlined" onClick={() => addAnomaly(index)}>
//                                                     {t('receptionForm.addAnomaly')}
//                                                 </Button>
//                                             </Box>
//                                             {product.anomalies.map((anomaly, anomalyIndex) => (
//                                                 <Grid container spacing={2} key={anomalyIndex}>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <InputLabel>{t('receptionForm.anomalyType')}</InputLabel>
//                                                         <Select
//                                                             name="type"
//                                                             value={anomaly.type}
//                                                             onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
//                                                             fullWidth
//                                                         >
//                                                             {anomalyTypes.map(type => (
//                                                                 <MenuItem key={type.value} value={type.value}>
//                                                                     {type.label}
//                                                                 </MenuItem>
//                                                             ))}
//                                                         </Select>
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <TextField
//                                                             label={t('receptionForm.quantity')}
//                                                             name="quantity"
//                                                             value={anomaly.quantity}
//                                                             onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
//                                                             fullWidth
//                                                             required
//                                                         />
//                                                     </Grid>
//                                                     <Grid item xs={12} sm={4}>
//                                                         <TextField
//                                                             label={t('receptionForm.description')}
//                                                             name="description"
//                                                             value={anomaly.description}
//                                                             onChange={(e) => handleAnomalyChange(index, anomalyIndex, e)}
//                                                             fullWidth
//                                                         />
//                                                     </Grid>
//                                                 </Grid>
//                                             ))}
//                                         </CardContent>
//                                     </Card>
//                                 ))}
                                
//                                 <Button variant="outlined" onClick={addProduct}>
//                                     {t('receptionForm.addProduct')}
//                                 </Button>
//                             </Box>
//                         </Grid>
//                     </Grid>

//                     <Box mt={3} display="flex" justifyContent="center">
//                         <Button variant="contained" type="submit">
//                             {receptionId ? t('receptionForm.update') : t('receptionForm.submit')}
//                         </Button>
//                     </Box>
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

// export default AjouterReception;