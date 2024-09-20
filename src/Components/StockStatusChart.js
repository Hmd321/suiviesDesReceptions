import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';

const StockStatusChart = ({ aggregatedData, peakValues }) => {
  const { t } = useTranslation();

  // Memoize data to prevent unnecessary renders
  const memoizedAggregatedData = useMemo(() => aggregatedData, [aggregatedData]);
  const memoizedPeakValues = useMemo(() => [peakValues], [peakValues]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: 'auto', overflow: 'hidden' }}>
      {/* Line Chart Container */}
      <div style={{ width: '48%' }}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={memoizedAggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="secPercentage" stroke="#8884d8" name={t('secQtyPercentage')} />
            <Line type="monotone" dataKey="sasPercentage" stroke="#82ca9d" name={t('sasQtyPercentage')} />
            <Line type="monotone" dataKey="chambreFroidPercentage" stroke="#ff7300" name={t('chambreFroidQtyPercentage')} />
            <Line type="monotone" dataKey="totalPercentage" stroke="#ff0000" name={t('totalQtyPercentage')} />
          </LineChart>
        </ResponsiveContainer>
        <h5 style={{ textAlign: 'center' }}>{t('translation.stockStatusChart')}</h5>
      </div>

      {/* Bar Chart Container */}
      <div style={{ width: '48%' }}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={memoizedPeakValues}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="secPercentage" fill="#8884d8" name={t('secQtyPercentage')} />
            <Bar dataKey="sasPercentage" fill="#82ca9d" name={t('sasQtyPercentage')} />
            <Bar dataKey="chambreFroidPercentage" fill="#ff7300" name={t('chambreFroidQtyPercentage')} />
            <Bar dataKey="totalPercentage" fill="#ff0000" name={t('totalQtyPercentage')} />
          </BarChart>
        </ResponsiveContainer>
        <h5 style={{ textAlign: 'center' }}>{t('peakOfMonth')}</h5>
      </div>
    </div>
  );
};

export default StockStatusChart;
