export const truncate = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr

  const separator = '...'

  const sepLen = separator.length
  const charsToShow = strLen - sepLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)

  return `${fullStr.substr(0, frontChars)}...${fullStr.substr(fullStr.length - backChars)}`

}
