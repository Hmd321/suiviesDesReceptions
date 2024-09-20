import React from 'react';
import { Table, Button, Select, Input } from '@/components/ui/';

const ImprovedInterface = () => {
  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Taux d'occupation par zones</h1>
        <Button variant="outline">EXPORTER VERS EXCEL</Button>
      </div>
      
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Select>
          <option>Mois: 9</option>
        </Select>
        <Input placeholder="Capacité Sec: 2500" />
        <Input placeholder="Capacité SAS: 106" />
        <Input placeholder="Capacité Chambre Froid: 200" />
        <Input placeholder="Capacité Totale: 2806" />
      </div>
      
      <div className="grid grid-cols-6 gap-4 mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Tableau de bord</Button>
        <Button variant="outline">Gestion des produits</Button>
        <Button variant="outline">Gestion des réceptions</Button>
        <Button variant="outline">Gestion des expéditions</Button>
        <Button variant="outline">Gestion des stocks</Button>
        <Button variant="outline">Gestion des anomalies</Button>
      </div>
      
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Date</Table.Head>
            <Table.Head>Sec (Quantité / %)</Table.Head>
            <Table.Head>SAS (Quantité / %)</Table.Head>
            <Table.Head>Chambre Froid (Quantité / %)</Table.Head>
            <Table.Head>Total (Quantité / %)</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>2024-09-03</Table.Cell>
            <Table.Cell>251 / 10.04%</Table.Cell>
            <Table.Cell>27.875 / 26.30%</Table.Cell>
            <Table.Cell>43.875 / 21.94%</Table.Cell>
            <Table.Cell>322.75 / 11.50%</Table.Cell>
          </Table.Row>
          {/* More rows would be added here */}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Pic du Mois</Table.Cell>
            <Table.Cell>22101979.38 / 884079.18%</Table.Cell>
            <Table.Cell>29 / 27.36%</Table.Cell>
            <Table.Cell>43.875 / 21.94%</Table.Cell>
            <Table.Cell>22102052.26 / 787671.14%</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
};

export default ImprovedInterface;