# Comp4350Assignment
This is a project for COMP4350 at the University of Manitoba. 

## Implementation
The project has been focused on API calls more than styling or framework use, which is why HTML, Bootstrap and Vanilla Javascript are being used. I call StackExchange's API using the [`/questions`](https://api.stackexchange.com/docs/questions) path. We can get almost all the values that we want with this path by editing the queries in this API like `pageSize` and `tag`. However, this won't return answers nor comments, so I had to add a [custom filter](https://api.stackexchange.com/docs/filters).
Once we have all the information needed, the information is sorted and dynamically shown on the page.

## Running
You can simply clone this repository and double click on `index.html`
### Docker setup
- To test the implementation without cloning this repo, you can use this Docker command:
  ```
  docker run -p 8000:80 chrismega/stack-questions:v1
  ```
- If this doesn't work, try pulling the image with `docker pull chrismega/stack-questions:v1` and then running it with the previous command or the Docker app
- Once you are running the image, go to `localhost:8000` in your browser and you should be able to see a page with "StackOverflow Magic" as the header

On the page, just type the tag you want to search and press enter or the search button. You should be able to see questions related to your tag ordered by creation date in descendent order. You can see the creation time and score in each header. If you click a question, you can see its answers and comments (if available).

## Things to keep in mind
- StackExchange has a limited quota for API calls, so you may be "blocked" by them if you reach that limit. Please try again later or by using a VPN.
- Some error checking has been implemented
