import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import WalletScreen from '../screens/WalletScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Wallet: WalletScreen
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
}

export default HomeStack
