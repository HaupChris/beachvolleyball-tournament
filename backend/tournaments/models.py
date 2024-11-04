from django.db import models


class Tournament(models.Model):

    MODES = [
        ('single_elimination', 'Single Elimination'),
        ('double_elimination', 'Double Elimination'),
        ('group_elimination', 'Gruppenphase + KO-Runde'),
        ('swiss', 'Schweitzer System'),
        ('round_robin_once', 'Jeder gegen Jeden nur Hinrude'),
        ('round_robin_twice', 'Jeder gegen Jeden Hin- und Rückrunde'),
    ]

    STATUSES = [
        ('planned', 'Planned'),
        ('started', 'Started'),
        ('finished', 'Finished'),
    ]

    name = models.CharField(max_length=100)
    players_per_team = models.IntegerField(default=2)
    sets_to_win = models.IntegerField()
    points_per_set = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=100)
    mode = models.CharField(max_length=50, choices=MODES)
    status = models.CharField(max_length=10, choices=STATUSES, default='planned')

    def start_tournament(self):
        if self.status == 'planned':
            self.status = 'started'
            self.save()
            self.generate_schedule()

    def __str__(self):
        return self.name

    def generate_schedule(self):
        if self.mode == 'single_elimination':
            SingleEliminationScheduler().generate_schedule(self)
        elif self.mode == 'double_elimination':
            DoubleEliminationScheduler().generate_schedule(self)
        elif self.mode == 'group_elimination':
            GroupEliminationScheduler().generate_schedule(self)
        elif self.mode == 'swiss':
            SwissScheduler().generate_schedule(self)
        elif self.mode == 'round_robin_once':
            RoundRobinScheduler(facing_twice=False).generate_schedule(self)
        elif self.mode == 'round_robin_twice':
            RoundRobinScheduler(facing_twice=True).generate_schedule(self)

    def get_played_matches(self):
        return Match.objects.filter(tournament=self)

    def get_upcoming_matches(self):
        return Match.objects.filter(tournament=self)

    def get_current_state(self):
        if self.mode in ['round_robin_once', 'round_robin_twice']:
            return self.get_round_robin_table()
        elif self.mode == 'swiss':
            return self.get_swiss_table()
        elif self.mode == 'group_elimination':
            return {
                'groups': self.get_group_tables(),
                'bracket': self.get_elimination_bracket()
            }
        elif self.mode in ['single_elimination', 'double_elimination']:
            return self.get_elimination_bracket()
        return {}

    def get_round_robin_table(self):
        teams = Team.objects.filter(tournament=self)
        standings = []
        for team in teams:
            matches = Match.objects.filter(tournament=self).filter(
                models.Q(team1=team) | models.Q(team2=team)
            )
            wins = matches.filter(models.Q(team1=team, score_team1__gt=models.F('score_team2')) |
                                  models.Q(team2=team, score_team2__gt=models.F('score_team1'))).count()
            losses = matches.count() - wins
            standings.append({'team': team.name, 'wins': wins, 'losses': losses})
        standings.sort(key=lambda x: (-x['wins'], x['losses']))
        return standings#

    def get_group_tables(self):
        groups = {}
        for group_num in range(1, 5):  # Example: 4 groups
            group_teams = Team.objects.filter(tournament=self, group=group_num)
            standings = self.get_round_robin_table()  # Reuse the round robin structure
            groups[f'Group {group_num}'] = standings
        return groups

    def get_elimination_bracket(self):
        bracket = []
        max_round = Match.objects.filter(tournament=self).aggregate(models.Max('round'))['round__max']
        for round_num in range(1, max_round + 1):
            matches = Match.objects.filter(tournament=self, round=round_num)
            round_data = [
                {
                    'team1': match.team1.name,
                    'team2': match.team2.name,
                    'score_team1': match.score_team1,
                    'score_team2': match.score_team2,
                }
                for match in matches
            ]
            bracket.append({'round': round_num, 'matches': round_data})
        return bracket


