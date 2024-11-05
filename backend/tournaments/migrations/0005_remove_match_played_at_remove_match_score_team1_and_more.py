# Generated by Django 5.1.2 on 2024-11-05 17:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0004_tournament_mode_tournament_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='match',
            name='played_at',
        ),
        migrations.RemoveField(
            model_name='match',
            name='score_team1',
        ),
        migrations.RemoveField(
            model_name='match',
            name='score_team2',
        ),
        migrations.AlterField(
            model_name='tournament',
            name='status',
            field=models.CharField(choices=[('planned', 'Planned'), ('started', 'Started'), ('finished', 'Finished')], default='planned', max_length=10),
        ),
        migrations.CreateModel(
            name='Set',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score_team1', models.IntegerField(default=0)),
                ('score_team2', models.IntegerField(default=0)),
                ('played_at', models.DateTimeField(blank=True, null=True)),
                ('match', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sets', to='tournaments.match')),
            ],
        ),
    ]