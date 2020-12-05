# Books RESTful API

A RESTful API which allows to perform CRUD operations on `books` documents stored in a mongoDB database. It is secured with the use of JWT.

[Getting Started](#getting-started)  
&nbsp;&nbsp;&nbsp;&nbsp;[Installation](#installation)  
&nbsp;&nbsp;&nbsp;&nbsp;[Running the Tests](#running-the-tests)  
[Available Endpoints](#available-endpoints)  
&nbsp;&nbsp;&nbsp;&nbsp;[User Authorization Endpoints](#user-authorization-endpoints)  
&nbsp;&nbsp;&nbsp;&nbsp;[Books Endpoints](#books-endpoints)  
[Built With](#built-with)


## Getting Started

### Installation

1. Clone this repository.
2. Go to the projects root directory.
3. Fill in the `.env` file with your details.
4. Open terminal.
5. Run `npm install`.
6. After installation is complete, you can start the REST server by running `npm start`.

### Running the Tests

You can run the tests by running `npm test` in terminal in projects root directory.

__Example:__

```
$ npm test
...
 PASS  tests/routes/bookRouter.test.js (5.272 s)
  Accessing Endpoint: /api/books
    Given that no JWT is passed in as authorization to access API
      √ Should reject request to get all books (22 ms)
      √ Should reject request to get a single book (6 ms)
      √ Should reject request to add a new book (6 ms)
      √ Should reject request to update a books detail (5 ms)
      √ Should reject attempt to delete a book (3 ms)
    Given that a valid JWT token is passed in as authorization to access API
      √ Can get all books from database (15 ms)
      √ Can get a single book from the database (7 ms)
      √ Can add a single book to the database (30 ms)
      √ Can add a new book with its cover image to the database (33 ms)
      √ Can update a books detail in database (10 ms)
      √ Can update a book cover image stored in filesystem (16 ms)
      √ Can delete a book and its cover image (9 ms)
    Given that a valid JWT token is passed in as authorization with an invalid book ID
      √ Should reject attempt to get a single book (6 ms)
      √ Should reject attempt to update a books details (4 ms)
      √ Should reject attempt to delete a book and its details (4 ms)
...
```

## Available Endpoints

Before you can access the data stored in the database, you will need to register to the service and login to get a JWT. The JWT provided on successful login can be used to access the other endpoints

### User Authorization Endpoints

The endpoints allows developers to register and login to the service to get a JWT which is required as authorization in request header in all other endpoints.

#### POST /user/register

Registers a user to the service

__Parameters__

| Name | Required/Optional | Data Type | Description |
|------|-------------------|-----------|-------------|
| username | Required | String | Username you want to register with |
| password | Required | String | Password you want to be associated with your username |

#### POST /user/login

Logins a user to the service to obtain a JWT.

__Parameters__

| Name | Type |Required/Optional | Data Type | Description |
|------|------|------------------|-----------|-------------|
| username | Request Body | Required | String | Username you want to login with |
| password | Request Body |Required | String | Password associated with your username |

### Books Endpoints

These endpoints allows access to the books details stored in the database. JWT required as authorization in headers of request for all of the endpoints below.

__Example Request Headers for accessing books endpoints:__

```
GET / HTTP/1.1
Host: localhost:8080
...
Authorization: JWT YOUR_TOKEN_HERE
...
```
#### GET /api/books

Gets all the books details from the database

#### GET /api/books/:bookID

Gets a single books details which matches the given id.

__Parameters__

| Name | Type |Required/Optional | Data Type | Description |
|------|------|------------------|-----------|-------------|
| bookID | Path Parameter | Required | String | Id of the book |

#### POST /api/books

Adds a single books details to the database.

| Name | Type |Required/Optional | Data Type | Description |
|------|------|------------------|-----------|-------------|
| title | Request Body | Required | String | Title of the book |
| authors | Request Body | Required | [String] | Author(s) of the book |
| publisher | Request Body | Required | String | Publisher of the book |
| published | Request Body | Required | String | Published date |
| genre | Request Body | Required | [String] | Genre associated with the book |
| summary | Request Body | Optional | String | Summary of the book |
| cover_image | Request Body | Optional | Binary (Image) | Cover image of the book. If this parameter is to be passed in, make sure the `Content-Type` is set to `multipart/form-data` in request headers |

#### PUT /api/books/:bookID

Updates a books details in the database.

| Name | Type |Required/Optional | Data Type | Description |
|------|------|------------------|-----------|-------------|
| bookID | Path Parameter | Required | String | Id of the book |
| title | Request Body | Required | String | Title of the book |
| authors | Request Body | Required | [String] | Author(s) of the book |
| publisher | Request Body | Required | String | Publisher of the book |
| published | Request Body | Required | String | Published date |
| genre | Request Body | Required | [String] | Genre associated with the book |
| summary | Request Body | Optional | String | Summary of the book |
| cover_image | Request Body | Optional | Binary (Image) | Cover image of the book. If this parameter is to be passed in, make sure the `Content-Type` is set to `multipart/form-data` in request headers |

#### DELETE /api/books/:bookID

Deletes a book and it details (including cover image stored in filesystem if available).

| Name | Type |Required/Optional | Data Type | Description |
|------|------|------------------|-----------|-------------|
| bookID | Path Parameter | Required | String | Id of the book |

## Built With

* [express](https://expressjs.com/) - Web Framework used
* [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - For password hahsing
* [body-parser](https://github.com/expressjs/body-parser)- Middleware used to parse incomming request bodies
* [dotenv](https://github.com/motdotla/dotenv) - To read in `.env` files
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - To sign and verify JWT
* [mongoose](https://mongoosejs.com/) - As an ODM to interact with mongoDB
* [morgan](https://github.com/expressjs/morgan) - As a logger
* [multer](https://github.com/expressjs/multer) - Middleware used to handle incoming image files
* [Jest](https://jestjs.io/) - Testing framework used
