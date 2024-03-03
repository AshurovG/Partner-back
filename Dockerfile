# Используйте официальный образ Node.js версии 21.0.0 как базовый
FROM node:21.0.0

# Установите рабочую директорию
WORKDIR /usr/src/app

# Копируйте package.json и package-lock.json (если есть)
COPY package*.json ./

# Установите зависимости
RUN npm install

# Копируйте остальные файлы проекта
COPY . .

# Откройте порт
EXPOSE 8000
CMD ["npm", "run", "dev"]
