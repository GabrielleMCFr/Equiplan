# Generated by Django 3.2.4 on 2021-11-07 21:08

from django.db import migrations
import django_resized.forms


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0028_alter_horse_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='horse',
            name='picture',
            field=django_resized.forms.ResizedImageField(blank=True, crop=None, force_format=None, keep_meta=True, quality=0, size=[200, 200], upload_to='horses'),
        ),
    ]