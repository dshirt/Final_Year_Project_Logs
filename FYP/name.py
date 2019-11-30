
def names_list(name):
    with open("names.txt","a") as filename:
        filename.write("\n")
        filename.write(name)
    filename.close
