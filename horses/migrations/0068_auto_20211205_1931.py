# Generated by Django 3.2.4 on 2021-12-05 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0067_remove_gestation_foal'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gestation',
            name='dateend',
            field=models.DateField(blank=True, null=True),
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
        migrations.AlterField(
            model_name='gestation',
            name='realend',
            field=models.DateField(blank=True, null=True),
        ),
    ]
