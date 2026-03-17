# Hexagone Vote Ether

This web application is a frontend to a [smart contract](https://sepolia.etherscan.io/address/0x07dc061bf3c8e7f5db6d908b4e86eb9f0ab5fa35) that allows users to vote between [Léon Blum](https://en.wikipedia.org/wiki/L%C3%A9on_Blum), [Jacques Chirac](https://en.wikipedia.org/wiki/Jacques_Chirac) and [François Mitterrand](https://en.wikipedia.org/wiki/Fran%C3%A7ois_Mitterrand) using the **Ethereum** blockchain (Sepolia testnet).

What follows are our comprehension questions raised as part of the learning project.

## Questions

### Etape 1

```
Pourquoi les scores s'affichent-ils sans que vous ayez connecté MetaMask ?
Quelle propriété de la blockchain rend cela possible ?
```

La blockchain est par nature publique, ainsi les méthodes (excepté `vote`) du smart contract. MetaMask pourrait être utilisé pour récupéré ces données publiques,
mais nous avons utilisé un provider JSON-RPC pour récupérer les données publiques même en l’absence d’un MetaMask.

### Etape 2

```
Que se passerait-il si vous transmettiez votre adresse Ethereum à votre voisin ?
Pourrait-il voter à votre place ? Pourquoi ?
```

Non, une adresse Ethereum est par nature publique. Pour voter, il faut signer la transaction avec la clé privée associée à l'addresse.
C’est ici géré par MetaMask.

### Etape 3

```
Qui vérifie que vous respectez le cooldown de 3 minutes — votre frontend ou le smart contract ?
Que se passerait-il si quelqu'un contournait votre frontend et appelait vote() directement ?
```

Comme toujours, c’est un non-sens d’attendre qu’un frontend valide les données.
Le smart contract vérifie le cooldownPassword et contient la logique des règles du vote.

### Etape 4

```
block.timestamp est une variable globale Solidity qui retourne l'heure de validation du bloc.
Pourquoi n'utilise-t-on pas Date.now() côté JavaScript pour cette vérification ? Quel serait le risque ?
```

`Date.now()` dépend de l'heure du système de l'utilisateur qui peut être modifiée ou incorrecte.
On utilise donc `block.timestamp` qui est une valeur fournie par la blockchain et ne peut pas être manipulée par les utilisateurs.

### Etape 5

```
Pourquoi faut-il appeler listenContract.off() dans le return du
useEffect ? Que se passerait-il si on ne le faisait pas après 10 reconnexions successives ?
```

On doit appeler `listenContract.off()` dans le return du useEffect pour éviter de créer des listeners à chaque refraichissement du composant React.

### Etape 6

```
Le parentHash d'un bloc contient le hash du bloc précédent.
Pourquoi cette propriété rend-elle la blockchain immuable ? Que se passerait-il si vous modifiiez le vote contenu dans le bloc #104 606 440 ?
```

`parentHash` contient le hash du bloc précédent, donc si on modifie un bloc passé le hash du bloc modifié changera.
Tous les blocs suivants seront invalidés car ils référencent le hash du bloc modifié.
Pour modifier un bloc passé, il faudrait recalculer tous les blocs suivants avec le consensus du réseau de validateurs, ce qui est pratiquement impossible avec une blockchain publique.