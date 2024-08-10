The actual source files of a software project are usually stored inside the src folder. Alternatively, you can put them into the lib (if you're developing a library), or into the app folder (if your application's source files are not supposed to be compiled).

# To start the image and see the UI:
- Open the repository in your code editor
- Open the terminal
- Navigate to the 'app' folder ( 'cd app' command )
- Navigate to the 'frontend' folder ('cd frontend' command)
- Run the command 'npm install'
- Once the install finishes, navigate back to the 'app' folder ('cd ..' command)
- Enter the command 'docker compose up'
- Navigate to localhost:3000 on your web browser

# To access pgadmin4:
- ensure docker is running
- Navigate to localhost:5050 on your web browser
- Login with the email 'test@admin.org' and password 'cosc499rocks'
- Once logged in, select 'Add a New Server'
- Name can be anything (I used gradeit)
- In the connection tab, set up as follows
    - Host name/address = 'db' (without the apostrophes)
    - Port = '5432'
    - Username = 'gradeit'
    - Password = 'cosc499rocks'
- Press 'Save' in the bottom right, and your connection should be established