# Hexagone Vote Ether

## Questions

### Etape 4

`Date.now()` dépend de l'heure du système de l'utilisateur qui peut être modifiée ou incorrecte.

On utilise donc `block.timestamp` qui est une valeur fournie par la blockchain et ne peut pas être manipulée par les utilisateurs.

### Etape 5

On doit appeler `listenContract.off()` dans le return du useEffect pour éviter de créer des listeners à chaque refraichissement du composant React.

### Etape 6

`parentHash` contient le hash du bloc précédent, donc si on modifie un bloc passé le hash du bloc modifié changera.

Tous les blocs suivants seront invalidés car ils référencent le hash du bloc modifié.

Pour modifier un bloc passé, il faudrait recalculer tous les blocs suivants avec le consensus du réseau de validateurs, ce qui est pratiquement impossible avec une blockchain publique.
