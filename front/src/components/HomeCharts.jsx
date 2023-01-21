import { Stack } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";

const calculatePercent = (percentage) => {
  return [{ x: 1, y: percentage }, { x: 2, y: 100 - percentage }];
}

const HomeCharts = () => {
  const [data, setData] = useState([]);
  const [chartsData, setChartsData] = useState([{percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}]);


  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        setData(response.data);
        setChartsData(percent => [{percent: 25, data: calculatePercent(25)}, {percent: 30, data: calculatePercent(30)}, {percent: 60, data: calculatePercent(60)}, {percent: 80, data: calculatePercent(80)}, {percent: 100, data: calculatePercent(100)}])
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }
    getData();
  }, []);

  return (
    <Stack sx={{marginTop: 10}} fullWidth spacing={2}  direction={{ xs: 'column', sm: 'row' }}  justifyContent="space-evenly" alignItems="center">
      {chartsData.map((chart) => {
      return (<svg viewBox="0 0 50 50" width="10%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={50} height={50}
          data={chart.data}
          radius={20}
          innerRadius={19}
          cornerRadius={2}
          labels={() => null}
          style={{
            data: { fill: ({ datum }) => {
              const color = datum.y > 30 ? "green" : "red";
              return datum.x === 1 ? color : "transparent";
            }
            }
          }}
        />
        <VictoryAnimation duration={2000} data={chart}>
          {(newProps) => {
            return (
              <VictoryLabel
                textAnchor="middle" verticalAnchor="middle"
                x={25} y={25}
                text={`${Math.round(newProps.percent)}%`}
                style={{ fontSize: 5 }}
              />
            );
          }}
        </VictoryAnimation>
      </svg>);})}
    </Stack>
  );
};

export default HomeCharts;