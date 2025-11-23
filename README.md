# Full Stack Project by  Aurea María Caride González, Alejandro Jesús Suárez Saavedra and Nicasio Manuel Galindo Lojo

![image](https://github.com/user-attachments/assets/2f13286b-5869-407e-bf61-1952f9604631)

# Clinica Veterinaria 
# Full stack with  FrontEnd: Ionic/Angular Backend: Node/Express+ Sequelize. 

As the header says, a project with Ionic, Express, Sequelize and MySQL based on the notes of Miguel Ángel Barrera is just that.

(https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio)

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

Prerequisites, to have installed:
- SO Windows
- Node.js 
- npm
- DockerDesktop
- VSC
- pgAdmin

Structure: 
- /backend - API Node/Express (Sequelize)
- /frontend - Ionic/Angular
- docker-compose.yml - database services (currently Postgres) and pgAdmin
- scripts in the root package.json to start and install subtasks

Quick installation (local development):
1. Clone the repo git clone (https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio)
2. Install dependencies for the entire monorepo:
    npm run install:all 
    or if you prefer
    npm install --prefix backend
    npm install --prefix frontend
3. Environment variable:
    .env file in root (exports all the variables)
4. Starting with Docker (DB + pgAdmin): - docker-compose up -d
- start pgAdmin

5. Start the app in development mode (monorepo): 
- Start backend and frontend simultaneously: npm run start
- Start only backend: npm run dev --prefix backend (or) npm run dev:backend
- Start only frontend: npm run dev --prefix frontend (or) npm run dev:frontend

6. Tests:
- Backend (jest + supertest): npm test --prefix backend
- Frontend (karma / ng test): npm test --prefix frontend

7. Lint and build:
- Frontend lint: npm run lint --prefix frontend
- Build frontend: npm run build --prefix frontend
- 

## Postman access



### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Authors
Aurea María Caride González, Alejandro Jesús Suárez Saavedra and Nicasio Manuel Galindo Lojo - NOVICE Game Developers - 

((https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio))

See also the list of
[contributors](<(https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio)/contributors>)
who participated in this project.

### License

This project is licensed under the [CC0 1.0 Universal](LICENSE.md)
Creative Commons License - see the [LICENSE.md](LICENSE.md) file for
details
A tip for anyone whose code is used

Special thanks to the Unity community for their support.

## Acknowledgments

- Hat tip to anyone whose code is used
- Inspiration
- etc
