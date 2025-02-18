import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { Pool, PoolClient } from 'pg';
import { randomInt, randomUUID } from "crypto";

export const generateToken = async (yourClusterEndpoint, region) => {
  const signer = new DsqlSigner({
    hostname: yourClusterEndpoint,
    region,
  });
  try {
    // Use `getDbConnectAuthToken` if you are _not_ logging in as `admin` user
    const token = await signer.getDbConnectAdminAuthToken();
    return token;
  } catch (error) {
      console.error("Failed to generate token: ", error);
      throw error;
  }
}

export const connectToDatabase = async (host:string, user: string, password: string): Promise<{pool: Pool, client: PoolClient}> => {
    // Database connection configuration
    const pool = new Pool({
        user,
        host,
        database: 'postgres',
        password,
        port: 5432, // default PostgreSQL port
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Get a client from the pool
        return {
            pool,
            client: await pool.connect()
        };
    } catch (error) {
        console.error('Error:', error);
    } 
}

export const queryData = async (client: PoolClient, id: string) => {
    try {
        const start = Date.now();
        // Query the table
        const res = await client.query('SELECT * FROM orders WHERE id=$1', [id]);
        const end = Date.now();
        const executionTime = end - start;

        console.log('Data:', res.rows);
        console.log('Execution time:', executionTime, 'ms');

        return {
            data: res.rows,
            executionTime
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export const insertData = async (client: PoolClient) => {
    try {
        // Insert data into the table
        const id = randomUUID();
        const state = 'PENDING';
        const value = randomInt(1, 100);
        const occuredAt = new Date().toISOString();
        await client.query(`INSERT INTO orders(id, state, value, ocurredat) VALUES ('${id}', '${state}', ${value}, '${occuredAt}')`);
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

export const updateData = async (client: PoolClient, id: string) => {
    try {
        // Update data in the table
        const state = 'COMPLETED';
        const value = randomInt(1, 100);
        const occuredAt = new Date().toISOString();
        await client.query(`UPDATE orders SET state='${state}', value=${value}, ocurredat='${occuredAt}' WHERE id='${id}'`);
        console.log(`${id} updated successfully with state: ${state}, value: ${value}, ocurredAt: ${occuredAt}`);
    } catch (error) {
        console.log(`Error updating ${id}:`, error);
    }
}

export const finish = async (pool: Pool, client: PoolClient) => {
    // Release the client back to the pool
    client.release();
    // Close the pool
    await pool.end();
}