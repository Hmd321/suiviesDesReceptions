import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OccupationRateTable = () => {
    const [capacites, setCapacites] = useState({
        sec: 2500,
        sas: 106,
        'chambre froid': 200,
        totale: 2806
    });
    const [occupationData, setOccupationData] = useState([]);

    useEffect(() => {
        const fetchOccupationRates = async () => {
            try {
                const response = await axios.post('http://localhost:3000/occupation-rates', { capacites });
                setOccupationData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des taux d\'occupation:', error);
            }
        };
        fetchOccupationRates();
    }, [capacites]);

    return (
        <div>
            <h1>Taux d'occupation par zones</h1>
            {/* Ajoutez ici votre formulaire pour ajuster les capacités par zone */}
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sec</th>
                        <th>SAS</th>
                        <th>Chambre Froid</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {occupationData.map((data, index) => (
                        <tr key={index}>
                            <td>{new Date(data.date).toLocaleDateString()}</td>
                            <td>{`${data.sec.quantiteOccupee} (${data.sec.tauxOccupation}%)`}</td>
                            <td>{`${data.sas.quantiteOccupee} (${data.sas.tauxOccupation}%)`}</td>
                            <td>{`${data['chambre froid'].quantiteOccupee} (${data['chambre froid'].tauxOccupation}%)`}</td>
                            <td>{`${data.totale.quantiteOccupee} (${data.totale.tauxOccupation}%)`}</td>
                        </tr>
                    ))} */}
                </tbody>
            </table>
        </div>
    );
};

export default OccupationRateTable;