class SingleEliminationScheduler:
    def generate_schedule(self, tournament):
        teams = list(Team.objects.filter(tournament=tournament))
        matches = []
        round_num = 1

        while len(teams) > 1:
            next_round_teams = []
            for i in range(0, len(teams), 2):
                if i + 1 < len(teams):
                    match = Match.objects.create(
                        tournament=tournament,
                        team1=teams[i],
                        team2=teams[i + 1],
                        round=round_num
                    )
                    next_round_teams.append(match)  # Winner goes to next round
                else:
                    # If odd team count, automatically advance the last team
                    next_round_teams.append(teams[i])

            teams = next_round_teams
            round_num += 1

        # Championship match
        Match.objects.bulk_create(matches)


class DoubleEliminationScheduler:
    def generate_schedule(self, tournament):
        teams = list(Team.objects.filter(tournament=tournament))
        winners_bracket = teams
        losers_bracket = []
        round_num = 1

        while len(winners_bracket) + len(losers_bracket) > 1:
            next_round_winners = []
            next_round_losers = []

            for i in range(0, len(winners_bracket), 2):
                if i + 1 < len(winners_bracket):
                    match = Match.objects.create(
                        tournament=tournament,
                        team1=winners_bracket[i],
                        team2=winners_bracket[i + 1],
                        round=round_num,
                        bracket="winners"
                    )
                    next_round_winners.append(match)

            for i in range(0, len(losers_bracket), 2):
                if i + 1 < len(losers_bracket):
                    match = Match.objects.create(
                        tournament=tournament,
                        team1=losers_bracket[i],
                        team2=losers_bracket[i + 1],
                        round=round_num,
                        bracket="losers"
                    )
                    next_round_losers.append(match)

            winners_bracket = next_round_winners
            losers_bracket = next_round_losers
            round_num += 1

class GroupEliminationScheduler:
    def generate_schedule(self, tournament):
        teams = list(Team.objects.filter(tournament=tournament))
        num_groups = 4  # Example: Divide teams into 4 groups
        group_size = len(teams) // num_groups
        groups = [teams[i:i + group_size] for i in range(0, len(teams), group_size)]

        # Group Stage - Round Robin within each group
        for group_num, group in enumerate(groups):
            for i in range(len(group)):
                for j in range(i + 1, len(group)):
                    Match.objects.create(
                        tournament=tournament,
                        team1=group[i],
                        team2=group[j],
                        round=1,
                        group=group_num
                    )

        # Elimination Stage - Top teams advance
        advancing_teams = [group[0] for group in groups]  # Example: top team from each group
        SingleEliminationScheduler().generate_schedule_for_teams(tournament, advancing_teams)


class SwissScheduler:
    def generate_schedule(self, tournament):
        teams = list(Team.objects.filter(tournament=tournament))
        num_rounds = 5  # Example: 5 rounds
        matches = []

        for round_num in range(1, num_rounds + 1):
            for i in range(0, len(teams), 2):
                if i + 1 < len(teams):
                    matches.append(Match(
                        tournament=tournament,
                        team1=teams[i],
                        team2=teams[i + 1],
                        round=round_num
                    ))
            teams.sort(key=lambda team: team.wins)  # Sort by wins for pairing in next round

        Match.objects.bulk_create(matches)


class RoundRobinScheduler:
    def __init__(self, facing_twice=False):
        self.facing_twice = facing_twice

    def generate_schedule(self, tournament):
        teams = list(Team.objects.filter(tournament=tournament))
        matches = []

        for i in range(len(teams)):
            for j in range(i + 1, len(teams)):
                matches.append(Match(
                    tournament=tournament,
                    team1=teams[i],
                    team2=teams[j],
                    round=1
                ))
                if self.facing_twice:
                    # Add reverse match if each team faces each other twice
                    matches.append(Match(
                        tournament=tournament,
                        team1=teams[j],
                        team2=teams[i],
                        round=1
                    ))

        Match.objects.bulk_create(matches)


class Team(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='teams', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Court(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='courts', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

class Player(models.Model):
    team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    skill_level = models.IntegerField(default=1)

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='matches', on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, related_name='team1_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(Team, related_name='team2_matches', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.team1.name} vs {self.team2.name}"

class Set(models.Model):
    match = models.ForeignKey(Match, related_name='sets', on_delete=models.CASCADE)
    score_team1 = models.IntegerField(default=0)
    score_team2 = models.IntegerField(default=0)
    played_at = models.DateTimeField(null=True, blank=True)

class TournamentMode:
    def generate_schedule(self, tournament):
        raise NotImplementedError("This method should be overridden by subclasses.")


