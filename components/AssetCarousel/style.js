import { Stylesheet, Dimensions } from 'react-native'

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

function wp (percentage) {
  const value = (percentage * viewportWidth / 100)

  return Math.round(value)
}

const slideHeight = viewportHeight * 0.36
const slideWidth = wp(75)
const itemHorizontalMargin = wp(2)
