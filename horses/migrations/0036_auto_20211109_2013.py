# Generated by Django 3.2.4 on 2021-11-09 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0035_dates'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventory',
            name='empty',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='inventory',
            name='over',
            field=models.BooleanField(default=False),
        ),
    ]
