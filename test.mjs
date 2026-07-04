import YahooFinance from 'yahoo-finance2';
const yf = new YahooFinance();

async function test() {
  try {
    const symbol = 'AAPL';
    console.log('Fetching data for', symbol);
    
    // Earnings history
    const earnings = await yf.quoteSummary(symbol, { modules: ['earningsHistory'] });
    console.log('Earnings History:', JSON.stringify(earnings.earningsHistory, null, 2));
    
    // Analyst recommendations & price targets
    const quote = await yf.quote(symbol);
    console.log('Quote data (Price Targets):', {
      targetLowPrice: quote.targetLowPrice,
      targetMeanPrice: quote.targetMeanPrice,
      targetMedianPrice: quote.targetMedianPrice,
      targetHighPrice: quote.targetHighPrice,
      numberOfAnalystOpinions: quote.numberOfAnalystOpinions,
    });
    
    // Quote summary for more detailed recommendation/earnings data
    const summary = await yf.quoteSummary(symbol, { modules: ['recommendationTrend', 'financialData'] });
    console.log('Quote Summary (Recommendation Trend):', JSON.stringify(summary.recommendationTrend, null, 2));
    console.log('Quote Summary (Financial Data):', JSON.stringify(summary.financialData, null, 2));
    
  } catch (e) {
    console.error(e);
  }
}

test();
