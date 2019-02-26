import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'

import LinksScreen from '../screens/LinksScreen'
import WalletScreen from '../screens/WalletScreen'

const WalletStack = createStackNavigator({
  Wallet: WalletScreen,
  Summary: WalletScreen
})

WalletStack.navigationOptions = {
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

const SummaryStack = createStackNavigator({
  Links: LinksScreen
})

SummaryStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  )
}

export default createBottomTabNavigator({
  WalletStack,
  SummaryStack
})
