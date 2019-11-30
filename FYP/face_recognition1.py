import cv2
import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list

cam = cv2.VideoCapture(0)
cam.set(3, 640) # set video width
cam.set(4, 480) # set video height

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trainer.yml')
cascadePath = "Faces.xml"
faceCascade = cv2.CascadeClassifier(cascadePath);

font = cv2.FONT_HERSHEY_SIMPLEX
#id = 0
names = open("names.txt").readlines()
minW = 0.1*cam.get(3)
minH = 0.1*cam.get(4)

# Path for face image database
path = 'dataset'
list=os.listdir(path)

new_users = input("Do you wish to register a new user : y/n ")

if (new_users == 'y'or new_users == 'Y' ):
    
    if (len(list)==0):
        number_users = input("How many users do you wish to register : ")
        user_count = 0
        count = 1
    else:
        user_count = int(round((len(list))/25))
        new_users = input("How many users do you wish to register : ")
        number_users = user_count + int(new_users)
        count = user_count
    
    while((user_count+1) <= int(number_users)):
        user_name = input("Please enter your name : ")
        names_list(user_name)
        training(cam,count)
        count+=1
        user_count += 1
    print ("\n [INFO] Training faces. It will take a few seconds. Wait ...")
    faces,ids = getImagesAndLabels(path)
    print("I am here")
    recognizer.train(faces, np.array(ids))

    # Save the model into trainer/trainer.yml
    recognizer.write('trainer.yml')

    # Print the numer of faces trained and end program
    print("\n [INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))
    cv2.destroyWindow("image")


else:
    print("No new users")
    number_users = int(round((len(list))/25))
    print ("\n [INFO] Training faces. It will take a few seconds. Wait ...")
    faces,ids = getImagesAndLabels(path)
    print(np.array(ids))
    recognizer.train(faces, np.array(ids))
    print("\n [INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))
        
 
while True:
    ret, img =cam.read()
    img = cv2.flip(img, 1) # Flip vertically
    cv2.rectangle(img,(150,50),(500,350),(0,255,0),2)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale( 
        gray,
        scaleFactor = 1.3,
        minNeighbors = 5,
        minSize = (30,30),
    )

    for(x,y,w,h) in faces:
        cv2.rectangle(img, (x,y), (x+w,y+h), (0,255,0), 2)
        
        roi_gray = gray[y:y+h, x:x+w]
        
        roi_color = img[y:y+h, x:x+w]
                
    

        id, confidence = recognizer.predict(gray[y:y+h,x:x+w])
        positive  = round(100 - confidence)
        confidence = "  {0}%".format(round(100 - confidence))

        # Check if confidence is less them 100 ==> "0" is perfect match 
        if (positive > 40):
            id = names[id]
            
        else:
            id = "Unrecognised"
            
        
        cv2.putText(img, str(id), (x+5,y-5), font, 1, (255,255,255), 2)
        cv2.putText(img, str(positive), (x+5,y+h-5), font, 1, (255,255,0), 1)  
    
    cv2.imshow('camera',img) 

    k = cv2.waitKey(10) & 0xff # Press 'ESC' for exiting video
    if k == 27:
        break

# Do a bit of cleanup
print("\n [INFO] Exiting Program and cleanup stuff")
cam.release()
cv2.destroyAllWindows()
