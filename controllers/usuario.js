const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /usuario:
 *  get:
 *    summary: Retornar todos usuários
 *    tags: [usuario] 
 *    responses:
 *      200:  
 *        description: Todos usuários.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/usuario'        
 */

router.get("/usuario", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countUsuario = await db.usuario.count();
    console.log(countUsuario);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countUsuario !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countUsuario / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum usuário encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const usuario = await db.usuario.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','nome_usuario','email','senha'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(usuario){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/usuario',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countUsuario
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            usuario,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum usuário encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger 
 * /usuario/{id}:
 *  get:
 *    summary: Retornar um usuário
 *    tags: [usuario]
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
 *              $ref: '#/components/schemas/usuario'        
 */

router.get("/usuario/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const usuario = await db.usuario.findOne({
        attributes: ['id','nome_usuario','email','senha','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(usuario){
        // Pausar o processamento e retornar os dados
        return res.json({
            usuario: usuario.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: usuário não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    usuario:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          descripition: Nome do usuário
 *        email:
 *          type: string
 *          description: Email do usuário
 *        senha:
 *          type: string
 *          description: Senha do usuário
 *      required:
 *       - nome_usuario
 *       - email
 *       - senha
 *      example:
 *        nome_usuario: Cristiano Ronaldo
 *        email: cristiano@gmail.com
 *        senha: 12345
 */

/**
 * @swagger
 * /usuario:
 *  post:
 *    summary: Cadastrar usuário
 *    tags: [usuario] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/usuario'
 *    responses:
 *      200:  
 *        description: Usuário cadastrado com sucesso!
 *      400:
 *        description: Erro ao cadastrar usuário.  
 */   

router.post('/usuario', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.usuario.create(dados).then((dadosUsuario) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Usuário cadastrado com sucesso!",
            dadosUsuario
        });
    }).catch(() => { 
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao cadastrar usuário.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /usuario/{id}:
 *  put:
 *    summary: Editar usuário
 *    tags: [usuario]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Id usuário
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/usuario'
 *    responses:
 *      200:  
 *        description: Usuário editado com sucesso!
 *      400:  
 *        description: Erro usuário não editado.       
 */

router.put("/usuario/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    var { id } = req.params;
    // Editar no banco de dados
    await db.usuario.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /usuario/{id}:
 *  delete:
 *    summary: Deletar usuário
 *    tags: [usuario]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Deletar usuário
 *    responses:
 *      200:  
 *        description: Usuário deletado com sucesso!. 
*      400:  
 *        description: Erro usuário não deletado.      
 */

router.delete("/usuario/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.usuario.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Usuário apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: usuário não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;