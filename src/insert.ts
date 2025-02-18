
import { connectToDatabase, finish, generateToken, insertData } from "./generateToken";
import { servers } from "./config";

(async () => {
    const region = process.argv[2];
    console.log('Region:', region);

    const token = await generateToken(servers[0].host, servers[0].region);
    const {pool, client } = await connectToDatabase(servers[0].host, 'admin', token);

    for (let i = 0; i < 5; i++) {
        await insertData(client);
    }

    await finish(pool, client);
})();