Partie 1
 Créant un formulaire avec la méthode Reactive Forms.
 Structurant un projet Angular avec plusieurs composants.
 Implémentant la validation côté client.
 Utilisant la communication entre composants (@Input).
 Préparant l’affichage dynamique d’un composant récapitulatif.
 Préparant la future intégration du backend.
Consignes
1️⃣ Structure du formulaire
Créez un formulaire de déclaration de pollution avec les champs suivants :
 Titre de la pollution (texte, requis)
 Type de pollution (liste déroulante : Plastique, Chimique, Dépôt sauvage, Eau, Air, Autre — requis)
 Description (textarea, requis)
 Date de l’observation (date, requis)
 Lieu (texte, requis)
 Latitude (nombre, requis)
 Longitude (nombre, requis)
 Photo (URL) (texte, optionnel)
 Un bouton Déclarer valide le formulaire.
2️⃣ Validation et logique
Implémentez la validation avec Reactive Forms :
 Tous les champs requis doivent être validés.
 La latitude et la longitude doivent être des nombres valides.
 La date doit être correcte.
 Quand le formulaire est valide :
 Masquez le formulaire.
 Passez les données au composant recap via un @Input().
 Affichez le récapitulatif dans la même page, sans rechargement ni navigation vers une route externe.
Affichage du récapitulatif
 Affichez toutes les données saisies.
 Si une URL de photo est fournie, affichez l’image.

 Organisez l’affichage de façon claire, structurée et responsive.

Partie 2
objectif de mettre en pratique vos compétences Angular en :
Créant un service injectable.
Utiliser HttpClient pour communiquer avec un backend mocké.
Gérer dynamiquement une liste de pollutions.
Implémenter les opérations CRUD (Create, Read, Update, Delete).
Mettre en place une page de détail d'une pollution.
Approcher la gestion des environnements pour distinguer les URL d’API.

Consignes
1️⃣ Structure du service
Créez un service qui interface ls API CRUD de gestion des pollutions :
Ajouter une pollution.
Afficher la liste des pollutions existantes.
Accéder au détail d’une pollution.
Modifier une pollution existante.
Supprimer une pollution.

2️⃣ Evolution de l’interface
Implémentez l’affichage des pollutions :
Affichage de la liste des pollutions (avec bouton de suppression).
Filtrer les pollutions suivant plusieurs critères
Détail d’une pollution.
Utilisation de l’environnement Angular pour configurer l’URL de l’API selon l’environnement (dev/prod).


Note:  
asset/mock : 
d'abord mock, mais en faite api