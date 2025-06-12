# Step 1: Use official Node image with pnpm
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install pnpm
RUN npm install -g pnpm

# Step 4: Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./

# Step 5: Install dependencies
RUN pnpm install

# Step 6: Copy source files
COPY . .

# Step 7: Build the NestJS project
RUN pnpm build

# Step 8: Expose port (default NestJS is 3000)
EXPOSE 3000

# Step 9: Start app
CMD ["pnpm", "start:prod"]
