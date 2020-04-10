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
# This code contains the function to write to the text file
# to store the drivers name in a list
#
def names_list(name):
    with open("names.txt","a") as filename:
        filename.write(name+"\n")
    filename.close
