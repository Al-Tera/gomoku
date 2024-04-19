import { useState } from "react"
import ResetIcon from '../assets/reset.svg'

function Board() {

    const boardRC = 15
    const boardBy = boardRC * boardRC
    const [turn, setTurn] = useState(false)
    const [placements, setPlacements] = useState<any[]>([])
    const [gameStatus, setGameStatus] = useState<null | string>(null)
    const p1Clr = 'black'
    const p2Clr = 'white'

    const ArrayFinder = (list: any[], value: number) => {
        return list.find(item => parseInt(item.split('.')[0]) === value)
    }

    const findNext = (value:number, find:string, list:any[], placements: number[]) => {
        var matrix = []
        for (var i = 1; i < 5; i++) {
            var findValue = 0;
            switch(find){
                case 't':
                    findValue = value + (boardRC * i)
                    break;
                case 'b':
                    findValue = value - (boardRC * i)
                    break;
                case 'r':
                    findValue = value - i
                    break;
                case 'l':
                    findValue = value + i
                    break;
                case 'dtl':
                    findValue = value - (boardRC * i) - i
                    break;
                case 'dbr':
                    findValue = value + (boardRC * i) + i
                    break;
                case 'dbl':
                    findValue = value + (boardRC * i) - i
                    break;
                case 'dtr':
                    findValue = value - (boardRC * i) + i
                    break;
                default:
                    break;
            }
            findValue = Math.abs(findValue)
            const matrixClone = [...matrix.map(item=>parseInt(item.replace(/[rg.]/g, ''))), findValue, value]
            const hasMostLeft = matrixClone.some(ix=>ix%boardRC===0)
            const hasMostRight = matrixClone.some(ix=>ix%boardRC===boardRC-1)
            const walled = hasMostLeft && hasMostRight
            const finder = ArrayFinder(list, findValue)
            if (!finder || !placements.includes(finder) || walled) 
                break;
            matrix.push(finder)
        }
        return matrix
    }

    const findWin = (list: any[], i: number) => {

        const playerPlacement = turn ?
            list.filter(item => item.includes('.g')) :
            list.filter(item => item.includes('.r'))

        const findNumClr = ArrayFinder(list, i)
        var matrixFinderH = [findNumClr, ...findNext(i,'r',list,playerPlacement), ...findNext(i,'l',list,playerPlacement)]
        var matrixFinderV = [findNumClr, ...findNext(i,'t',list,playerPlacement), ...findNext(i,'b',list,playerPlacement)]
        var matrixFinderULRD = [findNumClr, ...findNext(i,'dtl',list,playerPlacement), ...findNext(i,'dbr',list,playerPlacement)]
        var matrixFinderDLRU = [findNumClr, ...findNext(i,'dbl',list,playerPlacement), ...findNext(i,'dtr',list,playerPlacement)]

        const findFive = [matrixFinderH, matrixFinderV, matrixFinderULRD, matrixFinderDLRU]
            .some(item => item.length > 4)
        if (findFive) setGameStatus(turn ? p1Clr : p2Clr)
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
                    new Array(boardBy).fill(0).map((_, i) => {
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