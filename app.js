var currentState = {
    board: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
    actions: ['00', '01', '02', '03', '04', '05', '06']
}
var PLAYER_COLOR = 'red'
var AI_COLOR = 'yellow'

function play(e) {
    if (!isTerminal(currentState)) {
        let col = e.id[1]
        updateBoard(e.id, PLAYER_COLOR, -1)
        if(!isTerminal(currentState))
            alphaBetaSearch(currentState)
    }
}

function updateBoard(move, color, val) {
    let col = move[1]
    for (let i = 0; i < currentState.board.length; i++) {
        if (!currentState.board[i][col]) {
            div = document.createElement('div')
            div.style.top = (5 - i) * -100 + '%'
            document.getElementById(i + col).appendChild(div)
            div.style.backgroundColor = color
            div.classList.add('dropdown')
            currentState.board[i][col] = val
            currentState.actions[col] = (Number(currentState.actions[col][0]) + 1) + '' + col
            if(Number(currentState.actions[col][0]) < currentState.board.length)
                return
            else{
                console.log('Set '+col+' to null')
                currentState.actions[col] = null
                return
            }
        }
    }
}

function alphaBetaSearch(state) {
    t = maxValue(state, -11, 11, 0)
    while(!t[1])
        t = [0,state.actions[Math.round(Math.random*state.actions.length)]]
    updateBoard(t[1], AI_COLOR, 1)
    console.log(currentState)
    return t
}

function maxValue(state, alpha, beta, depth) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    if(depth >= 6)
        return[0, null]
    let v = -11
    let move = null
    console.log(state.actions)
    state.actions.every(a => {
        if(a){
            newState = copy(state)
            console.log(newState)
            newState.board[a[0]][a[1]] = 1
            if (Number(a[0]) + 1 < newState.board.length)
                newState.actions[a[1]] = (Number(currentState.actions[a[1]][0]) + 1) + '' + a[1]
            else
                newState.actions[a[1]] = null
            let t = minValue(newState, alpha, beta, depth + 1)
            let v2 = t[0]
            if (v2 > v) {
                v = v2
                move = a
                alpha = Math.max(alpha, v)
            }
            if (v >= beta) {
                return false
            }
            return true
        }
    })
    return [v, move]
}

function minValue(state, alpha, beta, depth) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    if(depth >= 6)
        return[0, null]
    let v = 11
    let move = null
    state.actions.every(a => {
        if(a){
            newState = copy(state)
            newState.board[a[0]][a[1]] = 1
            if (Number(a[0]) + 1 < newState.board.length)
                newState.actions[a[1]] = (Number(currentState.actions[a[1]][0]) + 1) + '' + a[1]
            else
                newState.actions[a[1]] = null
            let t = maxValue(newState, alpha, beta, depth + 1)
            let v2 = t[0]
            if (v2 < v) {
                v = v2
                move = a
                beta = Math.min(beta, v)
            }
            if (v <= alpha) {
                return false
            }
            return true
        }
    })
    return [v, move]
}

function gameUtility(board) {
    //Check columns
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col])
                if (board[row][col] == board[row + 1][col] &&
                    board[row + 2][col] == board[row + 3][col] &&
                    board[row][col] == board[row + 2][col])
                    return board[row][col] * 10

        }
    }
    //Check rows
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            if (board[row][col])
                if (board[row][col] == board[row][col + 1] &&
                    board[row][col + 2] == board[row][col + 3] &&
                    board[row][col] == board[row][col + 2])
                    return board[row][col] * 10

        }
    }
    //Check upper right diagonal 
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            if (board[row][col]) {
                if (board[row][col] == board[row + 1][col + 1] &&
                    board[row + 2][col + 2] == board[row + 3][col + 3] &&
                    board[row][col] == board[row + 2][col + 2])
                    return board[row][col] * 10
            }
        }
    }
    //Check counter diagonal 
    for (let row = 3; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            if (board[row][col])
                if (board[row][col] == board[row - 1][col + 1] &&
                    board[row - 2][col + 2] == board[row - 3][col + 3] &&
                    board[row][col] == board[row - 2][col + 2])
                    return board[row][col] * 10
        }
    }
    return 0
}

function h(state) {

}

function isTerminal(state) {
    for (let i = 0; i < state.actions.length; i++)
        if (state.actions[i] && !gameUtility(state.board))
            return false
    return true
}

function copy(state) {
    return { board: state.board.map(e => [...e]), actions: [...state.actions] }
}






