const md5 = require('md5')

class dbHandler {

    async fillTransaction(prisma, txObj) {

        await prisma.transaction.create({
            data: {
                id: txObj.hash,
                tx_id: txObj.txid,
                blockHash: txObj.blockhash
            }
        }).then(async () => {
            await prisma.$disconnect()
        }).catch(async (e) => {
            await prisma.$disconnect()
        })
    }

    async fillVout(prisma, voutObj, txObj, blockObj) {

        const scriptPubKey = voutObj.scriptPubKey
        const decodedHex = Buffer.from(scriptPubKey.hex, 'hex').toString()

        await prisma.vout.create({
            data: {
                id: md5(`${blockObj.hash}${txObj.hash}${JSON.stringify(scriptPubKey)}`),
                type: scriptPubKey.type,
                asm: scriptPubKey.asm,
                desc: scriptPubKey.desc,
                hex: scriptPubKey.hex,
                decoded_hex: decodedHex,
                tx: txObj.hash
            }
        }).then(async () => {
            await prisma.$disconnect()
        }).catch(async (e) => { // If decoded Hex is not valid UTF8 upsert again without decoded data
            try {
                await prisma.vout.create({
                    data: {
                        id: md5(`${blockObj.hash}${txObj.hash}${JSON.stringify(scriptPubKey)}`),
                        type: scriptPubKey.type,
                        asm: scriptPubKey.asm,
                        desc: scriptPubKey.desc,
                        hex: scriptPubKey.hex,
                        tx: txObj.hash
                    }
                })
                await prisma.$disconnect()
            } catch (error) { await prisma.$disconnect() }
        })
    }
}
module.exports = dbHandler