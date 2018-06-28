function addLocalPrivateNet(){
  const config = {
    name: 'LocalPrivateNet',
    extra: {
      neoscan: FIXED_NEOSCAN_LOCALHOST + "/api/main_net"
    }
  }
  const localprivateNet = new Neon.rpc.Network(config)
  Neon.default.add.network(localprivateNet)
  console.log(Neon.settings.networks['LocalPrivateNet'])
}

function addSharedPrivateNet(){
  const config = {
    name: 'SharedPrivateNet',
    extra: {
      neoscan: FIXED_NEOSCAN_NEOCOMPILER + "/api/main_net"
    }
  }
  const sharedprivateNet = new Neon.rpc.Network(config)
  Neon.default.add.network(sharedprivateNet)
  console.log(Neon.settings.networks['SharedPrivateNet'])
}


function CreateTx( from, fromPrivateKey, to, neo, gas, nodeToCall, networkToCall, sendingFromSCFlag = false){
    //balance = Neon.api.neoscan.getBalance('PrivateNet', from).then(res => console.log(res))
    var intent;
    if(neo > 0 && gas > 0)
        intent = Neon.api.makeIntent({NEO:neo,GAS:gas}, to)

    if(neo == 0 && gas > 0)
        intent = Neon.api.makeIntent({GAS:gas}, to)

    if(neo > 0 && gas == 0)
        intent = Neon.api.makeIntent({NEO:neo}, to)


    //console.log(intent) // This is an array of 2 Intent objects, one for each asset
    const config = {
        net: networkToCall, // The network to perform the action, MainNet or TestNet.
        url: nodeToCall,
        address: from,  // This is the address which the assets come from.
	sendingFromSmartContract: sendingFromSCFlag,
        privateKey: fromPrivateKey,
        intents: intent
    }

    Neon.default.sendAsset(config)
    .then(res => {
        //console.log("network:"+networkToCall);
        console.log(res.response);
        createNotificationOrAlert("CreateTx", res.response.result, 2000);
    })
    .catch(e => {
        console.log(e)
    })
}

//Private key or signing Function
function CreateClaimGasTX( from, fromPrivateKey, nodeToCall, networkToCall){
    const config = {
        net: networkToCall, // The network to perform the action, MainNet or TestNet.
        url: nodeToCall,
        address: from,  // This is the address which the assets come from.
        privateKey: fromPrivateKey,
    }

    Neon.default.claimGas(config)
    .then(res => {
        //console.log("network:"+networkToCall);
        console.log(res.response)
    })
    .catch(e => {
        console.log(e)
    })
}

//ICO TEMPLATE EXAMPLE:
/*
//Invoke mintToken from wallet of AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
Invoke(KNOWN_ADDRESSES[0].publicKey,KNOWN_ADDRESSES[0].privateKey,0,10,0, "e096710ef8012b83677b039ec0ee6871868bfcf9", "mintTokens", BASE_PATH_CLI, getCurrentNetworkNickname(), [])

//Check Balance of AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
{
  "jsonrpc": "2.0",
  "method": "invokefunction",
  "params": [
    "e096710ef8012b83677b039ec0ee6871868bfcf9",
    "balanceOf",
    [
      {
        "type": "Hash160",
        "value": "e9eed8dc39332032dc22e5d6e86332c50327ba23"
      }
    ]
  ],
  "id": 3
}

//Transfer some NEP-5 Tokens from AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y to APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
var neonJSParams = [];
pushParams(neonJSParams, 'Address', 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y');
pushParams(neonJSParams, 'Address', 'APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL');
pushParams(neonJSParams, 'Integer', Neon.u.str2hexstring("100"));
Invoke(KNOWN_ADDRESSES[0].publicKey,KNOWN_ADDRESSES[0].privateKey,0,0,0, "e096710ef8012b83677b039ec0ee6871868bfcf9", "transfer", BASE_PATH_CLI, getCurrentNetworkNickname(), neonJSParams)

//Check Balance of APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
{
  "jsonrpc": "2.0",
  "method": "invokefunction",
  "params": [
    "e096710ef8012b83677b039ec0ee6871868bfcf9",
    "balanceOf",
    [
      {
        "type": "Hash160",
        "value": "0f2b7a6ee34db32d9151c6028960ab2a8babea52"
      }
    ]
  ],
  "id": 3
}

*/

