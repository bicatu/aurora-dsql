
import { connectToDatabase, finish, generateToken, insertData, updateData } from "./generateToken";
import { servers } from "./config";
import { randomInt } from "crypto";

const ids = [
    "33d4594b-6885-44bb-bf2c-ac62626084f1",
    "464ee2f9-d970-4e1f-b1c5-45a5bd9c0929",
    "6136c66c-2bf0-402e-9024-1d8021ddcc17",
    "7f877c55-5474-41c2-a272-3b0eb4718904",
    "8f770557-6401-4736-9907-527f1840f60d",
    "a1b96338-3f78-4662-ada3-ef2390cb3f54",
    "a89cf45e-4c7f-41af-aca6-737c77862379",
    "aaef7a9d-2705-4639-8c16-5fe6c651ca6d",
    "b290de45-752b-4c74-bc02-0b2c080fd77d",
    "dec3c480-06b5-4cad-80be-05b5970c9044",
    "ecc8781a-a2f8-4a7f-85f6-88f2f262f0e4"
];

(async () => {
    const region = process.argv[2];
    console.log('Region:', region);

    const token = await generateToken(servers[0].host, servers[0].region);
    const {pool, client } = await connectToDatabase(servers[0].host, 'admin', token);

    for (let i = 0; i < 100; i++) {
        const id = ids[randomInt(0, ids.length)];
        await updateData(client, id);
    }

    await finish(pool, client);
})();