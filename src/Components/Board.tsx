import { useState } from "react"
import ResetIcon from '../assets/reset.svg'

function Board() {

    const [turn, setTurn] = useState(false)
    const [placements, setPlacements] = useState<any[]>([])
    const [gameStatus, setGameStatus] = useState<null | string>(null)
    const p1Clr = 'black'
    const p2Clr = 'white'

    const ArrayFinder = (list: any[], value: number) => {
        return list.find(item => parseInt(item.split('.')[0]) === value)
    }

    const findWin = (list: any[], i: number) => {
        const playerPlacement = turn ?
            list.filter(item => item.includes('.g')) :
            list.filter(item => item.includes('.r'))

        const findNumClr = ArrayFinder(list, i)
        var matrixFinderH = [findNumClr]
        var matrixFinderV = [findNumClr]
        var matrixFinderULRD = [findNumClr]
        var matrixFinderDLRU = [findNumClr]
        var endReadVDown = false
        var endReadVUp = false
        var endReadHLeft = false
        var endReadHRight = false
        var endReadDULeft = false
        var endReadDDRight = false
        var endReadDDLeft = false
        var endReadDURight = false

        for (var j = 1; j < 5; j++) {
            const incV = (15 * j) + i
            const decV = Math.abs((15 * j) - i)
            const incH = j + i
            const decH = Math.abs(j - i)
            const incDUL = ((15 * j) + i) + j
            const decDDR = (Math.abs((15 * j) - i)) - j
            const incDDL = ((15 * j) + i) - j
            const decDUR = (Math.abs((15 * j) - i)) + j

            const findDown = ArrayFinder(list, incV)
            const findUp = ArrayFinder(list, decV)
            if (!findDown || !playerPlacement.includes(findDown)) endReadVDown = true
            if (!findUp || !playerPlacement.includes(findUp)) endReadVUp = true
            if (findDown && !endReadVDown) matrixFinderV.push(findDown)
            if (findUp && !endReadVUp) matrixFinderV.push(findUp)

            const findLeft = ArrayFinder(list, incH)
            const findRight = ArrayFinder(list, decH)
            if (!findLeft || !playerPlacement.includes(findLeft)) endReadHLeft = true
            if (!findRight || !playerPlacement.includes(findRight)) endReadHRight = true
            if (findLeft && !endReadHLeft) matrixFinderH.push(findLeft)
            if (findRight && !endReadHRight) matrixFinderH.push(findRight)

            const findDiaUpLeft = ArrayFinder(list, incDUL)
            const findDiaDownRight = ArrayFinder(list, decDDR)
            if (!findDiaUpLeft || !playerPlacement.includes(findDiaUpLeft)) endReadDULeft = true
            if (!findDiaDownRight || !playerPlacement.includes(findDiaDownRight)) endReadDDRight = true
            if (findDiaUpLeft && !endReadDULeft) matrixFinderULRD.push(findDiaUpLeft)
            if (findDiaDownRight && !endReadDDRight) matrixFinderULRD.push(findDiaDownRight)

            const findDiaDownLeft = ArrayFinder(list, incDDL)
            const findDiaUpRight = ArrayFinder(list, decDUR)
            if (!findDiaDownLeft || !playerPlacement.includes(findDiaDownLeft)) endReadDDLeft = true
            if (!findDiaUpRight || !playerPlacement.includes(findDiaUpRight)) endReadDURight = true
            if (findDiaDownLeft && !endReadDDLeft) matrixFinderDLRU.push(findDiaDownLeft)
            if (findDiaUpRight && !endReadDURight) matrixFinderDLRU.push(findDiaUpRight)
        }
        const remDupeV = [...new Set(matrixFinderV)]
        const remDupeH = [...new Set(matrixFinderH)]
        const remDupeULRD = [...new Set(matrixFinderULRD)]
        const remDupeDLRU = [...new Set(matrixFinderDLRU)]

        const findFive = [remDupeV, remDupeH, remDupeULRD, remDupeDLRU].filter(item => item.length > 4)
        if (findFive.length) setGameStatus(turn ? p1Clr : p2Clr)
        else setGameStatus(null)

    }

    const handleClick = (e: any, i: number) => {
        e.target.disabled = true
        const label = document.getElementById(`label${i}`)
        setTurn(!turn)
        if (label) {
            const parentElement = label.parentElement
            label.classList.add(turn ? 'active-black' : 'active-white')
            if(parentElement) label.parentElement.classList.add('no-click')
        }
        const newPlacements = [...placements, `${i}.${turn ? 'g' : 'r'}`]
        setPlacements(newPlacements)
        findWin(newPlacements, i)
    }
    
    const handleReset = () => {
        const label = document.querySelectorAll(`.label`)
        label.forEach((el)=>{
            const child = el.getElementsByClassName('child')[0]
            child.classList.remove('active-black', 'active-white')
            el.removeAttribute('background')
            el.classList.remove('no-click')     
            const parent = el.parentElement
            const checkbox: HTMLInputElement | null | undefined  = parent?.querySelector('input')
            if(checkbox) checkbox.disabled = false
        })
        setGameStatus(null)
        setTurn(false)
        setPlacements([])
    }

    return (
        <>
            <div className='board' style={{pointerEvents: gameStatus ? 'none':'fill'}}>
                {
                    new Array(225).fill(0).map((_, i) => {
                        return (
                            <label key={i} >
                                <input type='checkbox' className="checkbox" onChange={(e) => handleClick(e, i)} />
                                {/* @ts-ignore */}
                                <span className='label' style={{'--color' : turn ? 'black':'white'}}>
                                <span id={`label${i}`}  className="child"></span>   
                                </span>
                            </label>
                        )
                    })
                }
            </div>
            <div className="last-section">

            <button onClick={handleReset}>
                <img src={ResetIcon} alt="reset-icon" />
            </button>
            {
                gameStatus &&
                <p>{gameStatus} wins!</p>
            }
            </div>
        </>
    )
}

export default Board