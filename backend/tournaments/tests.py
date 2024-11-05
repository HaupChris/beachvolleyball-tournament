from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Tournament, Team, Player


class TournamentCreationTests(APITestCase):

    def test_create_tournament_with_teams_and_players(self):
        # Define test data for a new tournament
        tournament_data = {
            "name": "Test Tournament",
            "players_per_team": 2,
            "sets_to_win": 3,
            "points_per_set": 21,
            "mode": "single_elimination"
        }

        # Define teams and players data
        teams_data = [
            {"name": "Team A", "players": ["Alice Anderson", "Aaron Avery"]},
            {"name": "Team B", "players": ["Bob Brown", "Bill Bates"]}
        ]

        # Merge teams and tournament data
        tournament_data['teams'] = teams_data

        # Send POST request to create a new tournament
        response = self.client.post(reverse('tournament-list'), tournament_data, format='json')

        # Ensure the tournament was created successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Retrieve the tournament to check its attributes
        tournament = Tournament.objects.get(name="Test Tournament")
        self.assertEqual(tournament.players_per_team, 2)
        self.assertEqual(tournament.sets_to_win, 3)
        self.assertEqual(tournament.points_per_set, 21)

        # Check that teams were created and are linked to the tournament
        teams = Team.objects.filter(tournament=tournament)
        self.assertEqual(teams.count(), 2)

        # Check that players were created for each team
        for team_data in teams_data:
            team = Team.objects.get(name=team_data["name"], tournament=tournament)
            players = Player.objects.filter(team=team)
            self.assertEqual(players.count(), tournament.players_per_team)

            # Verify player names match the data
            for player_name, player_obj in zip(team_data["players"], players):
                first_name, last_name = player_name.split()
                self.assertEqual(player_obj.first_name, first_name)
                self.assertEqual(player_obj.last_name, last_name)

