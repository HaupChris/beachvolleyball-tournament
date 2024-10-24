# Generated by Django 5.1.2 on 2024-10-23 16:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0002_tournament_number_of_courts_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='team',
            name='name',
        ),
        migrations.RemoveField(
            model_name='tournament',
            name='number_of_courts',
        ),
        migrations.RemoveField(
            model_name='tournament',
            name='number_of_teams',
        ),
        migrations.AddField(
            model_name='player',
            name='skill_level',
            field=models.IntegerField(default=1),
        ),
    ]
