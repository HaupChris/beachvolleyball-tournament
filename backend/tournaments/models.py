# tournament/models.py

from django.db import models
from django.utils import timezone
import random

class Tournament(models.Model):
    MODE_CHOICES = [
        ('single_elimination', 'Single Elimination'),
        ('double_elimination', 'Double Elimination'),
        ('group_elimination', 'Group Elimination'),
        ('swiss', 'Swiss'),
        ('round_robin_once', 'Round Robin Once'),
        ('round_robin_twice', 'Round Robin Twice'),
    ]

    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('started', 'Started'),
        ('finished', 'Finished'),
    ]

    name = models.CharField(max_length=255)
    estimated_time_per_match_in_minutes = models.PositiveIntegerField(default=30)
    planned_start_time = models.DateTimeField(null=True, blank=True)
    num_players_per_team = models.PositiveIntegerField(default=2)
    num_sets_to_win_a_match = models.PositiveIntegerField(default=2)
    points_per_set = models.PositiveIntegerField(default=21)
    created_at = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=10)
    mode = models.CharField(max_length=50, choices=MODE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')

    def __str__(self):
        return self.name

    def generate_pin(self):
        self.password = str(random.randint(1000, 9999))
        self.save()

    def start_tournament(self):
        if self.status == 'planned':
            self.status = 'started'
            self.lock_settings()
            self.generate_schedule()
            self.save()

    def lock_settings(self):
        # Implement logic to lock settings
        pass

    def generate_schedule(self):
        # Implement logic to generate schedule based on the selected mode
        pass

    def get_played_matches(self):
        return self.matches.filter(status='finished')

    def get_upcoming_matches(self):
        return self.matches.filter(status='scheduled')

    def get_current_state(self):
        # Implement logic to get the current state of the tournament
        pass

class Court(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='courts', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Team(models.Model):
    tournament = models.ForeignKey(Tournament, related_name='teams', on_delete=models.CASCADE)

    def __str__(self):
        return f"Team {self.id} - {self.tournament.name}"

class Player(models.Model):
    team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    skill_level = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Match(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('finished', 'Finished'),
    ]

    tournament = models.ForeignKey(Tournament, related_name='matches', on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, related_name='team1_matches', on_delete=models.CASCADE)
    team2 = models.ForeignKey(Team, related_name='team2_matches', on_delete=models.CASCADE)
    court = models.ForeignKey(Court, related_name='matches', on_delete=models.SET_NULL, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    round = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

    def __str__(self):
        return f"{self.team1} vs {self.team2} - {self.tournament.name}"

class Set(models.Model):
    match = models.ForeignKey(Match, related_name='sets', on_delete=models.CASCADE)
    set_number = models.PositiveIntegerField()
    score_team1 = models.PositiveIntegerField(default=0)
    score_team2 = models.PositiveIntegerField(default=0)
    played_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('match', 'set_number')

    def __str__(self):
        return f"Set {self.set_number} of Match {self.match.id}"