function pushParams(neonJSParams, type, value){
	if(type == 'String')
		neonJSParams.push(Neon.default.create.contractParam(type, value));
	else if(type == 'Address')
		neonJSParams.push(Neon.sc.ContractParam.byteArray(value, 'address'));
	else if(type == 'Hex')
		neonJSParams.push(Neon.default.create.contractParam(type, value));
	else if(type == 'Integer')
		neonJSParams.push(Neon.sc.ContractParam.byteArray(value, 'fixed8'));
	else if(type == 'BigInteger')
		neonJSParams.push(Neon.default.create.contractParam(type, value));
	else
		alert("You are trying to push a wrong invoke param type: " + type + "with value : " + value);
}

//Example of invoke
//Invoke(KNOWN_ADDRESSES[0].publicKey,KNOWN_ADDRESSES[0].privateKey,3,1,1, "24f232ce7c5ff91b9b9384e32f4fd5038742952f", "operation", BASE_PATH_CLI, getCurrentNetworkNickname(), [])
function Invoke(myaddress, myprivatekey, mygasfee, neo, gas, contract_scripthash, contract_operation, nodeToCall, networkToCall, neonJSParams){
  if(contract_scripthash == "")
  {
	alert("empty scripthash");
	return;
  }

  var intent;
  if(neo > 0 && gas > 0)
  	intent = Neon.api.makeIntent({NEO:neo,GAS:gas}, contract_scripthash)

  if(neo == 0 && gas > 0)
  	intent = Neon.api.makeIntent({GAS:gas}, contract_scripthash)

  if(neo > 0 && gas == 0)
  	intent = Neon.api.makeIntent({NEO:neo}, contract_scripthash)

  //TODO Check if scriptHash is Hex

  const config = {
    net: networkToCall,
    url: nodeToCall,
    script: Neon.default.create.script({
      scriptHash: contract_scripthash,
      operation: contract_operation,
      args: neonJSParams
    }),
    intents: intent,
    address: myaddress, //'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',//'ARCvt1d5qAGzcHqJCWA2MxvhTLQDb9dvjQ',
    privateKey: myprivatekey, //'1dd37fba80fec4e6a6f13fd708d8dcb3b29def768017052f6c930fa1c5d90bbb',//'4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548',
    gas: mygasfee //0
  }

  Neon.default.doInvoke(config).then(res => {
    console.log(res);
    console.log(res.response);

    createNotificationOrAlert("Invoke","Response: " + res.response.result + " of " + contract_scripthash, 2000);

    if(res.response.result)
    	updateVecRelayedTXsAndDraw(res.response.txid,"Invoke of " + contract_scripthash + " Params: TODO ");

  }).catch(err => {
     console.log(err);
     createNotificationOrAlert("Invoke ERROR","Response: " + err, 2000);
  });

}


//Example of Deploy checkwitness
//Deploy(KNOWN_ADDRESSES[0].publicKey,KNOWN_ADDRESSES[0].privateKey,90,BASE_PATH_CLI, getCurrentNetworkNickname(),script,false,01,'')
//Deploy(KNOWN_ADDRESSES[0].publicKey,KNOWN_ADDRESSES[0].privateKey,500,BASE_PATH_CLI, getCurrentNetworkNickname(),'00c56b611423ba2703c53263e8d6e522dc32203339dcd8eee96168184e656f2e52756e74696d652e436865636b5769746e65737364320051c576000f4f574e45522069732063616c6c6572c46168124e656f2e52756e74696d652e4e6f7469667951616c756600616c7566',false,01,'')
function Deploy(myaddress, myprivatekey, mygasfee, nodeToCall, networkToCall, contract_script, storage = 0x00, returntype = '05', par = '') {

    if(returntype.length == 1)
       returntype = returntype[0]; // remove array if single element

    const sb = Neon.default.create.scriptBuilder();
    sb.emitPush(Neon.u.str2hexstring('appdescription')) // description
      .emitPush(Neon.u.str2hexstring('email')) // email
      .emitPush(Neon.u.str2hexstring('author')) // author
      .emitPush(Neon.u.str2hexstring('v1.0')) // code_version
      .emitPush(Neon.u.str2hexstring('appname')) // name
      .emitPush(storage) // storage: {none: 0x00, storage: 0x01, dynamic: 0x02, storage+dynamic:0x03}
      .emitPush(returntype) // expects hexstring  (_emitString) // usually '05'
      .emitPush(par) // expects hexstring  (_emitString) // usually '0710'
      .emitPush(contract_script) //script
      .emitSysCall('Neo.Contract.Create');


    const config = {
      net: networkToCall,
      url: nodeToCall,
      script: sb.str,
      address: myaddress, //'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',//'ARCvt1d5qAGzcHqJCWA2MxvhTLQDb9dvjQ',
      privateKey: myprivatekey, //'1dd37fba80fec4e6a6f13fd708d8dcb3b29def768017052f6c930fa1c5d90bbb',//'4f0d41eda93941d106d4a26cc90b4b4fddc0e03b396ac94eb439c5d9e0cd6548',
      gas: mygasfee //0
    }

    Neon.default.doInvoke(config).then(res => {
      	console.log(res);

	createNotificationOrAlert("Deploy","Response: " + res.response.result, 2000);

	if(res.response.result)
		updateVecRelayedTXsAndDraw(res.response.txid, "Deploy");
    }).catch(err => {
     	console.log(err);
	createNotificationOrAlert("Deploy ERROR","Response: " + err, 2000);
  });
}

