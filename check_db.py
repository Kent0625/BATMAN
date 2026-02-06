import sqlite3

# Connect to the database
con = sqlite3.connect("database.db")
cur = con.cursor()

# Select all rows from the table
try:
    res = cur.execute("SELECT name, justice_level, email FROM surveyresponse")
    rows = res.fetchall()

    print("\n--- CLASSIFIED DATABASE ENTRIES ---")
    if not rows:
        print(">> NO ENTRIES FOUND. (Did you submit the form yet?)")
    else:
        for row in rows:
            print(f"Name: {row[0]} | Justice: {row[1]}% | Email: {row[2]}")
    print("-----------------------------------\n")
    
except Exception as e:
    print(f"Error reading database: {e}")

con.close()