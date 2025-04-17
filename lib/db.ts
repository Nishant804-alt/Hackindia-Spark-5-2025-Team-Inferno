import clientPromise from "./mongodb"

// Database Name
const dbName = "rationchain"

// Collections
export const collections = {
  distributions: "distributions",
  grievances: "grievances",
  users: "users",
  centers: "centers",
  transactions: "transactions",
}

export async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}

export async function getCollection(collectionName: string) {
  const db = await getDb()
  return db.collection(collectionName)
}
