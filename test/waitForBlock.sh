#!/bin/bash
wBLOCK=$1
while true
	do
	BLOCK=$(curl -s -H "Content-Type":"application/json" -X POST -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:4444 | grep -Po 'result":"0x\K([^"]*)')
	BLOCK=$((16#$BLOCK))
		if (( BLOCK >= wBLOCK  )); then
			break
		fi
	echo Current block: $BLOCK waiting for $wBLOCK
	sleep 5
done