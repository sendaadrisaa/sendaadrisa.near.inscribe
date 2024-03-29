const nearAPI = require('near-api-js');
const { connect, keyStores, KeyPair } = nearAPI;

async function main() {
    const myKeyStore = new keyStores.InMemoryKeyStore();

    const PRIVATE_KEY ="pk";

    const ACCOUNT_ID = "idlu.testnet";

    const SENDER = "idlu.testnet"

    const METHOD_NAME = "inscribe";

    const args = {
        "p": "nrc-20",
        "op": "mint",
        "tick": "neat",
        "amt": "100000000"
      }
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    
    await myKeyStore.setKey("mainnet", ACCOUNT_ID, keyPair);

    const nearConfig = {
        networkId: 'testnet',
        keyStore: myKeyStore,
        nodeUrl: "https://near-testnet.lava.build/lava-referer-4f2f36c9-f017-41a3-9877-74c11cf92113/",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",      
    };

    
    const nearConnection = await connect(nearConfig);
    
    const numTransactions = 5;
    for (let i = 0; i < numTransactions; i++) {
        const account = await nearConnection.account(ACCOUNT_ID);
        const result = await account.functionCall({
            contractId: SENDER,
            methodName: METHOD_NAME,
            args: args,
            gas: '300000000000000', // Gas limit
            attachedDeposit: nearAPI.utils.format.parseNearAmount('0')
        });

        
        if (result.status.SuccessValue == '') {
            console.log(`Transaction ${i + 1} succeeded hash:`, result.transaction.hash);
        } else {
            console.error(`Transaction ${i + 1} failed:`, result.status);
        }

        await sleep(1000);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
