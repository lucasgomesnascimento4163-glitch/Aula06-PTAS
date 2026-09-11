import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const USERS_DB_PATH = join(__dirname, "data.json");
const PRODUCTS_DB_PATH = join(__dirname, "data2.json");

async function readJsonFile(filePath) {
  try {
    const rawData = await readFile(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function readUsers() {
  return readJsonFile(USERS_DB_PATH);
}

export async function readProducts() {
  return readJsonFile(PRODUCTS_DB_PATH);
}

export async function writeUsers(users) {
  await writeJsonFile(USERS_DB_PATH, users);
}

export async function writeProducts(products) {
  await writeJsonFile(PRODUCTS_DB_PATH, products);
}
