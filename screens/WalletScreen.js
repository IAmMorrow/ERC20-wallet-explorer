import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Header } from 'react-native-elements'

import OperationList from '../components/OperationList'
import { truncate } from '../helpers/string'

import { each } from 'lodash'
import { connect } from 'react-redux'

import { fetchWallet } from '../state/wallet'
import { getCoinsData } from '../state/rates'
import { loadCoinOHLC } from '../state/ohlc'

class WalletScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  async componentDidMount () {
    this.refreshData()
  }

  refreshData = async () => {
    const { fetchCurrentWallet, getMarketRates, loadCoinOHLC } = this.props

    const { summary } = await fetchCurrentWallet()

    const assets = Object.keys(summary)

    getMarketRates(assets)

    each(assets, asset => {
      loadCoinOHLC(asset, 'USD')
    })
  }

  render() {
    const { navigation } = this.props
    const address = navigation.getParam('address')

    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.goBack() }}
          centerComponent={{ text: truncate(address, 20), style: { color: '#fff' } }}
          rightComponent={{ icon: 'data-usage', color: '#fff', onPress: () => navigation.navigate('Summary', { address }) }}
        />
        <OperationList refreshData={this.refreshData} address={address} />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch, props) => {
  const address = props.navigation.getParam('address')

  return {
    fetchCurrentWallet: () => dispatch(fetchWallet(address)),
    getMarketRates: assets => dispatch(getCoinsData(assets)),
    loadCoinOHLC: (asset, currency) => dispatch(loadCoinOHLC(asset, currency))
  }
}

export default connect(null, mapDispatchToProps)(WalletScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});
