const axios = require('axios')
require('dotenv').config()

class Utils {

    getHeaders() {
        // Set the RPC endpoint URL and HTTP basic auth credentials
        const rpcUrl = process.env.LOCAL_NODE
        const rpcUser = process.env.USERNAME
        const rpcPassword = process.env.PASSWORD

        // Set the HTTP headers for the request
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Buffer.from(rpcUser + ':' + rpcPassword).toString('base64')
            },
            rpc: rpcUrl
        }
    }

    async getBlockHash(blockNumber) {
        const getBlockHashPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockhash',
            params: [blockNumber]
        }
        let items = this.getHeaders()
        let blockHash = await axios.post(items.rpc, getBlockHashPayload, { headers: items.headers })
        return blockHash.data.result
    }

    async getBlock(blockHash) {
        const getBlockByHeightPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblock',
            params: [blockHash]
        }
        let items = this.getHeaders()
        let getBlockByHeightResponse = await axios.post(items.rpc, getBlockByHeightPayload, { headers: items.headers })
        return getBlockByHeightResponse.data.result
    }

    async getBlockHeight(){
        const getBlockCountPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockcount',
            params: []
        }
        let items = this.getHeaders()
        let getBlockCountResponse = await axios.post(items.rpc, getBlockCountPayload, { headers: items.headers })
        return getBlockCountResponse.data.result
    }

    async getRawTX(txHash, blockHash){
        const rawTXPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getrawtransaction',
            params: [txHash, true, blockHash]
          }
          let items = this.getHeaders()
          let getrawTX = await axios.post(items.rpc, rawTXPayload, {headers: items.headers})
          return getrawTX.data.result
    }

    async sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }

}
module.exports = Utils