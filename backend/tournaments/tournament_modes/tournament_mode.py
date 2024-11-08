from abc import ABC, abstractmethod
from backend.tournaments.models import Match, Tournament

class TournamentMode(ABC):
    def __init__(self, tournament: Tournament):
        self.tournament = tournament

    @abstractmethod
    def generate_schedule(self):
        pass

    @abstractmethod
    def get_played_matches(self):
        pass

    @abstractmethod
    def get_upcoming_matches(self):
        pass

    @abstractmethod
    def calculate_standings(self):
        pass
