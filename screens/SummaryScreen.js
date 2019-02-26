import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import { Header } from 'react-native-elements'

import OperationList from '../components/OperationList'
import { truncate } from '../helpers/string'

import { connect } from 'react-redux'

import { getWalletByAddress } from '../state/wallet'
import { getAllRates } from '../state/rates'

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
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

export default connect(mapStateToProps)(HomeScreen);

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
