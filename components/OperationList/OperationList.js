import React, { Component } from 'react'
import styled from 'styled-components'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { ListItem } from 'react-native-elements'
import { get, filter, map } from 'lodash'
import ta from 'time-ago'
import AssetCarousel from '../AssetCarousel'
import { View } from 'react-native'

import {
  WaveIndicator,
} from 'react-native-indicators';

import { getWalletByAddress } from '../../state/wallet'
import { getAllRates, isLoading } from '../../state/rates'

const iconMapping = {
  IN: { name: 'arrow-upward', color: 'green' },
  OUT: { name: 'arrow-downward', color: 'red' }
}

const TimeAgo = styled.Text`
  font-size: 12px;
`

const BalanceAmount = styled.Text`
  font-size: 12px;
`

const BalanceSymbol = styled.Text`
  font-weight: bold;
  font-size: 9px;
`

const SectionTitle = styled.Text`
  font-weight: bold;
  font-size: 20px;
  margin-left: 12px
  margin-top: 12px
  margin-bottom: 12px
`

const Balance = ({ value, symbol, type }) => {
  return (
    <BalanceAmount>
      { type && (type === 'OUT' ? '- ' : '+ ') }
      {value}
      {' '}
      <BalanceSymbol>{symbol}</BalanceSymbol>
    </BalanceAmount>
  )
}

class OperationList extends Component {
  state = {
    currentAssetIndex: 0
  }

  _keyExtractor = item => item.id

  _renderItem = ({ item }) => {
    const {
      counterSymbol,
      rates
    } = this.props

    const value = item.value / Math.pow(10, item.magnitude)
    const counterRate = get(rates, [item.symbol, counterSymbol])

    return (
      <ListItem
        title={
          <Balance type={item.type} value={value} symbol={item.symbol} />
        }
        subtitle={
          counterRate && <Balance value={value * counterRate} symbol={counterSymbol} />
        }
        rightTitle={
          <TimeAgo>{ta.ago(item.date)}</TimeAgo>
        }
        leftIcon={iconMapping[item.type]}
      />
    )
  }

  onAssetChange = index => {
    this.setState({
      currentAssetIndex: index
    })
  }

  render() {
    const {
      wallet,
      rates,
      counterSymbol,
      refreshData,
      isLoading,
      address
    } = this.props

    if (!wallet) {
      return <WaveIndicator color='black'/>
    }

    const {
      operations,
      summary
    } = wallet

    const summaryList = map(summary, (value, key) => ({
      symbol: key,
      balance: value.balance / Math.pow(10, value.magnitude)
    }))

    const currentSymbol = get(summaryList, [this.state.currentAssetIndex, 'symbol'])
    const filteredOperations = operations[currentSymbol]

    return (
      <FlatList
        header
        style={{
          paddingTop: 64
        }}
        onRefresh={refreshData}
        refreshing={isLoading}
        data={filteredOperations}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        extraData={rates}
        firstItem={this.state.currentAssetIndex}
        ListHeaderComponent={
          <View>
            <SectionTitle>{'Assets'}</SectionTitle>
            <AssetCarousel
              selectedIndex={this.state.currentAssetIndex}
              summaryList={summaryList}
              onAssetSelected={this.onAssetChange}
              counterSymbol={counterSymbol}
            />
            <SectionTitle>{'Operations'}</SectionTitle>
          </View>
        }
      />
    );
  }
}

OperationList.defaultProps = {
  counterSymbol: 'BTC'
}

const mapStateToProps = (state, props) => {
  return {
    wallet: getWalletByAddress(state, props.address),
    rates: getAllRates(state, props.address),
    isLoading: isLoading(state)
  }
}

export default connect(mapStateToProps)(OperationList)
