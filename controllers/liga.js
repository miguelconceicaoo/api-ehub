const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /liga:
 *  get:
 *    summary: Retornar todas ligas
 *    tags: [liga] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/liga'        
 */

router.get("/liga", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countLigas = await db.liga.count();
    console.log(countLigas);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countLigas !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countLigas / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma liga encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const ligas = await db.liga.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','nome_liga','id_regiao','edicao','jogos'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']], 

        // incluir atributos da chave estrangeira 
        // include: [{
        //     models: regiao,
        //     attributes: ['nome_regiao'],
        // }],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit

    })
    // Se encontrar registro no banco de dados
    if(ligas){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/liga',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countLigas
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            ligas,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma liga encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /liga/{id}:
 *  get:
 *    summary: Retornar liga
 *    tags: [liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do usuário
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/liga'        
 */

router.get("/liga/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const liga = await db.liga.findOne({
        attributes: ['id','nome_liga','id_regiao','edicao','jogos','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(liga){
        // Pausar o processamento e retornar os dados
        return res.json({
            liga: liga.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: liga não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    liga:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        nome_liga:
 *          type: string
 *          description: nome liga
 *        id_regiao:
 *          type: integer
 *          description: FK id_regiao
 *        edicao:
 *          type: integer
 *          description: edicao
 *        jogos:
 *          type: string
 *          description: jogos
 *      required:
 *       - id
 *       - nome_liga
 *       - id_regiao
 *       - edicao
 *       - jogos
 *      example:
 *        nome_liga: liga1
 *        id_regiao: 1
 *        edicao: 23
 *        jogos: 50
 */

/**
 * @swagger
 * /liga:
 *  post:
 *    summary: Cadastrar liga
 *    tags: [liga] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/liga'
 *    responses:
 *      200:  
 *        description: liga cadastrado com sucesso!  
 */ 

router.post('/liga', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.liga.create(dados).then((dadosLiga) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Liga cadastrada com sucesso!",
            dadosLiga
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar liga.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /liga/{id}:
 *  put:
 *    summary: Editar liga
 *    tags: [liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar usuário
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/liga'
 *    responses:
 *      200:  
 *        description: Editar usuário.      
 */

router.put("/liga/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.liga.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Liga editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: liga não editada.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /liga/{id}:
 *  delete:
 *    summary: Deletar liga
 *    tags: [liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar usuário
 *    responses:
 *      200:  
 *        description: Todos usuários.      
 */

router.delete("/liga/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.liga.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Liga apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: liga não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;