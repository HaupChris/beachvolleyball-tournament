import random

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tournament, Team, Match
from .serializers import TournamentSerializer, TeamSerializer, MatchSerializer

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    def perform_create(self, serializer):
        # Generate a 4-digit PIN
        generated_pin = str(random.randint(1000, 9999))

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
    def generate_schedule(self, request, pk=None):
        tournament = self.get_object()
        print("generating schedule")
        try:
            tournament.generate_schedule()
            return Response({"message": "Spielplan erfolgreich generiert."}, status=status.HTTP_200_OK)
        except Exception as e:

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
