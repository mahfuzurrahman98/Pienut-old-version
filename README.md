### Pienut, an MVC wrapper over Express.JS and MongoDB

Pienut is a lightweight and efficient MVC framework that is built on top of Express JS and Mongoose. It comes equipped with some of the core components of MVC architecture, such as the Model and Controller classes. Additionally, Pienut has a Route class that serves as a convenient wrapper over the Express router, simplifying the routing process for developers.

One of the standout features of Pienut is its custom-written Validation class, which helps ensure that your application's data is always in a valid state. Pienut also provides an authentication setup that utilizes JWT and refresh tokens, providing enhanced security for your application.

> Before jumping to the documentation of `Pienut`, It is highly recomended to go to the [Pienut development setup](https://github.com/mahfuzurrahman98/Pienut-Dev-Setup) repository and clone that to start writing code in a more guided way.
>
```
git clone git@github.com:mahfuzurrahman98/Pienut-Dev-Setup.git
```
>
> `cd` into the project directory and install `pienut` using the following command
```
npm install pienut
```
>
> Let's dive into the docs
> 1. [Route](#route)
> 2. [Controller](#controller)
> 3. [Model](#model)
> 4. [Auth](#auth)
> 5. [Validator](#validator)

#### #Route

---

To define a route using the `Route` class, follow these steps:

- Import the `Route` class from the `pienut` module.
```
  import { Route } from 'pienut';
```
- Create a new instance of the `Route` class.

  ```
  const router = new Route();
  ```

- Use the appropriate HTTP method function (`get`, `post`, `put`, `patch`, or `delete`) to define the route and specify the path, controller, and action.

  ```
  router.get('/path', controller, 'action');
  router.post('/path', controller, 'action');
  ```

  The `controller` parameter should be an instance of the controller class that contains the logic for handling the request, and `action` should be the name of the function in the controller that handles the request.

- You can also add middleware functions to the route by passing them as additional arguments after the action.

  ```
  router.get('/path', controller, 'action', middleware);
  router.get('/path', controller, 'action', [middleware1, middleware2]);
  ```

#### #Controller

---

The controller plays a pivotal role in managing both the database operations and business logic. Specifically, the Peanut base controller boasts a comprehensive set of pre-defined methods that cater to the full spectrum of CRUD functionalities. Additionally, it comes equipped with a state-of-the-art API response formatter, ensuring that your outputs are presented in a sleek and polished manner.

The base controller class has the following methods:

- `_index(req, res)`: handles a GET request for a collection of data
- `_show(req, res)`: handles a GET request for a single data item
- `_store(req, res)`: handles a POST request for creating a new data item
- `_update(req, res)`: handles a PUT request for updating an existing data item
- `_destroy(req, res)`: handles a DELETE request for deleting an existing data item
- `sendApiResponse(res, status, message, data = null)`: a helper function that sends a JSON response to the client, with a given status code, message, and optional data payload.

It is recomended to extend this base controller in any of your controller to utilize the functionalities.

#### #Model

---

The `Model` class provides a base implementation for creating database models using the Mongoose library. It offers convenient methods for creating and managing models, as well as defining and enforcing a schema.

- [x] **Creating a new Model**
      To create a new Model, you will need to extend the base `Model` class in a new file (e.g. `User.js`) and implement the required properties and methodsHere's an example implementation for a `User` Model:

```
import { Model } from 'pienut';

class User extends Model {
  collectionName = 'users';

  schemaObj = {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    username: {...},
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {...},
  };

  constructor() {
    super();
    this.makeModel(this.collectionName, this.schemaObj);
    this.enableSoftDelete(true);
    this.setHiddenAttributes(['password', 'deletedAt']);
    return this.Model;
  }
}

export default new User();
```

- [x] **Defining the Schema**

  The `schemaObj` property is an object that defines the schema for the Model. You can define the fields and their properties according to the Mongoose schema specification.
  In the example above, the `User` Model has fields for `name`, `username`, `email`, `password`, `role`, `active`, and `deletedAt`. Each field has its own properties such as `type`, `required`, `unique`, `default`, and more.\*\*

- [x] **Registering the Model**

  In the constructor, we call the `makeModel` method to create the Model using the `collectionName` and `schemaObj` properties. This method creates a Mongoose model instance that we can use to perform CRUD operations on our database.

**Notable:**

- _Soft Delete:_ If you want to enable soft delete for your Model, you can call the `enableSoftDelete` method and pass in `true`. This will set a `deletedAt` field for the document instead of actually deleting it from the database.
- _Hidden Fields:_ If you want to hide certain fields from the response object when querying the Model, you can call the `setHiddenAttributes` method and pass in an array of fields to be hidden. In the example above, we're hiding the `password` and `deletedAt` fields from the response.

#### #Auth

---

The base `Auth` class in Pienut is responsible for handling auth mechanism, it is basically built on `jsonwebtoken` and `httpOnly-cookie`

`Auth` class which contains several static methods that handle authentication and authorization logic. The `createAccessToken()` method creates an access token using the `jsonwebtoken` library, while the `createRefreshToken()` method creates a refresh token and stores it in a database. The `verifyToken()` method verifies a token using the `jsonwebtoken` library, and the `tokenExists()` method checks whether a token exists in the database for a given user ID. The `isAuthenticated()` method is a middleware that checks whether a request is authenticated by checking for a valid access token in the request headers.

#### #Validator

---

The Validator class is designed as a custom implementation to facilitate the validation of incoming requests. Unlike middleware, it is employed within the controller after the request has been accepted, but prior to executing any business logic or database operations and sending back the response. It features an extensive array of methods that enable comprehensive data validation, ensuring that incoming requests meet the defined criteria before proceeding with further processing.

To use validator first you need to import it

```
import { Validator } from 'pienut';
```

Here is a sample piece of code beow on how to use it in your code

```
const rules = {
  name: {
    type: ['string', 'Name must be a string'],
    required: [true, 'Name is required'],
  },
  username: {
    type: ['string', 'Name must be a string'],
    required: [true, 'Userame is required'],
    unique: [['users', 'username'], 'Username is already taken'],
  },
  email: {
    required: true,
    email: [true, 'Email format is invalid'],
    unique: [['users', 'email'], 'Email is already taken'],
  },
  gender: {
    type: ['char'], // error message is optional
    in: [['M', 'F', 'O']],
  },
  age: {
    type: ['int'], // should be an integer in term of both datatype and value
    between: [[18, 40], 'Age must be between 18 and 40'],
    not_in: [[24, 30, 36], 'Age 30 is not allowed'],
  },
  phone: {
    type: ['neumeric'], // neumeric is a string only containing numbers
    min_len: [10, 'Phone number must be at least 10 characters'],
  },
  password: {
    required: [true, 'Password is mandatory'],
    min_len: [6, 'Password must be at least 6 characters'],
    max_len: [10, 'Password must be at most 10 characters'],
    regex: [
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter and one number',
    ],
  },
};
const validator = new Validator(rules);
await validator.run(req.body);

if (validator.fails()) {
  return this.sendApiResponse(res, 400, validator.errors());
}
```

There are some other validator attribute you can use:

1. `type: ['alphaneumeric']` means the string should contain both _alphabets_ and _numbers_
2. `type: ['alpha']` means the string should contain only _alphabets_
3. `type: ['neumeric']` means the string should only contain _digits_
4. `type: ['number']` means the given type is a _number_, e.g `{'45', 25.1, 78, '4.3'}`
5. `type: ['float']` means the type should be _float_, e.g `4.5 is valid` but `'4.5' is not`
6. `type: ['bool']` means the type is boolean
7. The `date` validation will be added soon
