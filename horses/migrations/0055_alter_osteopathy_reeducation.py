# Generated by Django 3.2.4 on 2021-11-27 22:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0054_auto_20211127_2331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='osteopathy',
            name='reeducation',
            field=models.TextField(blank=True, max_length=2000),
        ),
    ]
