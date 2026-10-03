# Step 1: Base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package dependency files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci --omit=dev

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Expose the port your server listens on
EXPOSE 5000

# Step 7: Define default environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Step 8: Start the backend server
CMD ["npm", "start"]
