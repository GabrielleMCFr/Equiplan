# Generated by Django 3.2.4 on 2021-12-18 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('horses', '0081_alter_horse_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='horse',
            name='picture',
            field=models.CharField(choices=[('1', 'Cheval'), ('2', 'Cheval rose'), ('3', 'Ane'), ('4', 'Cheval bai foncé'), ('5', 'Cheval bai'), ('6', 'Cheval alezan'), ('7', 'Cheval noir'), ('8', 'Cheval gris'), ('9', 'Cheval palomino'), ('10', 'Poulet'), ('11', 'Oiseau'), ('12', 'Dindon'), ('13', 'Vache'), ('14', 'Phoque'), ('15', 'Bulldog'), ('16', 'Chien'), ('17', 'Chien gris'), ('18', 'Chat gris'), ('19', 'Chat'), ('20', 'Baleine'), ('21', 'Cochon'), ('22', 'Tortue'), ('23', 'Meduse'), ('24', 'Pieuvre'), ('25', 'Non spécifié')], default='25', max_length=20),
        ),
    ]
