const Country = ({ country }) => {
  if (country === undefined) {
    return;
  }

  return (
    <>
      <h1>{country.name.common}</h1>
      <table>
        <tbody>
          <tr>
            <td>capital</td>
            <td>{country.capital[0]}</td>
          </tr>
          <tr>
            <td>area</td>
            <td>{country.area}</td>
          </tr>
        </tbody>
      </table>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <br />
      <img src={country.flags.png} alt={""} />
    </>
  );
};

export default Country;
