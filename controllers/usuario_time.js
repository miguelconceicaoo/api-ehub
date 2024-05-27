const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /usuario_time:
 *  get:
 *    summary: Retornar registros usuario_time
 *    tags: [usuario_time] 
 *    responses:
 *      200:  
 *        description: Todos dados usuario_time
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/usuario_time'        
 */

router.get("/usuario_time", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countUsuarioTime = await db.usuario_time.count();
    console.log(countUsuarioTime);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countUsuarioTime !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countUsuarioTime / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum usuário_time encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const usuarioTime = await db.usuario_time.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_usuario','id_time'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(usuarioTime){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/usuario_time',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countUsuarioTime
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            usuarioTime,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum usuário_time encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /usuario_time/{id}:
 *  get:
 *    summary: Retornar um registro usuario_time
 *    tags: [usuario_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do usuário
 *    responses:
 *      200:  
 *        description: Todos dados usuario_time.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/usuario_time'        
 */

router.get("/usuario_time/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const usuarioTime = await db.usuario_time.findOne({
        attributes: ['id','id_usuario','id_time','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(usuarioTime){
        // Pausar o processamento e retornar os dados
        return res.json({
            usuarioTime: usuarioTime.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: usuário_time não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    usuario_time:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: Nome do usuário
 *        id_usuario:
 *          type: integer
 *          description: FK id_usuario
 *        id_time:
 *          type: integer
 *          description: FK id_time
 *      required:
 *       - id
 *       - id_usuario
 *       - id_time
 *      example:
 *        id_usuario: 4
 *        id_time: 5
 */

/**
 * @swagger
 * /usuario_time:
 *  post:
 *    summary: Cadastrar dados usuario_time
 *    tags: [usuario_time] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/usuario_time'
 *    responses:
 *      200:  
 *        description: usuario_time cadastrado com sucesso!  
 */   

router.post('/usuario_time', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.usuario_time.create(dados).then((dadosUsuarioTime) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Usuário_time cadastrado com sucesso!",
            dadosUsuarioTime
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar usuário_time.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /usuario_time/{id}:
 *  put:
 *    summary: Editar registro usuario_time
 *    tags: [usuario_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Editar registro usuario_time
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/usuario_time'
 *    responses:
 *      200:  
 *        description: usuario_time editado com sucesso.      
 */

router.put("/usuario_time/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.usuario_time.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário_time editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário_time não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /usuario_time/{id}:
 *  delete:
 *    summary: Deletar registro usuario_time
 *    tags: [usuario_time]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar usuario_time
 *    responses:
 *      200:  
 *        description: usuario_time deletado com sucesso.      
 */

router.delete("/usuario_time/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.usuario_time.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário_time apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário_time não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;