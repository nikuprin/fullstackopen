import { useState } from "react";

const Header = () => <h1>give feedback</h1>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const handleClick = ({ counter, setCounter }) => {
  debugger;

  setCounter(counter + 1);
  console.log(counter);
};

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        no feedback given
      </div>
    );
  }
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good} />
          <StatisticsLine text="neutral" value={props.neutral} />
          <StatisticsLine text="bad" value={props.bad} />
          <StatisticsLine
            text="all"
            value={props.good + props.neutral + props.bad}
          />
          <StatisticsLine
            text="average"
            value={(
              (props.good + props.bad * -1) /
              (props.good + props.bad + props.neutral)
            ).toFixed(1)}
          />
          <StatisticsLine
            text="positive"
            value={
              (
                (props.good / (props.good + props.neutral + props.bad)) *
                100
              ).toFixed(1) + " %"
            }
          />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);
  return (
    <div>
      <Header />
      <Button onClick={incrementGood} text="good" />
      <Button onClick={incrementNeutral} text="neutral" />
      <Button onClick={incrementBad} text="bad" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
