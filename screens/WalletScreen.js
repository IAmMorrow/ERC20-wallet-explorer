import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { Header } from 'react-native-elements'

import OperationList from '../components/OperationList'
import { truncate } from '../helpers/string'

import { each } from 'lodash'
import { connect } from 'react-redux'

import { getWalletByAddress, fetchWallet } from '../state/wallet'
import { getCoinsData, getAllRates } from '../state/rates'
import { loadCoinOHLC } from '../state/ohlc'

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    inputValue: ''
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
    const { navigation, wallet, rates } = this.props
    const address = navigation.getParam('address')

    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: () => navigation.goBack() }}
          centerComponent={{ text: truncate(address, 20), style: { color: '#fff' } }}
        />
        <OperationList refreshData={this.refreshData} address={address} counterSymbol={'BTC'} />
      </View>
    )
  }
}

const mapStateToProps = (state, props) => {
  const address = props.navigation.getParam('address')

  return {
    wallet: getWalletByAddress(state, address),
    rates: getAllRates(state)
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
