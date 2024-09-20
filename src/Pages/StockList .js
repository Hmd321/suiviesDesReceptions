import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box, CircularProgress, Alert, TextField,
    Card, CardContent, Divider, styled, FormControlLabel, Checkbox
} from '@mui/material';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    maxHeight: '505px', // Set the maximum height to enable scrolling
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
    fontSize: '0.8rem', // Smaller font size
    padding: theme.spacing(1), // Smaller padding
    position: 'sticky',
    top: 0,
    zIndex: 2,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '0.75rem', // Smaller font size for body cells
    padding: theme.spacing(0.5), // Smaller padding for body cells
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
        '& fieldset': {
            borderColor: theme.palette.divider,
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
    '& .MuiInputBase-root': {
        height: '36px',
    },
    width: '250px',
    marginLeft: 'auto',
}));

const FlexContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const FilterSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(0),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    marginLeft: "auto",
}));

const StockList = () => {
    const { t } = useTranslation();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState({
        all: true,
        sec: true,
        'chambre froid': true,
        sas: true,
    });

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/stocks');
                setStocks(response.data);
            } catch (error) {
                setError('Error fetching stock data');
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg">
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
            <Container maxWidth="lg">
                <Box my={4}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Container>
        );
    }

    const handleCategoryChange = (event) => {
        const { name, checked } = event.target;

        if (name === 'all') {
            setSelectedCategories({
                all: checked,
                'sec': checked,
                'chambre froid': checked,
                'sas': checked,
            });
        } else {
            setSelectedCategories(prevCategories => {
                const newCategories = { ...prevCategories, [name]: checked };
                const allChecked = Object.values(newCategories).every(value => value);

                return {
                    ...newCategories,
                    all: allChecked,
                };
            });
        }
    };

    const filteredStocks = stocks.filter(stock => {
        const matchesSearchTerm = stock.codeProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.designation.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategories.all || selectedCategories[stock.categoryStorage];

        return matchesSearchTerm && matchesCategory;
    });

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <StyledCard>
                    <CardContent>
                        <FlexContainer>
                            <Typography variant="h4" gutterBottom>
                                {t('stockList')}
                            </Typography>
                            <FilterSection>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedCategories.all}
                                        onChange={handleCategoryChange}
                                        name="all"
                                    />
                                }
                                label={t('all')}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedCategories.sec}
                                        onChange={handleCategoryChange}
                                        name="sec"
                                    />
                                }
                                label={t('sec')}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedCategories['chambre froid']}
                                        onChange={handleCategoryChange}
                                        name="chambre froid"
                                    />
                                }
                                label={t('chambre froid')}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedCategories.sas}
                                        onChange={handleCategoryChange}
                                        name="sas"
                                    />
                                }
                                label={t('sas')}
                            />
                           </FilterSection>
                            <StyledTextField
                                placeholder={t('searchPlaceholder')}
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </FlexContainer>
                    </CardContent>
                </StyledCard>
                <Divider />
                <StyledTableContainer component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <StyledTableHeadCell>{t('codeProduct')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('designation')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('quantityTotal')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('quantityTotalVendable')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('Qte Units')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('Qte Boxes')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('Qte Pallets')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('quantityDamaged')}</StyledTableHeadCell>
                                <StyledTableHeadCell>{t('quantityQuarantined')}</StyledTableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStocks.map((stock, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{stock.codeProduit}</StyledTableCell>
                                    <StyledTableCell>{stock.designation}</StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteTotale}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteVendable}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteTotaleParUnits}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteTotaleParColis}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteTotaleParPalette}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteAvariee}</center></StyledTableCell>
                                    <StyledTableCell><center>{stock.quantiteQuarantaine}</center></StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </Box>
        </Container>
    );
};

export default StockList;
