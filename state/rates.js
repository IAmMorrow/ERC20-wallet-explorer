import { get } from 'lodash'

// LABELS

export const LOAD_COINS_DATA = 'ERC20-token-explorer/rates/LOAD_COINS_DATA'
export const LOAD_COINS_DATA_SUCCESS = 'ERC20-token-explorer/rates/LOAD_COINS_DATA_SUCCESS'
export const LOAD_COINS_DATA_FAIL = 'ERC20-token-explorer/rates/LOAD_COINS_DATA_FAIL'

// REDUCER

export default function reducer (state = { assets: [], loading: false }, action) {
  switch (action.type) {
    case LOAD_COINS_DATA:
      return { ...state, loading: true }
    case LOAD_COINS_DATA_SUCCESS:
      return { ...state, loading: false, assets: action.payload.data }
    case LOAD_COINS_DATA_FAIL:
      return {
        ...state,
        loading: false,
        error: 'Error while fetching coins data'
      }

    default:
      return state
  }
}

// ACTION CREATORS

export function getCoinsData (coins = [], currencies = ['EUR', 'BTC', 'USD']) {
  return {
    type: LOAD_COINS_DATA,
    payload: {
      request: {
        url: '/data/pricemulti',
        params: {
          fsyms: coins.join(),
          tsyms: currencies.join()
        }
      }
    }
  }
}

// SELECTOR

export const getAllRates = state => state.rates.assets
export const getRatesByCoin = (state, coin) => get(state.rates.assets, coin)
export const isLoading = state => !!(state.wallet.loading || state.ohlc.loading || state.rates.loading)
