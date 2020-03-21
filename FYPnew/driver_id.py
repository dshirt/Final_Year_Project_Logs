import cv2
import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list

def driver_id(cam, names):
    id_count = 0
    font = cv2.FONT_HERSHEY_SIMPLEX
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read('trainer.yml') 
    cascadePath = "Faces.xml"
    faceCascade = cv2.CascadeClassifier(cascadePath);
    
    
    id_counts = []

    while (id_count <= 50):
        
        ret, img =cam.read()
        img = cv2.flip(img, 1) # Flip vertically
        cv2.rectangle(img,(190,70),(420,300),(0,255,0),2)
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

        faces = faceCascade.detectMultiScale( 
            gray,
            scaleFactor = 1.3,
            minNeighbors = 5,
            minSize = (10,10),
        )

        for(x,y,w,h) in faces:
           
            cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
    

            id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
            positive  = round(100 - confidence)
            confidence = "  {0}%".format(round(100 - confidence))
            
            # Check if confidence is less them 100 ==> "0" is perfect match 
            '''if (positive > 30):
                id = names[id]      
            else:
                id = "Driver not recognised"'''
            if (positive < 30):
                id = 0
            
            id_counts.append(id)
        
            id = names[id]
            
            cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
            cv2.putText(img, str(positive), (x+5,y+h-5), font, 1, (255,255,0), 1)  
        
        cv2.imshow('camera',img)
        id_count+=1

        
        k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
        if k == 27:
            break
   
    id = names[max(set(id_counts))]
 

    return id