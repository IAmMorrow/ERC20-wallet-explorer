import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { connect } from 'react-redux'

import { getWalletByAddress } from '../state/wallet'
import { getAllRates } from '../state/rates'
import AssetSummary from '../components/WalletSummary/AssetSummary'

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    const { navigation, wallet, rates } = this.props
    const address = navigation.getParam('address')

    return (
      <View style={styles.container}>
        <AssetSummary address={address} counterSymbol={'USD'} />
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

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
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
