// app.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'ravi' && password === 'secret') {
    res.json({ token: 'some-token-value' });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.get('/services/v1/account/accountList', (req, res) => {
  const { accountMode, accountID } = req.query;

  // Mocked account list data
  const accounts = [
    { accountID: 1, accountMode: 'Cash', accountShortName: 'Cash - 6956' },
    { accountID: 2, accountMode: 'Invest', accountShortName: 'Invest - 1234' },
    { accountID: 3, accountMode: 'Wealth', accountShortName: 'Wealth - 5678' },
  ];

  // Validate and convert accountID to a number if provided
  let filteredAccounts = accounts;
  if (accountID) {
    const parsedAccountID = parseInt(accountID, 10);
    if (isNaN(parsedAccountID)) {
      return res.status(400).json({ error: 'Invalid accountID parameter' });
    }
    filteredAccounts = filteredAccounts.filter(account => account.accountID === parsedAccountID);
  }

  // Filter by accountMode if provided
  if (accountMode) {
    filteredAccounts = filteredAccounts.filter(account => account.accountMode.toLowerCase() === accountMode.toLowerCase());
  }

  // If no accounts match the filters, return an empty array
  if (filteredAccounts.length === 0) {
    return res.status(404).json({ message: 'No accounts found matching the criteria' });
  }

  res.json({ accounts: filteredAccounts });
});


// Example: Express route with query param check
app.get('/services/v2/user/userDetails', (req, res) => {
  const { accountid, userId } = req.query;

  // Simple validation
  if (!accountid || !userId) {
    return res.status(400).json({ error: 'Missing required query parameters: accountid or userId' });
  }

  // Simulated response based on inputs
  const response = {
    mobile_response: {
      views: [
        {
          type: "user_details",
          data: [
            {
              accountid: accountid,
              numberOfAccounts: 9, // Static for now, you can calculate if needed
              userId: parseInt(userId)
            }
          ]
        }
      ]
    }
  };

  return res.json(response);
});








module.exports = app; // Export ONLY the app (do NOT call listen here)
