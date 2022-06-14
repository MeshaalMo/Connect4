var currentState = {
    board: [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
    actions: ['03', '02', '04', '01', '05', '00', '06']
}
var maxDepth = 10
var PLAYER_COLOR = 'red'
var AI_COLOR = 'yellow'

function play(e) {
    if (!isTerminal(currentState)) 
        updateBoard(e.id, PLAYER_COLOR, -1)
    if (!isTerminal(currentState))
        setTimeout(alphaBetaSearch,350,currentState)
}

function updateBoard(move, color, val) {
    let col = move[1]
    for (let i = 0; i < currentState.board.length; i++) {
        if (!currentState.board[i][col]) {
            div = document.createElement('div')
            div.style.top = (6 - i) * -100 + '%'
            document.getElementById(i + col).appendChild(div)
            div.style.backgroundColor = color
            div.classList.add('dropdown')
            currentState.board[i][col] = val
            if ((i + 1) < currentState.board.length) {
                currentState.actions[currentState.actions.findIndex(e => e == i+col)] = (i + 1) + '' + col
                break
            }
            currentState.actions[currentState.actions.findIndex(e => e == i+col)] = null
        }
    }
    if(gameUtility(currentState.board,0) < 0)
        document.querySelector('h1').innerHTML = 'Congrats 👑🏆 '
    if(gameUtility(currentState.board,0) > 0)
        document.querySelector('h1').innerHTML = 'AI is Super Smart 🥊'
    if(isTerminal(currentState) && !gameUtility(currentState.board,0))
        document.querySelector('h1').innerHTML = 'Draw 🤷‍♀️'
}

function ai(move) {
    updateBoard(move, AI_COLOR, 1)
}

function naive_ai(state) {
    let t = [0, null]
    for (let i = 0; i < state.actions.length; i++) {
        let a = state.actions[i]
        if (a) {
            opNewState = copy(state)
            opNewState.board[a[0]][a[1]] = -1
            opGameState = gameUtility(opNewState.board, 0)
            aiNewState = copy(state)
            aiNewState.board[a[0]][a[1]] = 1
            aiGameState = gameUtility(aiNewState.board, 0)
            if (aiGameState)
                return [1, a]
            if (opGameState)
                t = [1, a]
        }
    }
    return t
}

function alphaBetaSearch(state) {
    t = naive_ai(state)
    if(!t[1])
        t = maxValue(state, -100, 100, 0)
    ai(t[1])
}

function maxValue(state, alpha, beta, depth) {
    if (isTerminal(state) || depth > maxDepth)
        return [gameUtility(state.board, depth), null]
    let v = -100
    let move = null
    state.actions.every((a,i) => {
        if (a) {
            newState = copy(state)
            newState.board[a[0]][a[1]] = 1
            if (Number(a[0]) + 1 < newState.board.length)
                newState.actions[i] = (Number(a[0]) + 1) + '' + a[1]
            else
                newState.actions[i] = null
            let t = minValue(newState, alpha, beta, depth + 1)
            let v2 = t[0]
            if (v2 > v) {
                v = v2
                move = a
                alpha = Math.max(alpha, v)

            }
            if (v >= beta) 
                return false
        }
        return true
    })
    return [v, move]
}

function minValue(state, alpha, beta, depth) {
    if (isTerminal(state) || depth > maxDepth)
        return [gameUtility(state.board, depth), null]

    let v = 100
    let move = null
    state.actions.every((a,i) => {
        if (a) {
            newState = copy(state)
            newState.board[a[0]][a[1]] = -1
            if (Number(a[0]) + 1 < newState.board.length)
                newState.actions[i] = (Number(a[0]) + 1) + '' + a[1]
            else
                newState.actions[i] = null
            let t = maxValue(newState, alpha, beta, depth + 1)
            let v2 = t[0]
            if (v2 < v) {
                v = v2
                move = a
                beta = Math.min(beta, v)
            }
            if (v <= alpha)
                return false
        }
        return true
    })
    return [v, move]
}

function gameUtility(board, depth) {
    //Check columns
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col])
                if (board[row][col] == board[row + 1][col] &&
                    board[row + 2][col] == board[row + 3][col] &&
                    board[row][col] == board[row + 2][col])
                    return board[row][col] * 20 - board[row][col] * depth
        }
    }
    //Check rows
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            if (board[row][col])
                if (board[row][col] == board[row][col + 1] &&
                    board[row][col + 2] == board[row][col + 3] &&
                    board[row][col] == board[row][col + 2])
                    return board[row][col] * 20 - board[row][col] * depth

        }
    }
    //Check diagonals 
    for (let row = 0; row < board.length - 3; row++) {
        for (let col = 0; col < board[row].length - 3; col++) {
            //Check upper right diagonal 
            if (board[row][col]) {
                if (board[row][col] == board[row + 1][col + 1] &&
                    board[row + 2][col + 2] == board[row + 3][col + 3] &&
                    board[row][col] == board[row + 2][col + 2])
                    return board[row][col] * 20 - board[row][col] * depth

                //Check counter diagonal
                let r = row + 3 
                if (board[r][col] == board[r - 1][col + 1] &&
                    board[r - 2][col + 2] == board[r - 3][col + 3] &&
                    board[r][col] == board[r - 2][col + 2])
                    return board[r][col] * 20 - board[r][col] * depth
            }
        }
    }
    return 0
}

function isTerminal(state) {
    let utility = gameUtility(state.board,0)
    for (let i = 0; i < state.actions.length && !utility; i++)
        if (state.actions[i])
            return false
    return true
}

function copy(state) {
    return { board: state.board.map(e => [...e]), actions: [...state.actions] }
}






