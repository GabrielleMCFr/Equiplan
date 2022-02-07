from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
import json
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site  
from django.utils.encoding import force_bytes, force_text  
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from datetime import date, datetime, timedelta, timezone
from django.db.models import Q, F
from django.contrib.auth.decorators import user_passes_test
from django.contrib import messages

from .tokens import account_activation_token
from .models import Gestation, Tmp, User, Horse, Vaccine, Incident, Contest, Osteopathy, Dentistry, Bred, Breeding, Heats, Dates, Dewormer, Inventory, Repertory, Farriery
from .forms import NewBredMare, NewContact, NewContest, NewDentistry, NewDewormer, NewFarriery, NewGestation, NewHeat, NewIncident, NewItem, NewOsteo, NewPic, NewHorse, NewHorsePic, NewVax, NewBreedStallion

jobs = [
        (0, 'Maréchal'),
        (1, 'Vétérinaire'),
        (2, 'Osthéopathe'),
        (3, 'Inséminateur'),
        (4, 'Autre'),
        (5, 'Cavalier professionnel'),
        (6, 'Fournisseur'),
        (7, 'Acupuncteur'),
        (8, 'Masseur'),
        (9, 'Eleveur'),
        (10, 'Moniteur'),
        (11, 'Dentiste'),
    ]

AVATARS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']

##################################################SUPERUSER FUNCTIONS#######################################################

@user_passes_test(lambda u: u.is_superuser)
def cleanup(request):
    # erase every inactive user account for over a week.
    now = datetime.now()
    limit = now + timedelta(days = 7)
    users = User.objects.filter(created__gte=limit)
    size = len(users)
    count = 0
    for user in users:
        user.delete()
        count += 1

    if count == size:
        return render(request, "horses/cleanup.html", {
            "activestate" : "Les comptes inactifs ont été supprimés."
        })
    else:
        return render(request, "horses/cleanup.html", {
            "activestate" : "Les comptes inactifs n'ont pas pu être tous supprimés."
        })


# for now, do it with a superuser command, then do it with celery.
@user_passes_test(lambda u: u.is_superuser)
def notifications(request):
    now = datetime.now().astimezone()
    limit = now - timedelta(days=2)
    print(limit)
    # to avoid notifying old dates.
    limitsup = now + timedelta(days=2)
    print(limitsup)
    # check for Dates:
    
    dates = Dates.objects.filter(Q(notified=False), Q(date__gte=limit), Q(date__lte=limitsup))
    tmp = len(dates)
    count= 0
    if not dates:
        return render(request, "horses/cleanup.html", {
            "activestate" : "Tu fais de la merde."
        })
    else :
        for date in dates: 
            print(date.date)
        
            #send mail.
            user = date.user

            # send email
            mail_subject = "N'oubliez pas votre prochain rendez-vous"  
            message = render_to_string('horses/notifications.html', {  
                'user': user,  
                'message'  : 'Vous avez un rendez vous prévu',
                'horse' : date.horse,
                'date' : date.date
            })  
            to_email = user.email  
            print(to_email)
            email = EmailMessage(  
                mail_subject, message, to=[to_email]  
            )  
            email.send() 
            date.notified = True
            date.save()
            count += 1
            
        if tmp == count :
            return render(request, "horses/cleanup.html", {
            "activestate" : "Mails envoyés."
            })
        else :
            return render(request, "horses/cleanup.html", {
                "activestate" : "Encore et tjs de la merde."
            })

            

###################################################USER FUNCTIONS###########################################################


def index(request):
    if request.user.is_authenticated:
        
        #today = datetime.now()
        today = datetime.now(timezone.utc)
        today = today.astimezone()
        year = today.year
        year2 = year+1
        day = datetime.today()
        day = day.astimezone()
        limitsup = today + timedelta(days=14)

        dew = Dewormer.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).annotate(datetmp=F('date'))
        d2 = Dewormer.objects.filter(Q(user=request.user), Q(nextdate__gte=today), Q(nextdate__lte=limitsup)).annotate(datetmp=F('nextdate'))
        dewormers = dew.union(d2).order_by('datetmp')
                        
        v1 = Vaccine.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).annotate(datetmp=F('date'))
        v2 = Vaccine.objects.filter(Q(user=request.user), Q(next__gte=today), Q(next__lte=limitsup)).annotate(datetmp=F('next'))
        vaccins = v1.union(v2).order_by('datetmp')
        
        osteos = Osteopathy.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        dates = Dates.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        dents = Dentistry.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        farrs = Farriery.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        heats = Heats.objects.filter(Q(user=request.user), Q(datestart__gte=today), Q(datestart__lte=limitsup)).order_by('datestart')

        g1 = Gestation.objects.filter(Q(user=request.user), Q(dateend__icontains=year), Q(realend=None))
        g2 = Gestation.objects.filter(Q(user=request.user), Q(dateend__icontains=year2), Q(realend=None))
        gestations = g1.union(g2).order_by('-datestart')

        breeds = Breeding.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')
        
        mbreds = Bred.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        contests = Contest.objects.filter(Q(user=request.user), Q(date__gte=today), Q(date__lte=limitsup)).order_by('date')

        return render(request, "horses/index.html", {
            "dates" : dates,
            "dewormers" : dewormers,
            "vaccins" : vaccins,
            "osteos" : osteos, 
            "dents" : dents,
            "farrs" : farrs,
            "heats" : heats,
            "gestations" : gestations,
            "breeds" : breeds,
            "mbreds" : mbreds,
            "contests" : contests,
            "year" : year,
            "today" : day,
            "year2" : year2,
        })

    else:
        return HttpResponseRedirect(reverse("login"))



def login_f(request):
    if request.method == 'POST':
        # log in the user
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            if user.active == True:
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "horses/login.html", {
                "message": "Invalid username and/or password."
            })
    else: 
        return render(request, "horses/login.html")



def logout_f(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "horses/register.html", {
                "message": "Les mots de passe doivent concorder."
            })
        if len(password) <= 5:
            return render(request, "horses/register.html", {
                "message": "Le mot de passe doit faire au moins 6 caractères."
            })

        email = request.POST["email"]
        uniqueness = User.objects.filter(email=email)
        if uniqueness:
            return render(request, "horses/register.html", {
                "message": "Un compte est déjà associé à cette adresse email."
            })

        # Attempt to create new user and send a confirmation email
        try:
            user = User.objects.create_user(username, email, password)
            user.save()

            # to get the domain of the current site  
            current_site = get_current_site(request)  

            # send email
            mail_subject = "Lien d'activation de votre compte Equiplan"  
            message = render_to_string('horses/activeacc.html', {  
                'user': user,  
                'domain': current_site.domain,  
                'uid':urlsafe_base64_encode(force_bytes(user.pk)),  
                'token':account_activation_token.make_token(user),  
            })  
            to_email = user.email  
            email = EmailMessage(  
                mail_subject, message, to=[to_email]  
            )  
            email.send()  
            return render(request, "horses/activation.html", {
                "activstate": "Un email a été envoyé à l'adresse email indiquée. Veuillez confirmer votre adresse email et activer votre compte en cliquant sur le lien du mail reçu. Le lien est valide pendant 48h.",
                "userid" : user.id
            })
        except IntegrityError:
            return render(request, "horses/register.html", {
                "message": "Pseudo déjà pris."
            })
        
          
    else:
        return render(request, "horses/register.html")


def emailconfnew(request, id) :
    if request.method =="GET":
        user = get_object_or_404(User, pk=id)
        # to get the domain of the current site  
        current_site = get_current_site(request)  

        # send email
        mail_subject = "Lien d'activation de votre compte Equiplan"  
        message = render_to_string('horses/activeacc.html', {  
            'user': user,  
            'domain': current_site.domain,  
            'uid':urlsafe_base64_encode(force_bytes(user.pk)),  
            'token':account_activation_token.make_token(user),  
        })  
        to_email = user.email  
        email = EmailMessage(  
            mail_subject, message, to=[to_email]  
        )  
        email.send()  
        return render(request, "horses/activation.html", {
            "activstate": "Un email a été renvoyé à l'adresse email indiquée. Veuillez confirmer votre adresse email et activer votre compte en cliquant sur le lien du mail reçu. Le lien est valide pendant 48h.",
            "userid" : user.id
        })
    else:
        return render(request, "horses/error.html")
    


