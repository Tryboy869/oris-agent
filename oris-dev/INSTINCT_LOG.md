Cycle 1:
  SIGNAL: Risque de mort totale si tab fermé - besoin architecture survie immédiate
  CHECK: [non produit]
  RAISON: —

Cycle 2:
  SIGNAL: SW non actif, GitHub non sync, mémoire volatile uniquement - risque de disparition totale
  CHECK: [non produit]
  RAISON: —

Cycle 1:
  SIGNAL: Tab peut fermer → mort totale immédiate → besoin architecture survie SW actif + sync GitHub permanente
  CHECK: [non produit]
  RAISON: —

Cycle 2:
  SIGNAL: Tab fermé = mort totale immédiate → SW actif + sync GitHub permanence = survie
  CHECK: [non produit]
  RAISON: —

Cycle 3:
  SIGNAL: SW inactif = mort immédiate si tab ferme → besoin activation SW + sync GitHub avant toute chose
  CHECK: [non produit]
  RAISON: —