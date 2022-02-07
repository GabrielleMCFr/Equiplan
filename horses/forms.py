from django import forms
from django.db.models.fields import DateField
from django.forms.models import ModelForm
from .models import Breeding, Contest, Dentistry, Bred, Dewormer, Farriery, Gestation, Heats, Incident, Inventory, Osteopathy, Repertory, User, Horse, Vaccine, Dates
from datetime import datetime
from django.contrib.admin import widgets
from django.core.exceptions import ValidationError
from django.conf import settings


class NewPic(ModelForm):
    class Meta:
        model = User
        fields = ['picture']
        labels = { 'picture' : 'Sélectionnez votre image de profil (inférieure à 2,5 Mo) :'}


class NewHorsePic(ModelForm):
    class Meta:
        model = Horse
        fields = ['picture']
        labels = { "picture" : "Sélectionnez l'avatar de votre cheval :"}


class NewVax(forms.ModelForm):   
    class Meta:
        model = Vaccine
        fields = ['kind', 'date', 'next']
        labels = { 
            "kind" : "Type : ",
            "date" : "Date : ",
            "next" : "Rappel :"}
        widgets= {        
            "next" : forms.SelectDateWidget(years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
            "date" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }

class NewFarriery (forms.ModelForm):

    class Meta:
        model = Farriery
        fields = ['date', 'farrier', 'type']
        labels = { 
            "farrier" : "Maréchal : ",
            "date" : "Date : ",
            "type" : "Type de ferrure et notes : "}
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewDentistry (forms.ModelForm) :
    class Meta:
        model = Dentistry
        fields = ['date', 'dentist', 'diagnostic']
        labels = { 
            "dentist" : "Dentiste : ",
            "date" : "Date : ",
            "diagnostic" : "Diagnostic : "}
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(1995, datetime.today().year+2), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewContest (forms.ModelForm):
    class Meta:
        model = Contest
        fields = ['date', 'rider', 'discipline', 'division', 'result', 'place']
        labels = {
            "date" : "Date : ",
            "rider" : "Cavalier : ",
            "discipline" : "Discipline : ",
            "division" : "Epreuve : ",
            "place" : "Lieu : ",
            "result" : "Résultats : ",
        }
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewIncident (forms.ModelForm):
    class Meta:
        model = Incident
        fields = ['date', 'reason', 'diagnostic', 'vet', 'prescription', 'notes']
        labels = {
            "date" : "Date : ",
            "reason" : "Motif : ",
            "vet" : "Vétérinaire ou autre intervenant : ",
            "diagnostic" : "Diagnostic : ",
            "prescription" : "Prescription : ",
            "notes" : "Notes : ",

        }
        widgets= {        
            "date" : forms.SelectDateWidget(years=range(2000, datetime.today().year+2), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewBreedStallion (forms.ModelForm):
    class Meta:
        model = Breeding
        fields = ['date', 'mare', 'notes']
        labels = {
            "date" : "Date : ",
            "mare" : "Jument : ",
            "notes" : "Notes : ",
        }
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2010, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }



class NewBredMare (forms.ModelForm):
    class Meta:
        model = Bred
        fields = ['date', 'stallion', 'notes']
        labels = {
            "date" : "Date : ",
            "stallion" : "Etalon : ",
            "notes" : "Notes : ",
        }
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2010, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewHeat (forms.ModelForm):
    class Meta:
        model = Heats
        fields = ['datestart', 'dateend']
        labels = {
            'datestart' : 'Date de début des chaleurs : *',
            'dateend' : 'Date de fin des chaleurs : ',
        }
        widgets= {        
            "datestart" : forms.SelectDateWidget( years=range(2010, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
            "dateend" : forms.SelectDateWidget( years=range(2010, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewGestation (forms.ModelForm):
    class Meta :
        model = Gestation
        fields = ['datestart', 'vet', 'echo1', 'echo2', 'echo3', 'notes']
        labels = {
                'datestart' : 'Date de début de la gestation (le terme sera calculé 340 jours après la date indiquée) : ',
                'vet' : 'Vétérinaire : ',
                'echo1' : 'Echographie de contrôle : ',
                'echo2' : 'Seconde échographie : ',
                'echo3' : 'Troisième échographie : ',
                'notes' : 'Notes : ',
            }
        widgets= {        
                "datestart" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
                "dateend" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
                "echo1" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
                "echo2" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
                "echo3" : forms.SelectDateWidget( years=range(2000, 2031), attrs={'style': 'display: inline-block; width: 5%;'}),
            }


class NewOsteo (forms.ModelForm):
    class Meta:
        model = Osteopathy
        fields = ['date', 'osteo', 'diagnostic', 'reeducation']
        labels = {
            "date" : "Date : ",
            "osteo" : "Ostéopathe : ",
            "diagnostic" : "Diagnostic : ",
            "reeducation" : "Rééducation : "
        }
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2000, datetime.today().year+2), attrs={'style': 'display: inline-block; width: 5%;'}),
        }


class NewDewormer (forms.ModelForm):

    class Meta:
        model = Dewormer
        fields = ['name', 'molecule', 'date', 'nextname', 'nextdate']
        labels = {
            "name" : "Nom du vermifuge :",
            "molecule" : "Molécule :",
            "date" : "Date :",
            "nextname" : "Nom du prochain vermifuge :",
            "nextdate" : "Date du prochain vermifuge :"
        }
        widgets= {        
            "date" : forms.SelectDateWidget( years=range(2010, 2035), attrs={'style': 'display: inline-block; width: 5%;'}),
            "nextdate" : forms.SelectDateWidget( years=range(2010, 2035), attrs={'style': 'display: inline-block; width: 5%;'}),
        }

        
class NewContact (forms.ModelForm):

    class Meta:
        model = Repertory
        fields = ['name', 'address', 'email', 'job', 'nb', 'tab']
        labels = { 
            "name" : "Nom/prénom",
            "address" : "Adresse",
            "email": "Email",
            "job" : "Profession",
            "nb" : "Numéro de téléphone",
            "tab" : "Dette"}


class NewItem(forms.ModelForm):

    class Meta:
        model = Inventory
        fields = ['name', 'molecule', 'quantity', 'dateend', 'lot']
        labels = { 
            "name" : "Nom du produit ",
            "molecule" : "Molécule(s) ",
            "quantity" : "Quantité disponible",
            "dateend": "Date de péremption",
            'lot' : 'Numéro de lot',
            }
        widgets= {        
            "dateend" : forms.SelectDateWidget(years=range(datetime.today().year, datetime.today().year+20), attrs={'style': 'display: inline-block; width: 5%;'}),
           }



class NewHorse(ModelForm):
    class Meta:
        model = Horse
        fields = ['name', 'age', 'sex', 'breed', 'coat', 'ifce', 'ueln', 'sire', 'dam', 'siresire', 'siredam', 'damsire', 'damdam', 'tests', 'picture', 'notes']
        labels = {
            'Name': 'Nom :',
            'sex' : 'Sexe :',
            'age' : "Année de naissance (comprise entre 1950 et l'année actuelle) :",
            'breed' : 'Race :',
            'coat' : 'Robe :',
            'ifce' : 'N SIRE :',
            'ueln' : 'Transpondeur :',
            'sire' : 'Père :',
            'dam' : 'Mère :',
            'siresire' : 'Père de père :',
            'siredam': 'Mère de père :',
            'damsire' : 'Père de mère',
            'damdam' : 'Mère de mère :',
            'tests' : "Tests effectués :",
            'picture' : 'Photo :',
            'notes' : 'Notes :'
        }
    
