import matchStates from "./constants/matchStates";
import { InvalidMatchState } from "../utils/errors/errors";

const matchStatesFlow: any = {
    [matchStates.NOT_STARTED]: [matchStates.FIRST_HALF, matchStates.POSTPONED, matchStates.SUSPENDED],
    [matchStates.POSTPONED]: [matchStates.FIRST_HALF, matchStates.SUSPENDED],
    [matchStates.FIRST_HALF]: [matchStates.HALF_TIME, matchStates.SUSPENDED],
    [matchStates.HALF_TIME]: [matchStates.SECOND_HALF, matchStates.SUSPENDED],
    [matchStates.SECOND_HALF]: [matchStates.MATCH_OVER, matchStates.EXTRA_TIME, matchStates.PENALTY_SHOOTOUT, matchStates.SUSPENDED],
    [matchStates.EXTRA_TIME]: [matchStates.MATCH_OVER, matchStates.PENALTY_SHOOTOUT, matchStates.SUSPENDED],
    [matchStates.PENALTY_SHOOTOUT]: [matchStates.MATCH_OVER, matchStates.SUSPENDED],
    [matchStates.MATCH_OVER]: [matchStates.MATCH_OVER],
    [matchStates.SUSPENDED]: [matchStates.SUSPENDED]
}

const nextState = (currentState: matchStates, optionalState: matchStates | undefined = undefined) => {
    currentState = currentState.toUpperCase() as matchStates
    if (!matchStatesFlow[currentState]) throw new Error('Invalid state')
    
    if (optionalState) {
        if (matchStatesFlow[currentState].includes(optionalState)) {
            return optionalState
        } else {
            throw new InvalidMatchState('Invalid state')
        }
    }
    return matchStatesFlow[currentState][0]
}

export default nextState;