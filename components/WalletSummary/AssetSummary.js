import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get, reduce } from 'lodash'

import { getWalletByAddress } from '../../state/wallet'
import { getAllRates, isLoading } from '../../state/rates'
import { Text } from 'react-native'
import { Text as ChartText } from 'react-native-svg'
import { PieChart } from 'react-native-svg-charts'
import { getColorFromString } from '../../helpers/color'

class AssetSummary extends Component {
  render() {
    const {
      wallet,
      rates,
      counterSymbol
    } = this.props

    if (!rates) {
      return <Text>{'rates are needed to display the pie chart'}</Text>
    }

    const data = reduce(wallet.summary, (acc, asset, symbol) => {
      const rate = get(rates, [symbol, counterSymbol])

      if (rate) {
        acc.push({
          key: symbol,
          value: rate * (asset.balance / Math.pow(10, asset.magnitude)),
          svg: { fill: getColorFromString(symbol)[0] }
        })
      }
      return acc
    }, [])

    const Labels = ({ slices, height, width }) => {
      return slices.map((slice, index) => {
        const { pieCentroid, data } = slice;
        return (
          <ChartText
            key={index}
            x={pieCentroid[ 0 ]}
            y={pieCentroid[ 1 ]}
            fill={'white'}
            textAnchor={'middle'}
            alignmentBaseline={'middle'}
            fontSize={12}
            stroke={'black'}
            strokeWidth={0.2}
          >
            {data.key}
          </ChartText>
        )
      })
    }

    return (
      <PieChart
        style={{ height: 200 }}
        valueAccessor={({ item }) => item.value}
        data={data}
        spacing={0}
        outerRadius={'95%'}
      >
        <Labels/>
      </PieChart>
    )
  }
}

AssetSummary.defaultProps = {
  counterSymbol: 'BTC'
}

const mapStateToProps = (state, props) => {
  return {
    wallet: getWalletByAddress(state, props.address),
    rates: getAllRates(state, props.address),
    isLoading: isLoading(state)
  }
}

export default connect(mapStateToProps)(AssetSummary)
