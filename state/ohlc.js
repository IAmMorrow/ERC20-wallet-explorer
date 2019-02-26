import { get } from 'lodash'

// LABELS

export const LOAD_COIN_OHLC = 'ERC20-token-explorer/ohlc/LOAD_COIN_OHLC'
export const LOAD_COIN_OHLC_SUCCESS = 'ERC20-token-explorer/ohlc/LOAD_COIN_OHLC_SUCCESS'
export const LOAD_COIN_OHLC_FAIL = 'ERC20-token-explorer/ohlc/LOAD_COIN_OHLC_FAIL'

// REDUCER

export default function reducer (state = { assets: {}, loading: 0 }, action) {
  switch (action.type) {
    case LOAD_COIN_OHLC:
      return { ...state, loading: state.loading + 1 }
    case LOAD_COIN_OHLC_SUCCESS:
      return {
        ...state,
        loading: state.loading - 1,
        assets: {
          ...state.assets,
          [action.meta.previousAction.payload.coin]: get(action.payload.data, 'Data')
        }
      }
    case LOAD_COIN_OHLC_FAIL:
      return {
        ...state,
        loading: state.loading - 1,
        error: 'Error while fetching coin OHLC data'
      }

    default:
      return state
  }
}

// ACTION CREATORS

export function loadCoinOHLC (coin, currency = 'USD', limit = 24, aggregate = 3, e = 'CCCAGG') {
  return {
    type: LOAD_COIN_OHLC,
    payload: {
      coin,
      request: {
        url: '/data/histohour',
        params: {
          fsym: coin,
          tsym: currency,
          limit,
          aggregate,
          e
        }
      }
    }
  }
}

// SELECTOR

export const getCoinOHLC = (state, coin) => state.ohlc.assets[coin]
