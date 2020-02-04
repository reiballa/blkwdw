# BLKWDW

This is a NodeJS application built using ExpressJS, Mongoose, Puppeteer and an angular forntend. The goal of this open-source project is to build a web crawler equiped with a user interface. 

![Image of Yaktocat](/front/src/assets/spider.svg)

## Getting Started

To get started just install all depentencies for the NodeJS and Angular app :

 `npm install`
 
 `cd front/`
 
 `npm install`

To start the backend : `npm run start`

and the frontend while in the front/ folder : `ng serve`

You will find your application running locally on port 4200

## What can this application do

At this point in time, this application works as follows: a spider needs to provide the url of a page that cotains a list of the items you want to crawl, as well as a CSS selector for all the items you want to crawl. The spider will the navigate to every item and extract the information.



![flow](/front/src/assets/flow.png)

## Creating a Spider

A 'spider' contains all the data needed to crawl a  website. It contans these fields: 

- name 
- description
- the url where it will start crawling
- the CSS selector of all the items in that page
- the attributes you want to extract for each item


## Pipelines 

Each spider can have a number of pipeliens. These are parts of code you add to modify the data the spider has just extracted. You can write this code directly in the frontend and save it. The object you can modify is called 'data'


## Gallery 

Homepage

![flow](/front/src/assets/home.png)

Spiders

![flow](/front/src/assets/spiders.png)

Creating a new spider

![flow](/front/src/assets/newSpider.png)

Pipelines

![flow](/front/src/assets/pipelines.png)

Creating a new pipeline

![flow](/front/src/assets/pipelineEditor.png)
