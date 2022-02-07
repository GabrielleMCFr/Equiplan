from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date, datetime, timedelta, timezone
from django.core.files.storage import FileSystemStorage
from django.db.models.fields.files import ImageField
from django_resized import ResizedImageField
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

#year
yearnow = datetime.now().year

# Create your models here.
fs = FileSystemStorage(location='/media/profiles')


class User(AbstractUser):

   AVATAR_USER = [
        ('Femme', 'Femme'),
        ('Homme', 'Homme'),
        ('Non spécifié', 'Non spécifié')
   ]

   firstname= models.CharField(max_length=30, blank=True)
   lastname= models.CharField(max_length=30, blank=True)
   address = models.CharField(max_length=500, blank=True)
   job = models.CharField(max_length=50, blank=True)
   active = models.BooleanField(default=False)
   picture = models.CharField(max_length=15, choices=AVATAR_USER, default="Non spécifié")
   created = models.DateTimeField(default=datetime.now)
   notifications = models.BooleanField(default=False)


   def serialize(self):
      return {
         "id": self.id,
         "username": self.username,
         "firstname": self.firstname,
         "lastname" : self.lastname,
         "email": self.email,
         "address" : self.address,
         "job" : self.job,
      }
  
   def __str__(self):
        return f"{self.username}: {self.firstname} {self.lastname}"


class Horse(models.Model):
   SEX_CHOICES = [
      ('Jument', 'Jument'),
    ('Entier', 'Entier'),
    ('Hongre', 'Hongre'),
    ('Etalon', 'Etalon'),
   ]
   
   AVATAR_CHOICES = [
      
      ('1', 'Cheval'),
      ('2', 'Cheval rose'),
      ('3', 'Ane'),
      ('4', 'Cheval bai foncé'),
      ('5', 'Cheval bai'),
      ('6', 'Cheval alezan'),
      ('7', 'Cheval noir'),
      ('8', 'Cheval gris'),
      ('9', 'Cheval palomino'),
      ('10', 'Poulet'),
      ('11', 'Oiseau'),
      ('12', 'Dindon'),
      ('13', 'Vache'),
      ('14', 'Phoque'),
      ('15', 'Bulldog'),
      ('16', 'Chien'),
      ('17', 'Chien gris'),
      ('18', 'Chat gris'),
      ('19', 'Chat'),
      ('20', 'Baleine'),
      ('21', 'Cochon'),
      ('22', 'Tortue'),
      ('23', 'Meduse'),
      ('24', 'Pieuvre'),
      ('25', 'Non spécifié')
   ]

   name = models.CharField(max_length=80)
   sex = models.CharField(max_length=6, choices=SEX_CHOICES, default='Hongre')
   notes = models.TextField(max_length=5000, blank=True)
   breed = models.CharField(max_length=100, blank=True)
   coat = models.CharField(max_length=100, blank = True)
   owner = models.ForeignKey("User", on_delete=models.CASCADE, related_name="ownedby")
   age = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MinValueValidator(1950), MaxValueValidator(yearnow)])
   ifce = models.CharField(max_length=9, blank=True)
   ueln = models.CharField(max_length=15, blank=True)
   sire = models.CharField(max_length=80, blank=True) 
   siresire = models.CharField(max_length=80, blank=True)
   siredam = models.CharField(max_length=80, blank=True)
   dam = models.CharField(max_length=80, blank=True)
   damsire = models.CharField(max_length=80, blank=True)
   damdam = models.CharField(max_length=80, blank=True)
   tests = models.CharField(max_length=80, blank=True)
   picture = models.CharField(max_length=20, default='25', choices=AVATAR_CHOICES)

   def serialize(self):
      return {
         "id" : self.id,
         "name" : self.name,
         "sex" : self.sex,
         "notes": self.notes,
         "breed": self.breed,
         "coat": self.coat,
         "age": self.age,
         "ifce": self.ifce,
         "ueln": self.ueln,
         "sire": self.sire,
         "siresire": self.siresire,
         "siredam": self.siredam,
         "dam": self.dam,
         "damsire": self.damsire,
         "damdam": self.damdam,
         "tests": self.tests,
      }

   def __str__(self):
        return f"{self.name}, {self.breed}, {self.age}"


