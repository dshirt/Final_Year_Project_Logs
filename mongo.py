import bcrypt
from pymongo import MongoClient

NoneType = type(None)
cluster = MongoClient("mongodb+srv://dshirt:test1234@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority")
collection = cluster.facerecog.users
username = input("input username : ")
user = collection.find_one({"username": username})
print(user)
#check if user is empty
if user is None:
     print("Not a valid user")
elif user["username"] == username:
    userpass = input("Input password")
    if bcrypt.checkpw(userpass.encode("utf8"), user["password"]) :
                     print("It's a Match!")
    else :
        print("No Match :(")