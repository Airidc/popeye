# **Popeye tracker**

Frontend and backend project for the popeye geo routes tracking.


## **How to run the project** 

* Git clone the project and run `cd popeye` to get into the folder.
    
* run `docker-compose build`
* run `docker-compose up`
* Frontend will be available on `http://localhost:4000` and the backend is reachable on `http://localhost:5000`.

<br />
<br />
<br />

# **Documentation**

## **Socket Server Events**

<br />

### **ON `getCoordinates`**  

Endpoint initiate the coordinates stream for given route.

Event requires data below to be passed:

| variable name | Type| Description |
| --- | --- | --- |
| route | string | route identifier |
| interval | number | interval in seconds to be used to stream new coordinates value |


Return value: ``number[]``

---


### **ON `updateInterval`**  

Sets new interval for the data stream.

Event requires data below to be passed:

| variable name | Type| Description |
| --- | --- | --- |
| interval | number | interval in seconds to be used to stream new coordinates value |


Return value: ``void``

---


### **ON `error`**  

Returns and erorr value.


Return value: ``error``

---

### **EMIT `coordinates`**  

Emits new set of coordinates to listeners.

Return value: ``number[]``

---
<br />
<br />
<br />

# **Comments**

Very weak unit tests. This is an area to improve for the future. 
<br/>
Frontend was build to display functionality, so it might not be the most visually appealing.

At the end of the project I've felt that the class approach for the backend was not the best as it just made unit testing much harder than needed, but there was no time left to redo the project 😔 