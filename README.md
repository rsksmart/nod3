# nod3

> Minimal Javascript RPC communication with Ethereum / RSK node


## Debug
<a name="module_debug"></a>

### debug
<a name="module_debug.traceTransaction"></a>

#### debug.traceTransaction(txHash) ⇒ <code>Object</code>
**Kind**: static method of [<code>debug</code>](#module_debug)  
**Returns**: <code>Object</code> - debug trace  
**See**: https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction  
**Params**

- txHash <code>String</code>


## Eth
<a name="module_eth"></a>

### eth
<a name="module_eth.getBlock"></a>

#### eth.getBlock(hashOrNumber, txs) ⇒ <code>Object</code>
Returns a block object using eth_getBlockByHash or eth_getBlockByNumber according to the parameters.

**Kind**: static method of [<code>eth</code>](#module_eth)  
**Returns**: <code>Object</code> - block object or null  
**See**

- https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
- https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyNumber

**Params**

- hashOrNumber <code>String</code> - BlockHash or blockNumber
- txs <code>Boolean</code> - If true it returns the full transaction objects, if false only the hashes of the transactions.


## Net
<a name="module_net"></a>

### net

## Rsk
<a name="module_rsk"></a>

### rsk
<a name="module_rsk.getBlocksByNumber"></a>

#### rsk.getBlocksByNumber(blockNumber) ⇒ <code>Array</code>
**Kind**: static method of [<code>rsk</code>](#module_rsk)  
**Returns**: <code>Array</code> - : blocks  
**Description:**: xxx  
**Params**

- blockNumber <code>Number</code>


## Trace
<a name="module_trace"></a>

### trace

## Txpool
<a name="module_txpool"></a>

### txpool

