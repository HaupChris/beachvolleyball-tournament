import random

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tournament, Team, Match, Player, Court
from .serializers import TournamentSerializer, TeamSerializer, MatchSerializer

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    def perform_create(self, serializer):
        # Generate a 4-digit PIN
        generated_pin = str(random.randint(1000, 9999))
        ## TODO: remove this. is for testing only
        generated_pin = 1337

        # Save the tournament with the generated PIN
        tournament = serializer.save(password=generated_pin)

        # Return the tournament data along with the generated PIN
        return tournament

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tournament = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Include the generated password (PIN) in the response
        response_data = serializer.data
        response_data['password'] = tournament.password

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def update_all(self, request, pk=None):
        tournament = self.get_object()

        # Update tournament fields (excluding courts and teams)
        tournament_data = request.data.get('tournament')
        for field, value in tournament_data.items():
            setattr(tournament, field, value)
        tournament.save()

        # Update courts
        courts_data = request.data.get('courts', [])
        for idx, court_name in enumerate(courts_data):
            court, created = Court.objects.get_or_create(tournament=tournament, id=idx + 1)
            court.name = court_name
            court.save()

        # Update team players
        teams_data = request.data.get('teams', [])
        for team_idx, players_data in enumerate(teams_data):
            team = Team.objects.filter(tournament=tournament)[team_idx]
            for player_idx, player_name in enumerate(players_data):
                first_name, last_name = player_name.split(" ")
                player, created = Player.objects.get_or_create(team=team, id=player_idx + 1)
                player.first_name = first_name
                player.last_name = last_name
                player.save()

        return Response({'message': 'Tournament, courts, and players updated successfully.'})

    @action(detail=True, methods=['post'])
    def validate_pin(self, request, pk=None):
        tournament = self.get_object()
        entered_pin = request.data.get('pin')
        if tournament.password == entered_pin:
            return Response({'message': 'PIN korrekt'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'PIN falsch'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def generate_schedule(self, request, pk=None):
        tournament = self.get_object()
        print("generating schedule")
        try:
            tournament.generate_schedule()
            return Response({"message": "Spielplan erfolgreich generiert."}, status=status.HTTP_200_OK)
        except Exception as e:

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'])
    def delete_tournament(self, request, pk=None):
        try:
            tournament = self.get_object()
            tournament.delete()
            return Response({'message': 'Tournament deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Tournament.DoesNotExist:
            return Response({'error': 'Tournament not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def start_tournament(self, request, pk=None):
        tournament = self.get_object()
        if tournament.status == 'started':
            Response({'message': 'Tournament has already been started successfully.'})
        tournament.start_tournament()  # Locks the settings and generates schedule
        return Response({'message': 'Tournament started successfully.'})

    @action(detail=True, methods=['get'])
    def tournament_state(self, request, pk=None):
        tournament = self.get_object()

        # Serialize played and upcoming matches
        played_matches = [
            {
                'team1': match.team1.name,
                'team2': match.team2.name,
                'sets': [{'score_team1': set.score_team1, 'score_team2': set.score_team2} for set in match.sets.all()],
                'final_score': self.calculate_final_score(match)
            }
            for match in tournament.get_played_matches()
        ]

        upcoming_matches = [
            {
                'team1': match.team1.name,
                'team2': match.team2.name,
                'round': match.round,
            }
            for match in tournament.get_upcoming_matches()
        ]

        current_state = tournament.get_current_state()

        return Response({
            'played_matches': played_matches,
            'upcoming_matches': upcoming_matches,
            'current_state': current_state,
        })

    def calculate_final_score(self, match):
        team1_wins = sum(1 for set in match.sets.all() if set.score_team1 > set.score_team2)
        team2_wins = sum(1 for set in match.sets.all() if set.score_team2 > set.score_team1)
        return f"{team1_wins} - {team2_wins}"


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
