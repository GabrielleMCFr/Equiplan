# Generated by Django 3.2.4 on 2021-11-07 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0024_auto_20211107_1449'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='firstname',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='user',
            name='lastname',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
