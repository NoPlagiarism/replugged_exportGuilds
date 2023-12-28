import { Injector, Logger, settings, common } from "replugged";
import { Guild } from "discord-types/general";

const inject = new Injector();
const logger = Logger.plugin("xyz.noplagi.exportGuilds");

interface GuildExport {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface SettingsData {
  guilds: GuildExport[];
  lastUpdated: number;
}

interface SettingsInt {
  lastUpdated: number;
  data: SettingsData;
}

const cfg = await settings.init<SettingsInt>("xyz.noplagi.exportGuilds");

function transferGuild(old: Guild): GuildExport {
  return { id: old.id, name: old.name, description: old.description, icon: old.icon };
}

export function start(): void {
  const guilds = common.guilds.getGuilds();
  let guildsToExport = Array<GuildExport>();
  for (const key in guilds) {
    const guild = transferGuild(guilds[key]);
    guildsToExport.push(guild);
  }
  cfg.set("data", { guilds: guildsToExport, lastUpdated: Math.floor(Date.now() / 1000) });
  logger.log("Updated data");
}

export function stop(): void {
  inject.uninjectAll();
}
