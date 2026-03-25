export type MysqlConnectionParts = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export function buildMysqlDatabaseUrl(parts: MysqlConnectionParts): string {
  const u = encodeURIComponent(parts.user);
  const p = encodeURIComponent(parts.password);
  return `mysql://${u}:${p}@${parts.host}:${parts.port}/${parts.database}`;
}
