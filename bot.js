require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.help(ctx => {
    const helpMessage = `

    /start - Iniciar bot
    `

    bot.telegram.sendMessage(ctx.from.id, helpMessage, {
        parse_mode: "Markdown"
    })
})

bot.command('start', ctx => {
    sendStartMessage(ctx);
})


function sendStartMessage (ctx) {
    const startMessage = "Te damos la Bienvenida a este bot, sera un gusto atenderte, por motivos de seguridad y confidencialidad verificaremos que eres parte de nuestra Institucion Educatica";
  



    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Ir a nuestra pagina", url: "https://project-desarrollo.herokuapp.com/"}
                ],
                [
                    {text: "Visualizar datos", callback_data: 'info'}  
                ],
              
                [
                    {text: "Otras gestiones", callback_data: 'menu'}
                ]
            ]
        }
    })
}


bot.command('correo', ctx => {
    correo (ctx);
})

function correo(ctx)  {
    bot.telegram.sendMessage(ctx.chat.id,`${ctx.chat.text}`);

    
    
}







bot.action('info', ctx => {
    ctx.answerCbQuery();
    ctx.reply(`Para ver tus datos envia 'correo (tu correo)'`);

})


bot.action('menu', ctx => {
    ctx.answerCbQuery();

    const menuMessage = "Que deseas Visualizar"
    bot.telegram.sendMessage(ctx.chat.id, menuMessage, {
        reply_markup: {
            keyboard: [
                [
                    { text: "Frase Motivadora" },
                    { text: "Tips de Programacion" }
                 
                ],
                [
                    { text: "Salir" }
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
    
})
bot.hears('Frase Motivadora', async (ctx) => {
    const quote = await fetchQuote('frases')
    ctx.reply(quote);
})


bot.hears('Tips de Programacion', async (ctx) => {
    const quote = await fetchQuote('progra')
    ctx.reply(quote);
})

bot.hears('Salir', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Hasta luego", {
        reply_markup: {
            remove_keyboard: true
        }
    })
})


async function fetchQuote(type) {
    const res = await axios.get('http://localhost:3000/menu/' + type);
    return res.data.quote;
}





const buscaDatos =async (ctx, correo) =>{
    try{
         const respuesta = await axios.get('https://project-desarrollo.herokuapp.com/api/telegram',{data:{correo}})
         console.log(respuesta.data)

         const data = respuesta.data;
         ctx.reply(`
         Nombre: ${data.nombre}
Cursos: ${data.cursosList}
         `);
    }
  catch(err){
      console.log(err)
      return  ctx.reply(JSON.stringify('Lo sentimos no hay conexion'));
  }

  
}

bot.on('text', ctx => {
    
    const mensaje = ctx.update.message.text.toLowerCase();
 
 
    const comando = mensaje.split(' ');
 
    switch (comando[0]) {
        case 'correo':
             buscaDatos(ctx, comando[1])
            break;
    
        default:
         ctx.reply('No te entendi')
            break;
    }
 
    console.log(comando)
 
 
 
 })
 





bot.launch();