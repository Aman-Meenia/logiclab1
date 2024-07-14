## For build and run

```
 docker build -t logiclab .
 docker run -p 3000:3000 logiclab

 For detach mode
 docker run -p 3000:3000 -d logiclab

 TO CHECK WHICH CONTINERS ARE RUNNING
 docker ps
 docker ps -a (for all running as well as stopped containers)


 TO STOP CONTAINER
 docker stop <container_name> or docker stop <container_id>

 TO START CONTAINER
 docker start <container_name> or docker start <container_id>

```

## New docker compose commands for running nextjs project

```
docker-compose up --build

for mac:
sudo docker compose up

for windows:
docker compose up

to enable watch mode(so that you can see the changes in real time):
enter "w" in the terminal and press enter key.
```
