import React, { useState } from 'react';
import axios from 'axios';
import './style.css'

const StockForm = () => {
    const [symbol, setSymbol] = useState('');
    const [date, setDate] = useState('');
    const [tradeStats, setTradeStats] = useState({});
    const [error, setError] = useState('');
    const API_BASE_URL = 'http://localhost:5000';
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await axios.post(API_BASE_URL + '/api/fetchStockData', { symbol, date });
        setTradeStats(response.data);
      } catch (error) {
        setError(error.response.data.error || 'Error fetching trade statistics.');
        setTradeStats({});
      }
    };
  
    return (
      <div className='page-setup'>
        <div>
            <h2>Stock Trade Statistics</h2>
        </div>
        <form className='form-data' onSubmit={handleSubmit}>
            <div>
                <label className='m-r-10' htmlFor="symbol">Stock Symbol:</label>
                <input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className='m-r-10' htmlFor="date">Date:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <button type="submit">Fetch Trade Statistics</button>
            </div>
          
        </form>

        <div>
            {error && <p className='red'>{error}</p>}
            {Object.keys(tradeStats).length > 0 && (
            <div>
                <h2>Trade Statistics</h2>
                <p>Open: {tradeStats.open}</p>
                <p className='green' >High: {tradeStats.high}</p>
                <p className='red'>Low: {tradeStats.low}</p>
                <p>Close: {tradeStats.close}</p>
                <p>Volume: {tradeStats.volume}</p>
            </div>
            )}
        </div>
  
        
      </div>
    );
  };
  
  export default StockForm;