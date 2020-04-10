#
# John Lawless
# G00351835@gmit.ie
# 10/04/2020
#
# This code forms part of my Final Year Project
# for a BEng(Hons) Software and Electronic Engineering
#
# Vehicle Visage Verification (TripleV) is a fully networked,
# cloud-based fleet management system
# It includes:
#      1. A cloud based web application for managing the fleet
#      2. A cloud based database for storing all relative information
#      3. Encryption for all sensitive information on the database
#      4. Face recognition software held on a Raspberry Pi
#      5. A GUI held on the Pi.
# 
# This code contains the GUI for the face recognition software
# It was created using the tkinter library
# Connection to and updating of the cloud database happens here
#

from tkinter import *
import bcrypt
from pymongo import MongoClient
from face_recognition import register_new_face
from registered_face import registered_on_system

#connection string for mongodb atlas
cluster = MongoClient("mongodb+srv://vehicle:dshirt49@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority")
collection = cluster.facerecog.users

    
def destroy_screen():
	#destroys(closes) the instance of the names screen
    screen.destroy()
	#calls the next function
    register()
    
def destroy_screen2():
    screen2.destroy()
    register()
    
def unsuccessful_registration():
    #globalises the screen variable so it can be accessed from other functions
    global screen2
    screen1.destroy()
	#Tk() creates a tkinter object and allows you to build the figure to display in
    screen2 =Tk()
    screen2.title(" Unsuccessful Registration")
    screen2.geometry("800x600")
    screen2.configure(bg = "blue")
    Label(screen2, text="TripleV\nUnSuccessful Registration Attempt",fg='honeydew', bg="blue",font=('Arial',30,'bold')).pack()
	#command tells the code which function to run next
    Button(screen2, text = "Return to Register", bg='honeydew',fg='gray20',
            width=20,font=('Arial',20,'bold'), command= destroy_screen2).pack()


def register_user():
	#registration number of the vehicle the Pi is fitted in
    reg = '97D24451'
	#get the accescode entered in the GUI
    accesscode_info = accesscode.get()
    username_info = username.get()
    password_info = password.get()
    NoneType = type(None)
    user = collection.find_one({"driversname": driversname.get()})
    print(user)
	#if no user is found on the database open new screen
    if user is None:
         unsuccessful_registration()
	#go through and verify all information entered before preceeding
    elif user["reg"] == reg :
        if bcrypt.checkpw(username_info.encode("utf8"), user["username"].encode("utf8")):
            if bcrypt.checkpw(accesscode_info.encode("utf8"), user["code"].encode("utf8")):
                if bcrypt.checkpw(password_info.encode("utf8"), user["password"].encode("utf8")):
                    screen1.destroy()
                    register_new_face(driversname.get())
                    registered_screen()
                else:
                    command = unsuccessful_registration
            else:
                command = unsuccessful_registration   
        else:
            command = unsuccessful_registration   
    else:
        command = unsuccessful_registration   


def register():
    global screen1
    screen1 =Tk()
    screen1.title("Register")
    screen1.geometry("800x600")
    screen1.configure(bg = "blue")
	
	#declaring global vars for the entered text
	#allowing them to be used in other functions
    global accesscode
    global username
    global password
    global driversname
	#defining them as Strings it is part of Tk() 
	#allows the comparison with other strings later
    accesscode = StringVar()
    username = StringVar()
    password = StringVar()
    driversname = StringVar()
    
    Label(screen1, text="TripleV\nPlease enter  login details below",fg='honeydew', bg="blue",font=('Arial',30,'bold')).pack()
    Label(screen1, text="", bg="blue").pack()
    Label(screen1, text="Driver's Name ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1, textvariable = driversname, bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1, text="", bg="blue").pack()
    Label(screen1, text="AccessCode * ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1, textvariable = accesscode, show="*",bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1, text="", bg="blue").pack()
    Label(screen1, text="Username * ", fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1, textvariable = username,show="*", bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1,text="", bg="blue").pack()
    Label(screen1,text="Password * ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1,textvariable = password, show="*",bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1,text="", bg="blue").pack()
    Button(screen1, text = "Register", bg='honeydew',fg='gray20',
                width=20,font=('Arial',20,'bold'), command= register_user).pack()
    
    

def registered():
    screen.destroy()
    global registered_username
    registered_username = registered_on_system().strip()
    if registered_username == "User not Authorised":
        command = unsuccessful_registration
    else :
        collection.update_one({"driversname": registered_username}, {'$set':{"active":"Yes"}})
        logout_screen()
    
    
def begin_facial_recog():
    registered_screen.destroy()
    global registered_username
    registered_username = registered_on_system().strip()
    if registered_username == "User not Authorised":
        command = unsuccessful_registration
    else :
        collection.update_one({"driversname": registered_username}, {'$set':{"active":"Yes"}})
        logout_screen()
    

def logout():
    logout_screen.destroy()
    collection.update_one({"driversname": registered_username}, {'$set':{"active":"No"}})
   


def registered_screen():
    global registered_screen  
    registered_screen =Tk()
    registered_screen.geometry("800x600")
    registered_screen.configure(bg = "blue")
    registered_screen.title("TripleV")
    Label(text= "TripleV",bg='blue',fg='honeydew',font=('Arial',40,'bold')).pack()
    Label(text="", bg="blue").pack()
    Label(text="", bg="blue").pack()
    Button(text = "Begin Facial Recognition", bg='honeydew',fg='gray20',
                width=40,font=('Arial',20,'bold'), command= begin_facial_recog).pack()

def logout_screen():
    global logout_screen  
    logout_screen =Tk()
    logout_screen.geometry("800x600")
    logout_screen.configure(bg = "blue")
    logout_screen.title("TripleV")
    Label(text= "TripleV",bg='blue',fg='honeydew',font=('Arial',40,'bold')).pack()
    Label(text="", bg="blue").pack()
    Label(text="", bg="blue").pack()
    Button(text = "Logout of System", bg='honeydew',fg='gray20',
                width=40,font=('Arial',20,'bold'), command= logout).pack()

def main_screen():
    global screen  
    screen =Tk()
    screen.geometry("800x600")
    screen.configure(bg = "blue")
    screen.title("TripleV")
    Label(text= "TripleV",bg='blue',fg='honeydew',font=('Arial',40,'bold')).pack()
    Label(text="", bg="blue").pack()
    Button(text = "Login To Load Profile", bg='honeydew',fg='gray20',
                width=40,font=('Arial',20,'bold'), command= destroy_screen).pack()
    Label(text="", bg="blue").pack()
    Button(text = "Profile Already Registered", bg='honeydew',fg='gray20',
                width=40,font=('Arial',20,'bold'), command= registered).pack()
    
    screen.mainloop()

main_screen()
    
