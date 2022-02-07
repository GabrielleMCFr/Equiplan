# EQUIPLAN

## equiplan.herokuapp.com

### Intro
My application, Equiplan, is a planning application for horses owners, breeders, etc. Its main purpose is compiling every date and data we need to remember in one app. When one have a lot of horses, with a lot a different protocols for vaccines, dewormers, breedings etc, we always strugle to remember all of it for every horse, and this app helps in that. It also send emails notifications as reminders. It's in french, since I want to deploy it later for french users.


### Distinctiveness
This app is a planning application, not a network, neither a e-commerce, an encyclopedia or a mail app, so it should be distinct.


### Complexity
The challenge was mostly dealing with a lot a differents tables, differents views, handling media files, and in general, a far bigger application than the projects we had to work on. I also looked for some security measures, since it's meant to be deployed at some point. My goal is to make something useful and secure, and this kind of planning app is something we, as horses owners, need for a quite a long time. 
I also had to look into more precise configurations to have a better understanding of setting.py, to be able to send mails, or to make celery work. The queries are also more complex than the ones we used in the projects. I had to think about security measures, and made choices like not allow the users to upload medical prescriptions (some common horses drugs are used by some people for recreational uses or doping, so with the risks it represents, I believe I should not allow to upload any of the prescriptions) and instead limit the upload to one picture for the user's profile, and one for each horse. I also had to think about things that could go wrong with malicious users, and tried to check things client side - for the user comfort, and server - side, for security. I probably still have a lot of things to improve, though.


### Files
I have one application on my project, named horses.

In this app, we find in static directory every css or scss file (styles.css, styles2.css, and the directory scss), some pictures used for the app, and every js file corresponding to their view. 
Except for the horse view, the main part of the project, who has three differents js files (horse, horsef, horsem). Since a management of breeding-related data is part of the application, the views are differents depending of the horse's sex. I have a main base, horse, and then horsef have every functions in horse + its own views management and some other functions. Same thing for horsem, which is for stallions. It made me copy/paste a lot of functions from horse.js, but I thought it was clearer that way, with all the different views to manage.
The other js files are for inventory.js (for inventory.html), mycontact.js (for contact.html which display the data of a specific contact of a user), mycontacts.js (for contacts.html, which display the contacts list of the user) and myprofile.js (for profile.html, which display the profile of the user)

Then in templates, we find every templates. 
- index.html is the htlm file that display every date or things to remember about the horses of the users in the 14 next days. That way, the user can see easily what is coming soon.
- inventory.html is the html file that display the inventory of the user and allow them to modify, add, and delete items.
- contact.html is the html file that display the data of a specific contact of a user, and allow the user to edit and delete a contact.
- contacts.html is the html file that display the list of the contacts of a user, and allow them to go to a specific contact, add a new one or search for one.
- myhorses.html is the htlm that display the list of the horses of a user, and allow them to go to a specific horse or add a new one. 
- horse.html is the main part of the app, it allows the user to consult all the data for a specific horse. You have several views for each subject to make it clearer.
- error.html is a template error.
- cleanup.html is a template for a superuser to manually ask for cleaning up inactive user when their confirmation link has expired.
- activation.html is a template to show the activation of the account
- contact-us.html is a template that display informations to contact me
- goodbye.html is a template for when an account is deleted.
- help.html is a template to show the users how to use to application
- layout.htlm is the base template for all the others
- login.html is the template to log in
- register.html is the template to register
- notifications.html, activeacc.html, and resetpassword.html are the template that are sent as mail for confirmation/reset password or notifications.
- password_mail_sent.html, passwordreset.html, passwordsuccess.html, passwordfailure.htlm, setnewpassword.html are all the templates used to reset a forgotten password.
- politique-de-confidentialite.html is the html file that display the confidentality policy
- stateuser.html the template who shows the actual state of an account (ex: if the user try to activate it twice)


We have a media directory, where every picture of the users can go. Horses picture go to the directory horses, and the profile pictures go to the directory profiles.

We have several files, init.py, admin.py, apps.py, forms.py, models.py, urls.py, views.py (the functions in views are organized as superuser functions/ user functions / inventory functions / contacts functions / horses functions and general functions so it's clearer)

- tasks.py create periodic tasks for celery 
- tokens.py crate tokens for emails with a link.
- I added a file named celery.py in the main project directory to manage notifications emails.



### How to run Equiplan

I tried to build it so it would be intuitive.

First when the user register, he will receive a mail to confirm their email. When clicking on the link in it in less than 30 minutes after having been sent, the user confirms their email, and they can log in with the "se connecter" option in the navbar.

Logged in, you have 6 options in the navbar : Accueil (index), Mes chevaux (my horses), Mes contacts (my contacts), Mon inventaire (my inventory), Mon profil (my profile), and Se déconnecter(log out).

By clicking on "Accueil", you have the index view with all the dates for the 14 next days. If you click on an item, you're redirected to the horse's page.

By clicking on "Mes chevaux", you have a list of your horses already registered, the possibility to access their own page by clicking on their name, or add a new horse with the button "ajouter un nouveau cheval". 

If you click on a horse name, you have access to their page. In this page, you can edit the horse's informations, the picture by clicking on it or the grey round, or you can add data in specific categories that you access by clicking on the buttons bar. The categories are, in english : Notes, Dates, Farriery, Vaccines, Dewormers, Dentistry, Ostéopathy, Incidents, Contests, Pedigree and, if the horse is a mare or a stallion, Breeding. Each view shows a table with the possibility to add new data by clicking on the button (ajouter) and, if you change your mind, go back with the button (retour). You see the data already existing and change the content of the rows depending of which year you want to have access to (button 'Année'). For every row, you can edit the data ( the hand icon) or erase it(the cross icon). For two categories, incidents and if the horse is a mare, the subcategory gestation in the breeding view, you have a third possible action in each row, an eye icon that make a modal appear to access all the infos of the row, since it's too big to be contained in a table and stay readable. From each modal, you can close it or edit the data. 
It works the same way for all categories. 

By clicking on "Mes contacts", you have access to a page that displays your contacts already existing, gives you the possibility to add a new one (button ' ajouter un contact ') or have access to the details of a specific contact by clicking on their name. You can  also search for a specific contact with their job, or a search box. 

If you click on a contact, you have access to their page. From there, you can edit the data (button 'Modifier') or erase the contact altogether.

By clicking on "Mon inventaire", you are redirected to a page that display the inventory of the user. It works like a horse page, you can add new data with 'ajouter', you have a table of your inventory of the year (you can change the content of the table with the button 'Année' for the year you want to have access to), and for each item, you can see its informations in the table, and have three actions : edit it with the hand, declaring it empty by clicking on the little trash, and the whole row will appear in grey, and erase it with the cross. If you have entered a peremptive date, once we're past it, the date automatically appears in red to alert the user, except if it's already empty.

By clicking on "Mon profil", you have access to your profile, where you can edit your informations or change your password, and use a checkbox to say if you want to have emails notifications of your oncoming dates. You can also change your picture by clicking on it ( or the grey round if there is no picture). You can also erase your whole account, a confirmation will be asked.

By clicking on "Se déconnecter", you log out.











