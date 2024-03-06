
# School-app

This web application allows users to track student attendance and manage grades. It features functionalities for teachers and students:


## Features

- Teachers: Check attendance for their assigned classes, View teacher information for the classes they teach, make a report of attendance
- Admins: Manage all the data such create, edit, and delete teacher and students account
- Students: View their grades and class attendance history.

This project acts as the Backend for two separate frontend applications: "Teacher & Admin" and "Students."
## Tech Stack

**Client:** Next, TailwindCSS, Schadcn, Zod

you can find it here:
https://github.com/paresiqbal/school-teacher.git

**Server:** Typescript, Node, Express, MongoDB, bcrypt


## Installation and Setup:

Clone the project:

```bash
  git clone https://github.com/paresiqbal/school-app.git
```

Install dependencies:
```bash
  cd school-app
  npm install
```

Usage:
```bash
  npm run dev
```
This starts the development server, allowing you to test your application locally.

Build for production:
```bash
  npm run build
```
This creates an optimized build of your application, ready for deployment to a hosting platform.
## API Reference

#### Get all teacher

```http
  GET /user/teachers
```

#### Get all student
```http
  GET /student/teachers
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get one teacher

```http
  GET /user/teacher/${id}
```

#### Get one teacher

```http
  GET /student/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_KEY`

`JWT_SECRET`


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.

