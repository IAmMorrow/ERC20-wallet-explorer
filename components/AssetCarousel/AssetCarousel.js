import React from 'react'
import Carousel, { Pagination } from 'react-native-snap-carousel'

import { View, Dimensions } from 'react-native'

import AssetCard from './AssetCard'

const { width: viewportWidth } = Dimensions.get('window')

const sliderWidth = Math.round(1 * viewportWidth)
const horizontalMargin = Math.round(0.1 * viewportWidth)
const itemWidth = sliderWidth - (horizontalMargin * 2)

class AssetCarousel extends React.Component {
  _renderItem = ({ item, index }) => {
    const {
      counterSymbol
    } = this.props

    return (
      <AssetCard
        balance={item.balance}
        symbol={item.symbol}
        counterSymbol={counterSymbol}
      />
    )
  }

  render () {
    const { summaryList, onAssetSelected, selectedIndex } = this.props

    return (
      <View>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={summaryList}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onBeforeSnapToItem={onAssetSelected}
          swipeThreshold={40}
          enableMomentum={true}
          layout={'default'}
        />
      </View>
    )
  }
}

export default AssetCarousel
