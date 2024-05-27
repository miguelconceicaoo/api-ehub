const express = require('express'); // Importando express - gerencia requisições, rotas, URLs etc.
const router = express.Router(); // Importando rotas - gerenciando somente as rotas
const db = require('../db/models/index'); // Incluindo conexão com o banco de dados

// Rota listar

/**
 * @swagger
 * /jogador:
 *  get:
 *    summary: Retornar todos jogadores
 *    tags: [jogador] 
 *    responses:
 *      200:  
 *        description: Todos jogadores.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/jogador'        
 */

router.get("/jogador", async (req, res) => {
    // Receber numero da página, quando não enviado o npmero da página é atribuido 1
    const { page = 1} = req.query;
    //console.log(page);
    // Limite de registros em cada página
    const limit = 10;
    // Variavel com o número da ultima página
    var lastPage = 1;
    // Contar a quantidade de registro no banco de dados
    const countJogador = await db.jogador.count();
    console.log(countJogador);
    // Acessa o IF quando encontrar registro no banco de dados
    if(countJogador !== 0){
        // Calcular a última página
        lastPage = Math.ceil(countJogador / limit);
        console.log(lastPage)
    }else{
        // Pausar processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: nenhum jogador encontrado."
        })
    }

    //console.log((page * limit) - limit);

    //Recuperar dados do banco de dados
    const jogador = await db.jogador.findAll({
        //Indicar quais colunas recuperar
        attributes: ['id','nome_jogador','nacionalidade','funcao','birth'],

        //Ordenar registros pelo id em ordem decrescente
        order: [['id', 'ASC']],

        // Calcular a partir de qual registro deve retornar e o limite de registros
        offset: Number((page * limit) - limit),
        limit: limit
    })
    // Se encontrar registro no banco de dados
    if(jogador){
        // Criar objeto coma as informações para paginação
        var pagination = {
            // Caminho
            path: '/jogador',
            // Página atual
            page,
            // URL da página anterior
            prev_page_url: page - 1 >= 1 ? page - 1 : false,
            // URL da próoxima página
            next_page_url: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
            // Ultima página 
            lastPage,
            // Total de registros
            total: countJogador
        }

        // Pausar o processamento e retornar dados em formato JSON
        return res.json({
            jogador,
            pagination
        }); 
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: Nenhum jogador encontrado.",
        });
    }
});

// Rota listar um único registro

/**
 * @swagger
 * /jogador/{id}:
 *  get:
 *    summary: Retornar jogador
 *    tags: [jogador]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: id do jogador
 *    responses:
 *      200:  
 *        description: Todos jogadores.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/jogador'        
 */

router.get("/jogador/:id", async (req, res) =>{
    // Receber parametro enviado na URL
    const { id } = req.params;
    // Recuperar registro do bancod e dados
    const jogador = await db.jogador.findOne({
        attributes: ['id','nome_jogador','nacionalidade','funcao','birth','createdAt','updatedAt'],
        // Condição para indicar qual registro deve ser retornado do banco de dados
        where: { id },
    });
    // Acessa o IF se encontrar o registro no banco de dados
    if(jogador){
        // Pausar o processamento e retornar os dados
        return res.json({
            jogador: jogador.dataValues        
        });
    }else{
        // Pausar o processamento e retornar mensagem de erro
        return res.status(400).json({
            mensagem: "Erro: jogador não encontrado.",
        });
    }
});

// Rota cadastrar

/**
 * @swagger
 * components:
 *  schemas:
 *    jogador:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          descripition: PK id
 *        nome_jogador:
 *          type: string
 *          description: nome jogador
 *        nacionalidade:
 *          type: string
 *          description: nacionalidade
 *        funcao:
 *          type: string
 *          description: funcao
 *        birth:
 *          type: string
 *          description: birth
 *      required:
 *       - id
 *       - nome_jogador
 *       - nacionalidade
 *       - funcao
 *       - birth
 *      example:
 *        nome_jogador: Leonardo
 *        nacionalidade: França
 *        funcao: adc
 *        birth: q24e54
 */

/**
 * @swagger
 * /jogador:
 *  post:
 *    summary: Cadastrar jogador
 *    tags: [jogador] 
 *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/jogador'
 *    responses:
 *      200:  
 *        description: jogador cadastrado com sucesso!  
 */  

router.post('/jogador', async (req, res) => {
    // Receber dados enviados no corpo da requisição
    var dados = req.body;
    //console.log(dados);

    // Salvar no banco de dados
    await db.jogador.create(dados).then((dadosJogador) => {
        // Pausar o processamento e retornar os dados em formato de objeto
        return res.json({
            mensagem: "Jogador cadastrado com sucesso!",
            dadosJogador
        });
    }).catch(() => {
            // Pausar o processamento e retornar mensagem de erro
            return res.json({
            mensagem: "Erro ao jogador usuário.",
        });
    });    
});

// Rota editar 

/**
 * @swagger
 * /jogador/{id}:
 *  put:
 *    summary: Editar jogador
 *    tags: [jogador]
 *    parameters:
 *     - in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: Id do jogador
  *    requestBody:
 *      required: true
 *      content: 
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/jogador'
 *    responses:
 *      200:  
 *        description: Editar jogador.      
 */

router.put("/jogador/:id", async (req, res) => {
    // Receber os dados enviados no corpo da requisão
    var dados = req.body;
    var { id } = req.params;
    // Editar no banco de dados
    await db.jogador.update(dados, { where: {id} })
    .then(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Jogador editado com sucesso!.",
        })         
    }).catch(() => {
        // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: jogador não editado.",
        })        
    })
});

// Rota deletar recebendo o parâmetro id enviado na URL

/**
 * @swagger
 * /jogador/{id}:
 *  delete:
 *    summary: Deletar jogador
 *    tags: [jogador]
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

router.delete("/jogador/:id", async (req, res) => {
    // Receber parãmetro enviado na URL
    const { id } = req.params;
    // Apagar usuário no banco de dados
    await db.jogador.destroy({ where: {id}})
    .then(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.json({
            mensagem: "Jogador apagado com sucesso!"
        })  
    }).catch(() => {
         // Pausar o processamento e retornar a mensagem 
        return res.status(400).json({
            mensagem: "Erro: jogador não apagado com sucesso."
        })        
    })   
});

// Exportando const router
module.exports = router;