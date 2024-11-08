from django.db import models

from ..models import Match, Team
from ..tournament_modes.tournament_mode import TournamentMode


class DoubleEliminationMode(TournamentMode):
    def generate_schedule(self):
        teams = list(Team.objects.filter(tournament=self.tournament))
        matches = []
        round_num = 1

        while len(teams) > 1:
            next_round_teams = []
            for i in range(0, len(teams), 2):
                if i + 1 < len(teams):
                    match = Match.objects.create(
                        tournament=self.tournament,
                        team1=teams[i],
                        team2=teams[i + 1],
                        round=round_num
                    )
                    next_round_teams.append(match)  # Winner advances
                else:
                    next_round_teams.append(teams[i])  # Odd team advances automatically

            teams = next_round_teams
            round_num += 1

    def get_played_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=False).distinct()

    def get_upcoming_matches(self):
        return Match.objects.filter(tournament=self.tournament, sets__played_at__isnull=True).distinct()

    def calculate_standings(self):
        bracket = []
        max_round = Match.objects.filter(tournament=self.tournament).aggregate(models.Max('round'))['round__max']
        for round_num in range(1, max_round + 1):
            matches = Match.objects.filter(tournament=self.tournament, round=round_num)
            round_data = [
                {
                    'team1': match.team1.name,
                    'team2': match.team2.name,
                    'score_team1': self.calculate_match_score(match, 'team1'),
                    'score_team2': self.calculate_match_score(match, 'team2')
                }
                for match in matches
            ]
            bracket.append({'round': round_num, 'matches': round_data})
        return bracket

    def calculate_match_score(self, match, team):
        team1_wins = sum(1 for set in match.sets.all() if set.score_team1 > set.score_team2)
        team2_wins = sum(1 for set in match.sets.all() if set.score_team2 > set.score_team1)
        return team1_wins if team == 'team1' else team2_wins
