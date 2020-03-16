
def names_list(name):
    with open("names.txt","a") as filename:
        filename.write(name+"\n")
    filename.close
