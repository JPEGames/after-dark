app.factory('NavbarFactory', function ($http) {
  let NavbarFactory = {}
  let hasCharacter = null
  let hasBunker = null

  NavbarFactory.getter = () => {
    return {hasCharacter: hasCharacter, hasBunker: hasBunker}
  }
  NavbarFactory.setter = (characterState, bunkerState) => {
    hasCharacter = characterState
    hasBunker = bunkerState
  }
  return NavbarFactory
})
