# ERC20-wallet-explorer
A simple erc20 wallet explorer made in react-native

This is my first experience with react-native. I used my android mobile phone for most of the testing, but it should also work properly on IOS.

The code ain't very nice because I couldn't take the time to come up with a clever architecture. Also, the style is a bit messy.

The app can be tested instantly using EXPO with the following link: https://expo.io/@iammorrow/erc20-wallet-explorer

Features:
  - Address history (up to 10 using localstorage)
  - Filtering operations by asset
  - Dynamic counter value selection (USD, EUR, BTC)
  - Global account pie chart summary
  - Hourly market OHLC chart data
  - Pull to refresh
  - Basic data caching using redux (very naive though)

Here are some screenshots: 

![screen1](https://i.ibb.co/dpNsnzc/app1.jpg)
![alt text](https://i.ibb.co/Jx8W72H/app2.jpg)
![alt text](https://i.ibb.co/MCjmTQ4/app3.jpg)
![alt text](https://i.ibb.co/Sn7Q59Z/app4.jpg)
