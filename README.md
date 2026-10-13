# TESTCASE1

A website with an admin portal, containerized with Docker and deployed at **https://lis.work.gd**.

## Features

- Public website
- Admin portal for managing site content
- Dockerized deployment with Docker Compose
- Hosted on the `lis.work.gd` domain

## Tech Stack

> Edit this list to match your project.

- Frontend: <!-- e.g. HTML/CSS/JS, React -->
- Backend: <!-- e.g. Node.js, Python/Flask, PHP -->
- Database: <!-- e.g. MySQL, MongoDB, SQLite -->
- Containerization: Docker, Docker Compose

## Project Structure

```
TESTCASE1/
├── Dockerfile
├── docker-compose.yml
├── README.md
└── ...                 # source files
```

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Run locally

```bash
git clone https://github.com/10msnarun/TESTCASE1.git
cd TESTCASE1
docker compose up -d --build
```

Open `http://localhost:<PORT>` in a browser (replace `<PORT>` with the port mapped in `docker-compose.yml`).

### Stop

```bash
docker compose down
```

## Admin Portal

- URL: `/admin` <!-- change to your actual admin path -->
- Credentials are set through environment variables. Do not commit them to the repository.

## Configuration

Create a `.env` file in the project root (this file is not committed):

```env
# Example
ADMIN_USER=your_admin_username
ADMIN_PASSWORD=your_strong_password
```

## Deployment

The site is deployed with Docker Compose and served at https://lis.work.gd.

```bash
git pull
docker compose up -d --build
```

## License

Add a license of your choice (e.g. MIT) or remove this section.
