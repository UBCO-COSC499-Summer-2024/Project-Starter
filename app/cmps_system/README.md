This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## How to run it

### Step 1

Run the following 6 commands (you can run them one at a time or just download the following text as a bash script (.sh) and run that once

```
#!/bin/bash

# Step 1: Ensure Buildx is enabled and set up
docker buildx create --use

# Step 2: Build and load for amd64
docker buildx build --platform linux/amd64 -t my-local-image:amd64 --load .

# Step 3: Build and load for arm64
docker buildx build --platform linux/arm64 -t my-local-image:arm64 --load .

# Step 4: Tag the loaded images with the same name for simplicity
docker tag my-local-image:amd64 my-local-image:latest
docker tag my-local-image:arm64 my-local-image:latest

# Step 5: Run Docker Compose
docker-compose up --build
```

### Step 2

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
