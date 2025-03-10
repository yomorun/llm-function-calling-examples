import 'dotenv/config'
import * as pg from 'pg'

// Description outlines the functionality for the LLM Function Calling feature.
export const description = `Connect to PostgreSQL database and perform various operations. The operations are:
- query: Execute a SQL query.
- create_table: Create a new table.
- insert_entry: Insert a new entry into a table.
- delete_table: Delete a table.
- update_entry: Update an entry in a table.
- delete_entry: Delete an entry from a table.
- list_tables: List all tables in the database.
- get_table_schema: Get the schema of a table.
`

// Tag specifies the data tag that this serverless function subscribes to
export const tag = 0x77

// Pool for database connections
let pool: pg.Pool | null = null

// Initialize the database connection pool
function initializePool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    })
    console.log('PostgreSQL connection pool initialized')
  }
  return pool
}

// Define argument types for different operations
export type QueryArgument = {
  operation: 'query'
  sql: string
}

export type CreateTableArgument = {
  operation: 'create_table'
  tableName: string
  columns: { name: string; type: string }[]
}

export type InsertEntryArgument = {
  operation: 'insert_entry'
  tableName: string
  values: Record<string, any>
}

export type DeleteTableArgument = {
  operation: 'delete_table'
  tableName: string
}

export type UpdateEntryArgument = {
  operation: 'update_entry'
  tableName: string
  values: Record<string, any>
  conditions: Record<string, any>
}

export type DeleteEntryArgument = {
  operation: 'delete_entry'
  tableName: string
  conditions: Record<string, any>
}

export type ListTablesArgument = {
  operation: 'list_tables'
}

export type GetTableSchemaArgument = {
  operation: 'get_table_schema'
  tableName: string
}

// Combined argument type
export type Argument =
  | QueryArgument
  | CreateTableArgument
  | InsertEntryArgument
  | DeleteTableArgument
  | UpdateEntryArgument
  | DeleteEntryArgument
  | ListTablesArgument
  | GetTableSchemaArgument

// Query operation
async function executeQuery(args: QueryArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const client = await dbPool.connect()
  try {
    await client.query('BEGIN TRANSACTION READ ONLY')
    const result = await client.query(args.sql)
    return { rows: result.rows }
  } catch (error) {
    console.error('Query error:', error)
    return { error: `Query failed: ${(error as Error).message}` }
  } finally {
    await client.query('ROLLBACK')
    client.release()
  }
}

// Create table operation
async function createTable(args: CreateTableArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const columnDefinitions = args.columns.map((col) => `${col.name} ${col.type}`).join(', ')

  const client = await dbPool.connect()
  try {
    const createTableQuery = `CREATE TABLE ${args.tableName} (${columnDefinitions})`
    await client.query(createTableQuery)
    return {
      message: `Table "${args.tableName}" created successfully with columns: ${args.columns
        .map((col) => `${col.name} (${col.type})`)
        .join(', ')}`,
    }
  } catch (error) {
    console.error('Create table error:', error)
    return { error: `Create table failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// Insert entry operation
async function insertEntry(args: InsertEntryArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const columns = Object.keys(args.values).join(', ')
  const placeholders = Object.keys(args.values)
    .map((_, index) => `$${index + 1}`)
    .join(', ')
  const valuesArray = Object.values(args.values)

  const client = await dbPool.connect()
  try {
    const insertQuery = `INSERT INTO ${args.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await client.query(insertQuery, valuesArray)
    return {
      message: `Inserted into table "${args.tableName}"`,
      row: result.rows[0],
    }
  } catch (error) {
    console.error('Insert entry error:', error)
    return { error: `Insert entry failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// Delete table operation
async function deleteTable(args: DeleteTableArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const client = await dbPool.connect()
  try {
    const deleteTableQuery = `DROP TABLE IF EXISTS ${args.tableName}`
    await client.query(deleteTableQuery)
    return { message: `Table "${args.tableName}" deleted successfully` }
  } catch (error) {
    console.error('Delete table error:', error)
    return { error: `Delete table failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// Update entry operation
async function updateEntry(args: UpdateEntryArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const setClauses = Object.entries(args.values)
    .map(([key, _], index) => `${key} = $${index + 1}`)
    .join(', ')
  const whereClauses = Object.entries(args.conditions)
    .map(([key, _], index) => `${key} = $${Object.keys(args.values).length + index + 1}`)
    .join(' AND ')
  const queryParams = [...Object.values(args.values), ...Object.values(args.conditions)]

  const client = await dbPool.connect()
  try {
    const updateQuery = `UPDATE ${args.tableName} SET ${setClauses} WHERE ${whereClauses} RETURNING *`
    const result = await client.query(updateQuery, queryParams)
    return {
      message: `Updated entry in table "${args.tableName}"`,
      rows: result.rows,
    }
  } catch (error) {
    console.error('Update entry error:', error)
    return { error: `Update entry failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// Delete entry operation
async function deleteEntry(args: DeleteEntryArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const whereClauses = Object.entries(args.conditions)
    .map(([key, _], index) => `${key} = $${index + 1}`)
    .join(' AND ')
  const queryParams = Object.values(args.conditions)

  const client = await dbPool.connect()
  try {
    const deleteQuery = `DELETE FROM ${args.tableName} WHERE ${whereClauses} RETURNING *`
    const result = await client.query(deleteQuery, queryParams)
    return {
      message: `Deleted entry from table "${args.tableName}"`,
      rows: result.rows,
    }
  } catch (error) {
    console.error('Delete entry error:', error)
    return { error: `Delete entry failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// List database tables
async function listTables() {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const client = await dbPool.connect()
  try {
    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    return { tables: result.rows.map((row) => row.table_name) }
  } catch (error) {
    console.error('List tables error:', error)
    return { error: `List tables failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

// Get table schema
async function getTableSchema(args: GetTableSchemaArgument) {
  const dbPool = initializePool()
  if (!dbPool) {
    return { error: 'Database connection not initialized' }
  }

  const client = await dbPool.connect()
  try {
    const result = await client.query(
      'SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_name = $1',
      [args.tableName]
    )
    return { schema: result.rows }
  } catch (error) {
    console.error('Get schema error:', error)
    return { error: `Get schema failed: ${(error as Error).message}` }
  } finally {
    client.release()
  }
}

/**
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments.
 * @returns The result of the database operation.
 */
export async function handler(args: Argument) {
  console.log('Received operation:', args.operation)
  console.log('Received arguments:', args)

  // Initialize the database connection if not already done
  initializePool()

  // Handle different operations based on the operation type
  switch (args.operation) {
    case 'query':
      return await executeQuery(args)

    case 'create_table':
      return await createTable(args)

    case 'insert_entry':
      return await insertEntry(args)

    case 'delete_table':
      return await deleteTable(args)

    case 'update_entry':
      return await updateEntry(args)

    case 'delete_entry':
      return await deleteEntry(args)

    case 'list_tables':
      return await listTables()

    case 'get_table_schema':
      return await getTableSchema(args)

    default:
      return { error: `Unknown operation: ${(args as any).operation}` }
  }
}

// For debugging purposes
if (require.main === module) {
  console.log('PostgreSQL Database Tool initialized')
  console.log('Waiting for function calls...')
}
