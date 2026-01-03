#!/usr/bin/env bash

#Workaround found at https://github.com/oracle/docker-images/issues/2644

#Blokada wywolywania reszty skryptow inicjujacych baze.
#Jest potrzebne ponieważ ten obraz bazy oracle nie jest w stanie uruchomic skryptow z /setup
#ze wzgledu na to ze posiada prebudowaną bazę wewnątrz (/oradata nie jest puste => /setup nie wykonywane).
#Z tego powodu skrypty inicjujace wywolywane sa z setup a ten skrypt ewentualnie blokuje je jezeli
#zostaly juz wczesniej wykonane (ergo plik dbinit istnieje)


DB_INITIALISED="/opt/oracle/oradata/dbinit"
[ -f ${DB_INITIALISED} ] && exit
touch ${DB_INITIALISED}