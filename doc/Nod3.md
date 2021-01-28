# nod3

## Nod3
<a name="Nod3"></a>

### Nod3
**Kind**: global class  

* [Nod3](#Nod3)
    * _instance_
        * [.setDebug(debug)](#Nod3+setDebug)
        * [.isConnected()](#Nod3+isConnected)
        * [.batchRequest(commands, methodName)](#Nod3+batchRequest)
    * _static_
        * [.exports.Nod3](#Nod3.exports.Nod3)
            * [new exports.Nod3(provider, [{ logger, debug, skipFormatters }])](#new_Nod3.exports.Nod3_new)

<a name="Nod3+setDebug"></a>

#### nod3.setDebug(debug)
**Kind**: instance method of [<code>Nod3</code>](#Nod3)  
**Params**

- debug <code>\*</code>

<a name="Nod3+isConnected"></a>

#### nod3.isConnected()
**Kind**: instance method of [<code>Nod3</code>](#Nod3)  
<a name="Nod3+batchRequest"></a>

#### nod3.batchRequest(commands, methodName)
**Kind**: instance method of [<code>Nod3</code>](#Nod3)  
**Params**

- commands <code>\*</code>
- methodName <code>\*</code>

<a name="Nod3.exports.Nod3"></a>

#### Nod3.exports.Nod3
**Kind**: static class of [<code>Nod3</code>](#Nod3)  
<a name="new_Nod3.exports.Nod3_new"></a>

##### new exports.Nod3(provider, [{ logger, debug, skipFormatters }])
Creates an instance of Nod3.

**Params**

- provider <code>\*</code>
- [{ logger, debug, skipFormatters }] <code>\*</code> <code> = {}</code>


## Subscribe
<a name="module_subscribe"></a>

### subscribe

## Debug
<a name="module_debug"></a>

### debug
<a name="module_debug.traceTransaction"></a>

#### nod3.debug.traceTransaction(txHash) ⇒ <code>Object</code>
**Kind**: static method of [<code>debug</code>](#module_debug)  
**Returns**: <code>Object</code> - debug trace  
**See**: https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction  
**Params**

- txHash <code>String</code>


## Eth
<a name="module_eth"></a>

### eth
<a name="module_eth.getBlock"></a>

#### nod3.eth.getBlock(hashOrNumber, txs) ⇒ <code>Promise.&lt;Object&gt;</code>
Returns a block object using eth_getBlockByHash or eth_getBlockByNumber according to the parameters.

**Kind**: static method of [<code>eth</code>](#module_eth)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - block object or null  
**See**

- https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash
- https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyNumber

**Params**

- hashOrNumber <code>String</code> - BlockHash or blockNumber
- txs <code>Boolean</code> - If true it returns the full transaction objects, if false only the hashes of the transactions.


## Net
<a name="module_net"></a>

### net

* [net](#module_net)
    * [.listening()](#module_net.listening) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.version()](#module_net.version) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.peerCount()](#module_net.peerCount) ⇒ <code>Promise.&lt;QUANTITY&gt;</code>

<a name="module_net.listening"></a>

#### nod3.net.listening() ⇒ <code>Promise.&lt;Boolean&gt;</code>
Returns true if client is listening for networks connections.

**Kind**: static method of [<code>net</code>](#module_net)  
**See**: https://github.com/ethereum/wiki/wiki/JSON-RPC#net_listening  
<a name="module_net.version"></a>

#### nod3.net.version() ⇒ <code>Promise.&lt;String&gt;</code>
Returns the network id.

**Kind**: static method of [<code>net</code>](#module_net)  
**Returns**: <code>Promise.&lt;String&gt;</code> - network id  
**See**: https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version  
<a name="module_net.peerCount"></a>

#### nod3.net.peerCount() ⇒ <code>Promise.&lt;QUANTITY&gt;</code>
Returns number of peers connected to the client.

**Kind**: static method of [<code>net</code>](#module_net)  
**Returns**: <code>Promise.&lt;QUANTITY&gt;</code> - peers  
**See**: https://github.com/ethereum/wiki/wiki/JSON-RPC#net_peercount  

## Rsk
<a name="module_rsk"></a>

### rsk
<a name="module_rsk.getBlocksByNumber"></a>

#### nod3.rsk.getBlocksByNumber(blockNumber) ⇒ <code>Promise.&lt;Array&gt;</code>
Returns a list of block hashes for a given block number with the main chain block identified.

**Kind**: static method of [<code>rsk</code>](#module_rsk)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - : Array of block objects 
**Params**

- blockNumber <code>Number</code>


## Trace
<a name="module_trace"></a>

### trace

## Txpool
<a name="module_txpool"></a>

### txpool

