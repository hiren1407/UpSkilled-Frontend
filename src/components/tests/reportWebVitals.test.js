import reportWebVitals from '../../reportWebVitals';

jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call web-vitals methods if onPerfEntry is a function', async () => {
    const onPerfEntry = jest.fn();

    await reportWebVitals(onPerfEntry);

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = require('web-vitals');

    expect(getCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(getFID).toHaveBeenCalledWith(onPerfEntry);
    expect(getFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(getTTFB).toHaveBeenCalledWith(onPerfEntry);
  });

  it('should not call web-vitals methods if onPerfEntry is not provided', async () => {
    await reportWebVitals(undefined);

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = require('web-vitals');

    expect(getCLS).not.toHaveBeenCalled();
    expect(getFID).not.toHaveBeenCalled();
    expect(getFCP).not.toHaveBeenCalled();
    expect(getLCP).not.toHaveBeenCalled();
    expect(getTTFB).not.toHaveBeenCalled();
  });

  it('should not call web-vitals methods if onPerfEntry is not a function', async () => {
    await reportWebVitals({});

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = require('web-vitals');

    expect(getCLS).not.toHaveBeenCalled();
    expect(getFID).not.toHaveBeenCalled();
    expect(getFCP).not.toHaveBeenCalled();
    expect(getLCP).not.toHaveBeenCalled();
    expect(getTTFB).not.toHaveBeenCalled();
  });
});
