import axios from "axios";
import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

const Weather = ({ country }) => {
  const [weather, setWeather] = useState();
  useEffect(() => {
    if (country !== undefined) {
      setWeather(undefined);
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${API_KEY}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        })
        .catch(() => {
          console.log("weather error");
        });
    }
  }, [country]);

  if (country === undefined || weather === undefined) {
    return;
  }

  return (
    <>
      <h2>Weather in {country.capital[0]}</h2>
      temperature {weather.main.temp} °C
      <br />
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={""}
      />
      <br />
      wind {weather.wind.speed} m/s
    </>
  );
};

export default Weather;
