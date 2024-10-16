from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tournaments', views.TournamentViewSet)
router.register(r'teams', views.TeamViewSet)
router.register(r'matches', views.MatchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
