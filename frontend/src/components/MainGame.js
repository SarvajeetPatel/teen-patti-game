import React, { useEffect, useState } from 'react'
import Cards from '../data/Cards.json'

function MainGame({ newUser }) {
    const [winner, setWinner] = useState([])
    const [timer, setTimer] = useState(15)
    const [flag, setFlag] = useState(false)
    const [currUser, setCurrUser] = useState(0)
    const [newObject, setNewObject] = useState({})
    const [currCards, setCurrCards] = useState({ 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] })
    const [total, setTotal] = useState(0)
    const [blindAmt, setBlindAmt] = useState(20)
    const [callAmt, setCallAmt] = useState(blindAmt * 2)

    useEffect(() => {
        const existingCard = JSON.parse(localStorage.getItem('cards list')) || {}
        const existingUser = JSON.parse(localStorage.getItem('current player')) || 0
        const existingTime = JSON.parse(localStorage.getItem('time')) || 15
        const existingMoney = JSON.parse(localStorage.getItem('money count')) || 0
        const existingBlindMoney = JSON.parse(localStorage.getItem('blind amount')) || 0
        const existingCallMoney = JSON.parse(localStorage.getItem('call amount')) || existingBlindMoney * 2

        if (Object.keys(existingCard).length === 0) {
            let k = 0;
            let cardObject = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }
            let TempCards = Cards

            for (let i = 0; i < TempCards.length; i++) {
                let shuffle = Math.floor(Math.random() * (TempCards.length));
                [TempCards[i], TempCards[shuffle]] = [TempCards[shuffle], TempCards[i]];
            }

            while (k < 18) {
                // eslint-disable-next-line
                Object.keys(cardObject).map(cardKey => {
                    if (k === 0 || k === 6 || k === 12) {
                        TempCards[k].money = ['20']
                    }
                    cardObject[cardKey].push(TempCards[Number(cardKey) + k])
                })
                k += 6
            }

            let sum = 0;
            Object.keys(cardObject).forEach((cardsInList) => {
                cardObject[cardsInList][0].money.forEach((currAmt) => {
                    sum += Number(currAmt)
                })
            })
            setTotal(sum)

            localStorage.setItem('cards list', JSON.stringify(cardObject))
            setCurrCards(cardObject)
        } else {
            setCurrCards(existingCard)
            setTotal(existingMoney)
            setCurrUser(existingUser)
            setTimer(existingTime)
            setBlindAmt(existingBlindMoney)
            setCallAmt(existingCallMoney)
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const newInterval = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    handlePack(currUser)
                    if (currUser < Object.keys(currCards).length) {
                        setCurrUser(currUser + 1)
                    } else {
                        setCurrUser(0)
                    }
                    setTimer(15)
                    clearInterval(newInterval);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(newInterval);
        // eslint-disable-next-line
    }, [timer])

    useEffect(() => {
        if (winner.length === 0) {
            localStorage.setItem('cards list', JSON.stringify(currCards))
            localStorage.setItem('time', timer)
            localStorage.setItem('money count', total)
            localStorage.setItem('current player', currUser)
            localStorage.setItem('blind amount', blindAmt)
            localStorage.setItem('call amount', callAmt)
        }
        // eslint-disable-next-line 
    }, [timer, currCards, total, currUser, blindAmt, callAmt])

    useEffect(() => {
        let tempWinner = []
        if (Object.keys(newObject).length === 1 || flag) {
            Object.keys(newObject).map((cards) => {
                let tempCard = newObject[cards], diff1, diff2
                let sortedArray = tempCard.sort((a, b) => (a.value - b.value) > 0 ? 1 : -1)

                if (sortedArray[0].value === '1' && sortedArray[2].value === '13') {
                    diff2 = sortedArray[2].value - sortedArray[1].value
                    diff1 = 1
                } else {
                    diff1 = sortedArray[1].value - sortedArray[0].value
                    diff2 = sortedArray[2].value - sortedArray[1].value
                }

                //TRIPLE
                if ((tempCard[0].value === tempCard[1].value) && (tempCard[0].value === tempCard[2].value) && tempCard[0].value !== null) {
                    if (tempWinner.length > 0 && tempWinner[0].type === 'triple') {
                        if (tempCard[0].value === '1') {
                            tempWinner = [{ type: 'triple', player: cards }]
                        } else if (newObject[tempWinner[0].player][0].value !== '1' && tempCard[0].value !== '1' && newObject[tempWinner[0].player][0].value < tempCard[0].value) {
                            tempWinner = [{ type: 'triple', player: cards }]
                        }
                    } else {
                        tempWinner = [{ type: 'triple', player: cards }]
                    }
                }

                //COLOR SEQUENCE AND SEQUENCE
                else if ((diff1 === 1 && diff2 === 1)) {
                    if ((tempCard[0].color === tempCard[1].color) && (tempCard[0].color === tempCard[2].color) && tempCard[0].color !== null) {

                        if (tempWinner.length > 0 && tempWinner[0].type === 'triple') {
                            return true
                        } else if (tempWinner.length > 0 && tempWinner[0].type === 'color sequence') {
                            let preWinSorted = newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1)
                            let currPlayerCards = [], prevWinnerCard = []
                            sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                            preWinSorted.map(tempVal => prevWinnerCard.push(tempVal.value))

                            if (preWinSorted[0].value === '1' && preWinSorted[2].value === '13') {
                                return true
                            } else if (sortedArray[0].value === '1' && sortedArray[2].value === '13') {
                                tempWinner = [{ type: 'color sequence', player: cards }]
                            } else {
                                if ((currPlayerCards[2] - prevWinnerCard[2]) > 0) {
                                    tempWinner = [{ type: 'color sequence', player: cards }]
                                } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) > 0)) {
                                    tempWinner = [{ type: 'color sequence', player: cards }]
                                } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) === 0) && ((currPlayerCards[0] - prevWinnerCard[0]) > 0)) {
                                    tempWinner = [{ type: 'color sequence', player: cards }]
                                }
                            }

                        } else {
                            tempWinner = [{ type: 'color sequence', player: cards }]
                        }

                    } else {
                        if (tempWinner.length > 0 && (tempWinner[0].type === 'color sequence' || tempWinner[0].type === 'triple')) {
                            return true
                        } else if (tempWinner.length > 0 && tempWinner[0].type === 'sequence') {
                            let preWinSorted = newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1)
                            if (preWinSorted[0].value === '1' && preWinSorted[2].value === '13') {
                                return true
                            } else if (sortedArray[0].value === '1' && sortedArray[2].value === '13') {
                                tempWinner = [{ type: 'sequence', player: cards }]
                            } else {
                                let currPlayerCards = [], prevWinnerCard = []
                                sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                                newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1).map(tempVal => prevWinnerCard.push(tempVal.value))
                                if ((currPlayerCards[2] - prevWinnerCard[2]) > 0) {
                                    tempWinner = [{ type: 'sequence', player: cards }]
                                } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) > 0)) {
                                    tempWinner = [{ type: 'sequence', player: cards }]
                                } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) === 0) && ((currPlayerCards[0] - prevWinnerCard[0]) > 0)) {
                                    tempWinner = [{ type: 'sequence', player: cards }]
                                }
                            }
                        } else {
                            tempWinner = [{ type: 'sequence', player: cards }]
                        }
                    }
                }

                //COLOR
                else if (((tempCard[0].color === tempCard[1].color) && (tempCard[0].color === tempCard[2].color) && tempCard[0].color !== null) && (diff1 !== 1 || diff2 !== 1)) {
                    if (tempWinner.length > 0 && (tempWinner[0].type === 'triple' || tempWinner[0].type === 'color sequence' || tempWinner[0].type === 'sequence')) {
                        return true
                    } else if (tempWinner.length > 0 && tempWinner[0].type === 'color') {
                        let currPlayerCards = [], prevWinnerCard = []
                        sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                        newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1).map(tempVal => prevWinnerCard.push(tempVal.value))

                        if (currPlayerCards[0] !== '1' && prevWinnerCard[0] === '1') {
                            return true
                        } else if (currPlayerCards[0] === '1' && prevWinnerCard[0] !== '1') {
                            tempWinner = [{ type: 'color', player: cards }]
                        } else {
                            if ((currPlayerCards[2] - prevWinnerCard[2]) > 0) {
                                tempWinner = [{ type: 'color', player: cards }]
                            } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) > 0)) {
                                tempWinner = [{ type: 'color', player: cards }]
                            } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) === 0) && ((currPlayerCards[0] - prevWinnerCard[0]) > 0)) {
                                tempWinner = [{ type: 'color', player: cards }]
                            }
                        }
                    } else {
                        tempWinner = [{ type: 'color', player: cards }]
                    }
                }

                // PAIR
                else if (((tempCard[0].value === tempCard[1].value) || (tempCard[0].value === tempCard[2].value) || (tempCard[1].value === tempCard[2].value))) {
                    if (tempWinner.length > 0 && (tempWinner[0].type === 'triple' || tempWinner[0].type === 'color sequence' || tempWinner[0].type === 'sequence' || tempWinner[0].type === 'color')) {
                        return true
                    } else if (tempWinner.length > 0 && tempWinner[0].type === 'pair') {
                        let currPlayerCards = [], prevWinnerCard = []
                        sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                        newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1).map(tempVal => prevWinnerCard.push(tempVal.value))

                        if (prevWinnerCard[0] === '1' && prevWinnerCard[1] === '1' && currPlayerCards[0] !== '1') {
                            return true
                        } else if (prevWinnerCard[0] !== '1' && currPlayerCards[0] === '1' && currPlayerCards[1] === '1') {
                            tempWinner = [{ type: 'pair', player: cards }]
                        } else if (prevWinnerCard[0] === currPlayerCards[0]) {
                            if (currPlayerCards[2] - prevWinnerCard[2] > 0) {
                                tempWinner = [{ type: 'pair', player: cards }]
                            }
                        } else {
                            if (currPlayerCards[0] - prevWinnerCard[0] > 0) {
                                tempWinner = [{ type: 'pair', player: cards }]
                            }
                        }

                    } else {
                        tempWinner = [{ type: 'pair', player: cards }]
                    }
                }

                // NO MATCH
                else {
                    if (tempWinner.length > 0 && (tempWinner[0].type === 'triple' || tempWinner[0].type === 'color sequence' || tempWinner[0].type === 'sequence' || tempWinner[0].type === 'color' || tempWinner[0].type === 'pair')) {
                        return true
                    } else if (tempWinner.length > 0 && tempWinner[0].type === 'no match') {
                        let currPlayerCards = [], prevWinnerCard = []
                        sortedArray.map(currValue => currPlayerCards.push(currValue.value))
                        newObject[tempWinner[0].player].sort((a, b) => (a.value - b.value) > 0 ? 1 : -1).map(tempVal => prevWinnerCard.push(tempVal.value))

                        if (prevWinnerCard[0] === '1' && currPlayerCards[0] !== '1') {
                            return true
                        } else if (currPlayerCards[0] === '1' && prevWinnerCard[0] !== '1') {
                            tempWinner = [{ type: 'no match', player: cards }]
                        } else {
                            if ((currPlayerCards[2] - prevWinnerCard[2]) > 0) {
                                tempWinner = [{ type: 'no match', player: cards }]
                            } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) > 0)) {
                                tempWinner = [{ type: 'no match', player: cards }]
                            } else if (((currPlayerCards[2] - prevWinnerCard[2]) === 0) && ((currPlayerCards[1] - prevWinnerCard[1]) === 0) && ((currPlayerCards[0] - prevWinnerCard[0]) > 0)) {
                                tempWinner = [{ type: 'no match', player: cards }]
                            }
                        }
                    }
                    else {
                        tempWinner = [{ type: 'no match', player: cards }]
                    }
                }
                return 0;
            })

            setWinner(tempWinner)
            setTimer(0)
            setCurrUser(0)

            localStorage.removeItem('cards list')
            localStorage.removeItem('current player')
            localStorage.removeItem('time')
            localStorage.removeItem('money count')
            localStorage.removeItem('blind amount')
            localStorage.removeItem('call amount')
        }
        // eslint-disable-next-line
    }, [newObject, flag])

    const updateObject = (index) => {
        let i = (Number(index) < 5) ? Number(index) + 1 : 0
        if (i < Object.keys(currCards).length) {
            while (currCards[i][0].status === 'pack') {
                if (i < 5) {
                    i++
                } else {
                    i = 0
                }
            }
        }
        setCurrUser(i)
        setTimer(15)
    }

    const handleCall = (index) => {
        let tempCards = currCards

        if (tempCards[Number(index)][0].status === 'blind') {
            tempCards[Number(index)][0].money.push(blindAmt)
            tempCards[Number(index)][1].money.push(blindAmt)
            tempCards[Number(index)][2].money.push(blindAmt)
        } else {
            tempCards[Number(index)][0].money.push(callAmt)
            tempCards[Number(index)][1].money.push(callAmt)
            tempCards[Number(index)][2].money.push(callAmt)
        }

        let sum = 0;
        Object.keys(tempCards).forEach((cardsInList) => {
            tempCards[cardsInList][0].money.forEach((currAmt) => {
                sum += Number(currAmt)
            })
        })
        setTotal(sum)

        setCurrCards(tempCards)
        updateObject(index)
    }

    const handlePack = (index) => {
        let tempCards = currCards

        tempCards[Number(index)][0].status = 'pack'
        tempCards[Number(index)][1].status = 'pack'
        tempCards[Number(index)][2].status = 'pack'

        let newCard = Object.keys(tempCards).filter(objKey => tempCards[objKey][0].status === 'blind' || tempCards[objKey][0].status === 'call')
            .reduce((newObj, key) => {
                newObj[key] = tempCards[key];
                return newObj;
            }, {}
            );

        updateObject(index)
        setNewObject(newCard)
        setCurrCards(tempCards)
    }

    const handleBlindOpen = (index) => {
        let tempCard = currCards

        tempCard[Number(index)][0].status = 'call'
        tempCard[Number(index)][1].status = 'call'
        tempCard[Number(index)][2].status = 'call'
        setCallAmt(blindAmt * 2)
        setCurrCards({ ...tempCard })
    }

    const handleRaise = (index) => {
        let tempBlindAmt = blindAmt, tempCard = currCards, tempCallAmt = callAmt
        if (tempCard[index][0].status === 'blind') {
            tempBlindAmt += 10
            setBlindAmt(tempBlindAmt)
            setCallAmt(tempBlindAmt * 2)
        } else if (tempCard[index][0].status === 'call') {
            tempCallAmt += 10
            tempBlindAmt = tempCallAmt / 2
            setBlindAmt(tempBlindAmt)
            setCallAmt(tempCallAmt)
        }
    }

    return (
        <>
            <h3> Logged in as : {newUser} </h3>
            <h2> Players Cards are : </h2>

            {currCards[0].length > 0 &&
                Object.keys(currCards).map(card =>
                    <>
                        <div className='card-listing'>
                            Player {card}
                            {
                                currCards[card][0].status === 'blind' &&
                                <button className='button-86' type='button' onClick={() => handleBlindOpen(card)}> OPEN </button>
                            }
                            {
                                currCards[card][0].status !== 'blind' &&
                                currCards?.[card]?.map((playerCard, cardIndex) => (
                                    <div className={(playerCard?.status === 'pack' ? 'pack-user' : 'winner-player')}>
                                        <ul key={cardIndex}>
                                            <li> {playerCard?.name} of {playerCard?.color} </li>
                                        </ul>
                                    </div>
                                ))
                            }
                            {currCards?.[card]?.[0]?.money?.[currCards?.[card]?.[0]?.money?.length - 1]}

                            {((winner.length === 0) && (currUser === Number(card)) && (currCards[card][0].status !== 'pack')) &&
                                <>
                                    <button className='button-86' type='button' onClick={() => handleCall(card)}> {currCards[card][0].status === 'blind' ? 'BLIND' : 'CALL'} </button>
                                    <button className='button-86' type='button' onClick={() => handlePack(card)}> PACK </button>
                                    <span> {currCards[card][0].status === 'blind' && blindAmt} </span>
                                    <span> {currCards[card][0].status === 'call' && callAmt} </span>
                                    <button className='button-86' type='button' onClick={() => handleRaise(card)}> + </button>

                                    {Object.keys(newObject).length === 2 &&
                                        <button className='button-86' type='button' onClick={() => setFlag(true)}> SHOW </button>
                                    }
                                    &nbsp; &nbsp;
                                    <h5> {timer > 9 ? timer : `0${timer}`} seconds left! </h5>
                                </>
                            }
                        </div>
                    </>
                )}
            <h3> Total Amount is : {total} </h3>
            {winner.length > 0 && <div className='winner-details'> Winner is Player {winner[0]?.player} and has {winner[0]?.type} set! </div>}
        </>
    )
}

export default MainGame