import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { LinearGradient } from 'expo'

import { map, get } from 'lodash'
import { AreaChart } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { getCoinOHLC } from '../../state/ohlc'
import { getRatesByCoin } from '../../state/rates'
import { getColorFromString } from '../../helpers/color'

const { width: viewportWidth } = Dimensions.get('window')

const sliderWidth = Math.round(1 * viewportWidth)
const horizontalMargin = Math.round(0.1 * viewportWidth)
const itemWidth = sliderWidth - (horizontalMargin * 2)

const Slide = styled.View`
  width: ${itemWidth}px;
  height: 150px;
  border-radius: 15px;
  background-color: blue;
  padding: 12px;
  position: relative;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`

const ChartContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`

const AssetAmount = styled.Text`
  font-size: 22px;
  color: #424242;
  max-width: 100%;
`

const SubAssetAmount = styled.Text`
  font-size: 15px;
  color: #424242;
  opacity: 0.8;
`

const AssetSymbol = styled.Text`
  font-size: 16px;
  font-weight: bold;
`

const CounterAssetSymbol = styled.Text`
  font-size: 10px;
  font-weight: bold;
`

const CardTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.15);
  position: absolute;
  bottom: 6px;
  right: 6px;
`

class AssetCard extends React.Component {
  render () {
    const { symbol, balance, ohlc, rates, counterSymbol } = this.props

    const data = map(ohlc, ({ open }) => open)
    const counterRate = get(rates, counterSymbol)

    return (
      <Slide>
        <ChartContainer>
          <LinearGradient
            colors={getColorFromString(symbol)}
          >
            <AreaChart
              style={{ height: 150 }}
              data={ data }
              contentInset={{ top: 30, bottom: 30 }}
              curve={ shape.curveNatural }
              svg={{ fill: 'rgba(255, 255, 255, 0.3)' }}
            />
          </LinearGradient>
        </ChartContainer>
        <CardTitle>{ symbol }</CardTitle>
        <AssetAmount adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
          { balance }
          { ' ' }
          <AssetSymbol>{ symbol }</AssetSymbol>
        </AssetAmount>
        {
          counterRate &&
          <SubAssetAmount>
            { balance * counterRate }
            { ' ' }
            <CounterAssetSymbol>{ counterSymbol }</CounterAssetSymbol>
          </SubAssetAmount>
        }
      </Slide>
    )
  }
}

AssetCard.propTypes = {
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  ohlc: PropTypes.array,
  rates: PropTypes.object,
  counterSymbol: PropTypes.string
}

const mapStateToProps = (state, props) => {
  return {
    ohlc: getCoinOHLC(state, props.symbol),
    rates: getRatesByCoin(state, props.symbol)
  }
}

export default connect(mapStateToProps)(AssetCard)
