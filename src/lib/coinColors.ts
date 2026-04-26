// CoinGecko brand colors for popular cryptocurrencies
// Source: CoinGecko official branding and community standards

export const COIN_COLORS: Record<string, string> = {
  // Major coins
  'BTC': '#F7931A',  // Bitcoin orange
  'ETH': '#627EEA',  // Ethereum blue
  'USDT': '#26A17B', // Tether green
  'BNB': '#F3BA2F',  // Binance yellow
  'SOL': '#9945FF',  // Solana purple
  'XRP': '#23292F',  // Ripple black
  'USDC': '#2775CA', // USD Coin blue
  'ADA': '#0033AD',  // Cardano blue
  'AVAX': '#E84142', // Avalanche red
  'DOGE': '#C2A633', // Dogecoin gold
  'DOT': '#E6007A',  // Polkadot pink
  'MATIC': '#8247E5', // Polygon purple
  'TRX': '#FF060A',  // Tron red
  'LINK': '#2A5ADA', // Chainlink blue
  'ATOM': '#2E3148', // Cosmos dark
  'UNI': '#FF007A',  // Uniswap pink
  'LTC': '#345D9D',  // Litecoin blue
  'XLM': '#000000',  // Stellar black
  'XMR': '#FF6600',  // Monero orange
  'ETC': '#328332',  // Ethereum Classic green
  'BCH': '#8DC351',  // Bitcoin Cash green
  'ALGO': '#000000', // Algorand black
  'VET': '#15BDFF',  // VeChain blue
  'FIL': '#0090FF',  // Filecoin blue
  'ICP': '#29ABE2',  // Internet Computer blue
  'APT': '#000000',  // Aptos black
  'NEAR': '#000000', // NEAR black
  'AAVE': '#B6509E', // Aave purple
  'MKR': '#1AAB9B',  // Maker teal
  'SNX': '#00D1FF',  // Synthetix cyan
  'SAND': '#04ADEF', // Sandbox blue
  'MANA': '#FF2D55', // Decentraland pink
  'AXS': '#0055D5',  // Axie Infinity blue
  'SHIB': '#FFA409', // Shiba Inu orange
  'CRO': '#002D74',  // Cronos blue
  'FTM': '#1969FF',  // Fantom blue
  'HBAR': '#000000', // Hedera black
  'EOS': '#000000',  // EOS black
  'THETA': '#2AB8E6', // Theta blue
  'FLOW': '#00EF8B', // Flow green
  'XTZ': '#2C7DF7',  // Tezos blue
  'EGLD': '#000000', // MultiversX black
  'CAKE': '#D1884F', // PancakeSwap brown
  'RUNE': '#33FF99', // THORChain green
  'KCS': '#0093DD',  // KuCoin blue
  'GRT': '#6747ED',  // The Graph purple
  'ZEC': '#ECB244',  // Zcash gold
  'DASH': '#008CE7', // Dash blue
  'NEO': '#58BF00',  // NEO green
  'WAVES': '#0055FF', // Waves blue
  'COMP': '#00D395', // Compound green
  'YFI': '#006AE3',  // Yearn Finance blue
  'SUSHI': '#FA52A0', // SushiSwap pink
  '1INCH': '#94A6C3', // 1inch gray-blue
  'BAT': '#FF5000',  // Basic Attention Token orange
  'ENJ': '#7866D5',  // Enjin purple
  'CHZ': '#CD0124',  // Chiliz red
  'ZIL': '#49C1BF',  // Zilliqa teal
  'HOT': '#7537E0',  // Holo purple
  'ICX': '#1FC5C9',  // ICON cyan
  'ONT': '#00A6C2',  // Ontology cyan
  'ZRX': '#000000',  // 0x black
  'BAL': '#000000',  // Balancer black
  'CRV': '#40649F',  // Curve blue
  'LUNA': '#FFD83D', // Terra yellow
  'FTT': '#5FCADE',  // FTX Token cyan
  'HNT': '#474DFF',  // Helium purple
  'ONE': '#00ADE8',  // Harmony blue
  'CELO': '#FBCC5C', // Celo yellow
  'KAVA': '#FF564F', // Kava red
  'QTUM': '#2E9AD0', // Qtum blue
  'OMG': '#1A53F0',  // OMG Network blue
  'RVN': '#384182',  // Ravencoin purple
  'SC': '#00CBA0',   // Siacoin green
  'IOTA': '#000000', // IOTA black
  'LSK': '#0D4EA0',  // Lisk blue
  'STEEM': '#4BA2F2', // Steem blue
  'NANO': '#4A90E2', // Nano blue
  'DGB': '#006AD2',  // DigiByte blue
  'DCR': '#2ED6A1',  // Decred green
  'ARK': '#F70000',  // Ark red
  'STRAT': '#1387C9', // Stratis blue
  'REP': '#602A52',  // Augur purple
  'KMD': '#326464',  // Komodo teal
  'ARDR': '#1162A1', // Ardor blue
  'NXT': '#008FBB',  // Nxt blue
  'STORJ': '#2683FF', // Storj blue
  'GNO': '#00A6C4',  // Gnosis cyan
  'LRC': '#2AB6F6',  // Loopring blue
  'POLY': '#4C5A95', // Polymath purple
  'POWR': '#05BCA9', // Power Ledger teal
  'REQ': '#00E6A0',  // Request green
  'MAID': '#5592D7', // MaidSafeCoin blue
  'DENT': '#666666', // Dent gray
  'FUN': '#ED1968',  // FunFair pink
  'LOOM': '#48BEFF', // Loom Network blue
  'MITH': '#00316D', // Mithril blue
  'NEXO': '#1A4199', // Nexo blue
  'PAX': '#00522C',  // Paxos green
  'TUSD': '#002868', // TrueUSD blue
  'USDD': '#1E1E1E', // USDD dark
  'BUSD': '#F0B90B', // Binance USD yellow
  'DAI': '#F4B731',  // Dai yellow
  'FRAX': '#000000', // Frax black
  'GUSD': '#00DCFA', // Gemini Dollar cyan
  'HUSD': '#2E7AF5', // HUSD blue
  'SUSD': '#1E1A31', // sUSD dark
  'USDP': '#00A55F', // Pax Dollar green
};

/**
 * Get the brand color for a cryptocurrency symbol
 * @param symbol - The coin symbol (e.g., 'BTC', 'ETH')
 * @returns Hex color code
 */
export function getCoinColor(symbol: string): string {
  const upperSymbol = symbol.toUpperCase();
  return COIN_COLORS[upperSymbol] || '#3b82f6'; // Default to blue if not found
}

/**
 * Generate a consistent color for a coin symbol using a hash function
 * Used as fallback when coin is not in the predefined list
 * @param symbol - The coin symbol
 * @returns Hex color code
 */
export function generateCoinColor(symbol: string): string {
  // Check if we have a predefined color first
  if (COIN_COLORS[symbol.toUpperCase()]) {
    return COIN_COLORS[symbol.toUpperCase()];
  }
  
  // Generate a color based on the symbol hash
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to a pleasant color (avoid too dark or too light)
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
