const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /regiao:
 *  get:
 *    summary: Retornar todas regioes
 *    tags: [regiao] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/regiao'        
 */

router.get("/regiao", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countRegiao = await db.regiao.count();
    console.log(countRegiao);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countRegiao !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countRegiao / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhuma região encontrada."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const regiao = await db.regiao.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','nome_regiao'],
        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],
        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit,

    })
    // Se encontrar registro no banco de dados
    if(regiao){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/regiao',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countRegiao
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            regiao,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhuma região encontrada.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /regiao/{id}:
 *  get:
 *    summary: Retornar região
 *    tags: [regiao]
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
 *              $ref: '#/components/schemas/regiao'        
 */

router.get("/regiao/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const regiao = await db.regiao.findOne({
        attributes: ['id','nome_regiao','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(regiao){
        // Pausar o processamento e retornar os dados
        return res.json({
            regiao: regiao.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: região não encontrada.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    regiao:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        nome_regiao:
 *          type: string
 *          description: nome da regiao
 *      required:
 *       - id
 *       - nome_regiao
 *      example:
 *        nome_regiao: europa
 */

/**
 * @swagger
 * /regiao:
 *  post:
 *    summary: Cadastrar região
 *    tags: [regiao] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/regiao'
 *    responses:
 *      200:  
 *        description: regiao cadastrada com sucesso!  
 */ 

router.post('/regiao', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.regiao.create(dados).then((dadosRegiao) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Região cadastrada com sucesso!",
            dadosRegiao
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar região.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /regiao/{id}:
 *  put:
 *    summary: Editar região
 *    tags: [regiao]
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
 *            $ref: '#/components/schemas/regiao'
 *    responses:
 *      200:  
 *        description: Editar região.      
 */

router.put("/regiao/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.regiao.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Região editada com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: região não editada.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /regiao/{id}:
 *  delete:
 *    summary: Deletar região
 *    tags: [regiao]
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

router.delete("/regiao/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.regiao.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Região apagada com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: região não apagada com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;