from django.db import models

from backend.tournaments.models import Team, Match
from backend.tournaments.tournament_modes.tournament_mode import TournamentMode


class GroupEliminationMode(TournamentMode):
    def generate_schedule(self):
        pass

    def get_played_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=False).distinct()

    def get_upcoming_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=True).distinct()

    def calculate_standings(self):
        pass
