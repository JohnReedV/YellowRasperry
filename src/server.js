const express = require('express')
const app = express()

class Server {

    async runServer(prisma) {
        app.get('/opreturn/:txhash', async (req, res) => {

            let voutResult = await prisma.vout.findMany({
                where: {
                    tx: req.params.txhash
                }
            })

            let txResult = await prisma.transaction.findMany({
                where: {
                    id: req.params.txhash
                }
            })

            res.send(voutResult.concat(txResult))
        })
        app.listen(3002, () => console.log('Listening on port 3002'))
    }
}
module.exports = Server