// authApiClient.js

const supertest = require('supertest');
const app = require('../app'); // Local Express app instance

// Get the current environment (either from NODE_ENV or default to 'dev')
const env = process.env.NODE_ENV || 'dev';

// Dynamically load the configuration based on the environment
const authApiClient = require(`./${env}.json`);
let cachedToken = null

// Login function (only once, cached)
async function login() {
    const agent = supertest.agent(authApiClient.baseUrl || app);
    const response = await agent
        .post(authApiClient.loginAPI) // Your login endpoint
        .send({
            username: authApiClient.username,
            password: authApiClient.password
        });

    if (response.status !== 200 || !response.body.token) {
        throw new Error(`Login failed: ${response.status} ${response.text}`);
    }

     cachedToken = response.body.token;
    return cachedToken;
}


// Adding logic to handle baseUrl and local app instance
function getRequestTarget(token = null) {
    const base = authApiClient.baseUrl ? authApiClient.baseUrl : app;

    console.log(authApiClient.baseUrl ? "Using remote baseUrl:" : "Using local app", base);

    const agent = supertest.agent(base); // Create persistent agent

    const authToken = token ||  cachedToken;

    // Set global/default headers ONCE here
    agent.set('x-xx-xxx-details', authToken);

    return agent;
}

async function callApiWithAutoRefresh(method, api, options = {}) {
    let agent = requestTarget;
    let res = await agent[method](api)
        .query(options.query || {})
        .send(options.body || {})
        .set(options.headers || {});

    if (res.status === 401) {
        // Token expired: login again, update token and agent, retry once
        cachedToken = await login();
        requestTarget = getRequestTarget(cachedToken);
        agent = requestTarget;


        res = await agent[method](api)
            .query(options.query || {})
            .send(options.body || {})
            .set(options.headers || {});
    }

    return res;
}

// Export the authApiClient and getRequestTarget function
module.exports = {
    config: authApiClient,
    login,
    getRequestTarget,
    callApiWithAutoRefresh
};