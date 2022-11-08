import axios from "axios";
import { useEffect, useState } from "react";
import Countries from "./Countries";
import Country from "./Country";
import Weather from "./Weather";

const App = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState("");
  const [country, setCountry] = useState(undefined);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setAllCountries(response.data);
    });
  }, []);

  const onFilterChange = (event) => {
    setFilter(event.target.value);

    if (!event.target.value) {
      setMatches([]);
      return;
    }

    const filtered = allCountries.filter((country) =>
      country.name.common
        .toUpperCase()
        .includes(event.target.value.toUpperCase())
    );

    setMatches(filtered);

    if (filtered.length === 0) {
      setCountry(undefined);
      return;
    }

    if (filtered.length === 1) {
      setCountry(filtered[0]);
      return;
    }

    setCountry(undefined);
  };

  const onShowCountry = (props) => {
    setCountry(props);
  };

  return (
    <>
      find countries <input value={filter} onChange={onFilterChange} />
      <Countries matches={matches} showCountry={onShowCountry} />
      <Country country={country} />
      <Weather country={country} />
    </>
  );
};

export default App;
