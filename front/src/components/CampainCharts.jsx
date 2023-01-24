import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from 'react';
import { VictoryPie, VictoryAnimation, VictoryLabel } from "victory";
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import {useLocation} from 'react-router-dom';

const calculatePercent = (percentage) => {
  return [{ x: 1, y: Math.round(percentage) }, { x: 2, y: 100 - Math.round(percentage) }];
}

const CampainCharts = ({props}) => {
  const [chartsData, setChartsData] = useState([{percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}, {percent: 0, data: calculatePercent(0)}]);
  const emailString = ["Emails envoyés", "Emails ouverts", "Liens cliqués", "Données soumises"];
  const [chartsStats, setChartsStats] = useState([0, 0, 0, 0]);
  const theme = useTheme();
  const location = useLocation();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const dark = theme.palette.neutral.dark;

  const calculateChartsStats = (data) => {
      let tab = [0, 0, 0, 0];
      setChartsStats(chartsStats => [0, 0, 0, 0]);
      data.results.forEach(result => {
        if(result.status === "Submitted Data") {
          for(let i=0; i<4; i++) {
            tab[i]++;
          }
          setChartsStats(chartsStats => chartsStats.map((chartData, index) => {
            if(index < 4)
              return chartData + 1;
            else
              return chartData;
          }));
        } else if(result.status === "Clicked Link") {
          for(let i=0; i<3; i++) {
            tab[i]++;
          }
          setChartsStats(chartsStats => chartsStats.map((chartData, index) => {
            if(index < 3)
              return chartData + 1;
            else
              return chartData;
          }));
        } else if(result.status === "Email Opened") {
          for(let i=0; i<2; i++) {
            tab[i]++;
          }
          setChartsStats(chartsStats => chartsStats.map((chartData, index) => {
            if(index < 2)
              return chartData + 1;
            else
              return chartData;
          }));
        } else if(result.status === "Email Sent") {
          for(let i=0; i<1; i++) {
            tab[i]++;
          }
          setChartsStats(chartsStats => chartsStats.map((chartData, index) => {
            if(index < 1)
              return chartData + 1;
            else
              return chartData;
          }));
        }
      });

      setChartsData([
        {percent: 100, data: calculatePercent(100)}, 
        {percent: Math.round(tab[1]/tab[0]), data: calculatePercent(tab[1]/tab[0])}, 
        {percent: Math.round(tab[2]/tab[0]), data: calculatePercent(tab[2]/tab[0])},
        {percent: Math.round(tab[3]/tab[0]), data: calculatePercent(tab[3]/tab[0])}]);
    }

  useEffect(() => {
    async function getData() {
      await axios.get(`${process.env.REACT_APP_GOPHISH_API}/campaigns/${location.state.id}/results/?api_key=${process.env.REACT_APP_GOPHISH_API_KEY}`)
      .then(response => {
        // handle success
        calculateChartsStats(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
    }
    getData();
  }, [location.state.id, props.eventTrigger]);

  return (
    <Stack sx={{marginTop: 4}} spacing={2}  direction={{ xs: 'column', sm: 'row' }}  justifyContent="space-evenly" alignItems="center">
      {chartsData.map((chart, index) => {
      return ( <Stack key={index} sx={{width: isNonMobileScreens ? "12%" : "50%"}} alignItems="center" spacing={4}>
          <svg viewBox="0 0 50 50" width="100%">
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
                    text={`${chartsStats[index]}`} 
                    style={{ fill: dark, fontSize: 10 }}
                  />
                );
              }}
            </VictoryAnimation>
          </svg>
          <Typography sx={{fontSize: isNonMobileScreens ? 12 : 20}}>{emailString[index]} : {Math.round(chart.percent)}%</Typography>
        </Stack>
      );})}
    </Stack>
  );
};

export default CampainCharts;