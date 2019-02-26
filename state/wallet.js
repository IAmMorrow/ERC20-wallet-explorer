import { reduce } from 'lodash'

import { fetchTxs, txsToOperations, getSummary } from '../helpers/ethereum'

export const GET_WALLET = 'ERC20-wallet-explorer/repos/LOAD'
export const GET_WALLET_SUCCESS = 'ERC20-wallet-explorer/repos/LOAD_SUCCESS'
export const GET_WALLET_FAIL = 'ERC20-wallet-explorer/repos/LOAD_FAIL'

// REDUCERS

export default function reducer (state = { wallets: {}, loading: false }, action) {
  switch (action.type) {
    case GET_WALLET:
      return { ...state, loading: true }
    case GET_WALLET_SUCCESS:
      return {
        ...state,
        loading: false,
        wallets: {
          ...state.wallets,
          [action.payload.address]: {
            ...action.payload.wallet
          }
        }
      }
    case GET_WALLET_FAIL:
      return {
        ...state,
        loading: false,
        error: 'Error while fetching wallet'
      }
    default:
      return state
  }
}

// ACTION CREATORS

function getWallet () {
  return {
    type: GET_WALLET
  }
}

function getWalletSuccess (address, wallet) {
  return {
    type: GET_WALLET_SUCCESS,
    payload: {
      address,
      wallet
    }
  }
}

function getWalletFail (error) {
  return {
    type: GET_WALLET_FAIL,
    error
  }
}

// THUNKS

export function fetchWallet (address) {
  return async dispatch => {
    dispatch(getWallet())

    try {
      const txs = await fetchTxs(address)
      const operations = txsToOperations(txs, address)
      const summary = getSummary(operations)

      const sortedOperations = reduce(operations, (acc, op) => {
        if (!acc[op.symbol]) {
          acc[op.symbol] = []
        }
        acc[op.symbol].push(op)
        return acc
      }, {})

      const wallet = {
        operations: sortedOperations,
        summary
      }

      dispatch(getWalletSuccess(address, wallet))
      return wallet
    } catch (error) {
      dispatch(getWalletFail(error))
      console.log('ERROR: ', error)
    }
  }
}

// SELECTOR

export const getWalletByAddress = (state, address) => state.wallet.wallets[address]
