# Road Sign Finder #

## Table of Contents ##

[TOCM]


Getting Started
-------------

Please follow these instructions to get the project up and running on your local machine.

### Prerequisites

NodeJS and npm

```
sudo apt-get install nodejs
sudo apt-get install npm
```

### Installing

The dependencies are added to the package.json. Please run the below command in the source head directory (where package.json is present)

```
npm install
```

## Running the tests

The test folder contains the unit test files. To run the tests, please run the following command in the application

```
npm test
```

## Using the applications

There are two web applications that the server provides.

[localhost:3000](http://localhost:3000/)

This website provides the user to send a road-sign observation to be stored in the server. The user provides the latitude and longitude values in the respective field, selects the type of roadsign from the radio buttons and clicks the submit button to post the data to the server.


[localhost:4007](http://localhost:4007/)

This website provides the user with an interface to search for unique road-signs in a desired region. The user enters the location details with its latitude and longitude, specifies the radius (in KMs) within which the road-signs need to be searched, and clicks the submit button to get the results. The resulting road-sign types are displayed in region below the button.


## Built With

* [NodeJS](https://nodejs.org/en/) - The JavaScript framework used
* [npm](https://www.npmjs.com/) - JavaScript package manager for getting all reusable dependent libraries
* [Embedded JavaScript](http://ejs.co/) - Dependency Management
* [HTML](https://html.com/) - Language used for creating the application web-pages

## Authors

* **Abhijit Hota** - [LinkedID](https://www.linkedin.com/in/abhijithotacmu/)




Requirements
-------------

#### Functional Requirements ####

1.	The system shall be able to receive observed road signs
	1.	The system shall provide a REST interface for receiving road sign observations from the fleet
	2.	The system shall be able to internally store the received road sign observation
	3.	The system shall be define a road sign observation with latitude (as double), longitude (as double) and type (as enum) of a particular road sign observation
	4.	The system shall process requests to find road signs within a defined radius of a location

2.	The system shall be able to receive requests for finding road signs though REST interfaces
	1.	The system shall provide a REST interface allowing users to request information of observed road signs
	2.	The system shall receive the request containing latitude (double) and longitude (double) or the given location and the search radius (integer in meters)
	3.	The system shall send back information of the signs observed strictly within the defined radius of the provided location coordinates
	4.	The system shall send back only the unique types of signs observed within the requested region

3.	The system shall provide front-end applications
	1.	The system shall provide a HTML and JavaScript based front-end application for posting road-sign observations with their location information
	2.	The system shall provide a HTML and JavaScript based front-end application for finding road-sign information within a radius of a location


#### Quality Attributes ####

1.	Scalability - The system shall handle high level of request loads seemlesly. 
	Implementation example - As a new road-sign observation is sent to the sevrer thoguh a post method, the webserver creates and emits a new event to process the new observation and responds to the post request immediately. The actual processing and storing of the observation is done asynchronously through the function handler of the events in the event queue. 

2.	Performance - The system shall respond to requests in a timely manner even with high volumes of data
	Implemetation example - The number of road-signs observed can grow significanlty over time, and serching though all of them to find the ones lying within the requested region (of the POST request) would be too slow. To improve the performance, I store the observations using two HashMaps. The first hashmap stores an entry of all observation within a 1 degree latitude window, and each 1 degre window entry key points to another hashmap. This second hashmap stores an entry of all observation within a 1 degree longitude window, and each 1 degree window entry key points to the list of all observations that are within the latitude and longitude window. The observations are stored as objects of road-sign class.




Architecture Diagrams
-------------


#### Physical View ####
![Alt text](/PhysicalView.jpg?raw=true "Physical View")

The physical view shows the web server and the interactiosn it can have with two or physical clients that can either post data or get data.

<br>

#### Dynamic View ####
![Alt text](/DynamicView.jpg?raw=true "Dynamic View")

Dynamic view shows the run-time software components and their interfaces with each other.

<br>

#### Static View for Storing Road-Sign Observations ####
![Alt text](/ContainerStaticView.jpg?raw=true "Static View")

The static view shows the data-structure for storing the observations. Instead of storing the observations in a linear form (where search would be expensive O(n) order), we store them in buckets using 2 level HashMaps.

The first level stores observations within a bucket of latitude range as one entry of the HashMap. Each key bucket range is 1 degrees of latitude. The value of the enty is the 2nd level HashMap.
The second level stores observations within a bucket of longitude range as one entry of the HashMap. Each key bucket range is 1 degrees of longitude. The value of the enty is the lost of all observations that fall under the first level and second level buckets.

Retrieving the observation is fast too. Based on the latitude of the observation, we retrieve the 2nd level HashMap by finding the latitude bucket entry ( O(1) order ). Then, Based on the longitude of the observation, we retrieve the observation list by finding the longitude bucket entry ( O(1) order again). Finiding the exact observation would be a linear search through the list ( which will be O(n) order, but with significantly lesser observations to search through ).

<br>




Future Developmet
-------------
1. Enable authentication for GET operation using OAuth
2. Store the last level of observations in a tree structure instead of array for faster search
3. Make the latitude and longitude validations to be run on client side javascript


