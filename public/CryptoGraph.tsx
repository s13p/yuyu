import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

interface PriceData {
  prices: number[][];
  market_caps: number[][];
  total_volumes: number[][];
}

interface ChartProps {
  coinId?: string;
}

type ChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
};

const CryptoGraph: React.FC<ChartProps> = ({ coinId = 'bitcoin' }) => {
  const [chartData, setChartData] = useState<ChartDataType>({
    labels: [],
    datasets: [{
      label: '',
      data: [],
      borderColor: '',
      fill: false,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`);
      const data: PriceData = await response.json();

      const dates = data.prices.map(priceInfo => {
        const date = new Date(priceInfo[0]);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      });

      const prices = data.prices.map(priceInfo => priceInfo[1]);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Price in USD',
            data: prices,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
          },
        ],
      });
    };

    fetchData();
  }, [coinId]);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default CryptoGraph;