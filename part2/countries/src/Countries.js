const Countries = ({ matches, showCountry }) => {
  if (matches.length === 0) {
    return;
  }

  if (matches.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  return (
    <>
      {matches.map((match) => (
        <div key={match.name.common}>
          {match.name.common} {match.flag}{" "}
          <button
            onClick={() => showCountry(match)}
            hidden={matches.length === 1}
          >
            {" "}
            show
          </button>
        </div>
      ))}
    </>
  );
};

export default Countries;
