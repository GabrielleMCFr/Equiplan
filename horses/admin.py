from django.contrib import admin
from .models import User, Horse, Vaccine, Incident, Contest, Osteopathy, Dentistry, Temperature, Breeding, Heats, Dewormer, Inventory, Repertory, Bred, Farriery, Dates, Gestation

# Register your models here.

admin.site.register(User)
admin.site.register(Horse)
admin.site.register(Contest)
admin.site.register(Osteopathy)
admin.site.register(Dentistry)
admin.site.register(Vaccine)
admin.site.register(Temperature)
admin.site.register(Incident)
admin.site.register(Breeding)
admin.site.register(Heats)
admin.site.register(Dewormer)
admin.site.register(Inventory)
admin.site.register(Repertory)
admin.site.register(Bred)
admin.site.register(Farriery)
admin.site.register(Dates)
admin.site.register(Gestation)