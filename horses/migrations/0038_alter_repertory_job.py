# Generated by Django 3.2.4 on 2021-11-09 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0037_alter_repertory_tab'),
    ]

    operations = [
        migrations.AlterField(
            model_name='repertory',
            name='job',
            field=models.CharField(choices=[('Maréchal', 'Maréchal'), ('Vétérinaire', 'Vétérinaire'), ('Osthéopathe', 'Osthéopathe'), ('Inséminateur', 'Inséminateur'), ('Autre', 'Autre'), ('Cavalier professionnel', 'Cavalier professionnel'), ('Fournisseur', 'Fournisseur'), ('Acupuncteur', 'Acupuncteur'), ('Masseur', 'Masseur'), ('Eleveur', 'Eleveur'), ('Moniteur', 'Moniteur'), ('Dentiste', 'Dentiste')], default='other', max_length=30),
        ),
    ]