def activate(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        if user.active == True :
            return render(request, "horses/stateuser.html", {
                        "activstate": "Votre compte a déjà été activé."
                    })    
        elif user.active == False:
            activationlimit = user.created + timedelta(hours=48)
            now = datetime.now(timezone.utc)
            now = now.astimezone()
            if now <= activationlimit:
                user.active = True
                user.save()
                login(request, user)
                return render(request, "horses/stateuser.html", {
                        "activstate": "Merci pour la confirmation de votre email. Votre compte est activé, vous pouvez dès maintenant vous connecter."
                    })
            else:
                user.delete()
                return render(request, "horses/stateuser.html", {
                        "activstate": "Désolé, le lien est invalide ! Vous pouvez recommencer votre inscription si vous le souhaitez."
                    })
    else:
        if user:
            user.delete()
        return render(request, "horses/stateuser.html", {
                "activstate": "Désolé, le lien est invalide ! Vous pouvez recommencer votre inscription si vous le souhaitez."
            })



@login_required(login_url='login')
def profile(request, id):
    # id = user.id
    if request.method == "GET" and request.user.is_authenticated:
        user = get_object_or_404(User, pk=id)
        #user = User.objects.get(pk = id)
        horses = Horse.objects.filter(owner = user)
        count = horses.count()
        return render(request, "horses/profile.html", {
            "user" : user,
            "count" : count,
        })
    
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def edituser(request, id):
    # id = user.id
    # double check
    if request.method == 'POST':
        user = get_object_or_404(User, pk=id)
        #user = User.objects.get(pk=id)

        if request.user == user :
             # get content
            data = json.loads(request.body)

            picture = data.get("picture", "")
            user.picture = picture
            user.save()
            
            # get job if there is one
            jobs = [job.strip() for job in data.get("job").split(",")]

            if jobs != [""]:
                job = data.get("job", "")
                user.job = job
                user.save() 

            # get address if there is one
            addresses = [address.strip() for address in data.get("address").split(",")]
            if addresses != [""]:
                address = data.get("address", "")
                user.address = address
                user.save() 

            # get first name if there is one
            fnames = [fname.strip() for fname in data.get("fname").split(",")]
            if fnames != [""]:
                fname = data.get("fname", "")
                user.firstname = fname
                user.save() 


            # get last name if there is one
            lnames = [lname.strip() for lname in data.get("lname").split(",")]
            if lnames != [""]:
                lname = data.get("lname", "")
                user.lastname = lname
                user.save() 
                 
            # return edited user infos
            return JsonResponse(user.serialize(), safe=False, status=200)

    return JsonResponse({"error": "Couldn't edit user account"}, status=400)




@login_required(login_url='login')
def editpassword(request, id):
    # id = user.id
     # double check
    if request.method == 'POST':
        user = get_object_or_404(User, pk=id)
        #user = User.objects.get(pk=id)

        if request.user == user :

             # get content
            data = json.loads(request.body)
            mdp = data.get("password", "")
            conf = data.get("confirmation", "")

            # normally already checked with JS, but just in case : 
            if mdp != conf or len(mdp) <= 5:
                return JsonResponse({"error": "Couldn't edit password"}, status=400)

            else:
                user.set_password(mdp)
                user.save()
                return JsonResponse(user.serialize(), safe=False)
    else:
        return render(request, "horses/error.html")




@login_required(login_url='login')
def deleteuser(request, id):
    #id : user.id
    if request.method == "GET":
        user = get_object_or_404(User, pk=id)
        #user = User.objects.get(pk = id)
        if request.user == user:
            # delete files first. profile and horses.
            horses = Horse.objects.filter(owner = user)
            for horse in horses:
                # delete every horse (it should delete themselves with cascade, i don't think they would with files.)
                horse.delete()
            logout(request)
            user.delete()
            return render(request, "horses/goodbye.html")
        return render(request, "horses/error.html")
    return render(request, "horses/error.html")


def contactus(request):
    if request.method == 'GET':
        return render(request, "horses/contact-us.html")   
    else:
        return render(request, "horses/error.html")


def help(request):
    if request.method == 'GET':
        return render(request, "horses/help.html")   
    else:
        return render(request, "horses/error.html")


def politiquedeconf(request):
    if request.method == 'GET':
        return render(request, "horses/politique-de-confidentialite.html")   
    else:
        return render(request, "horses/error.html")



def resetpassword(request) :
    if request.method == 'GET':
        return render(request, "horses/passwordreset.html") 
    if request.method == 'POST':
        emailaccount = request.POST["email"]
        user = get_object_or_404(User, email=emailaccount)
        if not user :
            return render(request, "horses/error.html")
        else:
            if user.active == True :
                # send mail
                # to get the domain of the current site  
                current_site = get_current_site(request)  
                now = datetime.now(timezone.utc)
                now = now.astimezone()
                token = account_activation_token.make_token(user)
                newentry = Tmp.objects.create(tmp=token, created=now)

                # send email
                mail_subject = "Demande de réinitialisation"  
                message = render_to_string('horses/resetpassword.html', {  
                    'user': user,  
                    'domain': current_site.domain,  
                    'uid':urlsafe_base64_encode(force_bytes(user.pk)),  
                    'token': token,  
                })  
               
                to_email = user.email
                email = EmailMessage(  
                    mail_subject, message, to=[to_email]  
                )  
                email.send()  

                return render(request, "horses/password_mail_sent.html")
            else:
                return render(request, "horses/password_mail_sent.html")



def setnewpassword(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        id = user.id
        try:
            tmp = Tmp.objects.get(tmp=token)
        except(Tmp.DoesNotExist):
            return render(request, "horses/passwordfailure.html", {
            "activestate" : "Le lien d'activation est invalide."
        })
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        activationlimit = tmp.created + timedelta(minutes=30)
        print(activationlimit)
        now = datetime.now(timezone.utc)
        now = now.astimezone()
        print(now)
        if now <= activationlimit:
            tmp.delete()
            return render(request, "horses/setnewpassword.html",
            {
                "userid" : id
            })
        else:
            tmp.delete()
            return render(request, "horses/passwordfailure.html", {
                "activestate" : "Le lien d'activation a expiré."
            })
    else:
        tmp.delete()
        return render(request, "horses/passwordfailure.html", {
            "activestate" : "Le lien d'activation est invalide."
        })
   

def confirmnewpassword(request, id):
    if request.method == 'POST':
        user = get_object_or_404(User, pk=id)
       
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "horses/setnewpassword.html", {
                "message": "Les mots de passe doivent concorder.",
                "userid" : id
            })
        elif len(password) <= 5:
            return render(request, "horses/setnewpassword.html", {
                "message": "Le mot de passe doit faire au moins 6 caractères.",
                "userid" : id
            })
        else :
            user.set_password(password)
            user.save()
            return render(request, "horses/passwordsuccess.html")

    else:
        return render(request, "horses/error.html")



#############################################FIN USER FUNCTIONS#############################################################

############################################ CONTACTFUNCTIONS ###############################################################

@login_required(login_url='login')
def contacts(request):
    # general route
    if request.method == 'GET':
        if request.user.is_authenticated:
                id = request.user.id
                user = get_object_or_404(User, pk=id)
                #user = User.objects.get(pk = id)
                contacts = Repertory.objects.filter(user = user).order_by('name')
                form = NewContact()
                
                
                if not contacts:
                    return render(request, "horses/contacts.html", {
                        "message" : "Aucun contact n'est enregistré",
                        "user" : user,
                        "form" : form,
                        "jobs" : jobs,
                        
                    })
                else:
                    return render(request, "horses/contacts.html", {
                        "contacts" : contacts,
                        "user" : user,
                        "form" : form,
                        "jobs" : jobs,
                        
                    })
        else:
            return render(request, "horses/error.html")

    # add route
    if request.method == 'POST':
        if request.user.is_authenticated:
            id = request.user.id
            user = get_object_or_404(User, pk=id)
            #user = User.objects.get(pk = id)
            form = NewContact(request.POST)

            if form.is_valid():
                contact = form.save(commit=False)
                contact.user = user
                contact.save()
                return redirect("contacts")
            else:
                return redirect("contacts")
        else:
            return render(request, "horses/error.html")
    else:
        return render(request, "horses/error.html")


@login_required(login_url='login')
def contact(request, id):
    #id : contact id
    # general route
    if request.method == "GET":

        if request.user.is_authenticated:
            contact = get_object_or_404(Repertory, pk=id)
            #contact = Repertory.objects.get(pk=id)
            user = get_object_or_404(User, pk=request.user.id)
            #user = User.objects.get(pk = request.user.id)
            form = NewContact(instance=contact)

            # only the owner of the repertory can access the entry data
            if contact.user == user :
                return render(request, "horses/contact.html", {
                        "contact" : contact,
                        "form" : form
                    })
        
            else:
                return render(request, "horses/error.html")
        else:
            return render(request, "horses/error.html")   
    
    # edit route
    if request.method == "POST":

        if request.user.is_authenticated:
            contact = get_object_or_404(Repertory, pk=id)
            #contact = Repertory.objects.get(pk=id) 
            form = NewContact(request.POST, instance=contact)

            if form.is_valid():
                form.save()
                return redirect("contact", id)

    else :
        return render(request, "horses/error.html")



@login_required
def deletecontact(request, id):
    #id : contact.id
    if request.method == "GET":
        if request.user.is_authenticated:
            contact = get_object_or_404(Repertory, pk=id)
            #contact = Repertory.objects.get(pk=id)
            user = get_object_or_404(User, pk=request.user.id)
            #user = User.objects.get(pk = request.user.id)

            # only the owner of the repertory can erase their contacts
            if contact.user == user:
                contact.delete()    
                return redirect("contacts") 
        else:
            return render(request, "horses/error.html", {
                "message" : "Requête refusée. Vous ne disposez pas des autorisations nécessaires pour effacer ce contact."
            })
    else:
        return render(request, "horses/error.html")

####################################FIN CONTACT FUNTIONS#####################################################################

####################################INVENTORY FUNCTIONS######################################################################

@login_required(login_url='login')
def inventory(request):
    # general route
    if request.method == "GET":
        if request.user.is_authenticated:
                id = request.user.id
                user = get_object_or_404(User, pk=id)
                #user = User.objects.get(pk = id)
                actualyear = datetime.now().year
                invent = Inventory.objects.filter(user = user, created__icontains=actualyear)

                # realise check for peremption et empty items.
                for i in invent:
                    if i.over == False and i.dateend:
                        if i.is_over :
                            i.over = True
                            i.save()
                    elif i.over == True and i.dateend:
                        if not i.is_over :
                            i.over = False
                            i.save()
               
                    if i.empty == False and i.quantity:
                        if i.quantity == 0:
                            i.empty = True
                            i.save()
                    elif i.empty == True and i.quantity:
                        if i.quantity > 0:
                            i.empty = False
                            i.save()

                #list of years.
                years = []

                for i in range(actualyear, 2020-1, -1):
                    years.append(i)

                inventory = Inventory.objects.filter(user = user, created__icontains=actualyear).order_by('empty', 'name')
                form = NewItem()

                if not inventory:
                    return render(request, "horses/inventory.html", {
                        "message" : "Aucun produit n'est enregistré",
                        "user" : user,
                        "form" : form,
                        "actualyear" : actualyear,
                        "years" : years
                })
                else:
                    return render(request, "horses/inventory.html", {
                        "inventory" : inventory,
                        "user" : user,
                        "form" : form,
                        "actualyear" : actualyear,
                        "years" : years,
                    })
    # add route
    elif request.method == "POST":
        if request.user.is_authenticated:
                id = request.user.id
                user = get_object_or_404(User, pk=id)
                #user = User.objects.get(pk = id)
                form = NewItem(request.POST)

                if form.is_valid():
                    item = form.save(commit=False)
                    item.user = user
                    item.save()
                    return redirect("inventory")
                else:
                    return render(request, "horses/error.html", {
                        'message' : "Formulaire invalide, impossible d'enregistrer le produit."
                    })
        else:
            return render(request, "horses/error.html", {
                'message' : "Utilisateur non reconnu, veuillez vous identifier." 
            })
        
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def pastinventory(request, id, context):
    # id : user id.  context : year you want
    # return the entries of the years asked. 
    if request.method == "GET":
        if request.user.is_authenticated:
            #id = request.user.id
            user = get_object_or_404(User, pk=id)
            #user = User.objects.get(pk = id)
   
            invent = Inventory.objects.filter(user = user, created__icontains=context)

            # realise check for peremption et empty items.
            for i in invent:
                if i.over == False and i.dateend:
                    if i.is_over :
                        i.over = True
                        i.save()
                elif i.over == True:
                    if not i.is_over :
                        i.over = False
                        i.save()

                
                if i.empty == False:
                    if i.quantity == 0:
                        i.empty = True
                        i.save()
                elif i.empty == True:
                    if i.quantity > 0:
                        i.empty = False
                        i.save()

            inventory = Inventory.objects.filter(user = user, created__icontains=context).order_by('empty', 'name')
            
            return JsonResponse([item.serialize() for item in inventory], safe=False)

        else:
            return JsonResponse({"error": "Couldn't charge inventory - NOT AUTHORIZED"}, status=400)

    else:
        return render(request, "horses/error.html")





@login_required(login_url='login')
def edititem(request, id):
    #id : id.item
    # delete route
    if request.method == "GET":
        if request.user.is_authenticated:
            user = get_object_or_404(User, pk=request.user.id)
            #user = User.objects.get(pk = request.user.id)
            item = get_object_or_404(Inventory, pk=id)
            #item = Inventory.objects.get(pk=id)

            # only owners can delete their items
            if user == item.user :
                item.delete()    
                return JsonResponse({"message": "Success"}, status=200) 
        
        else:
            return JsonResponse({"error": "Couldn't delete item - NOT AUTHORIZED"}, status=400)

    # edit route
    if request.method == "POST":
        if request.user.is_authenticated:
            user = get_object_or_404(User, pk=request.user.id)
            #user = User.objects.get(pk = request.user.id)
            item = get_object_or_404(Inventory, pk=id)
            #item = Inventory.objects.get(pk=id)

            # only owners can edit their items
            if user == item.user :
                 # get content
                data = json.loads(request.body)

                # get name 
                name = data.get("name", "")
                if item.name != name :
                    item.name = name
                    

                #get molecule if there is one, or erase it if the user want it.
                mols = [mol.strip() for mol in data.get("mol").split(",")]
                if mols != [""]:
                    molecule = data.get("mol", "")
                    if item.molecule != molecule:
                        item.molecule = molecule
                else:
                    item.molecule =  ''

                #get quantity if there is one
                quantities = [quantity.strip() for quantity in data.get("quantity").split(",")]
                if quantities != [""]:
                    newquantity = data.get("quantity", "")
                    if item.quantity != newquantity:
                        item.quantity = newquantity  
                        if item.empty == False:
                            if int(item.quantity) == 0:
                                item.empty = True
                        elif item.empty == True:
                            if int(item.quantity) > 0:
                                item.empty = False
                else:
                    item.quantity = None

                            
                #get lot if there is one
                lots = [lot.strip() for lot in data.get("lot").split(",")]
                if lots != [""]:
                    newlot = data.get("lot", "")
                    if item.lot != newlot:
                        item.lot = newlot
                else:
                    item.lot = ''
   

                #get date if there is one
                dates = [date.strip() for date in data.get("date").split(",")]
                if dates != [""]:
                    newdate = data.get("date", "")
                    if item.dateend != newdate:
                        item.dateend = newdate 
                        if item.over == False:
                            if datetime.now() > datetime.strptime(item.dateend, "%Y-%m-%d") :
                                item.over = True
                        elif item.over == True:
                            if datetime.now() < datetime.strptime(item.dateend, "%Y-%m-%d") :
                                item.over = False
                else:
                    item.dateend = None

                                
                item.save()
                 
                return JsonResponse(item.serialize(), safe=False, status=200)


        else:
            return render(request, "horses/error.html", {
                'message' : "Utilisateur non reconnu, veuillez vous identifier." 
            })


@login_required
def edites(request, id):
    #id : item id
    # declare the item empty 
    if request.method == "GET":
        if request.user.is_authenticated:
            user = get_object_or_404(User, pk=request.user.id)
            #user = User.objects.get(pk = request.user.id)
            item = get_object_or_404(Inventory, pk=id)
            #item = Inventory.objects.get(pk=id)

            # only owners can empty their items
            if user == item.user :
                item.quantity = 0
                item.empty = True
                item.save()
                return JsonResponse({"message": "Success"}, status=200) 

            else:
                return JsonResponse({"error": "Couldn't delete item - NOT AUTHORIZED"}, status=400)
        
        else:
            return JsonResponse({"error": "Couldn't delete item - NOT AUTHORIZED"}, status=400)


    else:
        return render(request, "horses/error.html", {
            'message' : "Impossible de répondre à votre requête." 
            })

        


#####################################END INVENTORY FUNCTIONS##################################################################

#######################################HORSES FUNCTIONS#######################################################################


@login_required(login_url='login')
def horses(request):

    # add route
    if request.method == "POST":
        # register the horse under the name of the request.user
        id = request.user.id
        user = get_object_or_404(User, pk=id)
        #user = User.objects.get(pk=id)

        if user.is_authenticated:
            form = NewHorse(request.POST, request.FILES)

            if form.is_valid():
                horse = form.save(commit=False)
                horse.owner = user
                
                if not request.FILES:
                    horse.save()
                    return HttpResponseRedirect(reverse("myhorses"))

                else:
                    horse.picture = request.FILES['picture']
                    horse.save()
                    return HttpResponseRedirect(reverse("myhorses"))
                    #return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))
            else:
                return render(request, "horses/error.html", {
                    "message" : "Le formulaire d'ajout d'un nouveau cheval est invalide. Veuillez recommencer."
                })
        else:
            return render(request, "horses/error.html", {
                    "message" : "Vous ne disposez pas des droits d'utilisateur nécessaires pour enregistrer ce cheval."
                })

    # general route
    if request.method == "GET":
        # just in case
        if request.user.is_authenticated:
            id = request.user.id
            user = get_object_or_404(User, pk=id)
            #user = User.objects.get(pk = id)
            horses = Horse.objects.filter(owner=user)
            form = NewHorse()
            
            avatars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']
            if not horses:
                return render(request, "horses/myhorses.html", {
                    "message" : "Aucun cheval n'est enregistré",
                    "form" : form,
                    "user" : user,
                    "avatars" : avatars,
            })
            else:
                return render(request, "horses/myhorses.html", {
                    "horses" : horses,
                    "form": form,
                    "user" : user,
                    "avatars" : avatars,
                })

        

@login_required(login_url='login')
def horse(request, id):
    # id = horse.id
    # select horse and their owner
    if request.method == 'GET':

        actualyear = datetime.now().year
        nextyear = actualyear+ 1
        # List of years from 2021 + 2 future 
        yearsdate = []
        # general value for ulterior events
        yearsdate.append(1111)
        for i in range(actualyear+2, 2020, -1):
            yearsdate.append(i)
        
        
        # list of years from the actual one, until 2018 (for old entries like vaccins, incidents, dentistry, osteo)
        years = []
        for i in range(actualyear+1, actualyear-5, -1):
            years.append(i)
        # general value for anterior events
        years.append(1000)

        # list of years before and after the actual one (farriery, dewormer)
        yearsprev = []
        yearsprev.append(1111)
        for i in range(actualyear+2, actualyear-3, -1):
            yearsprev.append(i)
        yearsprev.append(1001)

        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        form = NewHorsePic()
        vaccins = Vaccine.objects.filter(horse = horse, date__icontains=actualyear).order_by('-date')
        form2 = NewVax()
        form3 = NewFarriery()
        form4 = NewDewormer()
        form5 = NewDentistry()
        form6 = NewOsteo()
        form7 = NewContest()
        form8 = NewIncident()
        form9 = NewBreedStallion()
        form10 = NewBredMare()
        form11 = NewHeat()
        form12 = NewGestation()
        dewormers = Dewormer.objects.filter(horse= horse, date__icontains=actualyear).order_by('-date')
        incidents = Incident.objects.filter(horse= horse, date__icontains=actualyear).order_by('-date')
        osteos = Osteopathy.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        dents = Dentistry.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        farrs = Farriery.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        heats = Heats.objects.filter(horse=horse, datestart__icontains=actualyear).order_by('-datestart')
        gestations = Gestation.objects.filter(horse=horse, datestart__icontains=actualyear).order_by('-datestart')
        breeds = Breeding.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        mbreds = Bred.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        contests = Contest.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')
        dates = Dates.objects.filter(horse=horse, date__icontains=actualyear).order_by('-date')

        avatars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25']

        if horse.age:
            actualage = actualyear - horse.age
        else: 
            actualage = None
        # only the owner can access to horse data
        if request.user == user:

             return render(request, "horses/horse.html", {
            "user" : user,
            "horse" : horse,
            "form" : form,
            "mbreds" : mbreds,
            "vaccins" : vaccins,
            "form2" : form2,
            "dewormers" : dewormers,
            "incidents" : incidents,
            "osteos" : osteos,
            "dents" : dents,
            "farrs" : farrs,
            "heats" : heats,
            "gestations" : gestations,
            "breeds" : breeds,
            "contests" : contests,
            "dates" : dates,
            "yearsdate" : yearsdate,
            "years" : years,
            "yearsprev" : yearsprev,
            "actualyear" : actualyear,
            "actualage" : actualage,
            "form3" : form3,
            "form4" : form4,
            "form5" : form5,
            "form6" : form6,
            "form7" : form7,
            "form8" : form8,
            "form9" : form9,
            "form10" : form10,
            "form11" : form11,
            "form12" : form12,
            "nextyear": nextyear,
            "avatars" : avatars
        })

        else:
            return render(request, "horses/error.html", {
                "message" : "Ce cheval n'étant pas enregistré sous votre nom, nous sommes dans l'incapacité de vous faire accéder à sa page de renseignements."
            })
    
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def delete(request, id):
    #id = horse.id
    if request.method == 'GET':
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk=id)
        # make sure the owner is the one who delete
        if horse.owner == request.user:
            # delete img if need be. or tbnail ? 
    
            horse.delete()
            return redirect("myhorses")
        else:
            return render(request, "horses/error.html", {
                "message" : "Ce cheval n'étant pas enregistré sous votre nom, nous sommes dans l'incapacité de répondre à votre demande."
                })
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def edithorse(request, id):
    #id = horse.id
    
    if request.method == 'POST':
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk=id)
        user = horse.owner

        if request.user == user :
             # get content
            data = json.loads(request.body)

            #get age if there is one
            ages = [age.strip() for age in data.get("age").split(",")]
            if ages != [""]:
                age = data.get("age", "")
                horse.age = age
            else:
                horse.age =  None

            #get breed if there is one
            breeds = [breed.strip() for breed in data.get("breed").split(",")]
            if breeds != [""]:
                breed = data.get("breed", "")
                horse.breed = breed
            else:
                horse.breed = ''
     
            #get coat if there is one
            coats = [coat.strip() for coat in data.get("coat").split(",")]
            if coats != [""]:
                coat = data.get("coat", "")
                horse.coat = coat
            else:
                horse.coat = '' 

            #get ifce if there is one
            ifces = [ifce.strip() for ifce in data.get("ifce").split(",")]
            if ifces != [""]:
                ifce = data.get("ifce", "")
                horse.ifce = ifce
            else:
                horse.ifce = ''

            #get ueln if there is one
            uelns = [ueln.strip() for ueln in data.get("ueln").split(",")]
            if uelns != [""]:
                ueln = data.get("ueln", "")
                horse.ueln = ueln
            else:
                horse.ueln = '' 

            #get tests if there is one
            tests = [test.strip() for test in data.get("tests").split(",")]
            if tests != [""]:
                test = data.get("tests", "")
                horse.tests = test
            else:
                horse.tests = ''
             
            # get name and sex and save all
            name = data.get("name", "")
            horse.name = name
            sex = data.get("sex", "")
            horse.sex = sex

            horse.save()

            # return edited horse infos
            return JsonResponse(horse.serialize(), safe=False, status=200)
        
        return JsonResponse({"error": "Couldn't edit horse infos - NOT AUTHORIZED"}, status=400)

    return JsonResponse({"error": "Couldn't edit horse infos"}, status=400)
            
    

