# Generated by Django 3.2.4 on 2021-11-04 21:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0021_alter_horse_age'),
    ]

    operations = [
        migrations.AddField(
            model_name='horse',
            name='sex',
            field=models.CharField(choices=[('F', 'Jument'), ('M', 'Entier'), ('H', 'Hongre'), ('S', 'Etalon')], default='F', max_length=1),
        ),
    ]
