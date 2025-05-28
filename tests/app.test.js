const { getRequestTarget, config,login } = require('../config/./authApiClient');

let requestTarget;

beforeAll(async () => {
  const token = await login(); // you don’t need to pass 'user', 'pass' if config has it
  requestTarget = getRequestTarget(token);
});


describe('GET /services/v1/account/accountList - Separate Tests', () => {

  const api = config.accountList.api;

  it(config.accountList.case1.description, async () => {
    const res = await requestTarget
        .get(api)
        .query(config.accountList.case1.input);

    expect(res.statusCode).toBe(config.accountList.case1.output.statusCode);
    expect(res.body).toEqual(config.accountList.case1.output.body);
  });

  it(config.accountList.case2.description, async () => {
    const res = await requestTarget
        .get(api)
        .query(config.accountList.case2.input);

    expect(res.statusCode).toBe(config.accountList.case2.output.statusCode);
    expect(res.body).toEqual(config.accountList.case2.output.body);
  });

  it(config.accountList.case3.description, async () => {
    const res = await requestTarget
        .get(api)
        .query(config.accountList.case3.input);

    expect(res.statusCode).toBe(config.accountList.case3.output.statusCode);
    expect(res.body).toEqual(config.accountList.case3.output.body);
  });
});


describe('GET /services/v2/user/userDetails - Query Parameter Validation', () => {
  const api = '/services/v2/user/userDetails';

  it('should return 200 and valid response when accountid and userId are provided', async () => {
    const res = await requestTarget
        .get(api)
        .query({ accountid: '123456', userId: '102334' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('mobile_response');
    expect(res.body.mobile_response).toHaveProperty('views');
    expect(Array.isArray(res.body.mobile_response.views)).toBe(true);

    const views = res.body.mobile_response.views;
    expect(views.length).toBeGreaterThan(0);
    expect(views[0]).toHaveProperty('data');
    expect(Array.isArray(views[0].data)).toBe(true);
    expect(views[0].data.length).toBeGreaterThan(0);
    expect(views[0].data[0]).toHaveProperty('numberOfAccounts');

    // You can assert specific value if known, e.g. 9
    expect(views[0].data[0].numberOfAccounts).toBe(config.userDetails.case1.output.numberOfAccounts);
  });
});



