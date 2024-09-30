export interface KlineData {
    openTime: number;            // Kline open time (in milliseconds)
    openPrice: string;           // Open price (string to maintain precision)
    highPrice: string;           // High price (string to maintain precision)
    lowPrice: string;            // Low price (string to maintain precision)
    closePrice: string;          // Close price (string to maintain precision)
    volume: string;              // Volume (string to maintain precision)
    closeTime: number;           // Kline close time (in milliseconds)
    quoteAssetVolume: string;    // Quote asset volume (string to maintain precision)
    numberOfTrades: number;      // Number of trades
    takerBuyBaseAssetVolume: string; // Taker buy base asset volume (string to maintain precision)
    takerBuyQuoteAssetVolume: string; // Taker buy quote asset volume (string to maintain precision)
  }
  
export interface RawKlineData {
  0: number;    // Kline open time (timestamp)
  1: string;    // Open price
  2: string;    // High price
  3: string;    // Low price
  4: string;    // Close price
  5: string;    // Volume
  6: number;    // Kline close time (timestamp)
  7: string;    // Quote asset volume
  8: number;    // Number of trades
  9: string;    // Taker buy base asset volume
  10: string;   // Taker buy quote asset volume
  11: string;   // Unused field
}
  