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
# Face Traing Module
#Create a trainer.yml file
#

import cv2
import numpy as np
from PIL import Image
import os
from time import sleep

def training(cam,count):
    font = cv2.FONT_HERSHEY_SIMPLEX
    detector = cv2.CascadeClassifier('Faces.xml')
    right_eyeCascade = cv2.CascadeClassifier('Body.xml')
    # For each person, enter one numeric face id
    face_id = count
    print("\n [INFO] Initializing face capture. Look the camera and wait ...")
    # Initialize individual sampling face count
    img_count = 0
    

    while(True):
       
        ret, img = cam.read()
        img = cv2.flip(img, 1) # flip video image vertically
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        cv2.rectangle(img,(150,50),(500,350),(0,255,0),2)
    
       
            
        faces = detector.detectMultiScale(
            gray,
            scaleFactor = 1.3,
            minNeighbors = 5,
            minSize = (30,30)
        )

        for (x,y,w,h) in faces:

            cv2.rectangle(img, (x,y), (x+w,y+h), (255,0,0), 2)
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = img[y:y+h, x:x+h]
            
            
            right_eye = right_eyeCascade.detectMultiScale(
                roi_gray,
                scaleFactor = 1.2,
                minNeighbors = 5,
                minSize = (40,40)
            )
            
            for (bx,by,bw,bh) in right_eye:
                cv2.rectangle(img, (bx,by), (bx+bw,by+bh), (255,0,0), 2)     
            img_count += 1

            # Save the captured image into the datasets folder
            cv2.imwrite("dataset/User." + str(face_id) + '.' + str(img_count) + ".jpg", gray[y:y+h,x:x+w])

            cv2.imshow('image', img)

        k = cv2.waitKey(100) & 0xff # Press 'ESC' for exiting video
        if k == 27:
            break
        elif img_count >= 50: # Take 50 face sample and stop video
             break





# function to split the dataset into faces 
#and index to be saved to the trainer.yml file
def getImagesAndLabels(path):

    imagePaths = [os.path.join(path,f) for f in os.listdir(path)]     
    faceSamples=[]
    ids = []
    detector = cv2.CascadeClassifier('Faces.xml')
    for imagePath in imagePaths:

        PIL_img = Image.open(imagePath).convert('L') # convert it to grayscale
        img_numpy = np.array(PIL_img,'uint8')

        id = int(os.path.split(imagePath)[-1].split(".")[1])
        faces = detector.detectMultiScale(img_numpy)

        for (x,y,w,h) in faces:
            faceSamples.append(img_numpy[y:y+h,x:x+w])
            ids.append(id)

    return faceSamples,ids

