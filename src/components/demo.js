if ((diff1 === 1 && diff2 === 1)) {
    let preWinSorted = currCards[tempWinner[0].player].sort((a, b) => (a.value > b.value) ? 1 : -1)
    if ((tempCard[0].color === tempCard[1].color) && (tempCard[0].color === tempCard[2].color) && tempCard[0].color !== null) {
        if (sortedArray[0].value === '1' && sortedArray[2] === '13') {
            return true
        } else if (preWinSorted[0].value === '1' && preWinSorted[2] === '13') {
            tempWinner = [{ type: 'color sequence', player: cards }]
        } else {
            if (tempWinner.length > 0 && tempWinner[0].type === 'triple') {
                return true
            } else if (tempWinner.length > 0 && tempWinner[0].type === 'color sequence') {
                let currPlayerCards = [], prevWinnerCard = []
                sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                preWinSorted.map(tempVal => prevWinnerCard.push(tempVal.value))
                if (currPlayerCards.toString() > prevWinnerCard.toString()) {
                    tempWinner = [{ type: 'color sequence', player: cards }]
                }
            } else {
                tempWinner = [{ type: 'color sequence', player: cards }]
            }
        }
    }
}