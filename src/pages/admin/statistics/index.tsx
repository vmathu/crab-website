import { ShoppingBagOutlined, ShowChartRounded } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { doGet } from '@src/utils/APIRequest';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { colors } from '@src/libs/ui';
import { PieChart } from '@mui/x-charts';

function Card({
  title,
  value,
  icon,
  colorIcon,
}: {
  title: string;
  value: string;
  icon: any;
  colorIcon: string;
}) {
  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      <div
        style={{
          background: colorIcon,
          padding: '12px 12px 8px 12px',
          height: 'fit-content',
          borderRadius: '24px',
        }}
      >
        {icon}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography variant='body2' fontWeight={600} color='#85858B'>
          {title}
        </Typography>
        <Typography variant='h3' fontWeight={600}>
          {value}
        </Typography>
      </div>
    </div>
  );
}

function parseNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}

export default function Statistics() {
  const [customers, setCustomers] = useState<number>(0);
  const [income, setIncome] = useState<string>('');
  const [motorbikeFee, setMotorbikeFee] = useState<[]>([]);
  const [carFee, setCarFee] = useState<[]>([]);
  const [motorbikeData, setMotorbikeData] = useState<any[]>([]);
  const [carData, setCarData] = useState<any[]>([]);
  const [xAxisData, setXAxisData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/accounts/members?role=customer',
      );
      setCustomers(response.data.data.length);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/booking-infos/fees',
      );

      setIncome(parseNumber(response.data));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/booking-infos/fees?type=motorbike',
      );

      setMotorbikeFee(response.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await doGet(
        'http://localhost:3000/api/booking-infos/fees?type=car',
      );

      setCarFee(response.data);
    };

    fetchData();
  }, []);

  // Convert date to a more readable format
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });
  }

  useEffect(() => {
    // Map over the motorbikeFee and carFee arrays to extract the date and value properties
    let data = motorbikeFee.map((fee: any) => ({
      x: formatDate(fee.date),
      y: fee.value,
    }));
    setMotorbikeData(data);

    data = carFee.map((fee: any) => ({
      x: formatDate(fee.date),
      y: fee.value,
    }));
    setCarData(data);

    // Create an array of unique dates for the xAxis
    data = Array.from(
      new Set([
        ...motorbikeData.map((item) => item.x),
        ...carData.map((item) => item.x),
      ]),
    );
    setXAxisData(data);
  }, [motorbikeFee, carFee]);

  return (
    <>
      <Typography variant='h6' fontWeight='600'>
        Business Report
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card
            title='Customers'
            value={customers.toString()}
            icon={<ShoppingBagOutlined />}
            colorIcon='#B3E6FD'
          />
        </Grid>
        <Grid item xs={6}>
          <Card
            title='Income'
            value={income.toString()}
            icon={<ShowChartRounded />}
            colorIcon='#CBBDFF'
          />
        </Grid>
      </Grid>
      <Typography variant='body1' fontWeight='600'>
        Revenue Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <BarChart
            series={[
              { data: motorbikeData.map((data) => data.y), label: 'Motorbike' },
              { data: carData.map((data) => data.y), label: 'Car' },
            ]}
            height={300}
            xAxis={[{ data: xAxisData, scaleType: 'band' }]}
            margin={{ top: 30, bottom: 30, left: 60, right: 10 }}
            slotProps={{
              bar: {
                clipPath: `inset(0px round 8px 8px 0px 0px)`,
              },
              legend: { itemGap: 20 },
            }}
            colors={[colors.green300, colors.blue300]}
          />
        </Grid>
        <Grid item xs={4}>
          <PieChart
            series={[
              {
                data: [
                  {
                    id: 0,
                    value: motorbikeData.reduce((arc, cur) => arc + cur.y, 0),
                    label: 'Motorbike',
                  },
                  {
                    id: 1,
                    value: carData.reduce((arc, cur) => arc + cur.y, 0),
                    label: 'Car',
                  },
                ],
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 5,
                cornerRadius: 8,
                startAngle: -90,
                endAngle: 270,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: 'gray',
                },
              },
            ]}
            height={300}
            colors={[colors.green500, colors.blue500]}
            legend={{ position: { vertical: 'top', horizontal: 'right' } }}
          />
        </Grid>
      </Grid>
    </>
  );
}
