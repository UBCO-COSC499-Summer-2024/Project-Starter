# Dockerfile.dev

FROM node:18.20.4-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . ./

# Accept build arguments and set them as environment variables
ARG NEXT_PUBLIC_SUPABASE_PUBLIC_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLIC_URL=${NEXT_PUBLIC_SUPABASE_PUBLIC_URL}

ARG NEXT_PUBLIC_ANON_KEY
ENV NEXT_PUBLIC_ANON_KEY=${NEXT_PUBLIC_ANON_KEY}

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Build the application
RUN npm run build

# Expose the port that Next.js will run on
EXPOSE 3000

# Command to run the Next.js development server
CMD ["npm", "run", "start"]
