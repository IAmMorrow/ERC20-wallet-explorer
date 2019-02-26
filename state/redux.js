import { createStore, applyMiddleware, combineReducers } from 'redux'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import { Constants } from 'expo'
import thunk from 'redux-thunk'

import wallet from './wallet'
import rates from './rates'
import ohlc from './ohlc'

const { cryptoCompare } = Constants.manifest.extra

const client = axios.create({
  headers: {
    authorization: `Apikey ${cryptoCompare.apiKey}.`
  },
  baseURL: cryptoCompare.url,
  responseType: 'json'
})

const reducer = combineReducers({
  wallet,
  rates,
  ohlc
})

const store = createStore(reducer, applyMiddleware(thunk, axiosMiddleware(client)))

export default store
