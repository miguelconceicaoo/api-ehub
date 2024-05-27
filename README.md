## Requisitos

* Node.js 20 ou superior
* MySQL 8 ou superior

## Como rodar o projeto baixado

Criar a base de dados "celke" no MySQL<br>
Alterar as credencias do banco de dados no arquivo ".env"<br>

Instalar todas as dependencias indicada pelo package.json
```
npm install
```

Executar as migrations
```
npx sequelize-cli db:migrate
```

Executar as seeders
```
npx sequelize-cli db:seed:all
```

Rodar o projeto
```
node app.js
```

Rodar o projeto usando o nodemon
```
nodemon app.js
```

Abrir o endereço no navegador para acessar a página inicial
```
http://localhost:8080
```


## Sequencia para criar o projeto
Criar o arquivo package
```
npm init
```

Gerencia as requisições, rotas e URLs, entre outra funcionalidades
```
npm install --save express
```

Rodar o projeto
```
node app.js
```

Instalar a dependência de forma global, "-g" significa globalmente. Executar o comando através do prompt de comando, executar somente se nunca instalou a dependência na maquina, após instalar, reiniciar o PC.
```
npm install -g nodemon
```

Instalar a dependência como desenvolvedor para reiniciar o servidor sempre que houver alteração no código fonte.
```
npm install --save-dev nodemon
```

Rodar o projeto usando o nodemon
```
nodemon app.js
```

Abrir o endereço no navegador para acessar a página inicial
```
http://localhost:8080
```

Comando SQL para criar a base de dados
```
CREATE DATABASE celke CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sequelize é uma biblioteca Javascript que facilita o gerenciamento do banco de dados SQL
```
npm install --save sequelize
```

Instalar o drive do banco de dados
```
npm install --save mysql2
```

Sequelize-cli interface de linha de comando usada para criar modelos, configurações e arquivos de migração para bancos de dados
```
npm install --save-dev sequelize-cli
```

Iniciar o Sequelize-cli e criar o arquivo config
```
npx sequelize-cli init
```

Manipular variáveis de ambiente
```
npm install dotenv --save
```

Criar a Models usuários
```
npx sequelize-cli model:generate --name Users --attributes name:string,email:string
```

Executar as migrations
```
npx sequelize-cli db:migrate
```

Criar seeders users
```
npx sequelize-cli seed:generate --name demo-users
```

Executar as seeders
```
npx sequelize-cli db:seed:all
```

Permitir requisição externa
```
npm install cors
```

