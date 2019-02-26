import React from 'react'
import styled from 'styled-components'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { AsyncStorage } from "react-native"
import { includes, slice, toLower } from 'lodash'

import { isValidEthereum } from '../helpers/ethereum'
import { Input } from 'react-native-elements';

const HomeTitle = styled.Text`
  font-size: 20px;
  margin-bottom: 12px;
  margin-top: 24px;
`

const HistoryAddress = styled.Text`
  font-size: 12px;
  margin-bottom: 6px;
  margin-top: 6px;
`

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    inputValue: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    historyList: [],
    error: null
  }

  async componentDidMount () {
    const history = await AsyncStorage.getItem('history')

    const historyList = history ? JSON.parse(history) : []

    this.setState({
      historyList
    })
  }

  updateHistory = async address => {
    const { historyList } = this.state

    if (!includes(historyList, address)) {
      const newHistoryList = [address, ...slice(historyList, 0, 9),]
      await AsyncStorage.setItem('history', JSON.stringify(newHistoryList))
      this.setState({
        newHistoryList
      })
    }
  }

  submit = () => {
    const address = toLower(this.state.inputValue)

    if (isValidEthereum(address)) {
      this.props.navigation.navigate('Wallet', { address })
      this.updateHistory(address)
      this.setState({
        errorMessage: null
      })

    } else {
      this.setState({
        errorMessage: 'invalid ethereum address'
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <HomeTitle>Open an ethereum address</HomeTitle>
            <Input
              shake
              style={{width: '80%', height: 40 }}
              onChangeText={text => this.setState({ inputValue: text})}
              value={this.state.inputValue}
              placeholder={'Ethereum address'}
              onSubmitEditing={this.submit}
              errorMessage={this.state.errorMessage}
            />
            <HomeTitle>History</HomeTitle>
            <FlatList
              data={this.state.historyList}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Wallet', { address: item })}>
                  <HistoryAddress>{item}</HistoryAddress>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

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
})
