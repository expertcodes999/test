export const bscChainId = "0x38"; //BSC Mainnet
export const rinkebyChainId = "0x4"; // Rinkeby
export const testBscChainId = "0x61"; //BSC Testnet

// export const bscChainId = "56"; //BSC Mainnet
// export const rinkebyChainId = "4"; // Rinkeby
// export const testBscChainId = "0x61"; //BSC Testnet
// export const chainId = "0x61"; //BSC Testnet

//BSC Mainnet
export const bscChainData = {
    chainId: "56",
    chainName: 'BSC Mainnet',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    nativeCurrency: {
        symbol: 'BNB',
        decimals: 18,
    }
}
//Rinkeby
export const rinkebyChainData = {
    chainId: "4",
    chainName: 'Rinkeby Test Network',
    rpcUrls: ['https://rinkeby.infura.io/v3/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    nativeCurrency: {
        symbol: 'ETH',
        decimals: 18,
    }
}