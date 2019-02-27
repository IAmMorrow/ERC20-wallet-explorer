import React, { Component } from 'react'
import styled from 'styled-components'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';

import { ListItem, ButtonGroup } from 'react-native-elements'
import { get, map } from 'lodash'
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

const TopBarContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  margin-top: 24px
  margin-left: 12px;
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

const counterSymbols = [
  { symbol: 'USD', element: () => <Icon name={'usd'} /> },
  { symbol: 'EUR', element: () => <Icon name={'euro'} /> },
  { symbol: 'BTC', element: () => <Icon name={'bitcoin'} /> }
]

const getCounterSymbol = index => get(counterSymbols, [index, 'symbol'], 'USD')

class OperationList extends Component {
  state = {
    currentAssetIndex: 0,
    counterSymbolIndex: 0
  }

  _keyExtractor = item => item.id

  _renderItem = ({ item }) => {
    const {
      rates
    } = this.props

    const counterSymbol = getCounterSymbol(this.state.counterSymbolIndex)
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

  onCounterSymbolChange = index => {
    this.setState({
      counterSymbolIndex: index
    })
  }

  renderHeader = summaryList => {
    const counterSymbol = getCounterSymbol(this.state.counterSymbolIndex)

    return (
      <View>
        <TopBarContainer>
          <SectionTitle>{'Assets'}</SectionTitle>
          <ButtonGroup
            onPress={this.onCounterSymbolChange}
            selectedIndex={this.state.counterSymbolIndex}
            buttons={counterSymbols}
            containerStyle={{ height: 30, width: 128 }}
          />
        </TopBarContainer>
        <AssetCarousel
          selectedIndex={this.state.currentAssetIndex}
          summaryList={summaryList}
          onAssetSelected={this.onAssetChange}
          counterSymbol={counterSymbol}
        />
        <TopBarContainer>
          <SectionTitle>{'Operations'}</SectionTitle>
        </TopBarContainer>
      </View>
    )
  }

  render() {
    const {
      wallet,
      rates,
      refreshData,
      isLoading
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
        ListHeaderComponent={this.renderHeader(summaryList)}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    wallet: getWalletByAddress(state, props.address),
    rates: getAllRates(state, props.address),
    isLoading: isLoading(state)
  }
}

export default connect(mapStateToProps)(OperationList)
