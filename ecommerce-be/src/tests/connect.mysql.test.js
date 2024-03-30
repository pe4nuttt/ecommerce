const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Aomg15122001',
  database: 'shopDEV',
  port: '8822',
});

const batchSize = 100000;
const totalSize = 1_000_000;

let currentId = 1;

console.time(':::TIME:::');

const insertBatch = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;

    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd(':::TIME:::');
    pool.end(err => {
      if (err) {
        console.log('Error occured while running batch');
      } else {
        console.log('Connecition pool closed successfulyl');
      }
    });
    return;
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async (error, result, fields) => {
    if (error) throw error;

    console.log(`Inserted ${result.affectedRows} records`);

    await insertBatch();
  });
};

insertBatch().catch(console.error);
