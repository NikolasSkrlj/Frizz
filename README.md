# Frizz

Frizz is a MERN stack application for making hair salon appointments that are based in Croatia. It also includes the features for smart search of hair salons and a review system in which users can give feedback for the hair salon and/or hairdressers. This app was created as a part of my final project for Bachelor's degree in computer science, but as it was my first dive into web development, it contains mostly beginner level code practices :) .

# URL

https://frizz-me.com/


# Technology

 - Backend:
    - Node and Express for making REST API endpoints
    - MongoDB and Mongoose for data storing, querying and manipulation
    - Utilities: 
      - date-fns for handling dates
      - node-cron for handling periodic tasks
      - JWT for authentication system
      - Bcrypt for safely storing passwords
      - Multer and sharp middleware for handling file upload(pictures)
 - Frontend:
    - React, React Hooks and Context API for creating application interfaces and state managing
    - Bootstrap and React-Bootstrap for styling the application
    - Utilities: 
      - axios for making Ajax requests
      - Formik and yup for handling form validation and submission
      - react-icons for using Font Awesome icons
      - react-datepicker for handling date picking features
  
# Features

 Application is structured so that users can register as two types of users, end users and hair salon owners/administrators. The features of each are following:
 
  - End Users
    - Searching for a specific hair salon with search functionality backed up by a sorting and filtration system
    - Appointment handling (User can delete his appointment if it's not confirmed)
    - Making appointments at a certain hair salon by picking the date and time of the appointment, appointment type and hairdresser if the user wants to specify that.
    - Submitting reviews for a hair salon or a hairdresser in a standard five star rating system
    - Each review user makes can be edited or deleted
    - User information handling (general info, change of password, uploading a profile picture)
    
  - Hair salon admins
    - Preview of all appointments for a specific date
    - Appointment handling (confirming or denying a certain appointment)
    - Appointment types handling (adding new ones, editing, deleting)
    - Hairdresser handling (adding new ones, editing, deleting)
    - Hair salon info handling (general info, change of password, editing working hours)
    - Preview of all reviews for that hair salon
  
# Screenshots
 
  - Landing page
  
    [![pocetna.png](https://i.postimg.cc/Hsxjjv36/pocetna.png)](https://postimg.cc/mhvT5wv9)
 -------------------------------------------------------------------------------------------
  - User salon feed
  
    [![user-feed.png](https://i.postimg.cc/gk6N9sRT/user-feed.png)](https://postimg.cc/1fspwpvG)
-------------------------------------------------------------------------------------------
  - Search options
  
    [![salon-search.png](https://i.postimg.cc/2jdX323L/salon-search.png)](https://postimg.cc/c6Hcb7Rd)
 -------------------------------------------------------------------------------------------
  - Appointment reservation form
  
    [![rezervacija-termina.png](https://i.postimg.cc/mgn9bWs3/rezervacija-termina.png)](https://postimg.cc/zynvjM33)
 -------------------------------------------------------------------------------------------
  - Reviews
  
    [![recenzije.png](https://i.postimg.cc/Z5n3tK1K/recenzije.png)](https://postimg.cc/hXFhVgDH)
 -------------------------------------------------------------------------------------------
  - Salon appointments feed
  
    [![salon-termini.png](https://i.postimg.cc/SxtDMPWV/salon-termini.png)](https://postimg.cc/68nrsYbG)
-------------------------------------------------------------------------------------------
  - Salon hairdressers
  
    [![salon-frizeri.png](https://i.postimg.cc/T1ywNpKZ/salon-frizeri.png)](https://postimg.cc/tnjpYRt5)
-------------------------------------------------------------------------------------------
  - Salon profile page
  
    [![salon-profil.png](https://i.postimg.cc/xC1qHsnj/salon-profil.png)](https://postimg.cc/1gb91r8b)
-------------------------------------------------------------------------------------------
  - Salon reviews feed
  
    [![salon-recenzije.png](https://i.postimg.cc/LsHsKyqk/salon-recenzije.png)](https://postimg.cc/4YSGpQQn)
