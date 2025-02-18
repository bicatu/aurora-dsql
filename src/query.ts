import { connectToDatabase, finish, generateToken, queryData } from "./generateToken";
import { servers } from "./config";

(async () => {
    const region = process.argv[2];
    console.log('Region:', region);

    const token = await generateToken(servers[0].host, servers[0].region);
    const {pool, client } = await connectToDatabase(servers[0].host, 'admin', token);

    for (let i = 0; i < 5; i++) {
        const executionTime = await queryData(client, '33d4594b-6885-44bb-bf2c-ac62626084f1');
        console.log('executionTime:', executionTime);
    }

    await finish(pool, client);
})();