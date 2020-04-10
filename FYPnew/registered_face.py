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
#This code checks the driver infront of the camera 
#against the trainer.yml models
#it does this 100 times to be certain of a good positive
#the index of ech check is appended to an array and 
#the index occurring the max amount of times in the array is
#used to discern the drivers name
#this returned to the GUI code and used to update the status of the driver
#

import cv2
import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list

def registered_on_system():
        cam = cv2.VideoCapture(0)
        cam.set(3, 640) # set video width
        cam.set(4, 480) # set video height
        id_count = 0
        font = cv2.FONT_HERSHEY_SIMPLEX
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read('trainer.yml') 
        cascadePath = "Faces.xml"
        faceCascade = cv2.CascadeClassifier(cascadePath);
        names = []
        names = open("names.txt").readlines()
		#set an array to hold the returned index positive or negative
		#initialize to an empty array everytime the code is run. This is important!!
        id_counts = []
		#loop 100 times
        while (id_count <= 100):
            
            ret, img =cam.read()
            img = cv2.flip(img, 1) # Flip vertically
            gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

            faces = faceCascade.detectMultiScale( 
                gray,
                scaleFactor = 1.3,
                minNeighbors = 5,
                minSize = (50,50),
            )

            for(x,y,w,h) in faces:
               
                cv2.rectangle(img, (x,y), (x+w,y+h), (255,255,0), 2)
        

                id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
                positive  = round(100 - confidence)
                confidence = "  {0}%".format(round(100 - confidence))
                
                #if a positive of less than 30% 
				#driver not recognised
                if (positive < 30):
                    id = 0
                #As the pi is limited with its camera
				#I loop through 100 times checking the image
				#against the dataset and append the index to the
				#id_counts array
                id_counts.append(id)
                id = names[id]
                
                cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
                cv2.putText(img, str(positive), (x+5,y+h-5), font, 1, (255,255,0), 1)  
            
            cv2.imshow('camera',img)
            id_count+=1

            
            k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
            if k == 27:
                break
		#When the loop is finished the array is checked
		#To see which index occurred the maximum amount of times
		#The id is set to the name of the drive
		#at that index in the names list 
        id = names[max(set(id_counts))]
        cam.release()
        cv2.destroyAllWindows()
        return id