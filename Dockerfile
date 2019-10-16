FROM node:12.4.0-alpine

WORKDIR /home/app
EXPOSE 5000
RUN npm install -g serve

COPY . .
RUN npm install
# RUN node --max_old_space_size=8000
RUN npm run-script build --production
CMD serve -s build