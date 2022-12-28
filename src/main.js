const Utils = require('./utils.class')
const dbHandler = require('./dbHandler.class')
const { PrismaClient } = require('@prisma/client')
const Server = require('./server')
const conf = require('../conf')

const prisma = new PrismaClient()
const utils = new Utils()
const db = new dbHandler()
const server = new Server()

async function main() {

    //feed incoming requests
    server.runServer(prisma)

    let currentBlockHeight = conf.startblock
    while (true) {
        // If at top of chain, wait for next block
        let latestBlockHeight = await utils.getBlockHeight()
        if (currentBlockHeight >= latestBlockHeight) {
            await utils.sleep(1000)
            continue
        }

        let blockHash = await utils.getBlockHash(currentBlockHeight)
        let block = await utils.getBlock(blockHash)

        // For every transaction and every vout of interest in those TXs, put them in the db
        for (let i = 0; i < block.tx.length; i++) {
            let rawTX = await utils.getRawTX(block.tx[i], blockHash)
            db.fillTransaction(prisma, rawTX)

            rawTX.vout.forEach(vout => {
                if (vout.scriptPubKey.type === 'nulldata') {
                    db.fillVout(prisma, vout, rawTX, block)
                }
            })
        }
        currentBlockHeight++
        console.log(currentBlockHeight)
    }
}

main()