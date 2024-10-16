# Generated by Django 5.1.2 on 2024-10-16 15:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('number_of_teams', models.IntegerField()),
                ('sets_to_win', models.IntegerField()),
                ('points_per_set', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('password', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='teams', to='tournaments.tournament')),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score_team1', models.IntegerField(default=0)),
                ('score_team2', models.IntegerField(default=0)),
                ('played_at', models.DateTimeField(blank=True, null=True)),
                ('team1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team1_matches', to='tournaments.team')),
                ('team2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='team2_matches', to='tournaments.team')),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='matches', to='tournaments.tournament')),
            ],
        ),
    ]