class Vaccine(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="vaxowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="vaxhorse")
   kind = models.CharField(max_length=200, default="T/G")
   date = models.DateField(default=datetime.today) 
   next = models.DateField(blank=True, null=True) # default : next year ? or calculate if TG, Rh ..
   notified1 = models.BooleanField(default=False)
   notified2 = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.kind}: {self.horse.name} {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "kind" : self.kind,
         "date" : self.date,
         "next" : self.next
      }

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Vaccine, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre de 2030.")
      if self.next != None:
         if self.next <= date(2000, 1, 1) or self.next >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")


   @property
   def next_is_valid(self):
      return self.date < self.next


class Incident(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="incowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="inchorse")
   diagnostic = models.TextField(max_length=1000, blank=True)
   date = models.DateField(default=datetime.today)
   prescription = models.TextField(max_length=2000, blank=True)
   notes = models.TextField(max_length=3000, blank=True)
   vet = models.CharField(max_length=150, default="Non spécifié")
   reason = models.CharField(max_length=50, default="Non spécifié")


   def clean(self, *args, **kwargs):
      # run the base validation
      super(Incident, self).clean(*args, **kwargs)
      actualyear = datetime.now().year
      year = actualyear+1
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(year, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre de l'année suivante.")
      
   def __str__(self):
        return f"{self.horse.name}: {self.diagnostic} {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "diagnostic" : self.diagnostic,
         "date": self.date,
         "vet" : self.vet,
         "reason" : self.reason,
         "prescription" : self.prescription,
         "horse" : self.horse.id,
         "userid" : self.user.id,
         "notes" : self.notes,
      } 


class Contest(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="contowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="conthorse")
   rider = models.CharField(max_length=40, blank=True)
   discipline = models.CharField(max_length=10, blank=True)
   division = models.CharField(max_length=20, blank = True)
   date = models.DateField(default=datetime.today)
   result = models.CharField(max_length=15, blank=True)
   place = models.CharField(max_length=80, default="Non spécifié")
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name} with {self.rider.username} : {self.discipline}, {self.date}"
   
   def serialize(self):
      return {
         "id" : self.id,
         "discipline" : self.discipline,
         "date": self.date,
         "rider" : self.rider,
         "division" : self.division,
         "horse" : self.horse.id,
         "userid" : self.user.id,
         "result" : self.result,
         "place" : self.place
      } 

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Contest, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")


class Osteopathy(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="ostowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="osthorse")
   osteo = models.CharField(max_length=200, default="Non spécifié")
   diagnostic = models.TextField(max_length=2000, blank=True)
   date = models.DateField(default=datetime.today)
   reeducation = models.TextField(max_length=2000, blank=True)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: ostéo le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "diagnostic" : self.diagnostic,
         "date": self.date,
         "osteo" : self.osteo,
         "reeducation" : self.reeducation,
         "horse" : self.horse.id,
         "userid" : self.user.id
      }    

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Osteopathy, self).clean(*args, **kwargs)
      actualyear = datetime.now().year
      year = actualyear+1
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(year, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre de l'année suivante.")



class Dentistry(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="dentowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="denthorse")
   dentist = models.CharField(max_length=200, default="Non spécifié")
   diagnostic = models.CharField(max_length=2000, blank=True)
   date = models.DateField(default=datetime.today)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: dentiste le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "user" : self.user.id,
         "horse" : self.horse.id,
         "dentist" : self.dentist,
         "diagnostic" : self.diagnostic,
         "date" : self.date,   
      }

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Dentistry, self).clean(*args, **kwargs)
      actualyear = datetime.now().year
      year = actualyear+1
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(year, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre de l'année suivante.")



# future class to make temperatures graphs
class Temperature(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="tempowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="temphorse")
   temp = models.FloatField(default="37.5")
   date = models.DateField(default=date.today)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: {self.temp}C le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "temp" : self.temp,
         "date": self.date,
         "horse" : self.horse.id,
         "userid" : self.user.id
      } 


class Breeding(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="bmowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="bmhorse")
   mare = models.CharField(max_length=200, default="Non spécifié")
   date = models.DateField(default=datetime.today)
   notes = models.CharField(max_length=1000, blank=True)
   notified = models.BooleanField(default=False)


   def clean(self, *args, **kwargs):
      # run the base validation
      super(Breeding, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2010, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2010 et inférieures au 31 décembre 2030.")


   def __str__(self):
        return f"{self.horse.name} X {self.mare} le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "date": self.date,
         "mare" : self.mare,
         "horse" : self.horse.id,
         "userid" : self.user.id,
         "notes" : self.notes
      } 


class Bred(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="bmareowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="bmarehorse")
   stallion = models.CharField(max_length=200, default="Non spécifié")
   date = models.DateField(default=datetime.today)
   notes = models.CharField(max_length=1000, blank=True)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name} X {self.stallion} le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "date": self.date,
         "stallion" : self.stallion,
         "horse" : self.horse.id,
         "userid" : self.user.id,
         "notes" : self.notes
      } 

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Bred, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2010, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2010 et inférieures au 31 décembre 2030.")


class Heats(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="heatowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="heathorse")
   datestart = models.DateField(default=datetime.today)
   dateend = models.DateField(blank=True, null=True)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: du {self.datestart} au {self.dateend}"

   def serialize(self):
      return {
         "id" : self.id,
         "datestart" : self.datestart,
         "dateend": self.dateend,
         "horse" : self.horse.id,
         "userid" : self.user.id
      } 

   @property
   def next_is_valid(self):
      return self.datestart < self.dateend

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Heats, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.datestart <= date(2020, 1, 1) or self.datestart >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2020 et inférieures au 31 décembre 2030.")
      if self.dateend <= date(2020, 1, 1) or self.dateend >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2020 et inférieures au 31 décembre 2030.")



class Farriery(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="farrowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="farrhorse")
   farrier = models.CharField(max_length=200, default="Non spécifié")
   type = models.TextField(max_length=300, blank=True)
   date = models.DateField(default=datetime.today)
   notified = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: {self.type} le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "user" : self.user.id,
         "horse" : self.horse.id,
         "farrier" : self.farrier,
         "type" : self.type,
         "date" : self.date,   
      }

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Farriery, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2000, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")



class Gestation(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="gestowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="gesthorse")
   datestart = models.DateField(default=datetime.today)
   dateend = models.DateField(null=True, blank=True)
   echo1 = models.DateField(null=True, blank=True)
   echo2 = models.DateField(null=True, blank=True)
   echo3 = models.DateField(null=True, blank=True)
   notes = models.TextField(max_length=4000, blank=True)
   realend = models.DateField(null=True, blank=True)
   vet = models.CharField(max_length=200, default="Non spécifié")
   notified = models.BooleanField(default=False)

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Gestation, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.datestart <= date(2000, 1, 1) or self.datestart >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre de 2030.")
      if self.dateend != None:
         if self.dateend <= date(2000, 1, 1) or self.dateend >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      if self.realend != None:
         if self.realend <= date(2000, 1, 1) or self.realend >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      if self.echo1 != None:
         if self.echo1 <= date(2000, 1, 1) or self.echo1 >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      if self.echo2 != None:
         if self.echo2 <= date(2000, 1, 1) or self.echo2 >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      if self.echo3 != None:
         if self.echo3 <= date(2000, 1, 1) or self.echo3 >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      

   def __str__(self):
        return f"{self.horse.name}: du {self.datestart}, prévu {self.dateend}"

   def serialize(self):
      return {
         "id" : self.id,
         "datestart" : self.datestart,
         "dateend": self.dateend,
         "realend": self.realend,
         "echo1" : self.echo1,
         "echo2" : self.echo2,
         "echo3" : self.echo3,
         "notes" : self.notes,
         "realend" : self.realend,
         "vet" : self.vet,
         "horse" : self.horse.id,
         "userid" : self.user.id
      } 

   @property
   def realend_is_valid(self):
      return self.datestart < self.realend
   
   @property
   def echo1_is_valid(self):
      return self.datestart < self.echo1

   @property
   def echo2_is_valid(self):
      return self.datestart < self.echo2

   @property
   def echo3_is_valid(self):
      return self.datestart < self.echo3

   @property
   def endprev_is_valid(self):
      return self.datestart < self.dateend

   @property
   def echos12_are_valid(self):
      return (self.echo1 < self.echo2)

   @property
   def echos13_are_valid(self):
      return (self.echo1 < self.echo3)

   @property
   def echos23_are_valid(self):
      return (self.echo2 < self.echo3)

   @property
   def gest_is_valid(self):
      return (self.datestart < self.realend and self.datestart < self.dateend)




class Dewormer(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="dewowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="dewhorse")
   name = models.CharField(max_length=30, default="Non spécifié")
   molecule = models.CharField(max_length=50, blank=True)
   date = models.DateField(default=datetime.today) 
   nextname = models.CharField(max_length=30, blank=True)
   nextdate = models.DateField(blank=True, null=True)
   notified1 = models.BooleanField(default=False)
   notified2 = models.BooleanField(default=False)

   def __str__(self):
        return f"{self.horse.name}: {self.name} le {self.date}"

   def serialize(self):
      return {
         "id" : self.id,
         "user" : self.user.id,
         "horse" : self.horse.id,
         "name" : self.name,
         "molecule" : self.molecule,
         "date" : self.date,
         "nextdate" : self.nextdate,
         "nextname" : self.nextname
      }

   @property
   def next_is_valid(self):
      return self.date < self.nextdate

   def clean(self, *args, **kwargs):
      # run the base validation
      super(Dewormer, self).clean(*args, **kwargs)
      # Don't allow dates out of range.
      if self.date <= date(2010, 1, 1) or self.date >= date(2030, 12, 31):
         raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")
      if self.nextdate != None:
         if self.nextdate <= date(2010, 1, 1) or self.nextdate >= date(2030, 12, 31):
            raise ValidationError("Les dates doivent être supérieures au 1er janvier 2000 et inférieures au 31 décembre 2030.")



class Dates(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="datesowner")
   horse = models.ForeignKey("Horse", on_delete=models.CASCADE, related_name="dateshorse")
   date = models.DateTimeField(default=datetime.today)
   other = models.CharField(max_length=200, blank=True, default="Non spécifié")
   reason = models.CharField(max_length=300, default="Non spécifié")
   notified = models.BooleanField(default=False)


   def __str__(self):
        return f"{self.horse.name}: {self.reason} le {self.date}"


   def serialize(self):
      return {
         "id" : self.id,
         "reason" : self.reason,
         "date": self.date,
         "other" : self.other,
         "horse" : self.horse.id,
         "userid" : self.user.id
      }     



class Inventory(models.Model):
   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="invuser")
   name = models.CharField(max_length=30)
   molecule = models.CharField(max_length=50, blank=True)
   quantity = models.IntegerField(blank=True, null=True)
   dateend = models.DateField(blank=True, null=True)
   lot = models.CharField(blank=True, max_length=35)
   empty = models.BooleanField(default=False)
   over = models.BooleanField(default=False)
   created = models.DateField(default=datetime.today)
   

   def serialize(self):
      return {
         "id" : self.id,
         "name" : self.name,
         "molecule" : self.molecule,
         "quantity": self.quantity,
         "lot" : self.lot,
         "dateend": self.dateend,
         "empty": self.empty,
         "over": self.over,
         "created": self.created,
      }

   def __str__(self):
        return f"{self.name}: {self.quantity} le {self.created}"
   
   @property
   def is_over(self):
      return date.today() > self.dateend
   
   @property
   def is_not_over(self):
      return date.today() <= self.dateend



class Repertory(models.Model):
   JOB_CHOICES = [
        ('Maréchal', 'Maréchal'),
        ('Vétérinaire', 'Vétérinaire'),
        ('Osthéopathe', 'Osthéopathe'),
        ('Inséminateur', 'Inséminateur'),
        ('Autre', 'Autre'),
        ('Cavalier professionnel', 'Cavalier professionnel'),
        ('Fournisseur', 'Fournisseur'),
        ('Acupuncteur', 'Acupuncteur'),
        ('Masseur', 'Masseur'),
        ('Eleveur', 'Eleveur'),
        ('Moniteur', 'Moniteur'),
        ('Dentiste', 'Dentiste'),
    ]

   user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="repuser")
   name= models.CharField(max_length=40)
   address = models.CharField(max_length=500, blank=True)
   email = models.EmailField(blank=True)
   job = models.CharField(choices=JOB_CHOICES, default='other', max_length=30)
   #job2 = models.CharField(choices=JOB_CHOICES, blank=True, max_length=11)
   nb = models.CharField(max_length=16, blank=True)
   tab = models.IntegerField(default=0)

   def serialize(self):
      return {
         "id": self.id,
         "name" : self.name,
         "address" : self.address,
         "email" : self.email,
         "job" : self.job,
         "nb": self.nb,
         "tab" : self.tab
      }

      
class Tmp(models.Model):
   created = models.DateTimeField(default=datetime.now)
   tmp = models.CharField(max_length=500, blank=True)