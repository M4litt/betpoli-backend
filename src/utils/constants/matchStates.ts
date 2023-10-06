enum matchStates{
    "DEFAULT" = "NOT_STARTED",
    "NOT_STARTED" = "NOT_STARTED",
    "POSTPONED" = "POSTPONED",
    "FIRST_HALF" = "FIRST_HALF",
    "HALF_TIME" = "HALF_TIME",
    "SECOND_HALF" = "SECOND_HALF",
    "EXTRA_TIME" = "EXTRA_TIME",
    "PENALTY_SHOOTOUT" = "PENALTY_SHOOTOUT",
    "MATCH_OVER" = "MATCH_OVER",
    "SUSPENDED" = "SUSPENDED",
}

export default matchStates;


/*
crear_partido > not_started

siguiente_paso > first_half
siguiente_paso > half_time


second_half > siguiente_paso > match_over

secondo_half > siguiente_paso:extra_time > extra_time

*/