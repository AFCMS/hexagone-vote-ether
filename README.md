# Hexagone Vote Ether

This web application is a frontend to a [smart contract](https://sepolia.etherscan.io/address/0x07dc061bf3c8e7f5db6d908b4e86eb9f0ab5fa35) that allows users to vote between [Léon Blum](https://en.wikipedia.org/wiki/L%C3%A9on_Blum), [Jacques Chirac](https://en.wikipedia.org/wiki/Jacques_Chirac) and [François Mitterrand](https://en.wikipedia.org/wiki/Fran%C3%A7ois_Mitterrand) using the **Ethereum** blockchain (Sepolia testnet).

## Questions

### Etape 1

Les données de la blockchain sont publiques et accessibles à tous, pas besoin d'être connecté pour les consulter. (ici on n'utilise MetaMask que pour les transactions en écriture, la récupération se fait via un provider JSON-RPC)

### Etape 2

L’adresse ne suffit pas pour voter, il faut signer la transaction avec la clé privée associée à l'addresse, qui est gérée par MetaMask.

### Etape 3

Le smart contract vérifie le cooldown, pas le frontend. C'est lui qui contient la logique des règles du vote.

### Etape 4

`Date.now()` dépend de l'heure du système de l'utilisateur qui peut être modifiée ou incorrecte.

On utilise donc `block.timestamp` qui est une valeur fournie par la blockchain et ne peut pas être manipulée par les utilisateurs.

### Etape 5

On doit appeler `listenContract.off()` dans le return du useEffect pour éviter de créer des listeners à chaque refraichissement du composant React.

### Etape 6

`parentHash` contient le hash du bloc précédent, donc si on modifie un bloc passé le hash du bloc modifié changera.

Tous les blocs suivants seront invalidés car ils référencent le hash du bloc modifié.

Pour modifier un bloc passé, il faudrait recalculer tous les blocs suivants avec le consensus du réseau de validateurs, ce qui est pratiquement impossible avec une blockchain publique.
