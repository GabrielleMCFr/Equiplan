# Generated by Django 3.2.4 on 2021-10-27 17:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0010_auto_20211027_1911'),
    ]

    operations = [
        migrations.AlterField(
            model_name='horse',
            name='yearofbirth',
            field=models.PositiveSmallIntegerField(default=2021),
        ),
    ]
