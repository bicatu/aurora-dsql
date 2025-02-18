import { connectToDatabase, finish, queryData } from "./generateToken";


const endpoint = 'test-aurora-performance.cluster-c28nxh8xiqkg.us-east-2.rds.amazonaws.com';
const region = 'us-east-2';
const username = 'postgres';
const password = ']PRdhDc7:Kax87|Bnd:$037mTRDN';



(async () => {
// Query the table
const { pool, client } = await connectToDatabase(endpoint, username, password);

const res = await queryData(client, '33d4594b-6885-44bb-bf2c-ac62626084f1');

await finish(pool, client);
})();
