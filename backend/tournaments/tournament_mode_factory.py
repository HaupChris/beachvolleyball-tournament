from .tournament_modes.double_elimination_mode import DoubleEliminationMode
from .tournament_modes.group_elimination_mode import GroupEliminationMode
from .tournament_modes.round_robin_mode import RoundRobinMode
from .tournament_modes.single_elimination_mode import SingleEliminationMode
from .tournament_modes.swiss_mode import SwissMode

def get_tournament_mode_instance(tournament):
    mode_classes = {
        'single_elimination': SingleEliminationMode,
        'double_elimination': DoubleEliminationMode,
        'group_elimination': GroupEliminationMode,
        'swiss': SwissMode,
        'round_robin_once': RoundRobinMode,
        'round_robin_twice': RoundRobinMode,
    }
    mode_class = mode_classes.get(tournament.mode)
    return mode_class(tournament) if mode_class else None
