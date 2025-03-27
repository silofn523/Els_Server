# 베이스 이미지 설정
FROM node:20-alpine AS builder
# alpine는 경량화 이미지 제공 (제일빠름)

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (개발 의존성 포함)
RUN npm install --legacy-peer-deps

# .dockerignore 파일을 추가하여 node_modules와 dist를 제외한 후, COPY 명령어 사용
COPY . ./

# 애플리케이션 빌드
RUN npm run build

# 프로덕션용 베이스 이미지로 변경
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 프로덕션 의존성만 복사 및 설치
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# 빌드된 파일 복사
COPY --from=builder /usr/src/app/dist ./dist

# 실행 명령어 설정
CMD ["node", "dist/main.js"]
