# Generated by Django 3.2.4 on 2021-11-28 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0057_auto_20211127_2340'),
    ]

    operations = [
        migrations.AddField(
            model_name='incident',
            name='reason',
            field=models.CharField(default='Non spécifié', max_length=50),
        ),
        migrations.AlterField(
            model_name='gestation',
            name='echo1',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='gestation',
            name='echo2',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='gestation',
            name='echo3',
            field=models.DateField(blank=True, null=True),
        ),
    ]