function createNotificationOrAlert(notifyTitle, notifyBody, notifyTime)
{
	  var permission = (Notification.permission === "granted");
     if (!permission) {
          	//alert(Notification.permission);
            //console.log(Notification.permission);
	  	      Notification.requestPermission();
	  }

	  if(Notification.permission === "granted"){
		var notification = new Notification(notifyTitle, {
			icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
		  	body: notifyBody,
	  	});
	 	setTimeout(function() {notification.close()}, notifyTime);
	  } else {
		//For browser that do not allow notifications
		  //alert(notifyTitle + " : " + notifyBody);
        alert(notifyTitle + " : " + notifyBody);
	  }
}


function updateVecRelayedTXsAndDraw(relayedTXID, personalNote)
{
	   vecRelayedTXs.push({tx:relayedTXID, note:personalNote});
           drawRelayedTXs();
}

function getStorage( scripthashContext, key, url )
{
  query = Neon.rpc.Query.getStorage( scripthashContext, key );
  response = query.execute(url);
  console.log(response);
  return response;
}


/*
function CreateRawTx( rawData ){
  // just for test
  //query = Neon.rpc.Query.sendRawTransaction(rawData);
  query = Neon.rpc.Query.sendRawTransaction('800000014BFA9098EC9C5B95E4EC3045A2A2D04A10F12228A3267A3AC65265428ABDC1D3010002E72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000E1F505000000004E75C523C4D431DAFED515E5E230F11A4DB5A80FE72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000EF54A91C000000 513FF03F3A5648BE47CC82F6571251F57173CF8601060004303231347755C56B6C766B00527AC46C766B51527AC4616168164E656F2E52756E74696D652E47657454726967676572009C6C766B52527AC46C766B52C3642A00616C766B00C30430323134876C766B53527AC46C766B53C3640E00516C766B54527AC4620F0061006C766B54527AC46203006C766B54C3616C7566');
  response = query.execute(BASE_PATH_CLI);
  console.log(response);
}
*/

// =============================================
//First examples of using Neon-JS in connection with neo-scan for broadcasting to private net RPC clients
function neonJSPlayground(){
  var NeonA = Neon.default
  const query = Neon.default.create.query()
  var wallet = Neon.wallet
  console.log("query: " + query)
  console.log("wallet: " + wallet)
  var tx = Neon.tx
  console.log("tx: " + tx)
  let tx2 = Neon.default.create.tx({type: 128})
  console.log("tx2: " + tx2)

  balance = Neon.api.neoscan.getBalance('PrivateNet', "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
  .then(res => console.log(res))


  const intent = Neon.api.makeIntent({NEO:1,GAS:1000}, 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')
  console.log(intent) // This is an array of 2 Intent objects, one for each asset
  const configTest = {
    net: 'PrivateNet', // The network to perform the action, MainNet or TestNet.
    url: BASE_PATH_CLI,
    address: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',  // This is the address which the assets come from.
    privateKey: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr',
    intents: intent
  }

  Neon.default.sendAsset(configTest)
  .then(res => {
    console.log(res.response)
  })
  .catch(e => {
    console.log(e)
  })

  const sb = Neon.default.create.scriptBuilder()

  //sb.emitAppCall('35816a2b6f823a28aa6674ca56c28862fe419f8', 'name')
  //const tx3 = Neon.default.create.invocationTx('KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr', {}, {}, sb.str, 0)
}//END First examples of using Neon-JS in connection with neo-scan for broadcasting to private net RPC clients
// =============================================
