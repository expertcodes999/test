import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 56, 97]
})

export const rinkebyInjectedConnector = new InjectedConnector({
  supportedChainIds: [4]
})

export const bscMainNetInjectedConnector = new InjectedConnector({
  supportedChainIds: [56]
})