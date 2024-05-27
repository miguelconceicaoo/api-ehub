const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /usuario_liga:
 *  get:
 *    summary: Retornar registros usuario_liga
 *    tags: [usuario_liga] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/usuario_liga'        
 */

router.get("/usuario_liga", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countUsuarioLiga = await db.usuario_liga.count();
    console.log(countUsuarioLiga);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countUsuarioLiga !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countUsuarioLiga / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum usuário_liga encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const usuarioLiga = await db.usuario_liga.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','id_usuario','id_time'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(usuarioLiga){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/usuario_liga',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countUsuarioLiga
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            usuarioLiga,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum usuário_liga encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /usuario_liga/{id}:
 *  get:
 *    summary: Retornar registro usuario_liga
 *    tags: [usuario_liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do usuário
 *    responses:
 *      200:  
 *        description: Dados usuario_liga encontrado.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/usuario_liga'        
 */

router.get("/usuario_liga/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const usuarioLiga = await db.usuario_liga.findOne({
        attributes: ['id','id_usuario','id_time','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(usuarioLiga){
        // Pausar o processamento e retornar os dados
        return res.json({
            usuarioLiga: usuarioLiga.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: usuário_liga não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    usuario_liga:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
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
 *        nome_usuario: Cristiano Ronaldo
 *        email: cristiano@gmail.com
 */

/**
 * @swagger
 * /usuario_liga:
 *  post:
 *    summary: Cadastrar registro usuario_liga
 *    tags: [usuario_liga] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/usuario_liga'
 *    responses:
 *      200:  
 *        description: usuario_liga cadastrado com sucesso!  
 */

router.post('/usuario_liga', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.usuario_liga.create(dados).then((dadosUsuarioLiga) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Usuário_liga cadastrado com sucesso!",
            dadosUsuarioLiga
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar usuário_liga.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /usuario_liga/{id}:
 *  put:
 *    summary: Editar registro usuario_liga
 *    tags: [usuario_liga]
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
 *            $ref: '#/components/schemas/usuario_liga'
 *    responses:
 *      200:  
 *        description: usuario_liga editado com sucesso.      
 */ 

router.put("/usuario_liga/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    const { id } = req.params;
    // Editar no banco de dados
    await db.usuario_liga.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário_liga editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário_liga não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /usuario_liga/{id}:
 *  delete:
 *    summary: Deletar um registro usuario_liga
 *    tags: [usuario_liga]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar usuário
 *    responses:
 *      200:  
 *        description: Registro deletado com sucesso.      
 */

router.delete("/usuario_liga/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.usuario_liga.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário_liga  apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário_liga não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;