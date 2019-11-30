import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list
from driver_id import driver_id
import cv2

cam = cv2.VideoCapture(0)
cam.set(3, 640) # set video width
cam.set(4, 480) # set video height

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer.yml') 
cascadePath = "Faces.xml"
faceCascade = cv2.CascadeClassifier(cascadePath);

#font = cv2.FONT_HERSHEY_SIMPLEX
#id = 0
names = [] 
minW = 0.1*cam.get(3)
minH = 0.1*cam.get(4)

# Path for face image database
path = 'dataset'
list=os.listdir(path)

new_users = input("Register new users : y/n ")

if (new_users == 'y'or new_users == 'Y' ):
    #Check to see if the dataset is empty
    if (len(list)==0):
        number_users = input("Number of users to register : ")
        user_count = 0
        count = 1
    else:
        user_count = int(round((len(list))/100))
        print(user_count)
        new_users = input("Number of users to register : ")
        number_users = user_count + int(new_users)
        count = user_count + 1

    while((user_count+1) <= int(number_users)):
        print(number_users)
        user_name = input("Enter your name : ")
        names_list(user_name) #append name to names in names.txt
        training(cam, count)
        count+=1
        user_count += 1
        print ("\n [INFO] Registering new faces, wait couple seconds...")
        faces,ids = getImagesAndLabels(path)
        recognizer.train(faces, np.array(ids))


    # Save the model into trainer/trainer.yml
    recognizer.write('trainer.yml')

    # Print the numer of faces trained and end program
    print("\n [INFO] {0} faces trained. Look at the camera".format(len(np.unique(ids))))
    cv2.destroyWindow("image")


else:    
    #number_users = int(round((len(list))/25))
    print ("\n [INFO] Registering existing faces, wait couple seconds...")
    faces,ids = getImagesAndLabels(path)
    recognizer.train(faces, np.array(ids))
    print("\n [INFO] {0} faces trained. Look at the camera".format(len(np.unique(ids))))
    recognizer.read('trainer.yml')    
names = open("names.txt").readlines()
driver = driver_id(cam, names)
# Do a bit of cleanup
print("\n [INFO] Driver name being sent to application")
cam.release()
cv2.destroyAllWindows()


