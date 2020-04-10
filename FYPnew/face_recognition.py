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
# This code contains the face recognition algorithm
# The function defined here runs if a driver
# was not registered on the system previously
#


import cv2
import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list



#drivers name entered in the GUI passed as a parameter
def register_new_face(username):
	
	#setup the camera screen in using OpenCV
    cam = cv2.VideoCapture(0)
    cam.set(3, 640) # set video width
    cam.set(4, 480) # set video height
	
	#set the method to enable the recognizer to 
	#recognize a face it uses a defined class in OpenCV
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('trainer.yml')
    cascadePath = "Faces.xml"
	#set the classifier to recognise faces from the
	#positive and negative images stored in the Haar Cascade
    faceCascade = cv2.CascadeClassifier(cascadePath);

    font = cv2.FONT_HERSHEY_SIMPLEX
    #id = 0
    names = open("names.txt").readlines()
    minW = 0.1*cam.get(3)
    minH = 0.1*cam.get(4)
    path = 'dataset'
	
    list=os.listdir(path)
    

    if (len(list)==0):
        user_count = 0
        number_users = 1
        count = 1
    else:
        user_count = int(round((len(list))/50))
        number_users = user_count + 1
        count = user_count
        print(number_users)
    
    while((user_count+1) <= int(number_users)):
		#driversname enter on GUI passed to the names list
        user_name = username
        names_list(user_name)
		#training module starts
        training(cam,count)
        count+=1
        user_count += 1
    print ("\n [INFO] Training faces. It will take a few seconds. Wait ...")
	#dataset is passed to the getImagesAndLabels() function
	#data set split into images and index
	#as a key value pair
    faces,ids = getImagesAndLabels(path)
	#model is created for every pair
    recognizer.train(faces, np.array(ids))

    # Save the model into trainer/trainer.yml
    recognizer.write('trainer.yml')

    #Print the numer of faces trained and end program
    print("\n [INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))
    cv2.destroyWindow("image")
    