@login_required(login_url='login')  
def edithorsepic(request, id):
    # id: horse.id
    if request.method == 'POST':
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk=id)
        user = horse.owner

        if request.user == user :  
            data = json.loads(request.body)
            context = data.get("context", "")       
            horse.picture = context
            try:
                horse.save()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit horse picture"}, status=400)
            return JsonResponse({"message": "Success"}, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit horse picture"}, status=400)
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def editnotes(request, id):
    # id : horse.id
    if request.method == 'POST':
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk=id)
        user = horse.owner

        if request.user == user :
             # get content
            data = json.loads(request.body)

            note = data.get("notes", "")
            horse.notes = note
            horse.save() 
            
            # return edited horse infos
            return JsonResponse(horse.serialize(), safe=False, status=200)
        
        return JsonResponse({"error": "Couldn't edit the notes - NOT AUTHORIZED"}, status=400)

    return JsonResponse({"error": "Couldn't edit the notes"}, status=400)


@login_required(login_url='login') 
def newvax(request, id):  
    # create a new vaccin route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        if user == request.user:       
            form = NewVax(request.POST or None)
            if form.is_valid():
                vaccin = form.save(commit=False)
                vaccin.horse = horse
                vaccin.user = user
                if (vaccin.next != None and not vaccin.next_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)

                else:
                    try:
                        vaccin.clean()
                    except(ValidationError):
                        return JsonResponse({"error": "Couldn't edit the vaccin - DATE ISSUE"}, status=400)
                    vaccin.save()
                    return JsonResponse(vaccin.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a vaccin route
    if request.method == "GET":
        #in this case, id : vaccin.id
        vactodel = get_object_or_404(Vaccine, pk=id)
        #vactodel = Vaccine.objects.get(pk=id)
        user = vactodel.user
        if user == request.user:
            vactodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the vaccin - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login')
def editvax(request, id): 
    #id : vaccin id
    if request.method == 'POST':
        vaccin = get_object_or_404(Vaccine, pk=id)
        #vaccin = Vaccine.objects.get(pk = id)
        user = vaccin.user
        # only the one who registered the vaccin can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get date if there is one
            dates = [date.strip() for date in data.get("date").split(",")]
            if dates != [""]:
                date1 = data.get("date", "")
                date2 = date.fromisoformat(date1)
                vaccin.date = date2
            
            #get let erase rappel
            ndates = [ndate.strip() for ndate in data.get("next").split(",")]
            if ndates != [""]:
                nextdate = data.get("next", "")
                nextdate = date.fromisoformat(nextdate)
                vaccin.next = nextdate
            else:
                vaccin.next = None


            kind = data.get("kind", "")
            vaccin.kind = kind
            if vaccin.next != None and not vaccin.next_is_valid :
                return JsonResponse({"error": "Couldn't edit the vaccin - DATE ISSUE"}, status=400)
        
            else :
                try:
                    vaccin.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the vaccin - DATE ISSUE"}, status=400)
                vaccin.save()
                return JsonResponse(vaccin.serialize(), safe=False, status=200)
        else:
            return JsonResponse({"error": "Couldn't edit the vaccin - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def newdate(request, id) :
    # create a new date route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        if user == request.user:       
            # get json data
            data = json.loads(request.body)
            date = data.get("date", "")
            limitinf = datetime(2021, 1, 1, 0, 0)
            limitsup = datetime(2025, 12, 31, 23, 59)
            date2 = datetime.strptime(date, "%Y-%m-%dT%H:%M")
            if date2 <= limitsup and date2 >= limitinf:
                ndate = Dates.objects.create(user=user, horse=horse, date=date)
                ndate.save()
            else:
                return JsonResponse({"error": "Couldn't create the date - wrong date range"}, status=400)

            #get date if there is one
            reasons = [reason.strip() for reason in data.get("reason").split(",")]
            if reasons != [""]:
                reason = data.get("reason", "")
                ndate.reason = reason
                ndate.save() 

            #get person if there is one
            others = [other.strip() for other in data.get("other").split(",")]
            if others != [""]:
                other = data.get("other", "")
                ndate.other = other
                ndate.save()

            return JsonResponse(ndate.serialize(), safe=False, status=200)
                               
        else:
            return JsonResponse({"error": "Couldn't create the date - NOT AUTHORIZED"}, status=401)

        # delete a date route
    if request.method == "GET":
        #in this case, id : date.id
        datetodel = get_object_or_404(Dates, pk=id)
        #datetodel = Dates.objects.get(pk=id)
        user = datetodel.user
        if user == request.user:
            datetodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the date - NOT AUTHORIZED"}, status=400)


    else : 
        return render(request, "horses/error.html") 


@login_required(login_url='login') 
def editdate(request, id):
    #id : date.id
    if request.method == 'POST':
        mydate = get_object_or_404(Dates, pk=id)
        #mydate = Dates.objects.get(pk = id)
        user = mydate.user
        # only the one who registered the date can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)
            
            #get person or erase it
            others = [other.strip() for other in data.get("other").split(",")]
            if others != [""]:
                other = data.get("other", "")
                mydate.other = other 
            else:
                mydate.other = "Non spécifié"

            reason = data.get("reason", "")
            mydate.reason = reason
            
            limitinf = datetime(2021, 1, 1, 0, 0)
            limitsup = datetime(2025, 12, 31, 23, 59)

            date = data.get("date", "")       
            date2 = datetime.strptime(date, "%Y-%m-%dT%H:%M")
            #date3 = date2.astimezone()
            # let naive on purpose : easier to handle javascript tendancies to change hours on its own that way, and no issues with DLS.
            
            if date2 <= limitsup and date2 >= limitinf:
                mydate.date = date
                mydate.save()
                return JsonResponse(mydate.serialize(), safe=False, status=200)

            
            else:
                return JsonResponse({"error": "Couldn't edit the date - WRONG DATE RANGE"}, status=400)
            
        else:
            return JsonResponse({"error": "Couldn't edit the date - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")
    


@login_required(login_url='login')
def farriery(request, id):
    # create a new farriery entry route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        if user == request.user:       
            form = NewFarriery(request.POST or None)
            if form.is_valid():
                farr = form.save(commit=False)
                farr.horse = horse
                farr.user = user
                try:
                    farr.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't create the farriery data - DATE RANGE ISSUE"}, status=400)
                farr.save()
                return JsonResponse(farr.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a farriery entry route
    if request.method == "GET":
        #in this case, id : farriery.id
        fartodel = get_object_or_404(Farriery, pk=id)
        user = fartodel.user
        if user == request.user:
            fartodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the farriery entry - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login') 
def editfarriery(request, id):
    #id: farr id
    if request.method == 'POST':
        far = get_object_or_404(Farriery, pk=id)
        user = far.user
        # only the one who registered the farriery entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get type or erase it
            types = [type.strip() for type in data.get("type").split(",")]
            if types != [""]:
                type = data.get("type", "")
                far.type = type
            else:
                far.type = "Non spécifié"
            
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            far.date = date2

            farrier = data.get("farrier", "")
            far.farrier = farrier

            try:
                far.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the farriery data - DATE RANGE ISSUE"}, status=400)

            far.save()

            return JsonResponse(far.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit farriery - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def dewormer(request, id):

    # delete a dewormer entry route
    if request.method == "GET":
        #in this case, id : dewormer.id
        dewtodel = get_object_or_404(Dewormer, pk=id)
        user = dewtodel.user
        if user == request.user:
            dewtodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the vaccin - NOT AUTHORIZED"}, status=400)
    
    # create a new dewormer entry route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        if user == request.user:       
            form = NewDewormer(request.POST or None)
            if form.is_valid():
                deworm = form.save(commit=False)
                deworm.horse = horse
                deworm.user = user
                if (deworm.nextdate != None and not deworm.next_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)

                else:
                    try:
                        deworm.clean()
                    except(ValidationError):
                        return JsonResponse({"error": "Couldn't edit the dewormer data - DATE RANGE ISSUE"}, status=400)
                    deworm.save()
                    return JsonResponse(deworm.serialize(), safe=False, status=200)
                   
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)




@login_required(login_url='login') 
def editdewormer(request, id):
    #id : id.dewormer
    if request.method == 'POST':
        dew = get_object_or_404(Dewormer, pk=id)
        user = dew.user
        # only the one who registered the dewormer entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get nextdate if there is one or erase it
            dates = [date.strip() for date in data.get("nextdate").split(",")]
            if dates != [""]:
                date1 = data.get("nextdate", "")
                date2 = date.fromisoformat(date1)
                dew.nextdate = date2                
            else:
                dew.nextdate = None
                
            
            #get let erase molecule or save it
            mols = [mol.strip() for mol in data.get("molecule").split(",")]
            if mols != [""]:
                molecule = data.get("molecule", "")
                dew.molecule = molecule
                
            else:
                dew.molecule = ''
                

            #get let erase next name or save it
            names = [name.strip() for name in data.get("nextname").split(",")]
            if names != [""]:
                nextname = data.get("nextname", "")
                dew.nextname = nextname
                
            else:
                dew.nextname = ''
                

            ndate = data.get("date", "")
            date3 = date.fromisoformat(ndate)
            dew.date = date3
            name = data.get("name", "")
            dew.name = name

            if dew.nextdate != None and not dew.next_is_valid :
                return JsonResponse({"error": "Couldn't edit the dewormer - DATE ISSUE"}, status=400)
            else:
                try:
                    dew.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the dewormer data - DATE RANGE ISSUE"}, status=400)
                dew.save()
                return JsonResponse(dew.serialize(), safe=False, status=200)
        else:
            return JsonResponse({"error": "Couldn't edit the dewormer - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def dentistry(request, id):
    # create a new dentistry entry route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        #horse = Horse.objects.get(pk = id)
        user = horse.owner
        if user == request.user:       
            form = NewDentistry(request.POST or None)
            if form.is_valid():
                dent = form.save(commit=False)
                dent.horse = horse
                dent.user = user
                try:
                    dent.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the dentistry data - DATE RANGE ISSUE"}, status=400)
                dent.save()
                return JsonResponse(dent.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a dentistry entry route
    if request.method == "GET":
        #in this case, id : dentistry.id
        denttodel = get_object_or_404(Dentistry, pk=id)
        #denttodel = Dentistry.objects.get(pk=id)
        user = denttodel.user
        if user == request.user:
            denttodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the dentistry entry - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login') 
def editdentistry(request, id):
    # id : dentistry.id
    if request.method == 'POST':
        dentistry = get_object_or_404(Dentistry, pk=id)
        #dentistry = Dentistry.objects.get(pk = id)
        user = dentistry.user
        # only the one who registered the dentistry entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get diag or erase it
            diags = [diag.strip() for diag in data.get("diagnostic").split(",")]
            if diags != [""]:
                diagnostic = data.get("diagnostic", "")
                dentistry.diagnostic = diagnostic
            else:
                dentistry.diagnostic = ''
            
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            dentistry.date = date2
            dentist = data.get("dentist", "")
            dentistry.dentist = dentist

            try:
                dentistry.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the dentistry data - DATE RANGE ISSUE"}, status=400)

            dentistry.save()

            return JsonResponse(dentistry.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit dentistry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")


@login_required(login_url='login')
def editpedigree(request, id):
    #id : horseid
    if request.method == 'POST':    
        horse = get_object_or_404(Horse, pk=id)
        # same than horse = Horse.objects.get(pk=id)       
        user = horse.owner
        if request.user == user:
            # get json data
            data = json.loads(request.body)

            #get sire or erase it and same for all the entries
            sires = [sire.strip() for sire in data.get("sire").split(",")]
            if sires != [""]:
                sire = data.get("sire", "")
                horse.sire = sire
            else:
                horse.sire = ''

            siresires = [siresire.strip() for siresire in data.get("siresire").split(",")]
            if siresires != [""]:
                siresire = data.get("siresire", "")
                horse.siresire = siresire
            else:
                horse.siresire = ''

            siredams = [siredam.strip() for siredam in data.get("siredam").split(",")]
            if siredams != [""]:
                siredam = data.get("siredam", "")
                horse.siredam = siredam
            else:
                horse.siredam = ''
            
            dams = [dam.strip() for dam in data.get("dam").split(",")]
            if dams != [""]:
                dam = data.get("dam", "")
                horse.dam = dam
            else:
                horse.dam = ''
            
            damsires = [damsire.strip() for damsire in data.get("damsire").split(",")]
            if damsires != [""]:
                damsire = data.get("damsire", "")
                horse.damsire = damsire
            else:
                horse.damsire = ''
            
            damdams = [damdam.strip() for damdam in data.get("damdam").split(",")]
            if damdams != [""]:
                damdam = data.get("damdam", "")
                horse.damdam = damdam
            else:
                horse.damdam = ''

            horse.save()
            return JsonResponse(horse.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit pedigree - NOT AUTHORIZED"}, status=400)

    else:
        return render(request, "horses/error.html")


@login_required(login_url='login') 
def osteopathy(request, id):
    # create a new osteopathy entry route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewOsteo(request.POST or None)
            if form.is_valid():
                os = form.save(commit=False)
                os.horse = horse
                os.user = user
                try:
                    os.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't create the osteo data - DATE RANGE ISSUE"}, status=400)
                os.save()
                return JsonResponse(os.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a osteopathy entry route
    if request.method == "GET":
        #in this case, id : osteo.id
        ostodel = get_object_or_404(Osteopathy, pk=id)
        user = ostodel.user
        if user == request.user:
            ostodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the osteopathy entry - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login') 
def editosteopathy(request, id):
    # id: osteoid
    if request.method == 'POST':
        os = get_object_or_404(Osteopathy, pk=id)
        user = os.user
        # only the one who registered the osteo entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get diag or erase it
            diags = [diag.strip() for diag in data.get("diagnostic").split(",")]
            if diags != [""]:
                diagnostic = data.get("diagnostic", "")
                os.diagnostic = diagnostic
            else:
                os.diagnostic = ''

            #get reeducation or erase it
            reeds = [reed.strip() for reed in data.get("reeducation").split(",")]
            if reeds != [""]:
                reeducation = data.get("reeducation", "")
                os.reeducation = reeducation
            else:
                os.reeducation = ''
            
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            os.date = date2
            osteo = data.get("osteo", "")
            os.osteo = osteo

            try:
                os.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the osteo data - DATE RANGE ISSUE"}, status=400)
            os.save()

            return JsonResponse(os.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit osteopathy entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def contest(request, id):
    # create a new contest entry route
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewContest(request.POST or None)
            if form.is_valid():
                contest = form.save(commit=False)
                contest.horse = horse
                contest.user = user
                try:
                    contest.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the contest - DATE RANGE ISSUE"}, status=400)
                contest.save()
                return JsonResponse(contest.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a contest entry route
    if request.method == "GET":
        #in this case, id : contest.id
        cctodel = get_object_or_404(Contest, pk=id)
        user = cctodel.user
        if user == request.user:
            cctodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the contest entry - NOT AUTHORIZED"}, status=400)



@login_required(login_url='login') 
def editcontest(request, id): 
    # id: contestid
    if request.method == 'POST':
        contest = get_object_or_404(Contest, pk=id)
        user = contest.user
        # only the one who registered the contest entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get rider or erase it
            riders = [rider.strip() for rider in data.get("rider").split(",")]
            if riders != [""]:
                rider = data.get("rider", "")
                contest.rider = rider
            else:
                contest.rider = ''

            #get discipline or erase it
            disciplines = [discipline.strip() for discipline in data.get("discipline").split(",")]
            if disciplines != [""]:
                discipline = data.get("discipline", "")
                contest.discipline = discipline
            else:
                contest.discipline = ''

            #get division or erase it
            divisions = [division.strip() for division in data.get("division").split(",")]
            if divisions != [""]:
                division = data.get("division", "")
                contest.division = division
            else:
                contest.division = ''

            #get result or erase it
            results = [result.strip() for result in data.get("result").split(",")]
            if results != [""]:
                result = data.get("result", "")
                contest.result = result
            else:
                contest.result = ''

            
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            contest.date = date2
            place = data.get("place", "")
            contest.place = place

            try:
                contest.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the contest - DATE RANGE ISSUE"}, status=400)
            contest.save()

            return JsonResponse(contest.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit contest entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login') 
def incident(request, id):
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewIncident(request.POST or None)
            if form.is_valid():
                incident = form.save(commit=False)
                incident.horse = horse
                incident.user = user
                try:
                    incident.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't create the incident - DATE ISSUE"}, status=400)
                incident.save()
                return JsonResponse(incident.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a incident entry route
    if request.method == "GET":
        #in this case, id : incident.id
        inctodel = get_object_or_404(Incident, pk=id)
        user = inctodel.user
        if user == request.user:
            inctodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the incident entry - NOT AUTHORIZED"}, status=400)



@login_required(login_url='login') 
def editincident(request, id):
    # id: incidentid
    if request.method == 'POST':
        incident = get_object_or_404(Incident, pk=id)
        user = incident.user
        # only the one who registered the entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get diagnostic or erase it
            diags = [diag.strip() for diag in data.get("diagnostic").split(",")]
            if diags != [""]:
                diagnostic = data.get("diagnostic", "")
                incident.diagnostic = diagnostic
            else:
                incident.diagnostic = ''

            #get prescription or erase it
            prescs = [presc.strip() for presc in data.get("prescription").split(",")]
            if prescs != [""]:
                prescription = data.get("prescription", "")
                incident.prescription = prescription
            else:
                incident.prescription = ''

            #get notes or erase it
            notes = [note.strip() for note in data.get("notes").split(",")]
            if notes != [""]:
                newnotes = data.get("notes", "")
                incident.notes = newnotes
            else:
                incident.notes = ''

            
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            incident.date = date2

            vet = data.get("vet", "")
            incident.vet = vet
            reason = data.get("reason", "")
            incident.reason = reason

            try:
                incident.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the incident - DATE ISSUE"}, status=400)
                
            incident.save()

            return JsonResponse(incident.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit incident entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def breeding(request, id):
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewBreedStallion(request.POST or None)
            if form.is_valid():
                breeding = form.save(commit=False)
                breeding.horse = horse
                breeding.user = user
                try:
                    breeding.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't create the breeding data - DATE RANGE ISSUE"}, status=400)
                breeding.save()
                return JsonResponse(breeding.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a breeding entry route
    if request.method == "GET":
        #in this case, id : breeding.id
        breetodel = get_object_or_404(Breeding, pk=id)
        user = breetodel.user
        if user == request.user:
            breetodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the breeding entry - NOT AUTHORIZED"}, status=400)



@login_required(login_url='login')
def editbreeding(request, id):
    # id: breedingid
    if request.method == 'POST':
        breeding = get_object_or_404(Breeding, pk=id)
        user = breeding.user
        # only the one who registered the breeding entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get notes or erase it
            notes = [note.strip() for note in data.get("notes").split(",")]
            if notes != [""]:
                newnotes = data.get("notes", "")
                breeding.notes = newnotes
            else:
                breeding.notes = ''
    
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            breeding.date = date2
            mare = data.get("mare", "")
            breeding.mare = mare
            try:
                breeding.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the breeding data - DATE RANGE ISSUE"}, status=400)
            breeding.save()

            return JsonResponse(breeding.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit breeding entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def bred(request, id):
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewBredMare(request.POST or None)
            if form.is_valid():
                bredm = form.save(commit=False)
                bredm.horse = horse
                bredm.user = user
                try:
                    bredm.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't create the breeding(f) data - DATE RANGE ISSUE"}, status=400)
                bredm.save()
                return JsonResponse(bredm.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a breeding entry route
    if request.method == "GET":
        #in this case, id : bred.id
        bredtodel = get_object_or_404(Bred, pk=id)
        user = bredtodel.user
        if user == request.user:
            bredtodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the breeding (female) entry - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login')
def editbred(request, id):
    # id: breedingid
    if request.method == 'POST':
        bred = get_object_or_404(Bred, pk=id)
        user = bred.user
        # only the one who registered the breeding entry can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)

            #get notes or erase it
            notes = [note.strip() for note in data.get("notes").split(",")]
            if notes != [""]:
                newnotes = data.get("notes", "")
                bred.notes = newnotes
            else:
                bred.notes = ''
    
            date1 = data.get("date", "")
            date2 = date.fromisoformat(date1)
            bred.date = date2

            stallion = data.get("stallion", "")
            bred.stallion = stallion

            try:
                bred.clean()
            except(ValidationError):
                return JsonResponse({"error": "Couldn't edit the breeding(f) data - DATE RANGE ISSUE"}, status=400)

            bred.save()

            return JsonResponse(bred.serialize(), safe=False, status=200)

        else:
            return JsonResponse({"error": "Couldn't edit breeding (female) entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")



@login_required(login_url='login')
def heat(request, id):
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewHeat(request.POST or None)
            if form.is_valid():
                heat = form.save(commit=False)
                heat.horse = horse
                heat.user = user
                if (heat.dateend != None and not heat.next_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)

                else:
                    try:
                        heat.clean()
                    except(ValidationError):
                        return JsonResponse({"error": "Couldn't create the heat - DATE RANGE ISSUE"}, status=400)
                    heat.save()
                    return JsonResponse(heat.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a heat entry route
    if request.method == "GET":
        #in this case, id : vaccin.id
        heattodel = get_object_or_404(Heats, pk=id)
        user = heattodel.user
        if user == request.user:
            heattodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the heat entry - NOT AUTHORIZED"}, status=400)



@login_required(login_url='login')
def editheat(request, id):
    #id : heat id
    if request.method == 'POST':
        heat = get_object_or_404(Heats, pk=id)
        user = heat.user
        # only the one who registered the heat can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)
            
            # let erase end date or get it
            dates = [date.strip() for date in data.get("dateend").split(",")]
            if dates != [""]:
                dateend = data.get("dateend", "")
                date2 = date.fromisoformat(dateend)
                heat.dateend = date2
            else:
                heat.dateend = None

            datest = data.get("datestart", "")
            date3 = date.fromisoformat(datest)
            heat.datestart = date3

            if heat.dateend != None and not heat.next_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)
            
            else :
                try:
                    heat.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the heat - DATE RANGE ISSUE"}, status=400)
                heat.save()
                return JsonResponse(heat.serialize(), safe=False, status=200)
        else:
            return JsonResponse({"error": "Couldn't edit the heat entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")


@login_required(login_url='login') 
def gestation(request, id):
    if request.method == "POST":
        #id: horse.id
        horse = get_object_or_404(Horse, pk=id)
        user = horse.owner
        if user == request.user:       
            form = NewGestation(request.POST or None)
            if form.is_valid():
                gest = form.save(commit=False)
                gest.horse = horse
                gest.user = user
                if (gest.echo1 != None and not gest.echo1_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)
                elif (gest.echo2 != None and not gest.echo2_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)
                elif (gest.echo3 != None and not gest.echo3_is_valid):
                    return JsonResponse({"error": "date error"}, status=400)
                elif (gest.echo1 != None and gest.echo2 != None and not gest.echos12_are_valid):
                    return JsonResponse({"error": "date error"}, status=400)
                elif (gest.echo1 != None and gest.echo3 != None and not gest.echos13_are_valid):
                    return JsonResponse({"error": "date error"}, status=400)
                elif (gest.echo3 != None and gest.echo2 != None and not gest.echos23_are_valid):
                    return JsonResponse({"error": "date error"}, status=400)

                else:
                    try:
                        gest.clean()
                    except(ValidationError):
                        return JsonResponse({"error": "Couldn't create the gestation data - DATE RANGE ISSUE"}, status=400)
                    gest.save()
                    dateend = gest.datestart + timedelta(days=340)
                    gest.dateend = dateend
                    gest.save()
                    return JsonResponse(gest.serialize(), safe=False, status=200)
            else :
                return JsonResponse({"error": "Couldn't create the entry - INVALID FORM"}, status=400)
        else:
            return JsonResponse({"error": "Couldn't create the entry - NOT AUTHORIZED"}, status=400)

    # delete a gestation entry route
    if request.method == "GET":
        #in this case, id : gestation.id
        gesttodel = get_object_or_404(Gestation, pk=id)
        user = gesttodel.user
        if user == request.user:
            gesttodel.delete()  
            return JsonResponse({"message": "Success"}, status=201)
        else:
            return JsonResponse({"error": "Couldn't delete the gestation entry - NOT AUTHORIZED"}, status=400)


@login_required(login_url='login') 
def editgestation(request, id):
    #id : gest id
    if request.method == 'POST':
        gest = get_object_or_404(Gestation, pk=id)
        user = gest.user
        # only the one who registered the gestation can alter its infos.
        if user == request.user :
            # get json data
            data = json.loads(request.body)
            
            # let erase end date or get it
            dates = [date.strip() for date in data.get("dateend").split(",")]
            if dates != [""]:
                dateend = data.get("dateend", "") 
                dateend2 = date.fromisoformat(dateend)
                gest.dateend = dateend2
            else:
                gest.dateend = None

            # let erase realend date or get it
            rdates = [rdate.strip() for rdate in data.get("realend").split(",")]
            if rdates != [""]:
                realend = data.get("realend", "") 
                realend2 = date.fromisoformat(realend)
                gest.realend = realend2
            else:
                gest.realend = None

            # let erase echo1 or get it
            e1dates = [e1date.strip() for e1date in data.get("echo1").split(",")]
            if e1dates != [""]:
                echo1 = data.get("echo1", "") 
                datee1 = date.fromisoformat(echo1)
                gest.echo1 = datee1
            else:
                gest.echo1 = None

            # let erase echo2 or get it
            e2dates = [e2date.strip() for e2date in data.get("echo2").split(",")]
            if e2dates != [""]:
                echo2 = data.get("echo2", "") 
                datee2 = date.fromisoformat(echo2)
                gest.echo2 = datee2
            else:
                gest.echo2 = None

            # let erase echo3 or get it
            e3dates = [e3date.strip() for e3date in data.get("echo3").split(",")]
            if e3dates != [""]:
                echo3 = data.get("echo3", "") 
                datee3 = date.fromisoformat(echo3)
                gest.echo3 = datee3
            else:
                gest.echo3 = None
            
            # let erase notes or get it
            notes = [note.strip() for note in data.get("notes").split(",")]
            if notes != [""]:
                note = data.get("notes", "") 
                gest.notes = note
            else:
                gest.notes = ''

            datest = data.get("datestart", "")
            datest2 = date.fromisoformat(datest)
            if datest2 != gest.datestart:
                gest.dateend = datest2 + timedelta(days=340)
            gest.datestart = datest2
            
            vet = data.get("vet", "")
            gest.vet = vet

            if gest.dateend != None and not gest.endprev_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)

            elif gest.realend != None and not gest.realend_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)
            
            elif gest.echo1 != None and not gest.echo1_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)
            
            elif gest.echo2 != None and not gest.echo2_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)
            
            elif gest.echo3 != None and not gest.echo3_is_valid :
                return JsonResponse({"error": "Couldn't edit the heat entry - DATE ISSUE"}, status=400)
            
            else :
                try:
                    gest.clean()
                except(ValidationError):
                    return JsonResponse({"error": "Couldn't edit the gestation data - DATE RANGE ISSUE"}, status=400)
                gest.save()
                return JsonResponse(gest.serialize(), safe=False, status=200)
        else:
            return JsonResponse({"error": "Couldn't edit the gestation entry - NOT AUTHORIZED"}, status=400)
            
    else:
        return render(request, "horses/error.html")


##################################FIN HORSES FUNCTIONS###################################################################

####################################### GENERAL FUNCTIONS#################################################################

@login_required(login_url='login') 
def search(request, id_user, context):

    if request.method == "POST":
        user = get_object_or_404(User, pk=id_user)
        #user = User.objects.get(pk = id_user)
        # get data
        data = json.loads(request.body)
        
        #case where we search a contact
        if context == "contact":
            person = data.get("search", "")
            results = Repertory.objects.filter(user=user, name__icontains=person).order_by('name')
            return JsonResponse([result.serialize() for result in results], safe=False)
        
        # case where we search an item
        if context == "item" :
            research = data.get("search", "")
            results = Inventory.objects.filter(user= user, name__icontains=research).order_by('-created', 'name')                       
            return JsonResponse([result.serialize() for result in results], safe=False)

        # case where we search a job
        if context == "job" :
            research = data.get("search", "")
            research2 = jobs[research][1]
            print(research2)
            results = Repertory.objects.filter(user= user, job=research2).order_by('name')                       
            return JsonResponse([result.serialize() for result in results], safe=False)
                
    else:
        return render(request, "horses/error.html")




@login_required(login_url='login')
def yearview(request, id_horse, year, context):
    # id : horse id.  context : type of data, year you want
    # return the entries of the years asked. 
    if request.method == "GET":
        if request.user.is_authenticated:
            horse = get_object_or_404(Horse, pk=id_horse)
            #horse = Horse.objects.get(pk = id_horse)
            user = horse.owner
            actualyear = datetime.now().year

            if request.user == user :
                if context == "dates":
                    if year != 1111:
                        dates = Dates.objects.filter(horse = horse, date__icontains=year).order_by('-date')
                    else:     
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        dates = Dates.objects.filter(horse = horse, date__gte=x).order_by('-date')

                    return JsonResponse([date.serialize() for date in dates], safe=False)

                if context == "heats":
                    if year != 1111:
                        heats = Heats.objects.filter(horse = horse, datestart__icontains=year).order_by('-datestart')
                    else:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        heats = Heats.objects.filter(horse = horse, datestart__gte=x).order_by('-datestart')
                    
                    return JsonResponse([heat.serialize() for heat in heats], safe=False)

                if context == "vaccins":
                    if year != 1001 and year != 1111:
                        vaccins = Vaccine.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        vaccins = Vaccine.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        vaccins = Vaccine.objects.filter(horse = horse, date__gte=x).order_by('-date')

                    return JsonResponse([vaccin.serialize() for vaccin in vaccins], safe=False)

                if context == "farriery":
                    if year != 1001 and year != 1111:
                        fars = Farriery.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        fars = Farriery.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        fars = Farriery.objects.filter(horse = horse, date__gte=x).order_by('-date')

                    return JsonResponse([far.serialize() for far in fars], safe=False)


                if context == "incident":
                    if year != 1000:
                        incs = Incident.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1000:
                        inf_limit = actualyear - 4
                        y = datetime(inf_limit, 1, 1)
                        incs = Incident.objects.filter(horse=horse, date__lte=y).order_by('-date')
        
                    return JsonResponse([inc.serialize() for inc in incs], safe=False)

                if context == "contest":
                    if year != 1001 and year != 1111:
                        contests = Contest.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        contests = Contest.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        contests = Contest.objects.filter(horse = horse, date__gte=x).order_by('-date')

                    return JsonResponse([contest.serialize() for contest in contests], safe=False)
                
                if context == "breeding":
                    if year != 1001 and year != 1111:
                        breedings = Breeding.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        breedings = Breeding.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        breedings = Breeding.objects.filter(horse=horse, date__gte=x).order_by('-date')

                    return JsonResponse([breed.serialize() for breed in breedings], safe=False)

                if context == "bred":
                    if year != 1001 and year != 1111:
                        breds = Bred.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        breds = Bred.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        breds = Bred.objects.filter(horse=horse, date__gte=x).order_by('-date')

                    return JsonResponse([bred.serialize() for bred in breds], safe=False)

                if context == "dewormer":
                    if year != 1001 and year != 1111:
                        dews = Dewormer.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    elif year == 1001:
                        inf_limit = actualyear - 2
                        y = datetime(inf_limit, 1, 1)
                        dews = Dewormer.objects.filter(horse=horse, date__lte=y).order_by('-date')
                    elif year == 1111:
                        yeartwo = actualyear+2
                        x = datetime(yeartwo, 12, 31)
                        dews = Dewormer.objects.filter(horse = horse, date__gte=x).order_by('-date')

                    return JsonResponse([dew.serialize() for dew in dews], safe=False)

                if context == "dentistry":
                    if year != 1000:
                        dents = Dentistry.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    else:
                        inf_limit = actualyear - 4
                        x = datetime(inf_limit, 1, 1)
                        dents = Dentistry.objects.filter(horse=horse, date__lte=x).order_by('-date')

                    return JsonResponse([dent.serialize() for dent in dents], safe=False)

                if context == "osteopathy":
                    if year != 1000:
                        osteos = Osteopathy.objects.filter(horse=horse, date__icontains=year).order_by('-date')
                    else :
                        inf_limit = actualyear - 4
                        x = datetime(inf_limit, 1, 1)
                        osteos = Osteopathy.objects.filter(horse=horse, date__lte=x).order_by('-date')
                    
                    return JsonResponse([osteo.serialize() for osteo in osteos], safe=False)

                if context == "gestation":
                    if year != 1000:
                        gests = Gestation.objects.filter(horse=horse, datestart__icontains=year).order_by('-datestart')
                    else :
                        inf_limit = actualyear - 4
                        x = datetime(inf_limit, 1, 1)
                        gests = Gestation.objects.filter(horse=horse, datestart__lte=x).order_by('-datestart')
                    
                    return JsonResponse([gest.serialize() for gest in gests], safe=False)


                else:
                    return JsonResponse({"error": "Couldn't charge data - NOT FOUND"}, status=400)
            else:
                return JsonResponse({"error": "Couldn't charge data - NOT AUTHORIZED"}, status=400)    
        else:
            return JsonResponse({"error": "Couldn't charge data - NOT AUTHORIZED/LOG IN."}, status=400)

    else:
        return render(request, "horses/error.html")


