# Advocates

See ![DOCUMENTATION.MD](https://github.com/0xevm1/advocates/blob/main/DOCUMENTATION.md) for further discussion on implemented and features

See the ![Pull Requests](https://github.com/0xevm1/advocates/pulls?q=is%3Apr) for chain of thought and development

![Screenshot of Advocates Site](https://github.com/0xevm1/advocates/blob/main/advocates.png)


## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

## Database set up

The app is configured to return a default list of advocates. This will allow you to get the app up and running without needing to configure a database. If you’d like to configure a database, you’re encouraged to do so. You can uncomment the url in `.env` and the line in `src/app/api/advocates/route.ts` to test retrieving advocates from the database.

1. Feel free to use whatever configuration of postgres you like. The project is set up to use docker-compose.yml to set up postgres. The url is in .env.

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```
