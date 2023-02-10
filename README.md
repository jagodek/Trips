# Logowanie za pomocą firebase

Dla ułatwienia sprawdzenia funkcji różnych typów użytkowników umieściłem w komponencie signin przyciski które uzupełniają dane logowania

Na wszelki wypadek zamieszczę tutaj te dane
  Admin:
    email: admin@gmail.com
    hasło: qwerty
  
  Manager:
    email: manager@gmail.com
    hasło: 123456
  
  klient
    email: u1@gmail.com
    hasło: qwerty

W firebasie utworzyłem dodatkową kolekcję dla użytkowników z polami
  name
  role
  banned
  email
  userId
  lista userTrips (na przechowywanie id, stanu realizacji i ilości miejsc wycieczek)

Oraz dodatkowa kolekcja setting na przechowywanie trybu persystencji

