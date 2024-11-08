from django.db import models

from backend.tournaments.models import Team, Match
from backend.tournaments.tournament_modes.tournament_mode import TournamentMode


class RoundRobinMode(TournamentMode):
    def generate_schedule(self):
        teams = list(Team.objects.filter(tournament=self.tournament))
        matches = []

        for i in range(len(teams)):
            for j in range(i + 1, len(teams)):
                matches.append(Match(
                    tournament=self.tournament,
                    team1=teams[i],
                    team2=teams[j],
                    round=1
                ))

        Match.objects.bulk_create(matches)

    def get_played_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=False).distinct()

    def get_upcoming_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=True).distinct()

    def calculate_standings(self):
        teams = Team.objects.filter(tournament=self.tournament)
        standings = []
        for team in teams:
            matches = Match.objects.filter(tournament=self.tournament).filter(
                models.Q(team1=team) | models.Q(team2=team)
            )
            wins = matches.filter(models.Q(team1=team, sets__score_team1__gt=models.F('sets__score_team2')) |
                                  models.Q(team2=team, sets__score_team2__gt=models.F('sets__score_team1'))).count()
            losses = matches.count() - wins
            standings.append({'team': team.name, 'wins': wins, 'losses': losses})
        standings.sort(key=lambda x: (-x['wins'], x['losses']))
        return standings
