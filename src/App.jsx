import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState(null); // State to store fetched data
  const [message, setMessage] = useState("Filter dashboard report.");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [days, setDays] = useState(0);
  const [totalMiles, setTotalMiles] = useState(0);
  const [frequency, setFrequency] = useState('daily'); // State for frequency
  const [timeFrame, setTimeFrame] = useState(''); // State for time frame

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.post('https://server-a3ss.onrender.com/filter',
        {
          frequency,
          timeFrame,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      setLoading(false); // Set loading back to false after data is fetched
      if (response.data.success) {
        setSuccess(true);
        setData(response.data.vehicles);
        setDays(response.data.daysBetween);
        setTotalMiles(response.data.sumMilesDriven);
      } else {
        setSuccess(false);
        setMessage(response.data.message);
      }

    } catch (error) {
      setLoading(false); // Set loading to false if there's an error fetching data
      console.error('Error fetching data:', error);
    }
  };

  const adjustTimeFrame = () => {
    const frequency = document.getElementById('frequency').value;
    const timeFrameLabel = document.getElementById('timeFrameLabel');
    switch (frequency) {
      case 'daily':
        timeFrameLabel.innerText = 'Select Date:';
        break;
      case 'weekly':
        timeFrameLabel.innerText = 'Select Start Date for Week:';
        break;
      case 'monthly':
        timeFrameLabel.innerText = 'Select Start Date for Month:';
        break;
      case 'yearly':
        timeFrameLabel.innerText = 'Select Start Date for Year:';
        break;
      default:
        timeFrameLabel.innerText = 'Select Time Frame:';
    }
    setFrequency(frequency);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timeFrame) {
      setMessage('Please select a date.');
      setSuccess(false);
    } else {
      fetchData();
    }
  };


  return (
    <>
      <div>
        <h1>Reports Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="frequency">Frequency:</label>
          <select id="frequency" name="frequency" onChange={adjustTimeFrame}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <br /><br />
          <label id="timeFrameLabel" htmlFor="timeFrame">Select Date:</label>
          <input type="date" id="timeFrame" name="timeFrame" onChange={(e) => setTimeFrame(e.target.value)} />
          <br /><br />
          <input type="submit" value="Generate Report" style={{ color: 'white', background: 'black', fontWeight: 'bold' }} />
        </form>
        <div>
          {loading ? ( // Conditionally render the loader
            <div className="loader" style={{textAlign:'center'}}>Loading...</div>
          ) : success ? (
            <div>
              <h2>Reports Dashboard : Total Days = {days} ; Sum Miles Driven = {totalMiles}</h2>
              <table>
                <thead>
                  <tr>
                    <th>License Plate</th>
                    <th>Make</th>
                    <th>VIN</th>
                    <th>Model</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Miles Driven</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((vehicle, index) => (
                    <tr key={index}>
                      <td>{vehicle.LicensePlate}</td>
                      <td>{vehicle.Make}</td>
                      <td>{vehicle.VIN}</td>
                      <td>{vehicle.Model}</td>
                      <td>{vehicle.Type}</td>
                      <td>{vehicle.Date}</td>
                      <td>{vehicle.MilesDriven}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
                <h1>{message}</h1>
              )}
        </div>
      </div>
    </>
  );
}

export default App;
