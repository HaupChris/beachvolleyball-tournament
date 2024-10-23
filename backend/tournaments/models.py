from django.db import models

class Tournament(models.Model):
    MODES = [
        ('round_robin', 'Jeder-gegen-jeden'),
        ('knockout', 'K.-o.-System'),
    ]

    name = models.CharField(max_length=100)
    players_per_team = models.IntegerField(default=2)
    sets_to_win = models.IntegerField()
    points_per_set = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    def generate_schedule(self):
        if self.mode == 'round_robin':
            planner = RoundRobinMode()
        elif self.mode == 'knockout':
            planner = KnockoutMode()
        planner.generate_schedule(self)


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
    score_team1 = models.IntegerField(default=0)
    score_team2 = models.IntegerField(default=0)
    played_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.team1.name} vs {self.team2.name}"


class TournamentMode:
    def generate_schedule(self, tournament):
        raise NotImplementedError("This method should be overridden by subclasses.")

class RoundRobinMode(TournamentMode):
    """ Jeder-gegen-jeden-Modus """
    def generate_schedule(self, tournament):
        teams = Team.objects.filter(tournament=tournament)
        matches = []
        # Runde jeder gegen jeden
        for i in range(len(teams)):
            for j in range(i + 1, len(teams)):
                match = Match(tournament=tournament, team1=teams[i], team2=teams[j])
                matches.append(match)
        Match.objects.bulk_create(matches)

class KnockoutMode(TournamentMode):
    """ K.-o.-System """
    def generate_schedule(self, tournament):
        teams = Team.objects.filter(tournament=tournament)
        # Einfacher K.-o.-Modus
        matches = []
        while len(teams) > 1:
            match = Match(tournament=tournament, team1=teams.pop(0), team2=teams.pop(0))
            matches.append(match)
        Match.objects.bulk_create(matches)
