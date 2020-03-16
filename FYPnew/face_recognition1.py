import cv2
import os
import numpy as np
from PIL import Image
from face_training import training
from face_training import getImagesAndLabels
from time import sleep
from name import names_list




def register_new_face(username):

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
        #user_name = input("Please enter your name : ")
        user_name = username
        names_list(user_name)
        training(cam,count)
        count+=1
        user_count += 1
    print ("\n [INFO] Training faces. It will take a few seconds. Wait ...")
    faces,ids = getImagesAndLabels(path)
    recognizer.train(faces, np.array(ids))

    # Save the model into trainer/trainer.yml
    recognizer.write('trainer.yml')

    #Print the numer of faces trained and end program
    print("\n [INFO] {0} faces trained. Exiting Program".format(len(np.unique(ids))))
    cv2.destroyWindow("image")
    


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
        id_counts = []

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

    # Do a bit of cleanup
        print("\n [INFO] Exiting Program and cleanup stuff")
        cam.release()
        cv2.destroyAllWindows()
