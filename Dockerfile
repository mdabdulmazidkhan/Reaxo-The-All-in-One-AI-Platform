FROM node:22-alpine  
LABEL "language"="nodejs"  
LABEL "framework"="next.js"  
WORKDIR /app  
RUN npm install -g pnpm  
COPY . .  
RUN pnpm install  
RUN pnpm build  
EXPOSE 8080  
CMD ["pnpm", "start"]  
