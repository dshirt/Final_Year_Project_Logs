from tkinter import *
import bcrypt
from pymongo import MongoClient
from face_recognition1 import register_new_face
from face_recognition1 import registered_on_system


cluster = MongoClient("mongodb+srv://dshirt:test1234@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority")
collection = cluster.facerecog.users
    
    
def destroy_screen():
    screen.destroy()
    register()
    
def destroy_screen2():
    screen2.destroy()
    register()
    
def unsuccessful_registration():
    global screen2
    screen1.destroy()
    screen2 =Tk()
    #screen1 = Toplevel(screen)
    screen2.title(" Unsuccessful Registration")
    screen2.geometry("800x600")
    screen2.configure(bg = "blue")
   
    Label(screen2, text="TripleV\nUnSuccessful Registration Attempt",fg='honeydew', bg="blue",font=('Arial',30,'bold')).pack()
    Button(screen2, text = "Return to Register", bg='honeydew',fg='gray20',
            width=20,font=('Arial',20,'bold'), command= destroy_screen2).pack()


def register_user():
    username_info = username.get()
    password_info = password.get()
    NoneType = type(None)
    user = collection.find_one({"username": username_info})
    print(user)
    #check if user is empty
    if user is None:
         unsuccessful_registration()
    elif user["username"] == username_info:
        if bcrypt.checkpw(password_info.encode("utf8"), user["password"]) :
            screen1.destroy()
            register_new_face(username_info)
            registered_screen()
        else:
            command = unsuccessful_registration
        
            

def register():
    global screen1
    screen1 =Tk()
    #screen1 = Toplevel(screen)
    screen1.title("Register")
    screen1.geometry("800x600")
    screen1.configure(bg = "blue")
    global accesscode
    global username
    global password
    accesscode = StringVar()
    username = StringVar()
    password = StringVar()
    
    Label(screen1, text="TripleV\nPlease enter  login details below",fg='honeydew', bg="blue",font=('Arial',30,'bold')).pack()
    Label(screen1, text="", bg="blue").pack()
    Label(screen1, text="AccessCode * ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1, textvariable = accesscode, show="*",bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1, text="", bg="blue").pack()
    Label(screen1, text="Username * ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1, textvariable = username,bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1,text="", bg="blue").pack()
    Label(screen1,text="Password * ",fg='honeydew', bg="blue",font=('Arial',20,'bold')).pack()
    Entry(screen1,textvariable = password, show="*",bg='honeydew',fg='blue',font=('Arial',20,'bold')).pack()
    Label(screen1,text="", bg="blue").pack()
    Button(screen1, text = "Register", bg='honeydew',fg='gray20',
                width=20,font=('Arial',20,'bold'), command= register_user).pack()
    
    

def registered():
    screen.destroy()
    registered_username = registered_on_system().strip()
    user = collection.update_one({"username": registered_username}, {'$set':{"Active":"Yes"}})
    
    
    
def begin_facial_recog():
    registered_screen.destroy()
    registered_username = registered_on_system().strip()
    user = collection.update_one({"username": registered_username}, {'$set':{"Active":"Yes"}})


def registered_screen():
    global registered_screen  #globalises the screen variable so it can be accessed from other functions
    registered_screen =Tk()
    registered_screen.geometry("800x600")
    registered_screen.configure(bg = "blue")
    registered_screen.title("TripleV")
    Label(text= "TripleV",bg='blue',fg='honeydew',font=('Arial',40,'bold')).pack()
    Label(text="", bg="blue").pack()
    Label(text="", bg="blue").pack()
    Button(text = "Begin Facial Recognition", bg='honeydew',fg='gray20',
                width=40,font=('Arial',20,'bold'), command= begin_facial_recog).pack()



def main_screen():
    global screen  #globalises the screen variable so it can be accessed from other functions
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
    
